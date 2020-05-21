<template>
  <header>
    <b-navbar style="height: 64px;" class="shadow-sm p-2 mb-1 bg-white rounded">
      <b-container>
        <b-navbar-brand to="/">
          <!-- <i class="fas fa-sticky-note" style="color: #3C6191;"></i -->
          <b-img src="~/static/logo.png" height="36px" />
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto">
          <div v-if="$store.state.user.isLogin" class="d-flex">
            <div>
              <b-btn
                variant="outline-primary my-3"
                class="px-4 mr-3"
                to="/posts/edit/new"
                size="sm"
              >
                投稿
              </b-btn>
            </div>
            <b-nav-item-dropdown
              no-caret
              right
              class="d-flex"
              style="align-items: center;"
            >
              <template v-slot:button-content>
                <b-avatar
                  class=""
                  :src="user.photoURL"
                  variant="light"
                />
                <!-- <b-avatar
                  class=""
                  src="~/static/img/schizoid-chan.png"
                ></b-avatar> -->
              </template>
              <b-dd-header>{{ user.name }}</b-dd-header>
              <b-dd-item to="/posts/edit/new">
                投稿する
              </b-dd-item>
              <b-dd-item to="/posts">
                投稿記事
              </b-dd-item>
              <b-dd-divider />
              <b-dd-item to="/user/likes">
                いいね
              </b-dd-item>
              <!-- <b-dd-item>フォロー</b-dd-item> -->
              <!-- <b-dd-divider></b-dd-divider> -->
              <b-dd-item to="/user/setting">
                アカウント
              </b-dd-item>
              <b-dd-divider />
              <b-dd-item @click="logout()">
                ログアウト
              </b-dd-item>
            </b-nav-item-dropdown>
          </div>
          <div v-else class="d-flex prelogin">
            <div>
              <b-btn
                variant="outline-secondary"
                size="sm"
                class=""
                to="/login"
              >
                ログイン
              </b-btn>
            </div>
            <div>
              <b-btn
                variant="outline-primary"
                class=""
                to="/signup"
                size="sm"
              >
                新規登録
              </b-btn>
            </div>
          </div>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
  </header>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    logout () {
      this.$store.commit('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.prelogin .btn {
  padding: 4px 16px;
  margin: 16px 16px 16px 0px;
}
@media screen and (max-width: 480px) {
  .prelogin .btn {
    padding: 4px;
    margin: 16px 4px 16px 0px;
  }
}
</style>
