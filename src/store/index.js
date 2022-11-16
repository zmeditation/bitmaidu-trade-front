import Vue from "vue"
import Vuex from "vuex"

import user from "./user.module"
import markets from "./markets.module"
import trade from "./trade.module"
import support from "./support.module"
import view from "./view.module"
import io from "./io.module"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        view,
        io,
        user,
        markets,
        trade,
        support
    }
})