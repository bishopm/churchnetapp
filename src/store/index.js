import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: null,
    user: {},
    circuitfilter: [],
    societyfilter: [],
    select: '',
    // hostname: 'http://localhost/churchnet/public/api'
    hostname: 'https://church.net.za/api'
  },
  getters: {
    hasEntity: (state) => (entity) => {
      if (state.user) {
        return state.user[entity]
      } else {
        return false
      }
    },
    hasUser: (state) => (entity) => {
      if (state.user) {
        return true
      } else {
        return false
      }
    }
  },
  mutations: {
    setUser (state, newuser) {
      state.user = newuser
    },
    setToken (state, newtoken) {
      state.token = newtoken
    },
    setSFilter (state, newsfilter) {
      state.societyfilter = newsfilter
    },
    setCFilter (state, newcfilter) {
      state.circuitfilter = newcfilter
    },
    setSelect (state, newselect) {
      state.select = newselect
    }
  }
})

export default store
