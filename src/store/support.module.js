import Vue from 'vue'
import {SUPPORT_SEND} from "@/store/actions.type";
import RestService from "@/common/rest.service";
import {LOGOUT, SUPPORT_MESSAGE, USER} from "@/store/mutations.type";

const state = {
    supportMessages: []
}

const getters = {
    supportMessages() {
        return state.supportMessages
    }
}

const actions = {
    [SUPPORT_SEND](context, text) {
        RestService.post('/support/messages', {text})
    }
}

const mutations = {
    [USER]() {
        RestService.get('/support/messages')
            .then(messages => {
                for(let n in messages) {
                    this.commit(SUPPORT_MESSAGE, messages[n])
                }
            })
    },

    [SUPPORT_MESSAGE](context, message) {
        state.supportMessages.push(message)
    },

    [LOGOUT]() {
        Vue.set(state, 'supportMessages', [])
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}