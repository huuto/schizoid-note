import Vue from 'vue'
import firebase from '~/plugins/firebase'

// タイムスタンプを表示用年月日に変換
Vue.prototype.$timestampToDate = (timestamp) => {
  if (!timestamp) {
    return null
  }
  const convTimestamp = new firebase.firestore.Timestamp(
    timestamp.seconds,
    timestamp.nanoseconds
  )
  const date = convTimestamp.toDate()
  const y = date.getFullYear()
  const m = ('00' + (date.getMonth() + 1)).slice(-2)
  const d = ('00' + date.getDate()).slice(-2)
  return y + '/' + m + '/' + d
}
