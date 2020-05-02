<template>
  <div class="mx-auto" style="max-width: 640px;">
    <div class="head mb-3">
      <h2>新着</h2>
    </div>
    <div v-if="contents.length != 0">
      <div v-for="(content, index) in contents" :key="index">
        <b-link :to="`/contents/${content.id}`">
          <b-card
            class="content-card mb-3"
            :title="content.title"
            :img-src="firstContent(index)"
            style="max-width: 40rem;"
          >
            <b-card-body>
              <b-card-text>
                {{ content.introduction }}
              </b-card-text>
              <div class="d-flex content-footer">
                <b-avatar
                  size="2rem"
                  class="mr-3 my-auto"
                  :src="content.user_img"
                  variant="light"
                ></b-avatar>
                <div class="content-footer-text">
                  <div>{{ content.user_name }}</div>
                  <div>
                    {{ $timestampToDate(content.published_at) }}
                  </div>
                </div>
              </div>
              <!-- <b-button
                :id="content.id"
                :to="`/contents/${content.id}`"
                style="display:none"
              ></b-button> -->
            </b-card-body>
          </b-card>
        </b-link>
      </div>
      <infinite-loading
        v-if="contents.length >= 10 && loading"
        @infinite="infiniteHandler()"
      ></infinite-loading>
      <div v-show="!loading" class="my-5 ml-3">これ以上記事はありません。</div>
    </div>
    <div v-else>
      読み込み中
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import firebase from '~/plugins/firebase'
export default {
  components: {
    InfiniteLoading,
  },
  data() {
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
    firstContent(index) {
      if (index === 0) {
        return this.contents[0].top_img
      }
      return ''
    },
    // 新着10件取得
    async setContents() {
      console.log('get first contents')
      await firebase
        .firestore()
        .collection('posts')
        .where('public', '==', true)
        .orderBy('published_at', 'desc')
        .limit(10)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const content = doc.data()
            content.id = doc.id
            this.contents.push(content)
          })
        })
    },
    async infiniteHandler() {
      console.log('add contents')
      await firebase
        .firestore()
        .collection('posts')
        .where('public', '==', true)
        .where(
          'published_at',
          '<=',
          this.contents[this.contents.length - 1].published_at
        )
        .orderBy('published_at', 'desc')
        .limit(10)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const content = doc.data()
            content.id = doc.id
            this.contents.push(content)
          })
          if (querySnapshot.size < 10) {
            // 無限ローディング終了
            this.loading = false
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.2rem;
}
img {
  object-fit: cover;
  max-height: 20rem;
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
