import firebase from '~/plugins/firebase'
export const strict = false

export const state = () => ({
  user: {
    id: '',
    email: '',
    name: '',
    profile: '',
    photoURL: '',
    isLogin: false
  }
})

export const mutations = {
  login(state, user) {
    state.user.email = user.email
    state.user.name = user.displayName
    state.user.photoURL = user.photoURL
    state.user.id = user.uid
    state.user.isLogin = true
  },
  logout(state) {
    firebase.auth().signOut()
    state.user.isLogin = false
  }
}

export const actions = {
  authStateChanged({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        commit('login', user)
      } else {
        commit('logout')
      }
    })
  },
  authRedirect({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        commit('logout')
        this.$router.push('/')
      }
    })
  }
}
