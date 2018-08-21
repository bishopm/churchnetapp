import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: null,
    hassocieties: false,
    hascircuits: false,
    hostname: 'http://localhost/churchnet/public/api'
    // hostname: 'https://church.net.za/api'
  },
  mutations: {
    setUser (state, newuser) {
      state.user = newuser
    },
    setToken (state, newtoken) {
      state.token = newtoken
    },
    setSocieties (state, newsocieties) {
      state.societies = newsocieties
      if (newsocieties.length) {
        state.hassocieties = true
      } else {
        state.hassocieties = false
      }
    },
    setCircuits (state, newcircuits) {
      state.circuits = newcircuits
      if (newcircuits.length) {
        state.hascircuits = true
      } else {
        state.hascircuits = false
      }
    }
  }
})

export default store
