<template>
  <b-container class="my-5">
    <div style="max-width: 640px;" class="mx-auto">
      <MsgPopup :msg-popup="msgPopup" />
    </div>
    <b-container class="bg-white p-5" style="max-width: 640px;">
      <div style="max-width: 400px;" class="m-auto">
        <div class="text-center" style="margin: 7vh 0 10vh 0;">
          <h2>ログイン</h2>
        </div>
        <b-form @submit.prevent="login()">
          <b-form-group class="mb-5">
            <label for="email">メールアドレス</label>
            <b-form-input
              id="email"
              v-model="user.email"
              type="email"
              required
              class="mb-3"
              name="email"
            />
            <label for="password">パスワード</label>
            <b-form-input
              id="password"
              v-model="user.password"
              type="password"
              name="password"
              required
              class="mb-3"
            />
          </b-form-group>
          <div class="text-center mb-3">
            <b-button variant="primary" style="" type="submit" @click="login()">
              ログイン
            </b-button>
          </div>
          <div class="text-center mb-5">
            <b-button
              style="background-color: #1da1f2; border-color: #1da1f2;"
              @click="twitterLogin()"
            >
              <i class="fab fa-twitter mr-2" color="white" />Twitterでログイン
            </b-button>
          </div>
          <div class="text-center mb-5">
            <b-button variant="link" style="color: #707070;" to="signup">
              アカウント作成
            </b-button>
          </div>
        </b-form>
      </div>
    </b-container>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '@/plugins/firebase'
import MsgPopup, { MsgPopupType } from '~/components/common/msgPopup.vue'

export type DataType = {
  user: {
    email: string
    password: string
    valid: boolean
  }
  msgPopup: MsgPopupType
}

export default Vue.extend({
  layout: 'prelogin',
  components: {
    MsgPopup,
  },
  data(): DataType {
    return {
      user: {
        email: '',
        password: '',
        valid: false,
      },
      msgPopup: { message: '', variant: '', isSpinner: false },
    }
  },
  mounted() {
    // twitterのリダイレクト認証で戻ってきた場合、認証情報をユーザーに反映しホームに遷移
    firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
      if (user !== null) {
        this.msgPopup = {
          message: 'ホーム画面に移動します。<br />しばらくお待ちください。',
          variant: 'info',
          isSpinner: true,
        }
        this.$store.dispatch('authStateChanged')
        const user = firebase.auth().currentUser
        firebase.firestore().collection('users').doc(user?.uid).set(
          {
            user_name: user?.displayName,
            user_img: user?.photoURL,
          },
          { merge: true }
        )
        this.$router.push('/')
      } else {
        this.user.valid = false
      }
    })
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(() => {
          this.$store.dispatch('user/authStateChanged')
          this.$router.push('/')
        })
        .catch((error) => {
          if (
            ['auth/wrong-password', 'auth/user-not-found'].includes(error.code)
          ) {
            this.msgPopup = {
              message: 'メールアドレスかパスワードが違います。',
              variant: 'danger',
            }
          }
          console.error(error)
        })
    },
    async twitterLogin() {
      await firebase
        .auth()
        .signInWithRedirect(new firebase.auth.TwitterAuthProvider())
    },
  },
  head() {
    return {
      title: 'ログイン',
    }
  },
})
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
</style>
