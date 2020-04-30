<template>
  <div>
    <b-container class="pt-3" style="max-width:640px">
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
        <b-row class="mb-2">
          <b-col cols="auto">状態&nbsp;&nbsp;</b-col
          ><b-col style="max-width:150px"
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
        <div class="text-center">
          <b-img
            v-show="content.top_img"
            id="topImg"
            :src="content.top_img"
          ></b-img>
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
    MsgPopup
    // Editor
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
        profile: ''
      },
      customToolbar: [
        ['bold', 'italic', 'underline'], // toggled buttons
        ['blockquote'],

        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],

        ['link', 'image']
      ],
      editorOptions: {},
      disp_created_at: null,
      disp_updated_at: null,
      disp_published_at: null,
      // top_img: null,
      msg_popup: { message: null, isSpinner: false, variant: '' },
      status_options: [
        { value: 'draft', text: '下書き', btn: '下書き保存' },
        { value: 'public', text: '公開', btn: '保存して公開' },
        { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' }
      ],
      save_btn: '下書き保存',
      text_change: false,
      showModal: false,
      // body[{file: null, url: ""}]
      uploadFiles: { top_img: null, body: [] },
      // storageから削除予定の画像URL
      deleteFiles: []
    }
  },
  computed: {},
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
  mounted() {
    this.$store.dispatch('authRedirect')
    // スマホの場合は文字選択でツールバーが出る
    if (window.innerWidth <= 480) {
      this.editorOptions = {
        theme: 'bubble'
      }
    }
  },
  methods: {
    setStatus() {
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
          isSpinner: false
        }
        return null
      }
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500
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
          maxWidthOrHeight: 500
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

    // ストレージにある場合画像削除の準備
    handleImageRemoved(imageURL) {
      if (imageURL.startsWith('https')) {
        this.deleteFiles.push(imageURL)
      } else {
        // アップロード準備の画像URLを削除
        this.uploadFiles.body.filter((file) => file.url !== imageURL)
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
      if (['public', 'anonym'].includes(this.content.status)) {
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
        isSpinner: true
      }
      // 初投稿の場合
      if (['public', 'anonym'].includes(this.content.status)) {
        this.content.published_at = firebase.firestore.FieldValue.serverTimestamp()
      }
      this.content.created_at = firebase.firestore.FieldValue.serverTimestamp()
      this.content.updated_at = firebase.firestore.FieldValue.serverTimestamp()
      this.content.user_id = this.$store.state.user.id
      // 匿名投稿の場合
      if (this.content.status === 'anonym') {
        this.content.user_name = '匿名さん'
        this.content.user_img = '~/static/img/schizoid-chan.png'
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
        this.content.body.replace(img.url, url)
      })
      // 削除画像の削除
      this.deleteFiles.forEach((url) => {
        this.imageRemove(url)
      })

      // 日付を使ったユニークID
      const postId =
        Math.random()
          .toString(16)
          .slice(-2) +
        new Date()
          .getTime()
          .toString(16)
          .substring(2)
      firebase
        .firestore()
        .collection('posts')
        .doc(postId)
        .set(this.content)
        .then((docRef) => {
          this.msg_popup = {
            message: '保存しました。',
            variant: 'success',
            isSpinner: false
          }

          this.text_change = false
          this.preStatus = this.content.status

          setTimeout(() => {
            this.$router.push('/posts/edit/' + postId)
          }, 1000)
        })
        .catch((error) => {
          this.msg_popup = {
            message: 'エラーが発生しました。',
            variant: 'danger',
            isSpinner: false
          }
          console.log(error)
        })
    },
    /**
     * windowの遷移時の確認
     */
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
      const fileName = Date.now() + '_' + this.uploadFiles.top_img.name
      const ref = firebase.storage().ref()
      await ref.child('posts/' + fileName).put(file)
      console.log(`uploadfies ${fileName}`)
      const url = await ref.child('posts/' + fileName).getDownloadURL()
      return url
    }
  }
}
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.1rem;
  font-weight: bold;
}

img#topImg {
  width: 90vw;
  height: 66.7vw;
  max-width: 500px;
  max-height: 380px;
  object-fit: cover;
}

#saveBtn {
  width: 10rem;
}

#editorWrap {
  border-top: solid 1px #5d627b;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.22);
}
</style>
