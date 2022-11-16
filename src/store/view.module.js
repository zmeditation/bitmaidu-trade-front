import Vue from 'vue'
import {
    CONFIRM_ORDER,
    LANG,
    MODAL_CABINET,
    MODAL_CALCULATOR,
    MODAL_LOGIN, MODAL_ORDER_CONFIRM, MODAL_SUPPORT,
    NOTIFICATION, NOTIFICATION_ERROR, NOTIFICATION_REMOVE,
    SYMBOL_ACTIVE,
    SYMBOL_FAVORITE,
    USER
} from "@/store/mutations.type"
import {COMPANY_NAME, SYMBOL_DEFAULT} from "@/common/config";
import {APP_INIT} from "@/store/actions.type";
import langs from "@/common/langs";
import RestService from "@/common/rest.service";

const successSound = new Audio(require('@/assets/sounds/success.wav'));
const errorSound = new Audio(require('@/assets/sounds/error.wav'));

const state = {
    notificationId: 0,
    notifications: [],
    symbolActive: SYMBOL_DEFAULT,
    symbolsFavorite: [],
    modalLoginActive: false,
    modalCabinetActive: false,
    modalOrderConfirmActive: false,
    modalSupportActive: false,
    confirmOrder: true,
    langActive: 'gb'
}

const getters = {
    symbolActive() {
        return state.symbolActive
    },

    langActive() {
        return state.langActive
    },

    modalLoginActive() {
        return state.modalLoginActive
    },

    modalCabinetActive() {
        return state.modalCabinetActive
    },

    modalCalculatorActive() {
        return state.modalCalculatorActive
    },

    modalOrderConfirmActive() {
        return state.modalOrderConfirmActive
    },

    modalSupportActive() {
        return state.modalSupportActive
    },

    confirmOrder() {
        return state.confirmOrder
    },

    symbolsFavorite() {
        return state.symbolsFavorite
    },

    tokens() {
        return langs[state.langActive]
    },

    notification() {
        return state.notification
    },

    notifications() {
        return state.notifications
    },
}

const actions = {
    [APP_INIT]() {
        let symbol = window.location.pathname.split('/')

        if (!symbol[2]) {
            symbol = SYMBOL_DEFAULT
        } else {
            symbol = symbol[2]
        }

        let path = window.location.search.slice(1).split('&')

        this.commit(SYMBOL_ACTIVE, symbol)

        for(let n in path) {
            let t = path[n].split('='),
                param = t[0],
                val = t[1]

            switch (param) {
                case 'token':
                    window.localStorage.setItem('token', val)
                    RestService.token(val)
                    break
            }
        }

        let favs = window.localStorage.getItem('symbolsFavorite')

        if (favs) {
            try {
                favs = JSON.parse(favs)
            } catch (e) {
                return
            }

            if (!Array.isArray(favs)) {
                return
            }

            favs.forEach(sym => {
                this.commit(SYMBOL_FAVORITE, {
                    symbol: sym,
                    action: 'add'
                })
            })
        }

        let lang = window.localStorage.getItem('langActive')

        if (lang) {
            this.commit(LANG, lang)
        }

        let confirm = window.localStorage.getItem('confirmOrder')

        state.confirmOrder = confirm !== 'false'

        document.title = COMPANY_NAME

        RestService.err(err => {
            this.commit(NOTIFICATION_ERROR, err)
        })
    }
}

const mutations = {
    [USER]() {
        this.commit(MODAL_LOGIN, false)
    },

    [SYMBOL_ACTIVE](context, symbol) {
        state.symbolActive = symbol

        window.history.pushState({}, '', '/spot/'+symbol)
    },

    [MODAL_LOGIN](context, val) {
        state.modalLoginActive = val
    },

    [MODAL_CABINET](context, val) {
        state.modalCabinetActive = val
    },

    [MODAL_CALCULATOR](context, val) {
        state.modalCalculatorActive = val
    },

    [MODAL_ORDER_CONFIRM](context, val) {
        state.modalOrderConfirmActive = val
    },

    [MODAL_SUPPORT](context, val) {
        state.modalSupportActive = val
    },

    [SYMBOL_FAVORITE](context, sym) {
        let index
        switch (sym.action) {
            case 'add':
                if (state.symbolsFavorite.indexOf(sym.symbol) === -1) {
                    state.symbolsFavorite.push(sym.symbol)

                    window.localStorage.setItem('symbolsFavorite', JSON.stringify(state.symbolsFavorite))
                }
                break
            case 'remove':
                index = state.symbolsFavorite.indexOf(sym.symbol)
                if (index === -1) {
                    return
                }

                state.symbolsFavorite.splice(index, 1)

                window.localStorage.setItem('symbolsFavorite', JSON.stringify(state.symbolsFavorite))

                Vue.set(state, 'symbolsFavorite', state.symbolsFavorite)
                break

        }
    },

    [NOTIFICATION](context, val) {
        let id = state.notificationId++,
        notification = {
            type: 'success',
            text: val,
            id
        }

        state.notifications.push(notification)
        setTimeout(() => {
            this.commit(NOTIFICATION_REMOVE, id)
        }, 4000)

        successSound.play()
    },

    [NOTIFICATION_ERROR](context, val) {
        let id = state.notificationId++,
        notification = {
            type: 'error',
            text: val,
            id
        }

        state.notifications.push(notification)
        setTimeout(() => {
            this.commit(NOTIFICATION_REMOVE, id)
        }, 4000)

        errorSound.play()
    },

    [NOTIFICATION_REMOVE](context, id) {
        for(let n in state.notifications) {
            if (state.notifications[n].id === id) {
                state.notifications.splice(n, 1)
                break
            }
        }

        Vue.set(state, 'notifications', state.notifications)
    },

    [LANG](context, val) {
        state.langActive = val

        window.localStorage.setItem('langActive', val)
    },

    [CONFIRM_ORDER](context, val) {
        state.confirmOrder = val

        window.localStorage.setItem('confirmOrder', val)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};
