// import firebase from '~/plugins/firebase'

export default function({ store }) {
  store.dispatch('authStateChanged')
  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     store.commit('login', user)
  //   } else {
  //     store.commit('logout')
  //   }
  // })
  console.log('auth.js')
}
