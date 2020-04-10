<template>
  <b-container class="my-5">
    <b-container class="bg-white p-5" style="max-width:640px">
      <div style="max-width:400px" class="m-auto">
        <div class="text-center" style="margin:7vh 0 10vh 0">
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
          </b-form-group>
          <div class="text-center mb-3">
            <b-button variant="primary" style="" @click="login()"
              >ログイン</b-button
            >
          </div>
          <div class="text-center mb-5">
            <b-button
              style="background-color:#1DA1F2; border-color:#1DA1F2;"
              @click="twitterLogin()"
              ><i class="fab fa-twitter mr-2" color="white"></i
              >Twitterログイン</b-button
            >
          </div>
          <div class="text-center mb-5">
            <b-button variant="link" style="color:#707070;" to="signup"
              >アカウント作成</b-button
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
        email: 'huuto@com',
        password: ''
      }
    }
  },
  methods: {
    login() {},
    twitterLogin() {}
  }
}
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
</style>
