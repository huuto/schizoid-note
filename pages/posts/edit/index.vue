<template>
  <div>
    <b-container class="pt-3" style="max-width:640px">
      <div>
        <b-alert
          id="msg-popup"
          dismissible
          :variant="msg_popup.variant"
          :show="msg_popup.message"
        >
          <b-spinner
            v-if="msg_popup.isSpinner"
            variant="primary"
            label="Spinning"
            small
            class="mr-3"
          ></b-spinner>
          {{ msg_popup.message }}</b-alert
        >
      </div>
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
          v-model="top_img"
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
          <vue-editor
            id="editor"
            v-model="content.body"
            use-custom-image-handler
            @image-added="handleImageAdded"
            @image-removed="handleImageRemoved"
            @text-change="text_change = true"
          />
        </no-ssr>
      </div>
    </b-container>
  </div>
</template>
<script>
import firebase from '~/plugins/firebase'

export default {
  layout: 'user',
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
      disp_created_at: null,
      disp_updated_at: null,
      disp_published_at: null,
      top_img: null,
      msg_popup: { message: null, isSpinner: false, variant: '' },
      status_options: [
        { value: 'draft', text: '下書き', btn: '下書き保存' },
        { value: 'public', text: '公開', btn: '保存して公開' },
        { value: 'anonym', text: '匿名公開', btn: '保存して匿名公開' }
      ],
      save_btn: '下書き保存',
      text_change: false,
      // 追加、削除された画像URL
      photo_url: { added: [], deleted: [] },
      showModal: false
    }
  },
  computed: {},
  created() {
    if (process.client) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener('beforeunload', this.checkWindow)
    }
  },
  async beforeDestroy() {
    window.removeEventListener('beforeunload', this.checkWindow)
    // 追加した画像の削除
    await this.photo_url.added.forEach((url) => {
      this.imageRemove(url)
    })
    // 削除した画像は削除しない
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
    this.text_change = false
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
      const fileName = Date.now() + '_' + file.name
      const ref = firebase.storage().ref()
      await ref.child('posts/' + fileName).put(file)

      this.msg_popup = {
        message: '画像を保存中です。',
        variant: 'info',
        isSpinner: true
      }
      await setTimeout(() => {
        firebase
          .storage()
          .refFromURL(
            'gs://schizoid-note.appspot.com/posts/' + this.$resizeImg(fileName)
          )
          .getDownloadURL()
          .catch(() => {
            this.msg_popup = {
              message: '画像をアップロードできませんでした。',
              variant: 'danger',
              isSpinner: false
            }
          })
          .then((getUrl) => {
            setTimeout(() => {
              Editor.insertEmbed(cursorLocation, 'image', getUrl)
              resetUploader()
              this.photo_url.added.push(getUrl)
            }, 500)
          })
        this.resetMsg()
      }, 4000)
    },
    // トップ画像のアップロード
    async setTopImg() {
      if (this.top_img !== null) {
        const fileName = Date.now() + '_' + this.top_img.name
        const ref = firebase.storage().ref()
        await ref.child('posts/' + fileName).put(this.top_img)

        this.msg_popup = {
          message: '画像を保存中です。',
          variant: 'info',
          isSpinner: true
        }
        await setTimeout(() => {
          firebase
            .storage()
            .refFromURL(
              'gs://schizoid-note.appspot.com/posts/' +
                this.$resizeImg(fileName)
            )
            .getDownloadURL()
            .then((getUrl) => {
              setTimeout(() => {
                if (this.content.top_img)
                  this.photo_url.deleted.push(this.content.top_img)
                this.content.top_img = getUrl
                this.photo_url.added.push(getUrl)
                this.text_change = true
              }, 500)
            })
            .catch(() => {
              this.msg_popup = {
                message: '画像をアップロードできませんでした。',
                variant: 'danger',
                isSpinner: false
              }
            })
          this.resetMsg()
        }, 4000)
      }
    },
    // テキスト上からの画像削除
    handleImageRemoved(imageURL) {
      this.photo_url.deleted.push(imageURL)
    },
    // 本当に画像削除
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
    save() {
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
      firebase
        .firestore()
        .collection('posts')
        .add(this.content)
        .then((docRef) => {
          this.msg_popup = {
            message: '保存しました。',
            variant: 'success',
            isSpinner: false
          }

          this.text_change = false
          this.preStatus = this.content.status
          // テキストから削除した画像を本当に削除
          this.photo_url.deleted.forEach((url) => {
            this.imageRemove(url)
          })
          this.photo_url.added = []
          this.photo_url.deleted = []

          setTimeout(() => {
            this.$router.push('/posts/edit/' + docRef.id)
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
    checkWindow(event) {
      if (this.text_change) {
        event.preventDefault()
        event.returnValue = '変更が保存されていません。本当に移動しますか？'
      }
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

#msg-popup {
  position: fixed;
  z-index: 100;
  top: 0px;
  width: 38rem;
  max-width: 100%;
}
</style>
