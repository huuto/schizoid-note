<template>
  <div>
    <no-ssr>
      <div id="editorWrap">
        <vue-editor
          id="editor"
          v-model="body"
          use-custom-image-handler
          :editor-toolbar="customToolbar"
          :editor-options="editorOptions"
          @image-added="handleImageAdded"
          @image-removed="handleImageRemoved"
          @text-change="text_change = true"
        />
      </div>
    </no-ssr>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
import 'quill/dist/quill.bubble.css'
export default {
  props: {
    body: {
      type: String,
      default: ''
    },
    textChange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      customToolbar: [
        ['bold', 'italic', 'underline'], // toggled buttons
        ['blockquote'],

        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean']
      ],
      editorOptions: {}
    }
  },
  mounted() {
    // スマホの場合は文字選択でツールバーが出る
    if (window.innerWidth <= 480) {
      this.editorOptions = {
        theme: 'bubble'
      }
    }
  },
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
