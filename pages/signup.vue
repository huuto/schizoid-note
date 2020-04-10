<template>
  <b-container class="my-5">
    <b-container class="bg-white p-5" style="max-width:640px">
      <div style="max-width:400px" class="m-auto">
        <div class="text-center" style="margin:7vh 0 10vh 0">
          <h2>新規登録</h2>
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
            <b-button variant="primary" style="" @click="login()"
              >登録</b-button
            >
          </div>
          <div class="text-center mb-5">
            <b-button variant="link" style="color:#707070;" to="login"
              >ログイン画面に戻る</b-button
            >
          </div>
        </b-form>
      </div>
    </b-container>
  </b-container>
</template>

<script>
export default {
  layout: 'prelogin',
  data() {
    return {
      user: {
        name: '',
        email: 'huuto@com',
        password: '',
        password_confimation: ''
      }
    }
  },
  methods: {
    signup() {}
  }
}
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
</style>
