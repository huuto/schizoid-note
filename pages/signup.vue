<template>
  <b-container class="my-5">
    <b-container class="bg-white p-5" style="max-width:640px">
      <div style="max-width:400px" class="m-auto">
        <div class="text-center" style="margin:7vh 0 10vh 0">
          <h2>新規登録</h2>
        </div>
        <div class="text-danger mb-3">{{ message }}</div>
        <b-form @submit.prevent="signup()">
          <b-form-group>
            <label for="name">ユーザー名</label>
            <b-form-input
              id="name"
              v-model="user.name"
              type="text"
              required
              class="mb-3"
            ></b-form-input>
            <label for="email">メールアドレス</label>
            <b-form-input
              id="email"
              v-model="user.email"
              type="email"
              required
              class="mb-3"
            >
            </b-form-input>
            <label for="password">パスワード</label>
            <b-form-input
              id="password"
              v-model="user.password"
              type="password"
              required
              class="mb-3"
            ></b-form-input>
            <label for="password_confimation">確認用パスワード</label>
            <b-form-input
              id="password_confimation"
              v-model="user.password_confimation"
              type="password"
              required
              class="mb-3"
            ></b-form-input>
          </b-form-group>
          <div class="text-center mb-5">
            <b-button variant="primary" style="" @click="signup()"
              >登録</b-button
            >
          </div>
          <div class="text-center mb-5">
            <b-button variant="link" style="color:#707070;" to="login"
              >ログイン画面に戻る / Twitterでログイン</b-button
            >
          </div>
        </b-form>
      </div>
    </b-container>
  </b-container>
</template>

<script>
import firebase from '@/plugins/firebase'
export default {
  layout: 'prelogin',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        password_confimation: ''
      },
      message: ''
    }
  },
  methods: {
    signup() {
      if (
        this.user.name !== '' &&
        this.user.email !== '' &&
        this.user.password !== ''
      ) {
        if (this.user.password === this.user.password_confimation) {
          firebase
            .auth()
            .createUserWithEmailAndPassword(this.user.email, this.user.password)
            .then(() => {
              firebase.auth().currentUser.updateProfile({
                displayName: this.user.name
              })
              this.$router.push('/')
            })
            .catch((error) => {
              this.message =
                'エラーが発生してユーザーが登録できませんでした\n' +
                error.code +
                ' ' +
                error.message
            })
        } else {
          this.message = 'パスワードと確認用パスワードが一致しません'
        }
      } else {
        this.message = '必要な項目を入力してください'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
</style>
