<template>
  <header>
    <b-navbar style="height: 64px;" class="shadow-sm p-2 mb-1 bg-white rounded">
      <b-container>
        <b-navbar-brand to="/">
          <!-- <i class="fas fa-sticky-note" style="color: #3C6191;"></i -->
          <b-img src="~/static/logo.png" height="36px"></b-img
        ></b-navbar-brand>
        <b-navbar-nav class="ml-auto">
          <b-btn variant="outline-primary" class="px-5 my-3 mr-3" to="/edit"
            >投稿</b-btn
          >
          <b-nav-item-dropdown no-caret class="py-auto">
            <template v-slot:button-content>
              <b-avatar class="mt-2"></b-avatar>
            </template>
            <b-dd-header>huuto</b-dd-header>
            <b-dd-item to="/edit">投稿する</b-dd-item>
            <b-dd-item>投稿記事</b-dd-item>
            <b-dd-divider></b-dd-divider>
            <b-dd-item>いいね</b-dd-item>
            <b-dd-item>フォロー</b-dd-item>
            <b-dd-divider></b-dd-divider>
            <b-dd-item>アカウント設定</b-dd-item>
            <b-dd-divider></b-dd-divider>
            <b-dd-item>ログアウト</b-dd-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
  </header>
</template>

<script>
export default {}
</script>

<style></style>
