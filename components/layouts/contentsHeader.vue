<template>
  <div>
    <b-container class="mx-auto">
      <b-nav tabs fill class="top-nav">
        <b-nav-item href="#">
          ホーム
        </b-nav-item>
        <b-nav-item href="#">
          新着
        </b-nav-item>
        <!-- <b-nav-item href="#">カテゴリ</b-nav-item> -->
        <!-- <b-nav-item href="#">タグ</b-nav-item> -->
      </b-nav>
      <div class="divider" />
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
  margin-right: auto;
  a {
    color: #474747;
    &:hover {
      color: #000000;
    }
  }
}
.divider {
  border-bottom: thin solid #707070;
}
</style>
