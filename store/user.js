import firebase from '~/plugins/firebase'
export const strict = false

export const state = () => ({
  id: '',
  email: '',
  name: '',
  profile: '',
  photoURL: '',
  isLogin: false
})

export const mutations = {
  login (state, user) {
    state.id = user.uid
    state.email = user.email
    state.name = user.displayName
    state.photoURL = user.photoURL
    state.isLogin = true
  },
  logout (state) {
    firebase.auth().signOut()
    state.isLogin = false
  }
}

export const actions = {
  authStateChanged ({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        commit('login', user)
      } else {
        commit('logout')
      }
    })
  },
  authRedirect ({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        commit('logout')
        this.$router.push('/login')
      }
    })
  }
}
