import Vue from 'vue';
import {APP_INIT} from "@/store/actions.type";
import RestService from "@/common/rest.service";
import {
    BOOK, BOOK_FRAME,
    BOOK_FULL, CURRENCY,
    LAST_TRADES_FULL,
    MARKETS,
    SYMBOL,
    SYMBOL_ACTIVE,
    TRADE
} from "@/store/mutations.type";
import {SYMBOL_DEFAULT} from "@/common/config";
import {findLevel} from "@/common/helpers";

const state = {
    markets: {
        [SYMBOL_DEFAULT]: {
            price: 0,
            precision: 2,
            base_currency: '',
            foreign_currency: '',
            alias: '/',
            quote: {
                symbol: '',
                bid: 0,
                ask: 0,
                volume: 0,
                volume24h: 0,
                trend: 0,
                change: 0,
                changePct: 0,
                changeDir: 0
            }
        }
    },
    currencies: {},
    lastTrades: [],
    orderBook: {
        bids: [],
        asks: []
    },
    orderBookLast: {
        bids: [],
        asks: []
    },
    orderBookFrames: [],
    symActive: SYMBOL_DEFAULT
}

const getters = {
    markets() {
        return state.markets
    },

    currencies() {
        return state.currencies
    },

    lastTrades() {
        return state.lastTrades
    },

    orderBook() {
        return state.orderBook
    },

    quote() {
        return state.markets[state.symActive] ? state.markets[state.symActive].quote : state.markets[SYMBOL_DEFAULT].quote
    }
}

const actions = {
    [APP_INIT]() {
        RestService.get('/crypto/symbols')
            .then(symbols => {
                for(let i in symbols) {
                    this.commit(SYMBOL, symbols[i])
                }
            })

        RestService.get('/crypto/currencies')
            .then(currencies => {
                for(let i in currencies) {
                    this.commit(CURRENCY, currencies[i])
                }
            })

        setInterval(() => {
            let f = state.orderBookFrames.shift()

            if (state.orderBookFrames.length > 4) {
                state.orderBookFrames = state.orderBookFrames.slice(-4)
            }

            if (f) {
                this.commit(BOOK_FRAME, f)
            }
        }, 250)
    }
}

const mutations = {
    [SYMBOL](context, symbol) {
        symbol.quote.changeDir = 0
        Vue.set(state.markets, symbol.symbol, symbol)
    },

    [CURRENCY](context, currency) {
        Vue.set(state.currencies, currency.currency, currency)
    },

    [SYMBOL_ACTIVE](context, symbol) {
        RestService.get('/crypto/orderbook?symbol='+symbol)
            .then(book => {
                this.commit(BOOK_FULL, book)
            })

        RestService.get('/crypto/last_trades?symbol='+symbol)
            .then(trades => {
                this.commit(LAST_TRADES_FULL, trades)
            })

        state.symActive = symbol
    },

    [LAST_TRADES_FULL](context, trades) {
        Vue.set(state, 'lastTrades', trades)
    },

    [BOOK_FULL](context, book) {
        Vue.set(state, 'orderBook', book)

        state.orderBookLast = {
            bids: JSON.parse(JSON.stringify(book.bids)),
            asks: JSON.parse(JSON.stringify(book.asks))
        }
    },

    [TRADE](context, trade) {
        state.lastTrades.unshift(trade)
        state.lastTrades = state.lastTrades.slice(0, 20)

        Vue.set(state, 'lastTrades', state.lastTrades)
    },

    [BOOK](context, data) {
        let framesCnt = 0,
            framesTotal = 0

        for (let side in data.book) {
            for (let n in data.book[side]) {
                n;
                framesTotal++
            }
        }

        let freq = Math.floor(framesTotal / 3),
            min = {bids: null, asks: null}

        for (let side in data.book) {
            for(let n in data.book[side]) {
                let index = findLevel(data.book[side][n][0], state.orderBookLast[side], side)
                data.book[side][n][2] = Math.ceil(Math.random()*4)

                if (!min[side] || (side === 'bids' && data.book[side][n][0] > min[side]) || (side === 'asks' && data.book[side][n][0] < min[side])) {
                    min[side] = data.book[side][n][0]
                }

                if (index === state.orderBookLast[side].length) {
                    if (data.book[side][n][1] === 0) {
                        continue
                    }
                    state.orderBookLast[side].push(data.book[side][n])
                } else if (data.book[side][n][1] === 0) {
                    state.orderBookLast[side].splice(index, 1)
                } else if (data.book[side][n][0] === state.orderBookLast[side][index][0]) {
                    state.orderBookLast[side][index] = data.book[side][n]
                } else {
                    state.orderBookLast[side].splice(index, 0, data.book[side][n])
                }

                if (++framesCnt === freq) {
                    framesCnt = 0

                    state.orderBookFrames.push({
                        bids: JSON.parse(JSON.stringify(state.orderBookLast.bids)),
                        asks: JSON.parse(JSON.stringify(state.orderBookLast.asks))
                    })
                }
            }
        }

        for(let side in min) {
            for(let i=state.orderBookLast[side].length - 1; i>=0; i--) {
                if ((side === 'bids' && min['asks'] && state.orderBookLast[side][i][0] >= min['asks']) || (side === 'asks' && min['bids'] && state.orderBookLast[side][i][0] <= min['bids'])) {
                    state.orderBookLast[side].splice(i, 1)
                }
            }
        }

        state.orderBookFrames.push({
            bids: JSON.parse(JSON.stringify(state.orderBookLast.bids)),
            asks: JSON.parse(JSON.stringify(state.orderBookLast.asks))
        })
    },

    [BOOK_FRAME](context, frame) {
        Vue.set(state, 'orderBook', frame)
    },

    [MARKETS](context, markets) {
        for(let sym in markets) {
            if (state.markets[sym] !== undefined) {
                if (state.markets[sym].quote.bid > markets[sym].bid) {
                    markets[sym].changeDir = -1
                } else if (state.markets[sym].quote.bid < markets[sym].bid) {
                    markets[sym].changeDir = 1
                } else {
                    markets[sym].changeDir = state.markets[sym].quote.changeDir
                }
                Vue.set(state.markets[sym], 'quote', markets[sym])
            }
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};
