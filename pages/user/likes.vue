<template>
  <div>
    <b-container class="mb-5" style="max-width: 640px;">
      <div class="my-5">
        <div>いいねした記事 {{ contents.length }}件中 {{ dispRange() }}</div>
      </div>
      <div v-if="contents.length != 0">
        <div v-for="(content, index) in dispContents()" :key="index">
          <b-link :to="`/contents/${content.id}`">
            <b-card class="content-card mb-3 mx-auto">
              <b-card-body class="d-flex">
                <div>
                  <b-card-title :title="content.title" />
                  <div>
                    <div class="d-flex content-footer">
                      <b-avatar
                        size="2rem"
                        class="mr-3 my-auto"
                        :src="content.userImg"
                        variant="light"
                      />
                      <div class="content-footer-text">
                        <div>{{ content.userName }}</div>
                        <div>
                          {{ $timestampToDate(content.publishedAt) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-1" style="color: #e0245e;">
                    <i class="far fa-heart" />
                    {{ content.likes || 0 }}
                  </div>
                </div>
                <b-card-img
                  v-show="content.topImg"
                  class="ml-auto right-img"
                  :src="content.topImg"
                  right
                />
              </b-card-body>
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
/* eslint-disable camelcase */
import Vue from 'vue'
import firebase from '~/plugins/firebase'

type ContentType = {
  id: string
  title: string
  topImg: string
  likes: number
  publishedAt: firebase.firestore.Timestamp
  userName: string
  userImg: string
}

type DataType = {
  contents: ContentType[]
  likes: string[]
  loadMsg: string
}

export default Vue.extend({
  layout: 'user',
  data(): DataType {
    return {
      contents: [],
      likes: [],
      loadMsg: '読み込み中',
    }
  },
  created() {
    if (process.client) {
    }
  },
  mounted() {
    this.$store.dispatch('user/authRedirect')
    this.getLikes()
  },
  methods: {
    // いいね記事全件取得
    async getLikes() {
      try {
        const querySnapshot = await firebase
          .firestore()
          .collection('likes')
          .where('user_id', '==', this.$store.state.user.id)
          .orderBy('created_at', 'desc')
          .get()

        querySnapshot.forEach(async (doc) => {
          await firebase
            .firestore()
            .collection('posts')
            .doc(doc.data().post_id)
            .get()
            .then((postDoc) => {
              // 公開されていれば
              if (postDoc.data()?.public) {
                const content: ContentType = {
                  id: postDoc.id,
                  title: postDoc.data()?.title,
                  topImg: postDoc.data()?.top_img,
                  likes: postDoc.data()?.likes,
                  publishedAt: postDoc.data()?.published_at,
                  userName: postDoc.data()?.user_name,
                  userImg: postDoc.data()?.user_img,
                }
                this.contents.push(content)
              }
            })
        })
        if (this.contents.length === 0) {
          this.loadMsg = 'いいねした記事はありません。'
        }
      } catch (e) {
        this.loadMsg = '記事が取得できませんでした。'
      }
    },
    /**
     * ページャーでクエリ変更
     */
    linkGen(pageNum: number) {
      return {
        path: '/user/likes',
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
    dispRange(): string {
      if (this.$route.query.page) {
        return `${(this.$route.query.page - 1) * 10 + 1} - ${Math.min(
          this.$route.query.page * 10,
          this.contents.length
        )}`
      } else {
        return `1 - ${this.contents.length <= 10 ? this.contents.length : 10}`
      }
    },
  },
  head() {
    return {
      title: 'いいねした記事',
    }
  },
})
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.2rem;
}
h4 {
  font-size: 1.2rem;
  font-weight: 700;
}
img {
  object-fit: cover;
  max-height: 20rem;
}
.card {
  width: 90vw;
  max-width: 550px;
  img {
    height: 50vw;
    max-height: 280px;
  }
  img.right-img {
    height: 17vw;
    width: 17vw;
    max-width: 80px;
    max-height: 80px;
  }
  .card-body {
    padding: 1rem;
    &.d-flex {
      padding: 0.75rem;
    }
  }
  @media screen and (max-width: 480px) {
    h4 {
      font-size: 1rem;
      font-weight: 700;
    }
    .card-body {
      padding: 0.5rem;
      &.d-flex {
        padding: 0.5rem;
      }
    }
  }
}
.content-footer {
  &-text {
    font-size: 0.8rem;
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
</style>
