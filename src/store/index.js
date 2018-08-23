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
      if ((newsocieties.view.length) || (newsocieties.edit.length)) {
        state.hassocieties = true
      } else {
        state.hassocieties = false
      }
    },
    setCircuits (state, newcircuits) {
      if ((newcircuits.view.length) || (newcircuits.edit.length)) {
        state.hascircuits = true
      } else {
        state.hascircuits = false
      }
    },
    setDistricts (state, newdistricts) {
      if ((newdistricts.view.length) || (newdistricts.edit.length)) {
        state.hasdistricts = true
      } else {
        state.hasdistricts = false
      }
    }
  }
})

export default store
