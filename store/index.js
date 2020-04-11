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
    state.user = null
    state.user.isLogin = false
  }
}

export const actions = {}
