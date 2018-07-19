import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: {},
    hostname: 'http://localhost/churchnet/public/api/methodist'
    // hostname: 'https://church.net.za/api'
  },
  mutations: {
    setUser (state, newuser) {
      state.user = newuser
    },
    setSocieties (state, newsocieties) {
      state.societies = newsocieties
    }
  }
})

export default store
