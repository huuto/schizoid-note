<template>
  <div>
    <b-container class="pt-3" style="max-width: 640px;">
      <MsgPopup :msg-popup="msgPopup" />
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
        <b-row v-show="content.createdAt" class="mb-1">
          <b-col cols="auto"> 作成日 </b-col
          ><b-col>{{ $timestampToDate(content.createdAt) }}</b-col>
        </b-row>
        <b-row v-show="content.publishedAt" class="mb-1">
          <b-col cols="auto"> 公開日 </b-col
          ><b-col>{{ $timestampToDate(content.publishedAt) }}</b-col>
        </b-row>
        <b-row v-show="content.updatedAt" class="mb-3">
          <b-col cols="auto"> 更新日 </b-col
          ><b-col>{{ $timestampToDate(content.updatedAt) }}</b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="auto"> 状態&nbsp;&nbsp; </b-col
          ><b-col style="max-width: 150px;">
            <b-form-select
              v-model="content.status"
              :options="statusOptions"
              @change="changeStatus()"
            />
          </b-col>
        </b-row>
      </div>
      <div class="text-center mb-5">
        <b-btn
          id="saveBtn"
          variant="outline-success"
          class=""
          :disabled="!textChange"
          @click="preSave()"
        >
          {{ saveBtn }}
        </b-btn>
      </div>
      <div class="mb-5">
        <div class="mb-3">
          <h2>タイトル</h2>
        </div>
        <div>
          <b-form-input v-model="content.title" @change="textChange = true" />
        </div>
      </div>
      <div class="mb-5">
        <div class="mb-3">
          <h2>トップ画像</h2>
        </div>
        <b-form-file
          v-model="uploadFiles.topImg"
          placeholder="画像を選択してください"
          drop-placeholder="ここにドロップできます"
          class="mb-3"
          accept="image/*"
          @input="setTopImg()"
        />
        <div
          v-show="content.topImg"
          class="text-center"
          style="position: relative;"
        >
          <i
            class="fas fa-times-circle fa-2x delete-top-img"
            @click="deleteTopImg()"
          />
          <b-img id="topImg" :src="content.topImg" />
        </div>
      </div>
      <div class="mb-5">
        <div class="mb-3">
          <h2>本文</h2>
        </div>
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
              @text-change="textChange = true"
            />
          </div>
        </no-ssr>
        <div class="text-right mt-3 font-weight-bold">{{ setCount }} 文字</div>
      </div>
    </b-container>
    <b-container fluid style="background-color: #f1f1f3;">
      <b-row class="justify-content-center">
        <b-col
          id="preview"
          class="my-5"
          style="max-width: 640px; background-color: white;"
        >
          <div class="mt-4 mb-5">
            <h2 class="pr-2" style="display: inline;">
              プレビュー
            </h2>
            <i
              id="preview-icon"
              class="fas fa-exclamation-circle fa-lg"
              style="color: #747474;"
            />
            <b-tooltip target="preview-icon">
              本文の画像は保存すると表示されます。
            </b-tooltip>
          </div>
          <div class="mx-auto" style="max-width: 590px;">
            <div v-show="content.topImg" class="mb-5 text-center">
              <b-img class="top-img" :src="content.topImg" />
            </div>
            <div class="mb-3">
              <h2 id="title">
                {{ content.title }}
              </h2>
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
                <div v-if="content.publishedAt">
                  {{ $timestampToDate(content.publishedAt) }}
                </div>
              </div>
            </div>
            <div id="body" class="mb-5" v-html="$sanitize(content.body)" />
            <div class="divider mb-5" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'
import imageCompression from '~/plugins/browser-image-compression'
import firebase from '~/plugins/firebase'
import MsgPopup, { MsgPopupType } from '~/components/common/msgPopup.vue'

type PostType = {
  created_at: firebase.firestore.Timestamp | null
  updated_at: firebase.firestore.Timestamp | null
  published_at: firebase.firestore.Timestamp | null
  title: string
  top_img: string
  body: string
  status: 'draft' | 'public' | 'anonym' | 'private'
  public: boolean
  user_id: string
  user_img: string
  user_name: string
  profile: string
  likes: number
}

type DataType = {
  content: {
    createdAt: firebase.firestore.Timestamp | null
    updatedAt: firebase.firestore.Timestamp | null
    publishedAt: firebase.firestore.Timestamp | null
    title: string
    topImg: string
    body: string
    status: 'draft' | 'public' | 'anonym' | 'private'
    public: boolean
    userId: string
    userImg: string
    userName: string
    profile: string
    likes: number
  }
  customToolbar: any[]
  msgPopup: MsgPopupType
  statusOptions: any[]
  editorOptions: any
  saveBtn: string
  textChange: boolean
  preStatus: 'draft' | 'public' | 'anonym' | 'private'
  showModal: boolean
  uploadFiles: {
    topImg: File | null
    body: { file: File; url: string }[]
  }
  deleteFiles: string[]
}

