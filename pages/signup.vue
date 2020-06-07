<template>
  <b-container class="my-5">
    <div style="max-width: 640px;" class="mx-auto">
      <MsgPopup :msg-popup="msgPopup" />
    </div>
    <b-container class="bg-white p-5" style="max-width: 640px;">
      <div style="max-width: 400px;" class="m-auto">
        <div class="text-center" style="margin: 7vh 0 5vh 0;">
          <h2>新規登録</h2>
        </div>
        <div class="text-center mb-5">
          <b-button
            style="background-color: #1da1f2; border-color: #1da1f2;"
            @click="twitterLogin()"
          >
            <i class="fab fa-twitter mr-2" color="white" />Twitterで登録
          </b-button>
        </div>
        <b-form @submit.prevent="signup()">
          <b-form-group>
            <label for="name">ユーザー名</label>
            <b-form-input
              id="name"
              v-model="user.name"
              type="text"
              required
              class="mb-3"
            />
            <label for="email">メールアドレス</label>
            <b-form-input
              id="email"
              v-model="user.email"
              type="email"
              required
              class="mb-3"
            />
            <label for="password">パスワード</label>
            <b-form-input
              id="password"
              v-model="user.password"
              type="password"
              required
              class="mb-3"
            />
            <label for="passwordConfimation">確認用パスワード</label>
            <b-form-input
              id="passwordConfimation"
              v-model="user.passwordConfimation"
              type="password"
              required
              class="mb-4"
            />
            <p>
              登録の前に
              <b-link
                to="/support/terms"
                target="_blank"
                rel="noopener noreferrer"
                >利用規約</b-link
              >をご確認ください。
            </p>
            <b-form-checkbox v-model="isAgree"
              >利用規約の内容に合意しました。</b-form-checkbox
            >
          </b-form-group>
          <div class="text-center mb-5">
            <b-button
              variant="primary"
              style=""
              :disabled="!isAgree"
              @click="signup()"
            >
              登録
            </b-button>
          </div>
          <div class="text-center mb-5">
            <b-button variant="link" style="color: #707070;" to="login">
              ログイン画面に戻る
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
    name: string
    email: string
    password: string
    passwordConfimation: string
  }
  msgPopup: MsgPopupType
  isAgree: boolean
}

export default Vue.extend({
  layout: 'prelogin',
  components: {
    MsgPopup,
  },
  data(): DataType {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        passwordConfimation: '',
      },
      msgPopup: { message: '', variant: '', isSpinner: false },
      isAgree: false,
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
      }
    })
  },
  methods: {
    async signup() {
      if (
        this.user.name !== '' &&
        this.user.email !== '' &&
        this.user.password !== ''
      ) {
        if (this.user.password === this.user.passwordConfimation) {
          try {
            await firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.user.email,
                this.user.password
              )
            await firebase.auth().currentUser?.updateProfile({
              displayName: this.user.name,
            })
            const user: firebase.User | null = await firebase.auth().currentUser
            await firebase.firestore().collection('users').doc(user?.uid).set({
              user_name: user?.displayName,
              user_img: user?.photoURL,
              profile: '',
            })
            this.$router.push('/')
          } catch (error) {
            if (
              [
                'auth/credential-already-in-use',
                'auth/email-already-in-use',
              ].includes(error.code)
            ) {
              this.msgPopup = {
                message: 'そのメールアドレスはすでに登録されています。',
                variant: 'danger',
              }
            } else if (error.code === 'auth/weak-password') {
              this.msgPopup = {
                message: 'パスワードは6文字以上にしてください。',
                variant: 'danger',
              }
            } else {
              this.msgPopup = {
                message: 'エラーが発生してユーザーが登録できませんでした。',
                variant: 'danger',
              }
            }
            console.error(error)
          }
        } else {
          this.msgPopup = {
            message: 'パスワードと確認用パスワードが一致しません',
            variant: 'danger',
          }
        }
      } else {
        this.msgPopup = {
          message: '必要な項目を入力してください',
          variant: 'danger',
        }
      }
    },
    async twitterLogin() {
      await firebase
        .auth()
        .signInWithRedirect(new firebase.auth.TwitterAuthProvider())
    },
  },
  head() {
    return {
      title: '新規登録',
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
