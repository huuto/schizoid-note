<template>
  <div>
    <b-container class="pt-3" style="max-width:640px">
      <div class="mb-3">
        <b-row class="mb-1">
          <b-col cols="auto">投稿日</b-col
          ><b-col>{{ $timestampToDate(content.created_at) }}</b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="auto">更新日</b-col
          ><b-col>{{ $timestampToDate(content.updated_at) }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="auto">状態&nbsp;&nbsp;</b-col
          ><b-col style="max-width:150px"
            ><b-form-select
              v-model="content.status"
              :options="status_options"
            ></b-form-select
          ></b-col>
        </b-row>
      </div>
      <div class="text-center">
        <b-btn variant="outline-success" class="px-5">{{ setSaveBtn() }}</b-btn>
      </div>
      <div class="mb-3">
        <div class="mb-3"><h2>タイトル</h2></div>
        <div>
          <b-form-input v-model="content.title"></b-form-input>
        </div>
      </div>

      <div class="mb-3">
        <div class="mb-3"><h2>本文</h2></div>
        <no-ssr>
          <vue-editor
            id="editer"
            v-model="content.content"
            use-custom-image-handler
            @imageAdded="handleImageAdded()"
          />
        </no-ssr>
        <div v-html="$sanitize(content.body)"></div>
      </div>
      <div>
        <div><h2>タイトル画像</h2></div>
      </div>
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
      data() {
        return {
          content: {},
          message: ''
        }
      },
      status_options: [
        { value: 'draft', text: '下書き', btn: '下書き保存' },
        { value: 'public', text: '公開', btn: '保存して公開' },
        { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
        { value: 'private', text: '非公開', btn: '保存して非公開' }
      ]
    }
  },
  mounted() {
    this.$store.dispatch('authRedirect')
    this.getContent()
    this.setStatus()
  },
  methods: {
    async getContent() {
      const docRef = await firebase
        .firestore()
        .collection('posts')
        .doc(this.$route.params.id)
      docRef.get().then((doc) => {
        console.log(doc)
        if (doc.data().user_id === this.$store.state.user.id) {
          this.content = doc.data()
        } else {
          this.$route.push('/')
        }
      })
    },
    setStatus() {
      switch (this.content.status) {
        case 'draft':
          // 非公開を削除
          this.status_options.splice(3, 1)
          break
        case 'public':
        case 'anonym':
        case 'private':
          // 下書きを削除
          this.status_options.splice(0, 1)
          break
      }
    },
    setSaveBtn() {
      this.status_options.forEach((el) => {
        if (el.value === this.content.status) return el.btn
      })
    },
    // 画像のアップロード
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      if (!file.type.match('/^image//+/')) {
        this.message = '拡張子が違うため、画像をアップロードできません。'
        return null
      }
      let index = 0
      await firebase
        .firestore()
        .collection('posts_index')
        .doc('posts_index')
        .get()
        .then((doc) => {
          index = doc.data().index
        })
      const fileName = 'post' + index + '_' + file.name
      const ref = await firebase.storage.ref().child('posts/' + fileName)
      ref.put(file).then((snapshot) => {
        console.log('uploded a file ' + fileName)
      })
      let url = ''
      await ref.getDownloadURL().then((getUrl) => {
        url = getUrl
      })

      Editor.insertEmbed(cursorLocation, 'image', url)
      resetUploader()
    }
  }
}
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.1rem;
}
</style>
