import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// state
import state from './state'
// mutations
import mutations from './mutations'
import actions from './actions'


export default new Vuex.Store({
    state,
    mutations,
    actions
})
