<template>
  <div class="mx-auto" style="max-width: 590px">
    <div class="head mb-3">
      <h2>新着</h2>
    </div>
    <div v-if="contents.length != 0">
      <div v-for="(content, index) in contents" :key="index">
        <b-link :to="`/contents/${content.id}`">
          <b-card
            class="content-card mb-3 mx-auto"
            :img-src="firstContent(index)"
          >
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
                <div class="mt-1" style="color: #e0245e">
                  <i class="far fa-heart" />
                  {{ content.likes || 0 }}
                </div>
              </div>
              <b-card-img
                v-show="index !== 0 && content.topImg"
                class="ml-auto right-img"
                :src="content.topImg"
                right
              />
            </b-card-body>
          </b-card>
        </b-link>
      </div>
      <client-only>
        <infinite-loading
          v-if="contents.length >= 10 && loading"
          @infinite="infiniteHandler"
        />
      </client-only>
      <div v-show="!loading" class="my-5 ml-3">これ以上記事はありません。</div>
    </div>
    <div v-else>読み込み中</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
import firebase from '~/plugins/firebase'

export type ContentType = {
  id: string
  title: string
  topImg: string
  userName: string
  userImg: string
  likes: number
  publishedAt: firebase.firestore.Timestamp
}

export type DataType = {
  contents: ContentType[]
  loading: boolean
}

export default Vue.extend({
  components: {
    InfiniteLoading,
  },
  data(): DataType {
    return {
      contents: [],
      loading: true,
    }
  },
  created() {
    if (process.client) {
      this.setContents()
    }
  },
  mounted() {},
  methods: {
    firstContent(index: number): string {
      if (index === 0) {
        return this.contents[0].topImg
      }
      return ''
    },
    // 新着10件取得
    async setContents() {
      console.log('get first contents')
      const querySnapshot = await firebase
        .firestore()
        .collection('posts')
        .where('public', '==', true)
        .orderBy('published_at', 'desc')
        .limit(10)
        .get()
      querySnapshot.forEach((doc) => {
        const content: ContentType = {
          id: doc.id,
          title: doc.data().title,
          topImg: doc.data().top_img,
          userName: doc.data().user_name,
          userImg: doc.data().user_img,
          likes: doc.data().likes,
          publishedAt: doc.data().published_at,
        }
        this.contents.push(content)
      })
    },
    async infiniteHandler($state: any) {
      console.log('add contents')
      try {
        const querySnapshot = await firebase
          .firestore()
          .collection('posts')
          .where('public', '==', true)
          .where(
            'published_at',
            '<',
            this.contents[this.contents.length - 1].publishedAt
          )
          .orderBy('published_at', 'desc')
          .limit(10)
          .get()
        querySnapshot.forEach((doc) => {
          const content: ContentType = {
            id: doc.id,
            title: doc.data().title,
            topImg: doc.data().top_img,
            userName: doc.data().user_name,
            userImg: doc.data().user_img,
            likes: doc.data().likes,
            publishedAt: doc.data().published_at,
          }
          this.contents.push(content)
        })
        if (querySnapshot.size < 10) {
          // 無限ローディング終了
          this.loading = false
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (error) {
        console.error(error)
      }
    },
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
