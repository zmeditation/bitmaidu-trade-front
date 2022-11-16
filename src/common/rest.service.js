import Vue from "vue"
import axios from "axios"
import VueAxios from "vue-axios"

import {
    REST_ENDPOINT
} from "@/common/config"

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = REST_ENDPOINT

let token = '';
let errorCb = null;

export const RestService = {
    token(tok) {
        token = tok || ''
    },

    err(cb) {
        errorCb = cb
    },

    query(resource, params) {
        return Vue.axios.get(resource, params).catch(error => {
            throw new Error(`RestService ${error}`)
        })
    },

    get(resource, params) {
        return new Promise(resolve => {
            console.log('GET: '+resource)

            Vue.axios.get(`${resource}`, {
                params,
                headers: {
                    Authorization: token
                }
            })
                .then(ret => {
                    if (ret.data.error && errorCb !== null) {
                        errorCb(ret.data.error)
                        return
                    }

                    resolve(ret.data.data)
                })
                .catch(error => {
                    throw new Error(`RestService ${error}`)
                })
        })
    },

    post(resource, params) {
        return new Promise(resolve => {
            console.log('POST: '+resource, params)

            return Vue.axios.post(`${resource}`, params, {
                headers: {
                    Authorization: token
                }
            })
                .then(ret => {
                    if (ret.data.error && errorCb !== null) {
                        errorCb(ret.data.error)
                        return
                    }

                    resolve(ret.data.data)
                })
                .catch(error => {
                    throw new Error(`RestService ${error}`)
                })
        })
    },

    put(resource, params) {
        return new Promise(resolve => {
            console.log('PUT: '+resource, params)

            return Vue.axios.put(`${resource}`, params, {
                headers: {
                    Authorization: token
                }
            })
                .then(ret => {
                    if (ret.data.error && errorCb !== null) {
                        errorCb(ret.data.error)
                        return
                    }

                    resolve(ret.data.data)
                })
                .catch(error => {
                    throw new Error(`RestService ${error}`)
                })
        })
    },

    delete(resource) {
        return new Promise(resolve => {
            console.log('DELETE: '+resource)

            return Vue.axios.delete(`${resource}`, {
                headers: {
                    Authorization: token
                }
            })
                .then(ret => {
                    if (ret.data.error && errorCb !== null) {
                        errorCb(ret.data.error)
                        return
                    }

                    resolve(ret.data.data)
                })
                .catch(error => {
                    throw new Error(`RestService ${error}`)
                })
        })
    }
}

export default RestService
