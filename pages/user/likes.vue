<template>
  <div>
    <b-container class="mb-5" style="max-width: 640px;">
      <div class="my-5">
        <div>いいねした記事 {{ contents.length }}件</div>
      </div>
      <div v-if="contents.length != 0">
        <div v-for="(content, index) in contents" :key="index">
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
                        :src="content.user_img"
                        variant="light"
                      />
                      <div class="content-footer-text">
                        <div>{{ content.user_name }}</div>
                        <div>
                          {{ $timestampToDate(content.published_at) }}
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
                  v-show="content.top_img"
                  class="ml-auto right-img"
                  :src="content.top_img"
                  right
                />
              </b-card-body>
            </b-card>
          </b-link>
        </div>
      </div>
      <div v-else>
        読み込み中
      </div>
    </b-container>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'

export default {
  layout: 'user',
  data () {
    return {
      contents: [],
      likes: []
    }
  },
  created () {
    if (process.client) {
    }
  },
  mounted () {
    this.$store.dispatch('user/authRedirect')
    this.getLikes()
  },
  methods: {
    // いいね記事10件取得
    async getLikes () {
      const querySnapshot = await firebase
        .firestore()
        .collection('likes')
        .where('user_id', '==', this.$store.state.user.id)
        .orderBy('created_at', 'desc')
        .limit(10)
        .get()

      querySnapshot.forEach(async (doc) => {
        await firebase
          .firestore()
          .collection('posts')
          .doc(doc.data().post_id)
          .get()
          .then((postDoc) => {
            const data = postDoc.data()
            data.id = postDoc.id
            this.contents.push(data)
          })
      })
    }
  }
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
