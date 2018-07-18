import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    profile: {},
    circuitname: '',
    circuitid: 0,
    hostname: 'http://localhost/churchnet/public/api/methodist'
    // hostname: 'https://church.net.za/api'
  },
  mutations: {
    setProfile (state, newprofile) {
      state.profile = newprofile
    },
    setCircuitName (state, newname) {
      state.circuitname = newname
    },
    setCircuitId (state, newid) {
      state.circuitid = newid
    },
    setSocietyId (state, newsocietyid) {
      state.societyid = newsocietyid
    },
    setSocietyName (state, newsocietyname) {
      state.societyname = newsocietyname
    },
    setGroups (state, newgroups) {
      state.menu_groups = newgroups
    },
    setBirthdays (state, newbdays) {
      state.menu_birthdays = newbdays
    },
    setFeeditems (state, newitems) {
      state.feeditems = newitems
    },
    setMedia (state, newmedia) {
      state.menu_media = newmedia
    }
  }
})

export default store
