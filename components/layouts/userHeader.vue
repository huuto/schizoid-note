<template>
  <div>
    <b-container style="max-width:640px" class="mx-auto">
      <b-nav tabs fill class="top-nav">
        <b-nav-item class="nav-item" to="/posts/edit/new">投稿</b-nav-item>
        <b-nav-item class="nav-item" to="/posts">投稿記事</b-nav-item>
        <b-nav-item class="nav-item" to="/user/setting">アカウント</b-nav-item>
        <!-- <b-nav-item href="#">タグ</b-nav-item> -->
      </b-nav>
      <div class="divider"></div>
      <!-- <b-nav pills fill small class="top-nav">
        <b-nav-item href="#">コラム</b-nav-item>
        <b-nav-item href="#">エッセイ</b-nav-item>
        <b-nav-item href="#">ライフスタイル</b-nav-item>
        <b-nav-item href="#">漫画</b-nav-item>
        <b-nav-item href="#">仕事</b-nav-item>
      </b-nav> -->
    </b-container>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.top-nav {
  max-width: 640px;
  margin-right: auto;
  a {
    color: #474747;
    &:hover {
      color: #000000;
    }
  }
  .nav-item {
    text-align: center;
  }
}
.divider {
  border-bottom: thin solid #707070;
}
</style>
