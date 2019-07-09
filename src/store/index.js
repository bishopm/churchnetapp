import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default function (/* { ssrContext } */) {
  const store = new Vuex.Store({
    state: {
      token: null,
      user: {},
      circuitfilter: [],
      societyfilter: [],
      select: '',
      loaded: false,
      adminoptions: false
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
      setLoaded (state, newloaded) {
        state.loaded = newloaded
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
      setDFilter (state, newdfilter) {
        state.districtfilter = newdfilter
      },
      setSelect (state, newselect) {
        state.select = newselect
      },
      setAdminoptions (state, newadminoptions) {
        state.adminoptions = newadminoptions
      }
    }
  })

  return store
}
