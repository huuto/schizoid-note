<template>
  <div>
    <b-container class="pt-3" style="max-width:640px">
      <div class="mb-3">
        <b-row class="mb-1">
          <b-col cols="auto">投稿日</b-col><b-col>{{ post.created_at }}</b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="auto">更新日</b-col><b-col>{{ post.updated_at }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="auto">状態&nbsp;&nbsp;</b-col
          ><b-col style="max-width:150px"
            ><b-form-select
              v-model="post.status"
              :options="status_options"
            ></b-form-select
          ></b-col>
        </b-row>
      </div>
      <div class="text-center">
        <b-btn variant="outline-success" class="px-5">保存</b-btn>
      </div>
      <div class="mb-3">
        <div class="mb-3"><h2>タイトル</h2></div>
        <div>
          <b-form-input v-model="post.title"></b-form-input>
        </div>
      </div>

      <div class="mb-3">
        <div class="mb-3"><h2>本文</h2></div>
        <no-ssr>
          <vue-editor
            id="editer"
            v-model="post.content"
            use-custom-image-handler
          />
        </no-ssr>
        <div v-html="$sanitize(content)"></div>
      </div>
      <div>
        <div><h2>タイトル画像</h2></div>
      </div>
    </b-container>
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  data() {
    return {
      post: {
        id: '1',
        title: '',
        content: '',
        created_at: '2020/4/1',
        updated_at: '2020/5/1',
        status: 'draft'
      },
      status_options: [
        { value: 'draft', text: '下書き' },
        { value: 'public', text: '公開' },
        { value: 'anonym', text: '匿名公開' },
        { value: 'private', text: '非公開' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.1rem;
}
</style>
