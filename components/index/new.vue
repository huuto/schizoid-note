<template>
  <div>
    <div class="head mb-3">
      <h2>新着</h2>
    </div>
    <div v-if="contents.size != 0">
      <b-card
        v-for="(content, index) in contents"
        :key="index"
        :title="content.title"
        :img-src="firstContent(index)"
        img-height="250"
        style="max-width:40rem;"
        class="mb-3"
      >
        <b-card-body>
          <b-card-text>
            {{ content.introduction }}
          </b-card-text>
          <div class="d-flex content-footer">
            <b-avatar size="2rem" class="mr-3 my-auto"></b-avatar>
            <div class="content-footer-text">
              <div>
                {{ content.user_name }}
              </div>
              <div>{{ content.updated_at }}</div>
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
          updated_at: '2020/04/01'
        },
        {
          title: 'タイトルです2',
          introduction: 'コンテンツの冒頭です2',
          img_src: 'bbb',
          user_name: 'huuto',
          user_img: '',
          updated_at: '2020/04/02'
        }
      ]
    }
  },
  methods: {
    firstContent(index) {
      if (index === 0) {
        return this.contents[0].img_src
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.2rem;
}
.content-footer {
  &-text {
    font-size: 0.8rem;
  }
}
</style>
