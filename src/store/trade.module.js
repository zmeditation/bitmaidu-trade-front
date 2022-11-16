import Vue from 'vue';
import {
    ACCOUNT, BALANCE_UPDATE,
    HISTORY,
    HISTORY_LENGTH,
    LOGOUT,
    ORDER,
    SYMBOL_ACTIVE, TRADE,
    TRADES_FULL,
    USER,
    NOTIFICATION
} from "@/store/mutations.type";
import RestService from "@/common/rest.service";
import {HISTORY_REQUEST, ORDER_CANCEL, ORDER_REQUEST} from "@/store/actions.type";

const state = {
    account: {
        id: 0,
        leverage: 100,
        precision: 4,
        balance: 0,
        currency: 'BTC',
        wallets: {}
    },
    orders: {},
    trades: [],
    history: [],
    historyLen: 0
}

const getters = {
    account() {
        return state.account
    },

    orders() {
        return state.orders
    },

    trades() {
        return state.trades
    },

    history() {
        return state.history
    },

    historyLen() {
        return state.historyLen
    }
}

const actions = {
    [ORDER_REQUEST](context, order) {
        order.account_id = state.account.id
        RestService.post('/crypto/'+state.account.id+'/orders', order)
    },

    [ORDER_CANCEL](context, order) {
        order.account_id = state.account.id
        RestService.delete('/crypto/'+state.account.id+'/orders/'+order.id)
    },

    [HISTORY_REQUEST](context, page) {
        RestService.get('/crypto/'+state.account.id+'/orders/history?limit=10&offset='+page*10)
            .then(orders => {
                for(let i in orders.orders) {
                    this.commit(HISTORY, orders.orders[i])
                }
            })
    }
}

const mutations = {
    [USER]() {
        RestService.get('/crypto/accounts')
            .then(accounts => {
                for(let i in accounts) {
                    this.commit(ACCOUNT, accounts[i])
                }
            })
    },

    [ACCOUNT](context, account) {
        state.account = account

        RestService.get('/crypto/'+account.id+'/orders')
            .then(orders => {
                for(let i in orders) {
                    this.commit(ORDER, orders[i])
                }
            })

        RestService.get('/crypto/'+account.id+'/orders/history')
            .then(orders => {
                for(let i in orders.orders) {
                    this.commit(HISTORY, orders.orders[i])
                }
                this.commit(HISTORY_LENGTH, orders.total)
            })

        RestService.get('/crypto/'+account.id+'/trades')
            .then(trades => {
                for(let i in trades) {
                    this.commit(TRADES_FULL, trades[i])
                }
            })
    },

    [SYMBOL_ACTIVE](context, symbol) {
        if (!state.account.id) {
            return
        }

        RestService.get('/crypto/'+state.account.id+'/trades?symbol='+symbol)
            .then(trades => {
                this.commit(TRADES_FULL, trades)
            })

        state.symActive = symbol
    },

    [ORDER](context, order) {
        switch (order.status) {
            case 'NEW':
                return
            case 'ACTIVE':
                this.commit(NOTIFICATION, 'Order #'+order.id.split('-')[0]+' '+(order.side ? 'Buy' : 'Sell')+' '+order.quantity+' '+order.symbol+' is active')
                Vue.set(state.orders, order.id, order)
                break
            case 'PARTIALLY_FILLED':
                this.commit(NOTIFICATION, 'Order #'+order.id.split('-')[0]+' '+(order.side ? 'Buy' : 'Sell')+' '+order.quantity_filled+'/'+order.quantity+' '+order.symbol+' partially filled')
                Vue.set(state.orders, order.id, order)
                break
            case 'FILLED':
                this.commit(NOTIFICATION, 'Order #'+order.id.split('-')[0]+' '+(order.side ? 'Buy' : 'Sell')+' '+order.quantity+' '+order.symbol+' is filled')

                Vue.delete(state.orders, order.id)

                state.history.unshift(order)
                state.historyLen++

                break
            case 'CANCELLED':
                this.commit(NOTIFICATION, 'Order #'+order.id.split('-')[0]+' '+(order.side ? 'Buy' : 'Sell')+' '+order.quantity+' '+order.symbol+' is cancelled')

                Vue.delete(state.orders, order.id)

                state.history.unshift(order)
                state.historyLen++

                break
            default:
                return
        }
    },

    [TRADES_FULL](context, trades) {
        Vue.set(state, 'trades', trades)
    },

    [TRADE](context, trade) {
        if (trade.maker_id !== state.account.id && trade.taker_id !== state.account.id) {
            return
        }

        let nTrade = {
            ...trade
        }

        if (nTrade.maker_id === state.account.id) {
            nTrade.side = nTrade.side ? 0 : 1
        }

        state.trades.unshift(nTrade)
        state.trades = state.trades.slice(0, 20)

        Vue.set(state, 'trades', state.trades)
    },

    [HISTORY](context, order) {
        let res = state.history.filter(obj => {
            return obj.id === order.id
        })

        if (res.length) {
            return
        }

        state.history.push(order)
        state.history.sort((a, b) => {
            return a.time_closed > b.time_closed ? 1 : (a.time_closed < b.time_closed ? -1 : 0)
        })
    },

    [HISTORY_LENGTH](context, total) {
        state.historyLen = total
    },

    [BALANCE_UPDATE](context, balance) {
        if (state.account.wallets[balance.currency] !== undefined) {
            Vue.set(state.account.wallets[balance.currency], 'balance', state.account.wallets[balance.currency].balance + balance.amount)
        } else {
            state.account.wallets[balance.currency] = {
                precision: balance.precision,
                balance: balance.amount,
                currency: balance.currency
            }
        }
        state.account.balance += balance.amount
    },

    [LOGOUT]() {
        state.account = {
            leverage: 100,
            precision: 4,
            balance: 0,
            currency: 'BTC'
        }

        Vue.set(state, 'orders', {})
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
