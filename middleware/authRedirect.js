import firebase from '~/plugins/firebase'

export default function ({ route, store, redirect }) {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      store.commit('logout')
      redirect('/')
    }
  })
  console.log('authRedirect.js')
}
