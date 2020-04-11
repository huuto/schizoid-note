<template>
  <div>
    <b-container class="mb-5" style="max-width:640px">
      <div class="my-5">
        <div>投稿記事 {{ contents.length }}件</div>
      </div>
      <div v-if="contents.length != 0">
        <b-card
          v-for="(content, index) in contents"
          :key="index"
          style="max-width:40rem;"
          class="mb-3 mx-auto"
        >
          <b-card-body class="d-flex pb-2">
            <div class="">
              <div class="mb-2">{{ content.updated_at }}</div>
              <b-card-title :title="content.title"> </b-card-title>
              <b-card-text>
                {{ content.introduction }}
              </b-card-text>
            </div>
            <b-card-img
              class="ml-auto"
              :src="content.img_src"
              right
              height="100px"
            ></b-card-img>
          </b-card-body>
          <div class="text-center">
            <b-button variant="link" to="" block>編集</b-button>
          </div>
        </b-card>
      </div>
      <div v-else>
        投稿した記事はありません。
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      contents: [
        {
          title: 'タイトルですああああああああああああああああああああ',
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
  }
}
</script>

<style lang="scss" scoped></style>
