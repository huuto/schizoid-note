<template>
  <div>
    <b-container class="pt-3" style="max-width:640px">
      <div>{{ message }}</div>
      <div class="mb-3">
        <b-row class="mb-1">
          <b-col cols="auto">投稿日</b-col
          ><b-col>{{ content.created_at }}</b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="auto">更新日</b-col
          ><b-col>{{ content.updated_at }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="auto">状態&nbsp;&nbsp;</b-col
          ><b-col style="max-width:150px"
            ><b-form-select
              v-model="content.status"
              :options="status_options"
              @change="setSaveBtn()"
            ></b-form-select
          ></b-col>
        </b-row>
      </div>
      <div class="text-center mb-5">
        <b-btn id="saveBtn" variant="outline-success" class="">{{
          save_btn
        }}</b-btn>
      </div>
      <div class="mb-5">
        <div class="mb-3"><h2>タイトル</h2></div>
        <div>
          <b-form-input v-model="content.title"></b-form-input>
        </div>
      </div>
      <div class="mb-5">
        <div class="mb-3"><h2>トップ画像</h2></div>
        <b-form-file
          v-model="content.top_img"
          placeholder="画像を選択してください"
          drop-placeholder="ここにドロップできます"
          class="mb-3"
        ></b-form-file>
        <div class="text-center">
          <b-img id="topImg" :src="content.top_img"></b-img>
        </div>
      </div>
      <div class="mb-5">
        <div class="mb-3"><h2>本文</h2></div>
        <no-ssr>
          <vue-editor
            id="editor"
            v-model="content.body"
            use-custom-image-handler
            @image-added="handleImageAdded"
          />
        </no-ssr>
      </div>
    </b-container>
  </div>
</template>
<script>
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      content: {},
      message: '',

      status_options: [
        { value: 'draft', text: '下書き', btn: '下書き保存' },
        { value: 'public', text: '公開', btn: '保存して公開' },
        { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
        { value: 'private', text: '非公開', btn: '保存して非公開' }
      ],
      save_btn_options: [
        { value: 'draft', btn: '下書き保存' },
        { value: 'public', btn: '保存して公開' },
        { value: 'anonym', btn: '保存して匿名公開' },
        { value: 'private', btn: '保存して非公開' }
      ],
      save_btn: ''
    }
  },
  async mounted() {
    this.$store.dispatch('authRedirect')
    await this.getContent()
    this.setStatus()
    this.setSaveBtn()
  },
  methods: {
    async getContent() {
      await firebase
        .firestore()
        .collection('posts')
        .doc(this.$route.params.id)
        .get()
        .then((doc) => {
          if (doc.data().user_id === this.$store.state.user.id) {
            this.content = doc.data()
            this.content.created_at = this.$timestampToDate(
              this.content.created_at
            )
            this.content.updated_at = this.$timestampToDate(
              this.content.updated_at
            )
          } else {
            this.$router.push('/')
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
      this.save_btn_options.forEach((el) => {
        if (el.value === this.content.status) this.save_btn = el.btn
      })
    },
    // 画像のアップロード
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      if (!file.type.match(/^image\//g)) {
        this.message = '拡張子が違うため、画像をアップロードできません。'
        return null
      }
      const fileName = Date.now() + '_' + file.name
      const ref = firebase
        .storage()
        .ref()
        .child('posts/' + fileName)
      await ref.put(file)
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

img#topImg {
  width: 36rem;
  height: 18rem;
  object-fit: cover;
}

#saveBtn {
  width: 10rem;
}
</style>
