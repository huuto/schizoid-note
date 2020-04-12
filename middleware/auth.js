import firebase from '~/plugins/firebase'

export default function({ route, store, redirect }) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // // twitterログイン
      // if (user.email === null) {
      //   store.commit('twitterLogin', user)
      // } else {
      //   store.commit('login', user)
      // }
    } else {
      store.commit('logout')
      redirect('/')
    }
  })
}
