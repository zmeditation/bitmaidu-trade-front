import Vue from 'vue'
import RestService from "@/common/rest.service";
import {
    APP_INIT,
    DEPOSIT_REQUEST,
    DEPOSITS_GET,
    LOGIN,
    LOGOUT, PASSWORD_CHANGE, PERSONAL_UPDATE,
    WITHDRAWAL_REQUEST,
    WITHDRAWALS_GET
} from "@/store/actions.type";
import {
    DEPOSIT_ADDRESS,
    DEPOSITS,
    NOTIFICATION,
    USER,
    WITHDRAWALS
} from "@/store/mutations.type";
import {timeToString} from "@/common/helpers";

const state = {
    loggedIn: false,
    token: null,
    user: {
        firstname: '',
        lastname: '',
        fullname: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        address: '',
        postcode: ''
    },
    deposits: [],
    withdrawals: [],
    depositAddress: ''
}

const getters = {
    loggedIn() {
        return state.loggedIn
    },

    user() {
        return state.user
    },

    deposits() {
        return state.deposits
    },

    withdrawals() {
        return state.withdrawals
    },

    depositAddress() {
        return state.depositAddress
    }
}

const actions = {
    [APP_INIT]() {
        state.token = window.localStorage.getItem('token')

        if (state.token === undefined || state.token === 'undefined' || state.token === null || state.token === 'null') {
            window.localStorage.removeItem('token')
        } else {
            RestService.token(state.token)
            RestService.get('/user')
                .then(user => {
                    user.jwt_token = state.token
                    this.commit(USER, user)
                })
        }
    },

    [LOGIN](context, data) {
        RestService.post('/auth', data)
            .then(user => {
                RestService.token(user.jwt_token)
                window.localStorage.setItem('token', user.jwt_token)

                this.commit(USER, user)
            })
    },

    [PERSONAL_UPDATE](context, user) {
        RestService.put('/user', user)
            .then(() => {
                this.commit(NOTIFICATION, 'Personal details have been updated')

                let nUser = {
                    ...state.user
                }

                for (let n in user) {
                    nUser[n] = user[n]
                }

                this.commit(USER, nUser)
            })
    },

    [PASSWORD_CHANGE](context, pass) {
        RestService.put('/user/password', pass)
            .then(() => {
                this.commit(NOTIFICATION, 'Password has been changed')
            })
    },

    [DEPOSIT_REQUEST](context, data) {
        data.product = 'crypto'
        data.account_id = context.getters.account.id
        RestService.get('/psp/nax/wallet', data)
            .then(res => {
                if (res.wallet) {
                    this.commit(DEPOSIT_ADDRESS, res.wallet)
                }
            })
    },

    [DEPOSITS_GET]() {
        RestService.get('/transactions/deposits')
            .then(deposits => {
                this.commit(DEPOSITS, deposits.rows)
            })
    },

    [WITHDRAWAL_REQUEST](context, data) {
        data.product = 'crypto'
        data.account_id = context.getters.account.id
        data.balance = 'balance'
        RestService.post('/transactions/withdrawals', data)
            .then(() => {
                this.commit(NOTIFICATION, 'Withdrawal request has been sent')
                this.dispatch(WITHDRAWALS_GET)
            })
    },

    [WITHDRAWALS_GET]() {
        RestService.get('/transactions/withdrawals')
            .then(deposits => {
                this.commit(WITHDRAWALS, deposits.rows)
            })
    },

    [LOGOUT]() {
        window.localStorage.removeItem('token')
        RestService.token('')

        this.commit(LOGOUT)
    }
}

const mutations = {
    [USER](context, user) {
        state.user = user
        state.loggedIn = true
    },

    [DEPOSIT_ADDRESS](context, wallet) {
        state.depositAddress = wallet
    },

    [DEPOSITS](context, deposits) {
        for(let i in deposits) {
            deposits[i].timeCreatedString = timeToString(deposits[i].time_created)
        }
        deposits.reverse()
        Vue.set(state, 'deposits', deposits)
    },

    [WITHDRAWALS](context, withdrawals) {
        for(let i in withdrawals) {
            withdrawals[i].timeCreatedString = timeToString(withdrawals[i].time_created)
        }
        withdrawals.reverse()
        Vue.set(state, 'withdrawals', withdrawals)
    },

    [LOGOUT]() {
        state.loggedIn = false

        state.token = null

        state.user = {
            fullname: ''
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
