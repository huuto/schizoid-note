<template>
  <div class="mx-auto" style="max-width: 590px;">
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
                <b-card-title :title="content.title"> </b-card-title>
                <div>
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
                </div>
              </div>
              <b-card-img
                v-show="index !== 0"
                class="ml-auto right-img"
                :src="content.top_img"
                right
              ></b-card-img>
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
