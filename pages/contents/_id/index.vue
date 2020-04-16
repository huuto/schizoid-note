<template>
  <div>
    <b-container style="max-width:640px" class="pt-5">
      <div class="mb-5 text-center">
        <b-img :src="content.top_img"></b-img>
      </div>
      <div class="mb-4">
        <h2>{{ content.title }}</h2>
      </div>
      <div class="d-flex mb-4">
        <b-avatar size="2rem" class="mr-3 my-auto"></b-avatar>
        <div class="">
          <div>
            {{ content.user_name }}
          </div>
          <div>{{ $timestampToDate(content.updated_at) }}</div>
        </div>
      </div>
      <div class="content mb-5" v-html="$sanitize(content.body)"></div>
      <div class="divider mb-5"></div>
      <div class="author d-flex mb-5">
        <div>
          <b-avatar size="3rem" class="mr-3 my-auto"></b-avatar>
        </div>
        <div>
          <div>{{ content.user_name }}</div>
          <div>{{ content.profile }}</div>
        </div>
      </div>
      <b-list-group class="mb-5">
        <b-list-group-item
          v-for="(authpost, index) in author.posts"
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
export default {
  validate({ params }) {
    // 数値でなければならない
    return /^\d+$/.test(params.id)
  },
  data() {
    return {
      content: {},
      authorPosts: []
    }
  },
  mounted() {
    this.getContent()
  },
  methods: {
    async getContent() {
      const docRef = await firebase
        .firestore()
        .collection('posts')
        .doc(this.$route.params.id)
      docRef.get().then((doc) => {
        this.content = doc.data()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  font-size: 1.2rem;
}
.divider {
  border-bottom: thin solid #707070;
}
img {
  width: 36rem;
  max-height: 18rem;
  object-fit: cover;
}
</style>
