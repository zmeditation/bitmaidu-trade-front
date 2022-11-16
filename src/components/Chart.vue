<template>
    <div class="chart app-item flex-col" id="chart">
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import * as TradingView from '@/assets/tradingview/charting_library/charting_library/charting_library.min.js'
    import {COMPANY_NAME, CHART_TIMEFRAMES} from '@/common/config'
    import {SYMBOL_ACTIVE} from "@/store/mutations.type";
    import RestService from "@/common/rest.service";

    export default {
        name: "Chart",
        data() {
            return {
                tvWidget: null,
                readyCallback: null,
                lastCandle: {},
                subs: {}
            }
        },
        mounted() {
            //this.drawChart()
        },
        methods: {
            drawChart() {
                this.tvWidget = new TradingView.widget({
                    symbol: this.symbolActive,
                    interval: '1',
                    fullscreen: false,
                    autosize: true,
                    container_id: 'chart',
                    datafeed: {
                        onReady: (callback) => {
                            callback({
                                exchanges: [COMPANY_NAME],
                                symbols_types: ['Crypto'],
                                supported_resolutions: CHART_TIMEFRAMES
                            })
                        },
                        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
                            let ret = []
                            for(let s in this.markets) {
                                if (userInput && (this.markets[s].symbol.toLowerCase().includes(userInput.toLowerCase()) || this.markets[s].alias.toLowerCase().includes(userInput.toLowerCase()))) {
                                    ret.push({
                                        symbol: this.markets[s].symbol,
                                        full_name: this.markets[s].alias,
                                        description: this.markets[s].alias,
                                        type: 'Crypto',
                                        exchange: COMPANY_NAME,
                                        ticker: this.markets[s].symbol
                                    })
                                }
                            }

                            onResultReadyCallback(ret)
                        },
                        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
                            let symbol = this.markets[symbolName]

                            if (symbol === undefined) {
                                return onResolveErrorCallback()
                            }

                            this.$store.commit(SYMBOL_ACTIVE, symbolName)

                            let conf = {
                                name: symbol.alias,
                                ticker: symbol.symbol,
                                description: symbol.alias,
                                type: 'Crypto',
                                exchange: COMPANY_NAME,
                                timezone: 'Etc/UTC',
                                minmov: 1,
                                pricescale: Math.pow(10, symbol.precision),
                                has_intraday: true,
                                has_seconds: false,
                                has_daily: true,
                                has_weekly_and_monthly: false,
                                has_empty_bars: false,
                                force_session_rebuild: false,
                                has_no_volume: true,
                                volume_precision: 2,
                                data_status: 'streaming',
                                expired: false,
                                currency_code: symbol.base_currency
                            }

                            onSymbolResolvedCallback(conf)
                        },
                        getBars: (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
                            let timeResolution

                            switch (resolution) {
                                case '1D':
                                    timeResolution = 1440
                                    break
                                case '3D':
                                    timeResolution = 1440 * 3
                                    break
                                case '1W':
                                    timeResolution = 1440 * 7
                                    break
                                case '1M':
                                    timeResolution = 1440 * 30
                                    break
                                default:
                                    timeResolution = resolution
                            }

                            let offset = 0

                            if (!firstDataRequest) {
                                offset = Math.round((Math.floor(Date.now()/1000) - to)/(resolution*60))
                            }

                            let count = Math.round((Math.floor(Date.now()/1000) - from)/(resolution*60)) - offset

                            RestService.get('/quotes/'+symbolInfo.ticker+'/history', {
                                frame: parseInt(timeResolution)*60,
                                count,
                                offset
                            })
                                .then(data => {
                                    let ret = []

                                    if (!data) {
                                        return onHistoryCallback(ret)
                                    }

                                    data.forEach(el => {
                                        ret.push({
                                            open: el[0],
                                            high: el[1],
                                            low: el[2],
                                            close: el[3],
                                            volume: el[4],
                                            time: el[5]*1000
                                        })

                                        this.lastCandle = {
                                            open: el[0],
                                            high: el[1],
                                            low: el[2],
                                            close: el[3],
                                            volume: el[4],
                                            time: el[5]*1000
                                        }
                                    })

                                    onHistoryCallback(ret)
                                })
                        },
                        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID) => {
                            if (this.subs[symbolInfo.ticker] === undefined) {
                                this.subs[symbolInfo.ticker] = {}
                            }

                            this.subs[symbolInfo.ticker][subscribeUID] = {
                                symbol: symbolInfo.ticker,
                                frame: resolution*60,
                                cb: onRealtimeCallback,
                                last: null
                            }
                        },
                        unsubscribeBars: (subscriberUID) => {
                            for(let sym in this.subs) {
                                for(let uid in this.subs[sym]) {
                                    if (subscriberUID === uid) {
                                        delete this.subs[sym][uid]
                                        return
                                    }
                                }
                            }
                        }
                    },
                    library_path: 'tradingview/',
                    overrides: {
                        'paneProperties.background': '#000000',
                        'paneProperties.vertGridProperties.color': '#202020',
                        'paneProperties.horzGridProperties.color': '#202020',
                        'scalesProperties.backgroundColor': '#000000',
                        'scalesProperties.lineColor': '#202020',
                        'scalesProperties.textColor': '#eeeeee',
                        'editorFontsList': ['-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
                    },
                    theme: 'Dark',
                    toolbar_bg: '#000000',
                    loading_screen: {
                        backgroundColor: '#000000'
                    },
                    custom_css_url: 'tradingview.css',
                    enabled_features: ["hide_left_toolbar_by_default"]
                })
            }
        },
        computed: {
            ...mapGetters(['markets', 'symbolActive', 'markets', 'quote'])
        },
        watch: {
            symbolActive(val, old) {
                if (val !== old && this.markets[val] !== undefined) {
                    this.drawChart()
                }
            },
            markets() {
                if (!this.tvWidget) {
                    this.drawChart()
                }
            },
            quote: {
                handler(q) {
                    if (this.subs[q.symbol] !== undefined) {
                        for(let uid in this.subs[q.symbol]) {
                            let timeResolution

                            switch (this.subs[q.symbol][uid].frame) {
                                case '1D':
                                    timeResolution = 1440
                                    break
                                case '3D':
                                    timeResolution = 1440 * 3
                                    break
                                case '1W':
                                    timeResolution = 1440 * 7
                                    break
                                case '1M':
                                    timeResolution = 1440 * 30
                                    break
                                default:
                                    timeResolution = this.subs[q.symbol][uid].frame
                            }

                            timeResolution *= 60

                            let stamp = timeResolution * 1000 * Math.floor(Date.now()/(1000 * timeResolution))
                            if (this.subs[q.symbol][uid].last === null) {
                                this.subs[q.symbol][uid].last = this.lastCandle
                                this.subs[q.symbol][uid].last = {
                                    time: stamp,
                                    open: q.bid,
                                    high: q.bid,
                                    low: q.bid,
                                    close: q.bid
                                }

                                this.subs[q.symbol][uid].cb(this.subs[q.symbol][uid].last)
                            } else if (this.subs[q.symbol][uid].last.time !== stamp) {
                                this.subs[q.symbol][uid].last = {
                                    time: stamp,
                                    open: q.bid,
                                    high: q.bid,
                                    low: q.bid,
                                    close: q.bid
                                }

                                this.subs[q.symbol][uid].cb(this.subs[q.symbol][uid].last)
                            } else {
                                this.subs[q.symbol][uid].last.high = Math.max(this.subs[q.symbol][uid].last.high, q.bid)
                                this.subs[q.symbol][uid].last.low = Math.min(this.subs[q.symbol][uid].last.low, q.bid)
                                this.subs[q.symbol][uid].last.close = q.bid

                                this.subs[q.symbol][uid].cb(this.subs[q.symbol][uid].last)
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .chart {
        flex: 1 1 400px;
    }
</style>
