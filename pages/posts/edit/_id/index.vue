<template>
  <div>
    <b-container class="pt-3" style="max-width: 640px;">
      <MsgPopup :msg-popup="msg_popup" />
      <div>
        <b-modal
          id="public-modal"
          v-model="showModal"
          hide-header
          ok-title="公開"
          cancel-title="キャンセル"
          @ok="save()"
        >
          <h2>公開します。よろしいですか？</h2>
        </b-modal>
      </div>

      <div class="mb-3">
        <b-row v-show="disp_created_at" class="mb-1">
          <b-col cols="auto">作成日</b-col><b-col>{{ disp_created_at }}</b-col>
        </b-row>
        <b-row v-show="disp_published_at" class="mb-1">
          <b-col cols="auto">投稿日</b-col
          ><b-col>{{ disp_published_at }}</b-col>
        </b-row>
        <b-row v-show="disp_updated_at" class="mb-3">
          <b-col cols="auto">更新日</b-col><b-col>{{ disp_updated_at }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="auto">状態&nbsp;&nbsp;</b-col
          ><b-col style="max-width: 150px;"
            ><b-form-select
              v-model="content.status"
              :options="status_options"
              @change="setStatus()"
            ></b-form-select
          ></b-col>
        </b-row>
      </div>
      <div class="text-center mb-5">
        <b-btn
          id="saveBtn"
          variant="outline-success"
          class=""
          :disabled="!text_change"
          @click="preSave()"
          >{{ save_btn }}</b-btn
        >
      </div>
      <div class="mb-5">
        <div class="mb-3"><h2>タイトル</h2></div>
        <div>
          <b-form-input
            v-model="content.title"
            @change="text_change = true"
          ></b-form-input>
        </div>
      </div>
      <div class="mb-5">
        <div class="mb-3"><h2>トップ画像</h2></div>
        <b-form-file
          v-model="uploadFiles.top_img"
          placeholder="画像を選択してください"
          drop-placeholder="ここにドロップできます"
          class="mb-3"
          accept="image/*"
          @input="setTopImg()"
        ></b-form-file>
        <div
          v-show="content.top_img"
          class="text-center"
          style="position: relative;"
        >
          <i
            class="fas fa-times-circle fa-2x delete-top-img"
            @click="deleteTopImg()"
          ></i>
          <b-img id="topImg" :src="content.top_img"></b-img>
        </div>
      </div>
      <div class="mb-5">
        <div class="mb-3"><h2>本文</h2></div>
        <no-ssr>
          <div id="editorWrap">
            <vue-editor
              id="editor"
              v-model="content.body"
              use-custom-image-handler
              :editor-toolbar="customToolbar"
              :editor-options="editorOptions"
              @image-added="handleImageAdded"
              @image-removed="handleImageRemoved"
              @text-change="text_change = true"
            />
            <!-- <Editor :body="content.body" :text-change="text_change" /> -->
          </div>
        </no-ssr>
        <div class="text-right mt-3 font-weight-bold">{{ setCount }} 文字</div>
      </div>
    </b-container>
  </div>
</template>
<script>
import imageCompression from 'browser-image-compression'
import firebase from '~/plugins/firebase'
import MsgPopup from '~/components/common/msgPopup'
import 'quill/dist/quill.bubble.css'

export default {
  layout: 'user',
  components: {
    MsgPopup,
  },
  data() {
    return {
      content: {
        created_at: null,
        updated_at: null,
        published_at: null,
        title: '',
        top_img: '',
        body: '',
        status: 'draft',
        public: false,
        user_id: '',
        user_img: '',
        user_name: '',
        profile: '',
      },
      customToolbar: [
        ['bold', 'italic', 'underline'], // toggled buttons
        ['blockquote'],

        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [3, 4, 5, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],

        ['link', 'image'],
      ],
      disp_created_at: null,
      disp_updated_at: null,
      disp_published_at: null,
      msg_popup: { message: null, isSpinner: false, variant: '' },
      status_options: [
        { value: 'draft', text: '下書き', btn: '下書き保存' },
        { value: 'public', text: '公開', btn: '保存して公開' },
        { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
      ],
      editorOptions: {},
      save_btn: '',
      text_change: false,
      // 変更前のステータス
      preStatus: 'draft',
      showModal: false,
      // body[{file: null, url: ""}]
      uploadFiles: { top_img: null, body: [] },
      // storageから削除予定の画像URL
      deleteFiles: [],
    }
  },
  computed: {
    setCount() {
      if (!this.content.body) return 0
      return this.content.body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
        .length
    },
  },
  created() {
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener('beforeunload', this.checkWindow)
    }
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.checkWindow)
  },
  beforeRouteLeave(to, from, next) {
    if (this.text_change) {
      const ans = window.confirm(
        '変更が保存されていません。本当に移動しますか？'
      )
      next(ans)
    } else {
      next()
    }
  },
  async mounted() {
    this.$store.dispatch('authRedirect')
    await this.getContent()
    this.setStatus()
    // スマホの場合は文字選択でツールバーが出る
    if (window.innerWidth <= 480) {
      this.editorOptions = {
        theme: 'bubble',
      }
    }
    // setStatusでtureになってしまう対策
    this.text_change = false
  },
  methods: {
    /**
     * タイトルを設定
     */
    setTitle() {
      if (this.$route.params.id === 'new') {
        return '新規記事'
      }
      if (this.content.title === '') {
        return '記事編集'
      }
      return (
        '記事編集 ' +
        (this.content.title.length <= 15
          ? this.content.title
          : this.content.title.substr(0, 15))
      )
    },
    async getContent() {
      // 新規でない場合
      if (this.$route.params.id !== 'new') {
        await firebase
          .firestore()
          .collection('posts')
          .doc(this.$route.params.id)
          .get()
          .then((doc) => {
            if (doc.data().user_id === this.$store.state.user.id) {
              this.content = doc.data()
              this.preStatus = this.content.status
              if (this.content.created_at)
                this.disp_created_at = this.$timestampToDate(
                  this.content.created_at
                )
              if (this.content.published_at)
                this.disp_published_at = this.$timestampToDate(
                  this.content.published_at
                )
              if (this.content.updated_at)
                this.disp_updated_at = this.$timestampToDate(
                  this.content.updated_at
                )
            } else {
              this.$router.push('/')
            }
          })
      }
    },
    setStatus() {
      switch (this.content.status) {
        case 'draft':
          this.status_options = [
            { value: 'draft', text: '下書き', btn: '下書き保存' },
            { value: 'public', text: '公開', btn: '保存して公開' },
            { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
          ]
          break
        case 'public':
        case 'anonym':
        case 'private':
          this.status_options = [
            { value: 'public', text: '公開', btn: '保存して公開' },
            { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
            { value: 'private', text: '非公開', btn: '保存して非公開' },
          ]
          break
      }
      this.save_btn = this.status_options.find(
        (el) => el.value === this.content.status
      ).btn
      if (['public', 'anonym'].includes(this.content.status)) {
        this.content.public = true
      } else {
        this.content.public = false
      }
      this.text_change = true
    },
    // ポップアップメッセージのリセット
    resetMsg() {
      this.msg_popup = { message: null, variant: '', isSpinner: false }
    },
    // 画像のアップロード
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      if (!file.type.match(/^image\//g)) {
        this.msg_popup = {
          message: '画像以外はアップロードできません。',
          variant: 'danger',
          isSpinner: false,
        }
        return null
      }
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
      }
      const resizeImg = await imageCompression(file, options)
      const url = await imageCompression.getDataUrlFromFile(resizeImg)
      this.uploadFiles.body.push({ file: resizeImg, url })
      Editor.insertEmbed(cursorLocation, 'image', url)
      resetUploader()
    },
    // トップ画像のアップロード
    async setTopImg() {
      if (this.uploadFiles.top_img) {
        // ストレージに保存されていれば削除の準備
        if (this.content.top_img.startsWith('https')) {
          this.deleteFiles.push(this.content.top_img)
        }
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
        }
        const resizeImg = await imageCompression(
          this.uploadFiles.top_img,
          options
        )
        this.content.top_img = await imageCompression.getDataUrlFromFile(
          resizeImg
        )
        this.uploadFiles.top_img = resizeImg
        this.text_change = true
      }
    },
    /**
     * トップ画像の削除
     */
    deleteTopImg() {
      // ストレージに保存されていれば削除の準備
      if (this.content.top_img.startsWith('https')) {
        this.deleteFiles.push(this.content.top_img)
      } else {
        // アップロード準備の画像URLを削除
        this.uploadFiles.top_img = null
      }
      this.content.top_img = ''
    },
    // ストレージにある場合画像削除の準備
    handleImageRemoved(imageURL) {
      if (imageURL.startsWith('https')) {
        this.deleteFiles.push(imageURL)
      } else {
        // アップロード準備の画像URLを削除
        this.uploadFiles.body = this.uploadFiles.body.filter(
          (file) => file.url !== imageURL
        )
      }
    },
    /**
     * 本当に画像削除
     * @param {String} imageURL
     */
    imageRemove(imageURL) {
      firebase
        .storage()
        .refFromURL(imageURL)
        .delete()
        .then(() => {
          console.log('image delete ' + imageURL)
        })
        .catch(() => {
          console.log('error: image delete ' + imageURL)
        })
    },
    // 記事公開前のチェック
    preSave() {
      // 下書き、非公開から公開する場合のチェック
      if (
        ['draft', 'private'].includes(this.preStatus) &&
        ['public', 'anonym'].includes(this.content.status)
      ) {
        this.showModal = true
      } else {
        this.save()
      }
    },
    // 記事の保存
    async save() {
      this.msg_popup = {
        message: '保存中です。',
        variant: 'info',
        isSpinner: true,
      }
      const timespamp = firebase.firestore.FieldValue.serverTimestamp()
      this.content.updated_at = timespamp
      // 初公開の場合
      if (
        this.preStatus === 'draft' &&
        ['public', 'anonym'].includes(this.content.status)
      ) {
        this.content.published_at = timespamp
      }
      // 新規の場合
      if (this.$route.params.id === 'new') {
        this.content.created_at = timespamp
        this.content.user_id = this.$store.state.user.id
      }
      // 匿名投稿の場合
      if (this.content.status === 'anonym') {
        this.content.user_name = '匿名さん'
        this.content.user_img = '/img/schizoid-chan.png'
        this.content.profile = ''
      } else {
        this.content.user_name = this.$store.state.user.name
        this.content.user_img = this.$store.state.user.photoURL
        this.content.profile = this.$store.state.user.profile
      }

      // 画像のアップロード
      // トップ画像
      if (this.uploadFiles.top_img) {
        this.content.top_img = await this.uploadFile(this.uploadFiles.top_img)
      }
      // 本文画像
      this.uploadFiles.body.forEach(async (img) => {
        const url = await this.uploadFile(img.file)
        this.content.body = this.content.body.replace(img.url, url)
      })
      // 削除画像の削除
      this.deleteFiles.forEach((url) => {
        this.imageRemove(url)
      })
      this.uploadFiles = { top_img: null, body: [] }
      this.deleteFiles = []
      if (this.$route.params.id === 'new') {
        // 日付を使ったユニークID
        const postId =
          Math.random().toString(32).slice(-2) +
          Date.now().toString(32).substring(1)
        firebase
          .firestore()
          .collection('posts')
          .doc(postId)
          .set(this.content)
          .then((docRef) => {
            this.msg_popup = this.msgPopupSuccess()
            this.text_change = false
            this.preStatus = this.content.status

            setTimeout(() => {
              this.$router.push('/posts/edit/' + postId)
            }, 1000)
          })
          .catch((error) => {
            this.msg_popup = this.msgPopupError()
            console.error(error)
          })
      } else {
        firebase
          .firestore()
          .collection('posts')
          .doc(this.$route.params.id)
          .set(this.content)
          .then(() => {
            this.msg_popup = this.msgPopupSuccess()
            this.text_change = false
            this.preStatus = this.content.status
          })
          .catch(() => {
            this.msg_popup = this.msgPopupError()
          })
      }
    },
    msgPopupSuccess() {
      return {
        message: '保存しました。',
        variant: 'success',
        isSpinner: false,
      }
    },
    msgPopupError() {
      return {
        message: 'エラーが発生しました。',
        variant: 'danger',
        isSpinner: false,
      }
    },
    checkWindow(event) {
      if (this.text_change) {
        event.preventDefault()
        event.returnValue = '変更が保存されていません。本当に移動しますか？'
      }
    },
    /**
     * ファイルのアップロード
     * @param {File} file
     * @returns ダウンロードURL
     */
    async uploadFile(file) {
      const fileName = Date.now() + '_' + file.name
      const ref = firebase.storage().ref()
      await ref.child('posts/' + fileName).put(file)
      console.log(`uploadfies ${fileName}`)
      const url = await ref.child('posts/' + fileName).getDownloadURL()
      return url
    },
  },
  head() {
    return {
      title: this.setTitle(),
    }
  },
}
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.1rem;
  font-weight: bold;
}

// .ql-snow .ql-editor h3 {
//   font-size: 18px !important;
// }
// h4 {
//   font-size: 1.5rem !important;
// }
// h5 {
//   font-size: 1.25rem !important;
// }

img#topImg {
  width: 90vw;
  height: 66.7vw;
  max-width: 500px;
  max-height: 380px;
  object-fit: cover;
}

.delete-top-img {
  position: absolute;
  right: 10px;
  color: #747474;
  &:hover {
    color: #474747;
  }
}

#saveBtn {
  width: 10rem;
}

#editorWrap {
  border-top: solid 1px #5d627b;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.22);
}
</style>
