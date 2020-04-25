<template>
  <div>
    <div class="head mb-3">
      <h2>人気</h2>
    </div>
    <div v-if="contents.size != 0">
      <b-card
        v-for="(content, index) in contents"
        :key="index"
        :title="content.title"
        :img-src="content.img_src"
        img-height="100"
        style="max-width:18rem;"
        class="mb-2"
      >
        <b-card-body class="p-2">
          <b-card-text>
            {{ content.introduction }}
          </b-card-text>
          <div class="d-flex content-footer">
            <b-avatar size="1.5rem" class="mr-2 my-auto"></b-avatar>
            <div class="content-footer-text">
              <div>
                {{ content.user_name }}
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </div>
    <div v-else>
      投稿が読み込めません。
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contents: [
        {
          title: 'タイトルです',
          introduction: 'コンテンツの冒頭です',
          img_src: '/img/cat-2083492_640.jpg',
          user_name: 'huuto',
          user_img: '',
          updateAt: '2020/04/01'
        },
        {
          title: 'タイトルです2',
          introduction: 'コンテンツの冒頭です2',
          img_src: '',
          user_name: 'huuto',
          user_img: '',
          updateAt: '2020/04/02'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.2rem;
}
img {
  object-fit: cover;
}
</style>