export default Vue.extend({
  layout: 'user',
  components: {
    MsgPopup,
  },
  data(): DataType {
    return {
      content: {
        createdAt: null,
        updatedAt: null,
        publishedAt: null,
        title: '',
        topImg: '',
        body: '',
        status: 'draft',
        public: false,
        userId: '',
        userImg: '',
        userName: '',
        profile: '',
        likes: 0,
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
      msgPopup: { message: '', isSpinner: false, variant: '' },
      statusOptions: [
        { value: 'draft', text: '下書き', btn: '下書き保存' },
        { value: 'public', text: '公開', btn: '保存して公開' },
        { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
      ],
      editorOptions: {},
      saveBtn: '',
      textChange: false,
      // 変更前のステータス
      preStatus: 'draft',
      showModal: false,
      // body[{file: null, url: ""}]
      uploadFiles: { topImg: null, body: [] },
      // storageから削除予定の画像URL
      deleteFiles: [],
    }
  },
  computed: {
    setCount(): number {
      if (!this.content.body) {
        return 0
      }
      return this.content.body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
        .length
    },
  },
  created() {
    if (process.client) {
      window.addEventListener('beforeunload', this.checkWindow)
      // スマホの場合は文字選択でツールバーが出る
      if (window.innerWidth <= 480) {
        this.editorOptions = {
          theme: 'bubble',
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.checkWindow)
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteLeave(to, from, next) {
    if (this.textChange) {
      const ans = window.confirm(
        '変更が保存されていません。本当に移動しますか？'
      )
      if (ans) {
        next()
      }
    } else {
      next()
    }
  },
  async mounted() {
    this.$store.dispatch('user/authRedirect')
    await this.getContent()
    this.setStatus()
    setTimeout(() => {
      this.textChange = false
    }, 500)
  },
  methods: {
    /**
     * タイトルを設定
     */
    setTitle(): string {
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
        const doc = await firebase
          .firestore()
          .collection('posts')
          .doc(this.$route.params.id)
          .get()
        if (doc.data()?.user_id === this.$store.state.user.id) {
          this.content = {
            createdAt: doc.data()?.created_at,
            updatedAt: doc.data()?.updated_at,
            publishedAt: doc.data()?.published_at,
            title: doc.data()?.title,
            topImg: doc.data()?.top_img,
            body: doc.data()?.body,
            status: doc.data()?.status,
            public: doc.data()?.public,
            userId: doc.data()?.user_id,
            userImg: doc.data()?.user_img,
            userName: doc.data()?.user_name,
            profile: doc.data()?.profile,
            likes: doc.data()?.likes,
          }
          this.preStatus = this.content.status
        } else {
          this.$router.push('/')
        }
      }
    },
    setStatus() {
      switch (this.content.status) {
        case 'draft':
          this.statusOptions = [
            { value: 'draft', text: '下書き', btn: '下書き保存' },
            { value: 'public', text: '公開', btn: '保存して公開' },
            { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
          ]
          break
        case 'public':
        case 'anonym':
        case 'private':
          this.statusOptions = [
            { value: 'public', text: '公開', btn: '保存して公開' },
            { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' },
            { value: 'private', text: '非公開', btn: '保存して非公開' },
          ]
          break
      }
      this.saveBtn = this.statusOptions.find(
        (el) => el.value === this.content.status
      ).btn
      if (['public', 'anonym'].includes(this.content.status)) {
        this.content.public = true
      } else {
        this.content.public = false
      }
    },
    changeStatus() {
      this.saveBtn = this.statusOptions.find(
        (el) => el.value === this.content.status
      ).btn
      if (['public', 'anonym'].includes(this.content.status)) {
        this.content.public = true
      } else {
        this.content.public = false
      }
      this.textChange = true
    },
    // ポップアップメッセージのリセット
    resetMsg() {
      this.msgPopup = { message: '', variant: '', isSpinner: false }
    },
    // 画像のアップロード
    async handleImageAdded(
      file: File,
      Editor: any,
      cursorLocation: any,
      resetUploader: any
    ) {
      if (!file.type.match(/^image\//g)) {
        this.msgPopup = {
          message: '画像以外はアップロードできません。',
          variant: 'danger',
        }
        return null
      }
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 590,
      }
      const resizeImg = await imageCompression(file, options)
      const url = await imageCompression.getDataUrlFromFile(resizeImg)
      this.uploadFiles.body.push({ file: resizeImg as File, url })
      Editor.insertEmbed(cursorLocation, 'image', url)
      resetUploader()
    },
    // トップ画像のアップロード
    async setTopImg() {
      if (this.uploadFiles.topImg) {
        // ストレージに保存されていれば削除の準備
        if (this.content.topImg.startsWith('https')) {
          this.deleteFiles.push(this.content.topImg)
        }
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 590,
        }
        const resizeImg = await imageCompression(
          this.uploadFiles.topImg,
          options
        )
        this.content.topImg = await imageCompression.getDataUrlFromFile(
          resizeImg
        )
        this.uploadFiles.topImg = resizeImg as File
        this.textChange = true
      }
    },
    /**
     * トップ画像の削除
     */
    deleteTopImg() {
      // ストレージに保存されていれば削除の準備
      if (this.content.topImg.startsWith('https')) {
        this.deleteFiles.push(this.content.topImg)
      } else {
        // アップロード準備の画像URLを削除
        this.uploadFiles.topImg = null
      }
      this.content.topImg = ''
    },
    // ストレージにある場合画像削除の準備
    handleImageRemoved(imageURL: string) {
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
    imageRemove(imageURL: string) {
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
      this.msgPopup = {
        message: '保存中です。',
        variant: 'info',
        isSpinner: true,
      }
      const timespamp = firebase.firestore.Timestamp.now()
      this.content.updatedAt = timespamp
      // 初公開の場合
      if (
        this.preStatus === 'draft' &&
        ['public', 'anonym'].includes(this.content.status)
      ) {
        this.content.publishedAt = timespamp
      }
      // 新規の場合
      if (this.$route.params.id === 'new') {
        this.content.createdAt = timespamp
        this.content.userId = this.$store.state.user.id
      }
      // 匿名投稿の場合
      if (this.content.status === 'anonym') {
        this.content.userName = '匿名さん'
        this.content.userImg = '/img/schizoid-chan.png'
        this.content.profile = ''
      } else {
        this.content.userName = this.$store.state.user.name
        this.content.userImg = this.$store.state.user.photoURL
        this.content.profile = this.$store.state.user.profile
      }

      // 画像のアップロード
      // トップ画像
      if (this.uploadFiles.topImg) {
        this.content.topImg = await this.uploadFile(this.uploadFiles.topImg)
      }
      // 本文画像
      for (const img of this.uploadFiles.body) {
        const url = await this.uploadFile(img.file as File)
        this.content.body = await this.content.body.replace(img.url, url)
      }
      // 削除画像の削除
      this.deleteFiles.forEach((url) => {
        this.imageRemove(url)
      })
      this.uploadFiles = { topImg: null, body: [] }
      this.deleteFiles = []
      const post: PostType = {
        created_at: this.content.createdAt,
        updated_at: this.content.updatedAt,
        published_at: this.content.publishedAt,
        title: this.content.title,
        top_img: this.content.topImg,
        body: this.content.body,
        status: this.content.status,
        public: this.content.public,
        user_id: this.content.userId,
        user_img: this.content.userImg,
        user_name: this.content.userName,
        profile: this.content.profile,
        likes: this.content.likes,
      }
      if (this.$route.params.id === 'new') {
        // 日付を使ったユニークID
        const postId =
          Math.random().toString(32).slice(-2) +
          Date.now().toString(32).substring(1)
        firebase
          .firestore()
          .collection('posts')
          .doc(postId)
          .set(post)
          .then(() => {
            this.msgPopupSuccess()
            this.textChange = false
            this.preStatus = this.content.status

            setTimeout(() => {
              this.$router.push('/posts/edit/' + postId)
            }, 1000)
          })
          .catch((error) => {
            this.msgPopupError()
            console.error(error)
          })
      } else {
        firebase
          .firestore()
          .collection('posts')
          .doc(this.$route.params.id)
          .set(post)
          .then(() => {
            this.msgPopupSuccess()
            this.textChange = false
            this.preStatus = this.content.status
            // DeepCopyで更新日時を反映
            this.content = JSON.parse(JSON.stringify(this.content))
          })
          .catch(() => {
            this.msgPopupError()
          })
        // ステータスタグのリセット
        this.setStatus()
      }
    },
    msgPopupSuccess() {
      this.msgPopup = {
        message: '保存しました。',
        variant: 'success',
      }
      setTimeout(() => {
        this.msgPopup = {
          message: '',
          variant: '',
        }
      }, 1000)
    },
    msgPopupError() {
      this.msgPopup = {
        message: 'エラーが発生しました。',
        variant: 'danger',
      }
    },
    checkWindow(event: any) {
      if (this.textChange) {
        event.preventDefault()
        event.returnValue = '変更が保存されていません。本当に移動しますか？'
      }
    },
    /**
     * ファイルのアップロード
     * @param {File} file
     * @returns ダウンロードURL
     */
    async uploadFile(file: File) {
      const fileName = Date.now() + '_' + file.name
      const ref = firebase.storage().ref()
      await ref.child('posts/' + fileName).put(file)
      console.log(`uploadfies ${fileName}`)
      const url = await ref.child('posts/' + fileName).getDownloadURL()
      return url
    },
  },
  head(): { title: string; link: any[] } {
    return {
      title: this.setTitle(),
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.quilljs.com/1.3.5/quill.bubble.css',
        },
      ],
    }
  },
})
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.1rem;
  font-weight: bold;
}

img#topImg {
  width: 90vw;
  height: 51.25vw;
  max-width: 590px;
  max-height: 336px;
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

h2#title {
  font-size: 2rem;
  font-weight: 500;
}

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
</style>
