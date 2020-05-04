<template>
  <div>
    <b-container style="max-width: 620px;" class="pt-5">
      <div class="mb-5 text-center">
        <b-img class="top-img" :src="content.top_img"></b-img>
      </div>
      <div class="mb-4">
        <h2>{{ content.title }}</h2>
      </div>
      <div class="d-flex mb-4">
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
          <div>{{ disp_published_at }}</div>
        </div>
      </div>
      <div class="content mb-5" v-html="$sanitize(content.body)"></div>
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
  async asyncData({ store, route, router }) {
    let content = null
    await firebase
      .firestore()
      .collection('posts')
      .doc(route.params.id)
      .get()
      .then((doc) => {
        if (!['public', 'anonym'].includes(doc.data().status)) router.push('/')
        content = doc.data()
      })
      .catch((error) => {
        router.push('/')
        console.error(error)
      })
    return {
      content,
      meta: {
        title:
          content.title.length <= 15
            ? content.title
            : content.title.substr(0, 15),
        type: 'article',
        url: `https://schizoid-note.com/contents/${route.params.id}`,
        image: content.top_img,
      },
    }
  },
  data() {
    return {
      authorPosts: [],
      disp_published_at: null,
    }
  },
  created() {},
  mounted() {
    this.disp_published_at = this.$timestampToDate(
      new firebase.firestore.Timestamp(
        this.content.published_at.seconds,
        this.content.published_at.nanoseconds
      )
    )
  },
  methods: {},
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
.content {
  font-size: 1.2rem;
  img {
    width: 90vw;
    max-width: 500px;
  }
}
.divider {
  border-bottom: thin solid #707070;
}
img.top-img {
  width: 90vw;
  height: 66.7vw;
  max-width: 500px;
  max-height: 380px;
  object-fit: cover; //640x480 0.75 4/3
}
</style>
