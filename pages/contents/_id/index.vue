<template>
  <div>
    <b-container style="max-width: 620px;" class="pt-5">
      <div v-show="content.topImg" class="mb-5 text-center">
        <b-img class="top-img" :src="content.topImg" />
      </div>
      <div class="mb-3">
        <h2>{{ content.title }}</h2>
      </div>
      <div class="d-flex mb-5">
        <b-avatar
          size="2rem"
          class="mr-3 my-auto"
          :src="content.userImg"
          variant="light"
        />
        <div class="">
          <div>
            {{ content.userName }}
          </div>
          <div>{{ $timestampToDate(content.publishedAt) }}</div>
        </div>
      </div>
      <div id="body" class="mb-5" v-html="$sanitize(content.body)" />
      <div class="divider mb-5" />
      <div class="mt-3 mb-5">
        <span v-if="isLiked" id="liked" class="p-2" @click="likes()">
          <i class="fas fa-heart fa-lg" />
          {{ content.likes || 0 }}
        </span>
        <span v-else id="like" class="p-2" @click="likes()">
          <i class="far fa-heart fa-lg" />
          {{ content.likes || 0 }}
        </span>
      </div>
      <b-tooltip
        :disabled="$store.state.user.isLogin"
        triggers="hover"
        target="like"
        variant="info"
        >ログインするといいねできます</b-tooltip
      >
      <div class="author d-flex mb-5">
        <div>
          <b-avatar
            size="3rem"
            class="mr-3 my-auto"
            :src="content.userImg"
            variant="light"
          />
        </div>
        <div>
          <div>{{ content.userName }}</div>
          <div class="mt-3">{{ content.profile }}</div>
        </div>
      </div>
      <!-- <b-list-group class="mb-5">
        <b-list-group-item
          v-for="(authpost, index) in authorPosts"
          :key="index"
          to="#"
          class=""
        >
          {{ authpost.title }}
        </b-list-group-item>
      </b-list-group> -->
      <div class="divider mb-5" />
    </b-container>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'
import firebase from '~/plugins/firebase'
import Meta from '~/assets/mixins/meta'

type ContentType = {
  topImg: string
  title: string
  body: string
  publishedAt: firebase.firestore.Timestamp
  userImg: string
  userName: string
  profile: string
  likes: string
}

type AsyncDataType = {
  content: ContentType
  meta: {
    title: string
    type: string
    url: string
    image: string
    description: string
  }
}

type HeadType = {
  title: string
  meta: {
    hid: string
    property: string
    content: string
  }[]
}

type DataType = {
  content?: ContentType
  authorPosts: []
  isLiked: boolean
}

export default Vue.extend({
  mixins: [Meta],
  async asyncData({ route, redirect }): Promise<AsyncDataType | void> {
    try {
      const doc = await firebase
        .firestore()
        .collection('posts')
        .doc(route.params.id)
        .get()
      if (!doc.data()?.public) {
        redirect('/')
      }
      const content: ContentType = {
        topImg: doc.data()?.top_img,
        title: doc.data()?.title,
        body: doc.data()?.body,
        publishedAt: doc.data()?.published_at,
        userImg: doc.data()?.user_img,
        userName: doc.data()?.user_name,
        profile: doc.data()?.profile,
        likes: doc.data()?.likes,
      }
      return {
        content,
        meta: {
          title:
            content.title.length <= 30
              ? content.title
              : content.title.substr(0, 30),
          type: 'article',
          url: `https://schizoid-note.com/contents/${route.params.id}`,
          image: content.topImg,
          description: content.body
            .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
            .slice(0, 50),
        },
      }
    } catch (error) {
      console.error(error)
      redirect('/')
    }
  },
  data(): DataType {
    return {
      authorPosts: [],
      isLiked: false,
    }
  },
  computed: {
    userId: {
      get(this: any): string {
        return this.$store.state.user.id
      },
    },
  },
  watch: {
    userId(this: any, val: string) {
      this.chkLiked(val)
    },
  },
  created() {},
  mounted(this: any) {
    this.chkLiked(this.userId)
  },
  methods: {
    chkLiked(this: any, userId: string) {
      firebase
        .firestore()
        .collection('likes')
        .where('post_id', '==', this.$route.params.id)
        .where('user_id', '==', userId)
        .get()
        .then((docs) => {
          if (docs.size === 1) {
            this.isLiked = true
          }
        })
    },
    /**
     * いいねボタン押下
     */
    async likes(this: any) {
      if (!this.$store.state.user.isLogin) {
        return
      }
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
        this.content.likes = this.content.likes - 1
        // いいねを追加
      } else {
        firebase.firestore().collection('likes').add({
          post_id: this.$route.params.id,
          user_id: this.$store.state.user.id,
          created_at: firebase.firestore.Timestamp.now(),
        })
        this.content.likes = this.content.likes + 1
      }
      this.isLiked = !this.isLiked
    },
  },
  head(this: any): HeadType {
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
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.meta.description,
        },
      ],
    }
  },
})
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
