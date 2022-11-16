import io from 'socket.io-client'

import { SOCKET_ENDPOINT } from "@/common/config"

import { APP_INIT } from '@/store/actions.type'
import {
    BALANCE_UPDATE,
    BOOK, MARKETS, ORDER,
    SOCKET_CONNECTED, SUPPORT_MESSAGE, SYMBOL_ACTIVE, TRADE, USER
} from '@/store/mutations.type'

const state = {
    socket: null,
    socketState: false,
    symbolSub: null
}

const actions = {
    [APP_INIT]() {
        state.socket = io(SOCKET_ENDPOINT)

        state.socket.on('connect', () => {
            this.commit(SOCKET_CONNECTED)
        })
    }
}

const mutations = {
    [SOCKET_CONNECTED]() {
        state.socketState = true

        if (state.symbolSub) {
            state.socket.emit('subscribe', {
                topic: 'crypto:orderbook@'+state.symbolSub
            })
            state.socket.emit('subscribe', {
                topic: 'crypto:trade@'+state.symbolSub
            })
        }

        state.socket.emit('subscribe', {
            topic: 'crypto:markets'
        })

        state.socket.off('crypto:trade').on('crypto:trade', trade => {
            this.commit(TRADE, trade)
        })
        state.socket.off('crypto:orderbook').on('crypto:orderbook', book => {
            this.commit(BOOK, book)
        })
        state.socket.off('crypto:markets').on('crypto:markets', markets => {
            console.log(markets)
            this.commit(MARKETS, markets)
        })
        state.socket.off('crypto:order').on('crypto:order', order => {
            this.commit(ORDER, order)
        })
        state.socket.off('crypto:balance').on('crypto:balance', balance => {
            this.commit(BALANCE_UPDATE, balance)
        })
        state.socket.off('chat_message').on('chat_message', message => {
            this.commit(SUPPORT_MESSAGE, message)
        })
    },

    [USER](context, user) {
        state.socketState = false

        state.socket.destroy()

        state.socket = io(SOCKET_ENDPOINT, {
            query: {
                Authorization: user.jwt_token
            }
        })

        state.socket.on('connect', () => {
            this.commit(SOCKET_CONNECTED)
        })
    },

    [SYMBOL_ACTIVE](context, symbol) {
        if (symbol !== state.symbolSub) {
            if (state.socketState) {
                if (state.symbolSub) {
                    state.socket.emit('unsubscribe', {
                        topic: 'crypto:orderbook@'+state.symbolSub
                    })
                    state.socket.emit('unsubscribe', {
                        topic: 'crypto:trade@'+state.symbolSub
                    })
                }

                state.socket.emit('subscribe', {
                    topic: 'crypto:orderbook@'+symbol
                })
                state.socket.emit('subscribe', {
                    topic: 'crypto:trade@'+symbol
                })
            }
        }

        state.symbolSub = symbol
    }
}

export default {
    state,
    actions,
    mutations
}
