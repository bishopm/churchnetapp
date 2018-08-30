import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: null,
    user: {},
    filter: [],
    hostname: 'http://localhost/churchnet/public/api'
    // hostname: 'https://church.net.za/api'
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
    setFilter (state, newfilter) {
      state.filter = newfilter
    }
  }
})

export default store
