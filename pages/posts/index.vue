<template>
  <div>
    <b-container class="mb-5" style="max-width:640px">
      <div class="my-5">
        <div>投稿記事 {{ contents.length }}件</div>
      </div>
      <div v-if="contents.length != 0" class="mx-auto" style="max-width:540px">
        <div v-for="(content, index) in contents" :key="index">
          <!-- <b-link :to="'/posts/edit/' + content.id"> -->
          <b-card style="max-width:40rem;" class="mb-3 mx-auto content-card">
            <b-card-body class="d-flex pb-2">
              <div class="">
                <div class="mb-2">{{ content.updated_at }}</div>
                <b-card-title :title="content.title"> </b-card-title>
                <!-- <b-card-text>
                {{ content.introduction }}
              </b-card-text> -->
              </div>
              <b-card-img
                v-show="content.top_img"
                class="ml-auto"
                :src="content.top_img"
                right
                height="100px"
                width="100px"
              ></b-card-img>
            </b-card-body>
            <div class="text-center">
              <b-button
                :id="content.id"
                variant="link"
                :to="'/posts/edit/' + content.id"
                block
                >編集</b-button
              >
            </div>
          </b-card>
          <!-- </b-link> -->
        </div>
      </div>
      <div v-else>
        {{ loadMsg }}
      </div>
    </b-container>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  // middleware: 'authRedirect',
  layout: 'user',
  data() {
    return {
      contents: [],
      message: '',
      loadMsg: '読み込み中'
    }
  },
  created() {
    if (process.client) {
      this.getContents()
    }
  },
  mounted() {
    this.$store.dispatch('authRedirect')
  },
  methods: {
    async getContents() {
      await firebase
        .firestore()
        .collection('posts')
        .where('user_id', '==', this.$store.state.user.id)
        .orderBy('created_at', 'desc')
        .limit(10)
        .get()
        .then((docs) => {
          this.contents = []
          docs.forEach((doc) => {
            const data = doc.data()
            data.id = doc.id
            data.updated_at = this.$timestampToDate(data.updated_at)
            this.contents.push(data)
          })
          if (this.contents.length === 0)
            this.loadMsg = '投稿した記事はありません。'
        })
        .catch(() => {
          this.message = '投稿記事が取得できませんでした。'
        })
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  object-fit: cover;
}

h4 {
  font-size: 1.2rem;
}

// a {
//   text-decoration: none;
//   color: #474747;
// }

// .content-card {
//   transition: background-color 0.3s;
//   &:hover {
//     background-color: rgb(243, 243, 243);
//   }
// }
</style>
