<template>
  <div>
    <b-container style="max-width:640px" class="pt-5">
      <div class="mb-5 text-center">
        <b-img :src="post.img_src" height="340"></b-img>
      </div>
      <div class="mb-4">
        <h2>{{ post.title }}</h2>
      </div>
      <div class="d-flex mb-4">
        <b-avatar size="2rem" class="mr-3 my-auto"></b-avatar>
        <div class="">
          <div>
            {{ post.user_name }}
          </div>
          <div>{{ post.updated_at }}</div>
        </div>
      </div>
      <div class="content mb-5" v-html="$sanitize(post.content)"></div>
      <div class="divider mb-5"></div>
      <div class="author d-flex mb-5">
        <div>
          <b-avatar size="3rem" class="mr-3 my-auto"></b-avatar>
        </div>
        <div>
          <div>{{ author.user_name }}</div>
          <div>{{ author.profile }}</div>
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
export default {
  data() {
    return {
      post: {
        id: '1',
        title: 'タイトル',
        img_src: '/img/cat-2083492_640.jpg',
        user_name: 'huuto',
        user_img: '',
        content: 'aaaaaaaaaaa本文です',
        created_at: '2020/4/1',
        updated_at: '2020/5/1',
        status: 'draft'
      },
      author: {
        user_name: 'huuto',
        user_img: '',
        profile: 'よろしくお願いします。',
        posts: [
          { id: 2, title: 'タイトル２' },
          { id: 3, title: 'タイトル３' }
        ]
      }
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
</style>
