<template>
  <div>
    <b-container style="max-width: 620px;" class="pt-5">
      <div v-show="content.top_img" class="mb-5 text-center">
        <b-img class="top-img" :src="content.top_img"></b-img>
      </div>
      <div class="mb-3">
        <h2>{{ content.title }}</h2>
      </div>
      <div class="d-flex mb-5">
        <b-avatar
          size="2rem"
          class="mr-3 my-auto"
          :src="content.user_img"
          variant="light"
        ></b-avatar>
        <div class="">
          <div>
            {{ content.user_name }}
          </div>
          <div>{{ $timestampToDate(content.published_at) }}</div>
        </div>
      </div>
      <div id="body" class="mb-5" v-html="$sanitize(content.body)"></div>
      <div class="mt-4 mb-3">
        <span v-if="isLiked" id="liked" class="p-2" @click="likes()">
          <i class="fas fa-heart fa-lg"></i>
          {{ content.likes || 0 }}
        </span>
        <span v-else id="like" class="p-2" @click="likes()">
          <i class="far fa-heart fa-lg"></i>
          {{ content.likes || 0 }}
        </span>
      </div>
      <b-tooltip
        :disabled="$store.state.user.isLogin"
        triggers="click"
        target="like"
        variant="info"
        >ログインするといいねできます</b-tooltip
      >
      <div class="divider mb-5"></div>
      <div class="author d-flex mb-5">
        <div>
          <b-avatar
            size="3rem"
            class="mr-3 my-auto"
            :src="content.user_img"
            variant="light"
          ></b-avatar>
        </div>
        <div>
          <div>{{ content.user_name }}</div>
          <div>{{ content.profile }}</div>
        </div>
      </div>
      <b-list-group class="mb-5">
        <b-list-group-item
          v-for="(authpost, index) in authorPosts"
          :key="index"
          to="#"
          class=""
        >
          {{ authpost.title }}
        </b-list-group-item>
      </b-list-group>
      <div class="divider mb-5"></div>
    </b-container>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
import Meta from '~/assets/mixins/meta'
export default {
  mixins: [Meta],
  async asyncData({ store, route, redirect }) {
    let content = null
    await firebase
      .firestore()
      .collection('posts')
      .doc(route.params.id)
      .get()
      .then((doc) => {
        if (!doc.data().public) redirect('/')
        content = doc.data()
      })
      .catch((error) => {
        console.error(error)
        redirect('/')
      })
    return {
      content,
      meta: {
        title:
          content.title.length <= 30
            ? content.title
            : content.title.substr(0, 30),
        type: 'article',
        url: `https://schizoid-note.com/contents/${route.params.id}`,
        image: content.top_img,
      },
    }
  },
  data() {
    return {
      content: {
        likes: 0,
      },
      authorPosts: [],
      isLiked: false,
    }
  },
  computed: {
    userId: {
      get() {
        return this.$store.state.user.id
      },
    },
  },
  watch: {
    userId(val) {
      this.chkLiked(val)
    },
  },
  created() {},
  mounted() {
    this.chkLiked(this.userId)
  },
  methods: {
    chkLiked(userId) {
      firebase
        .firestore()
        .collection('likes')
        .where('post_id', '==', this.$route.params.id)
        .where('user_id', '==', userId)
        .get()
        .then((docs) => {
          if (docs.size === 1) this.isLiked = true
        })
    },
    /**
     * いいねボタン押下
     */
    async likes() {
      if (!this.$store.state.user.isLogin) return
      // いいねを解除
      if (this.isLiked) {
        const docs = await firebase
          .firestore()
          .collection('likes')
          .where('post_id', '==', this.$route.params.id)
          .where('user_id', '==', this.$store.state.user.id)
          .get()
        docs.forEach((doc) => {
          firebase.firestore().collection('likes').doc(doc.id).delete()
        })
        this.content.likes--
        // いいねを追加
      } else {
        firebase.firestore().collection('likes').add({
          post_id: this.$route.params.id,
          user_id: this.$store.state.user.id,
          created_at: firebase.firestore.Timestamp.now(),
        })
        this.content.likes++
      }
      this.isLiked = !this.isLiked
    },
  },
  head() {
    return {
      title: this.meta.title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.meta.url,
        },
        { hid: 'og:title', property: 'og:title', content: this.meta.title },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.meta.image,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
// 本文画像、h3~h5のcssは_index.scss
.divider {
  border-bottom: thin solid #707070;
}
img.top-img {
  width: 90vw;
  height: 51.25vw;
  max-width: 590px;
  max-height: 336px;
  object-fit: cover; //0.57
}

#liked {
  cursor: pointer;
  color: $like-color;
}

#like {
  cursor: pointer;
  color: $icon-color;
  &:hover {
    color: $like-color;
  }
}
</style>
