import firebase from 'firebase'

const config = {
  apiKey: process.env.VUE_APP_apiKey,
  authDomain: process.env.VUE_APP_authDomain,
  databaseURL: process.env.VUE_APP_databaseURL,
  projectId: process.env.VUE_APP_projectId,
  storageBucket: process.env.VUE_APP_storageBucket,
  messagingSenderId: process.env.VUE_APP_messagingSenderId,
  appId: process.env.VUE_APP_appId
  // measurementId: process.env.VUE_APP_measurementId,
}

// const config = {
//   apiKey: 'AIzaSyDpl8qxqm-h9JPp0_BIN_SgLIUMv1qOmMg',
//   authDomain: 'schizoid-note.firebaseapp.com',
//   databaseURL: 'https://schizoid-note.firebaseio.com',
//   projectId: 'schizoid-note',
//   storageBucket: 'schizoid-note.appspot.com',
//   messagingSenderId: '366526397368',
//   appId: '1:366526397368:web:cecde824119ad1bcb6ed4d',
//   measurementId: 'G-VYD0ZHF4T8',
// }

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase
