<template>
    <div class="depthchart app-item" ref="depthchart">
        <highcharts :options="chartOptions"></highcharts>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "Depth",
    mounted() {
        setInterval(() => {
            let el = this.$refs.depthchart
            this.chartOptions.chart.width = el.offsetWidth
            this.chartOptions.chart.height = el.offsetHeight
        }, 3000)
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    backgroundColor: 'transparent',
                    type: 'area',
                    height: 200
                },
                credits: false,
                title: false,
                legend: false,
                series: [{
                    name: 'bids',
                    data: [],
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, 'rgba(64,151,137,1)'],
                            [1, 'rgba(64,151,137,0.2)']
                        ]
                    },
                    lineWidth: 0,
                    lineColor: 'rgba(64,151,137,1)',
                    marker: {
                        enabled: false,
                        fillColor: 'rgba(64,151,137,1)',
                        radius: 2,
                        symbol: 'circle'
                    }
                }, {
                    name: 'asks',
                    data: [],
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, 'rgba(189,112,100,1)'],
                            [1, 'rgba(189,112,100,0.2)']
                        ]
                    },
                    lineWidth: 0,
                    lineColor: 'rgba(189,112,100,1)',
                    marker: {
                        enabled: false,
                        fillColor: 'rgba(189,112,100,1)',
                        radius: 2,
                        symbol: 'circle'
                    }
                }],
                tooltip: {
                    backgroundColor: '#1c1c1c',
                    borderColor: '#333333',
                    headerFormat: '<span style="font-size: 10px">Price: <b>{point.key}</b></span><br/>',
                    pointFormat: '<span style="font-size: 10px">Quantity: <b>{point.y}</b></span><br/>',
                    style: {
                        color: '#eeeeee'
                    }
                },
                xAxis: {
                    gridLineColor: 'transparent',
                    lineColor: 'transparent',
                    tickColor: 'transparent',
                    reversed: false
                },
                yAxis: {
                    gridLineColor: 'transparent',
                    labels: {
                        enabled: false
                    },
                    title: false,
                    startOnTick: false
                }
            }
        }
    },
    watch: {
        orderBook: {
            deep: true,
            handler(val) {
                if (!val || !val.bids || !val.asks || !val.bids[0] || !val.asks[0]) {
                    return
                }

                let bids = [], bidsAggr = 0, bidMax = null,
                    asks = [], asksAggr = 0, askMax = null

                for(let n in val.bids) {
                    bidsAggr += val.bids[n][1]
                    bids.push([val.bids[n][0], bidsAggr])

                    if (bidMax === null || bidMax > val.bids[n][0]) {
                        bidMax = val.bids[n][0]
                    }
                }

                for(let n in val.asks) {
                    asksAggr += val.asks[n][1]
                    asks.push([val.asks[n][0], asksAggr])

                    if (askMax === null || askMax < val.asks[n][0]) {
                        askMax = val.asks[n][0]
                    }
                }

                this.chartOptions.series[0].data = bids
                this.chartOptions.series[1].data = asks

                let dif = Math.min(askMax - val.asks[0][0], val.bids[0][0] - bidMax)

                this.chartOptions.xAxis.min = val.bids[0][0] - dif
                this.chartOptions.xAxis.max = val.asks[0][0] + dif
            }
        }
    },
    computed: {
        ...mapGetters(['tokens', 'markets', 'symbolActive', 'orderBook'])
    }
}
</script>

<style scoped>
.depthchart {
    flex: 0 0 200px;
    position: relative;
}
</style>
<style>
.highcharts-container {
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 200px;
    width: 100% !important;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>