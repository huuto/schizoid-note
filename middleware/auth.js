import firebase from '~/plugins/firebase'

export default function({ route, store, redirect }) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      store.commit('login', user)
    } else if (store.state.user.isLogin === false) {
      redirect('/login')
    }
  })
}
