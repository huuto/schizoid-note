<template>
  <b-container class="my-3">
    <b-container class="bg-white p-3" style="max-width:640px">
      <div style="max-width:400px" class="m-auto">
        <div class="text-center" style="margin:7vh 0 5vh 0">
          <h2>アカウント設定</h2>
        </div>
        <b-form @submit.prevent="edit()">
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
            <label for="password">新しいパスワード</label>
            <b-form-input
              id="password"
              v-model="user.password"
              type="password"
              class="mb-3"
            ></b-form-input>
            <label for="password_confimation">確認用パスワード</label>
            <b-form-input
              id="password_confimation"
              v-model="user.password_confimation"
              type="password"
              class="mb-3"
            ></b-form-input>
            <label for="profile">紹介文</label>
            <b-form-textarea
              id="profile"
              v-model="user.profile"
              rows="4"
              class="mb-3"
            ></b-form-textarea>
          </b-form-group>
          <div class="text-center mb-3">
            <b-button variant="primary" style="" @click="edit()">変更</b-button>
          </div>
          <div class="text-center mb-5">
            <b-button variant="link" style="color:#FF6565;" to=""
              >アカウント削除</b-button
            >
          </div>
          <div class="text-center mb-5">
            <b-button variant="link" style="color:#707070;" to="posts"
              >戻る</b-button
            >
          </div>
        </b-form>
      </div>
    </b-container>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        email: 'huuto@com',
        password: '',
        password_confimation: '',
        profile: ''
      }
    }
  },
  methods: {
    edit() {}
  }
}
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
</style>
