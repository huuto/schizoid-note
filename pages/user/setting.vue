<template>
  <b-container class="my-3">
    <b-container class="bg-white p-3" style="max-width:640px">
      <div style="max-width:400px" class="m-auto">
        <div>
          <b-alert
            id="msg-popup"
            dismissible
            :variant="msg_popup.variant"
            :show="msg_popup.message"
          >
            {{ msg_popup.message }}</b-alert
          >
        </div>
        <div class="text-center" style="margin:3vh 0 5vh 0">
          <h2>アカウント設定</h2>
        </div>
        <b-form>
          <b-form-group>
            <div class="text-center my-3" style="position:relative">
              <label for="photoURL" style="cursor:pointer">
                <b-avatar :src="user.photoURL" size="5rem"></b-avatar>
                <i id="avatar" class="fas fa-plus-circle fa-lg photoURL"></i>
                <b-form-file
                  id="photoURL"
                  v-model="photoURL"
                  style="display:none"
                  @change="editPhotoURL()"
                ></b-form-file>
              </label>
            </div>
            <label for="email">メールアドレス</label>
            <div class="mb-4 d-flex ml-2">
              <div>
                {{ user.email }}
              </div>
              <b-link class="ml-auto email"
                ><i class="fas fa-edit fa-lg"></i
              ></b-link>
            </div>
            <label for="password">パスワード</label>
            <div class="mb-4 d-flex ml-2">
              <div>
                **********
              </div>
              <b-link class="ml-auto password"
                ><i class="fas fa-edit fa-lg"></i
              ></b-link>
            </div>
            <!-- 
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
            ></b-form-input> -->
            <label for="name">ユーザー名</label>
            <b-form-input
              id="name"
              v-model="user.name"
              type="text"
              required
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
          <div class="text-center">
            <b-button
              variant="link"
              style="color:#707070;"
              to="posts"
              class="mb-5"
              >戻る</b-button
            >
          </div>
          <div class="text-center">
            <b-button variant="link" style="color:#FF6565;" to=""
              >アカウント削除</b-button
            >
          </div>
        </b-form>
      </div>
    </b-container>
  </b-container>
</template>

<script>
export default {
  layout: 'user',
  // middleware: 'authRedirect',
  data() {
    return {
      user: {
        photoURL: '',
        name: '',
        profile: ''
      },
      password: '',
      password_confimation: '',
      email: '',
      msg_popup: { variant: 'danger', message: null }
    }
  },
  created() {
    this.user = this.$store.state.user
  },
  mounted() {
    this.$store.dispatch('authRedirect')
  },
  methods: {
    edit() {},
    editEmail() {},
    editPassword() {},
    editPhotoURL() {}
  }
}
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
a.email,
.password,
.photoURL {
  color: #474747;
  &:hover {
    color: #747474;
  }
}
#avatar {
  position: absolute;
  right: 9rem;
  top: -0.5rem;
}
</style>
