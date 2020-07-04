<template>
  <div>
    <b-container class="mb-5" style="max-width: 640px;">
      <div class="my-5">
        <div>
          投稿記事 {{ contents.length }} 件中
          {{
            $route.query.page
              ? ` ${($route.query.page - 1) * 10 + 1} - ${Math.min(
                  $route.query.page * 10,
                  contents.length
                )}`
              : ` 1 - ${contents.length}`
          }}
        </div>
      </div>
      <div
        v-if="contents.length != 0"
        class="mx-auto"
        style="max-width: 540px;"
      >
        <div v-for="(content, index) in dispContents()" :key="index">
          <b-link :to="`/posts/edit/${content.id}`">
            <b-card style="max-width: 640px;" class="mb-3 content-card">
              <b-card-body class="d-flex pb-2">
                <div class="">
                  <div class="mb-1">
                    {{ setStatus(content.status) }}
                  </div>
                  <div class="mb-2">
                    {{ $timestampToDate(content.updatedAt) }}
                  </div>
                  <b-card-title :title="content.title" />
                  <!-- <b-card-text>
                {{ content.introduction }}
              </b-card-text> -->
                  <div
                    v-show="
                      ['public', 'anonym', 'private'].includes(content.status)
                    "
                    class="mt-1 like"
                  >
                    <i class="far fa-heart" />
                    {{ content.likes || 0 }}
                  </div>
                </div>
                <b-card-img
                  v-show="content.topImg"
                  class="ml-auto"
                  :src="content.topImg"
                  right
                  height="100px"
                  width="100px"
                />
              </b-card-body>
              <div class="text-center">
                <b-button
                  :id="content.id"
                  variant="link"
                  :to="'/posts/edit/' + content.id"
                  block
                >
                  編集
                </b-button>
              </div>
            </b-card>
          </b-link>
        </div>
        <div>
          <b-pagination-nav
            :link-gen="linkGen"
            :number-of-pages="
              contents.length >= 10 ? contents.length / 10 + 1 : 1
            "
            align="center"
          />
        </div>
      </div>
      <div v-else>
        {{ loadMsg }}
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from '~/plugins/firebase'

type ContentType = {
  id: string
  title: string
  topImg: string
  status: 'draft' | 'public' | 'anonym' | 'private'
  likes: number
  updatedAt: firebase.firestore.Timestamp
}

type StatusType = {
  value: string
  text: string
}

type DataType = {
  contents: ContentType[]
  message: string
  loadMsg: string
}

export default Vue.extend({
  // middleware: 'authRedirect',
  layout: 'user',
  data(): DataType {
    return {
      contents: [],
      message: '',
      loadMsg: '読み込み中',
    }
  },
  created() {
    if (process.client) {
    }
  },
  async mounted() {
    const ook = await this.$store.dispatch('user/authRedirect')
    console.log(ook)
    this.getContents()
  },
  methods: {
    async getContents() {
      // 全記事を取得
      // もし100件とかで表示が重くなってきたら対策考える
      await firebase
        .firestore()
        .collection('posts')
        .where('user_id', '==', this.$store.state.user.id)
        .orderBy('created_at', 'desc')
        .get()
        .then((docs) => {
          this.contents = []
          docs.forEach((doc) => {
            const content: ContentType = {
              id: doc.id,
              title: doc.data().title,
              topImg: doc.data().top_img,
              status: doc.data().status,
              likes: doc.data().likes,
              updatedAt: doc.data().updated_at,
            }
            this.contents.push(content)
          })
          if (this.contents.length === 0) {
            this.loadMsg = '投稿した記事はありません。'
          }
        })
        .catch(() => {
          this.message = '投稿記事が取得できませんでした。'
        })
    },
    setStatus(status: string): string | undefined {
      if (status) {
        return [
          { value: 'draft', text: '下書き' },
          { value: 'public', text: '公開' },
          { value: 'anonym', text: '匿名公開' },
          { value: 'private', text: '非公開' },
        ].find((el) => el.value === status)?.text
      }
    },
    /**
     * ページャーでクエリ変更
     */
    linkGen(pageNum: number) {
      return {
        path: '/posts',
        query: { page: pageNum },
      }
    },
    /**
     * 表示する記事
     */
    dispContents(): Array<ContentType> {
      if (this.$route.query.page) {
        return this.contents.slice(
          (this.$route.query.page - 1) * 10,
          this.$route.query.page * 10
        )
      }
      return this.contents.slice(0, 10)
    },
  },
  head() {
    return {
      title: '投稿一覧',
    }
  },
})
</script>

<style lang="scss" scoped>
img {
  object-fit: cover;
}

h4 {
  font-size: 1.2rem;
}

label {
  cursor: pointer;
  display: inline;
  .card {
    &:hover {
      background-color: rgb(245, 245, 245);
    }
  }
}

a {
  color: #474747;
  &:hover {
    text-decoration: none;
  }
}

.content-card {
  &:hover {
    background-color: rgb(245, 245, 245);
  }
}

.like {
  color: $like-color;
}

// .content-card {
//   transition: background-color 0.3s;
//   &:hover {
//     background-color: rgb(243, 243, 243);
//   }
// }
</style>
