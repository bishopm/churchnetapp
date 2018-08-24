import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: null,
    hassocieties: false,
    hascircuits: false,
    hasdistricts: false,
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
      if (newsocieties.keys.length) {
        state.hassocieties = true
      } else {
        state.hassocieties = false
      }
    },
    setCircuits (state, newcircuits) {
      if (newcircuits.keys.length) {
        state.hascircuits = true
      } else {
        state.hascircuits = false
      }
    },
    setDistricts (state, newdistricts) {
      if (newdistricts.view.length) {
        state.hasdistricts = true
      } else {
        state.hasdistricts = false
      }
    }
  }
})

export default store
