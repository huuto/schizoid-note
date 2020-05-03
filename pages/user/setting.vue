<template>
  <b-container class="my-3">
    <b-container class="bg-white p-3" style="max-width: 640px;">
      <MsgPopup :msg-popup="msg_popup" />
      <div style="max-width: 400px;" class="m-auto">
        <div>
          <b-modal
            id="public-modal"
            v-model="showEmailModal"
            title="メールアドレスを変更します。"
            ok-title="変更"
            cancel-title="キャンセル"
            @ok="editEmail()"
          >
            <div>
              <b-form-input
                id="email"
                v-model="user.email"
                type="text"
                required
                class="mb-3"
              ></b-form-input>
            </div>
          </b-modal>
          <b-modal
            id="public-modal-password"
            v-model="showPasswordModal"
            title="パスワードを変更します。"
            ok-title="変更"
            cancel-title="キャンセル"
            @ok="editPassword()"
          >
            <div>
              <label for="password">新規パスワード</label>
              <b-form-input
                id="password"
                v-model="user.password"
                type="password"
                class="mb-3"
              ></b-form-input>
              <label for="password_confimation">確認用パスワード</label>
              <b-form-input
                id="password_confimation"
                v-model="user.password_confimation"
                type="password"
                class="mb-3"
              ></b-form-input>
            </div>
          </b-modal>
          <b-modal
            id="public-modal-delete"
            v-model="showDeleteModal"
            hide-header
            ok-title="削除"
            ok-variant="danger"
            cancel-title="キャンセル"
            @ok="deleteUser()"
          >
            <div>
              ユーザーを削除します。よろしいですか？
            </div>
          </b-modal>
        </div>
        <div class="text-center" style="margin: 3vh 0 5vh 0;">
          <h2>アカウント設定</h2>
        </div>
        <b-form>
          <b-form-group>
            <div class="text-center my-3" style="position: relative;">
              <div v-if="!twitterLogin">
                <label for="photoURL" style="cursor: pointer;">
                  <b-avatar
                    :src="user.photoURL"
                    size="5rem"
                    variant="light"
                  ></b-avatar>
                  <i id="avatar" class="fas fa-plus-circle fa-lg photoURL"></i>
                  <b-form-file
                    id="photoURL"
                    v-model="photoFile"
                    style="display: none;"
                    @input="editPhotoURL()"
                  ></b-form-file>
                </label>
              </div>
              <div v-else>
                <b-avatar
                  :src="user.photoURL"
                  size="5rem"
                  variant="light"
                ></b-avatar>
              </div>
            </div>
            <div v-show="!twitterLogin">
              <label for="email">メールアドレス</label>
              <div class="mb-4 d-flex ml-2">
                <div>
                  {{ user.email }}
                </div>
                <b-link class="ml-auto email" @click="showEmailModal = true"
                  ><i class="fas fa-edit fa-lg"></i
                ></b-link>
              </div>
              <label for="password">パスワード</label>
              <div class="mb-4 d-flex ml-2">
                <div>
                  **********
                </div>
                <b-link
                  class="ml-auto password"
                  @click="showPasswordModal = true"
                  ><i class="fas fa-edit fa-lg"></i
                ></b-link>
              </div>
            </div>
            <label for="name">ユーザー名</label>
            <b-form-input
              id="name"
              v-model="user.name"
              type="text"
              required
              class="mb-3"
            ></b-form-input>
            <label for="profile">紹介文</label>
            <b-form-textarea
              id="profile"
              v-model="user.profile"
              rows="4"
              class="mb-3"
            ></b-form-textarea>
          </b-form-group>
          <div class="text-center mb-3">
            <b-button variant="primary" style="" @click="edit()">変更</b-button>
          </div>
          <div class="text-center">
            <b-button
              variant="link"
              style="color: #707070;"
              to="posts"
              class="mb-5"
              >戻る</b-button
            >
          </div>
          <div class="text-center">
            <b-button
              variant="link"
              style="color: #ff6565;"
              @click="showDeleteModal = true"
              >アカウント削除</b-button
            >
          </div>
        </b-form>
      </div>
    </b-container>
  </b-container>
</template>

<script>
import imageCompression from 'browser-image-compression'
import firebase from '~/plugins/firebase'
import MsgPopup from '~/components/common/msgPopup'

export default {
  layout: 'user',
  components: {
    MsgPopup,
  },
  data() {
    return {
      user: {
        id: '',
        photoURL: '',
        name: '',
        profile: '',
        password: '',
        password_confimation: '',
        email: '',
      },
      twitterLogin: false,
      photoFile: null,
      msg_popup: { message: null, isSpinner: false, variant: '' },
      showEmailModal: false,
      showPasswordModal: false,
      showDeleteModal: false,
      preEmail: '',
    }
  },
  created() {
    if (process.client) {
      this.$store.dispatch('authRedirect')
    }
  },
  mounted() {
    this.getCurrentUser()
  },
  methods: {
    /**
     * Twitterログインを区別するためプロバイダー取得
     */
    async getCurrentUser() {
      const user = await firebase.auth().currentUser
      this.user.id = user.uid
      this.user.photoURL = user.photoURL
      this.user.name = user.displayName
      this.user.email = user.email
      user.providerData.forEach((profile) => {
        if (profile.providerId === 'twitter.com') this.twitterLogin = true
      })
      this.getProfile()
    },
    getProfile() {
      firebase
        .firestore()
        .collection('users')
        .doc(this.user.id)
        .get()
        .then((doc) => {
          this.user.profile = doc.data().profile
        })
    },
    edit() {
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: this.user.name,
        })
        .then(() => {
          this.msg_popup = {
            message: 'アカウント設定を変更しました。',
            variant: 'success',
          }
        })
        .catch((error) => {
          this.msg_popup = {
            message: 'アカウント設定を変更できませんでした。',
            variant: 'danger',
          }
          console.error(error)
        })
      firebase
        .firestore()
        .collection('users')
        .doc(this.$store.state.user.id)
        .set({ profile: this.user.profile }, { merge: true })
        .then(() => {
          this.msg_popup = {
            message: 'アカウント設定を変更しました。',
            variant: 'success',
          }
        })
        .catch((error) => {
          this.msg_popup = {
            message: 'アカウント設定を変更できませんでした。',
            variant: 'danger',
          }
          console.error(error)
        })
    },
    editEmail() {
      firebase
        .auth()
        .currentUser.updateEmail(this.user.email)
        .then(() => {
          this.msg_popup = {
            message: 'メールアドレスを変更しました。',
            variant: 'success',
          }
        })
        .catch((error) => {
          if (error.code === 'auth/requires-recent-login') {
            this.msg_popup = {
              message: `直近のログインが無かったため、メールアドレスを変更できませんでした。<br>
                ログアウト後、再度ログインしてください。`,
              variant: 'danger',
            }
          } else {
            this.msg_popup = {
              message: 'メールアドレスを変更できませんでした。',
              variant: 'danger',
            }
          }
          this.user.email = this.preEmail
          console.error(error)
        })
    },
    editPassword() {
      if (this.user.password !== this.user.password_confimation) {
        this.msg_popup = {
          message:
            '新規パスワードと確認用パスワードが一致しません。もう一度お試しください。',
          variant: 'danger',
        }
      } else {
        firebase
          .auth()
          .currentUser.updatePassword(this.user.password)
          .then(() => {
            this.msg_popup = {
              message: 'パスワードを変更しました。',
              variant: 'success',
            }
          })
          .catch((error) => {
            if (error.code === 'auth/requires-recent-login') {
              this.msg_popup = {
                message: `直近のログインが無かったため、パスワードを変更できませんでした。<br>
                ログアウト後、再度ログインしてください。`,
                variant: 'danger',
              }
            } else if (error.code === 'auth/weak-password') {
              this.msg_popup = {
                message: `パスワードは6文字以上にしてください。`,
                variant: 'danger',
              }
            } else {
              this.msg_popup = {
                message: 'パスワードを変更できませんでした。',
                variant: 'danger',
              }
            }
            console.error(error)
          })
      }
      this.user.password = ''
      this.user.password_confimation = ''
    },
    editPhotoURL() {
      this.setPhotoURL()
    },
    // トップ画像のアップロード
    async setPhotoURL() {
      this.msg_popup = {
        message: '画像を保存中です。',
        variant: 'info',
        isSpinner: true,
      }
      if (this.photoFile) {
        const fileName = Date.now() + '_' + this.photoFile.name
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 200,
        }

        const resizeImg = await imageCompression(this.photoFile, options)
        const ref = firebase.storage().ref()
        await ref
          .child('users/' + fileName)
          .put(resizeImg)
          .catch((error) => {
            this.msg_popup = {
              message: '画像を変更できませんでした。',
              variant: 'danger',
            }
            console.error(error)
          })
        const url = await ref
          .child('users/' + fileName)
          .getDownloadURL()
          .catch((error) => {
            this.msg_popup = {
              message: '画像を変更できませんでした。',
              variant: 'danger',
            }
            console.error(error)
          })

        // 以前の画像を削除
        if (this.user.photoURL) this.imageRemove(this.user.photoURL)
        firebase.auth().currentUser.updateProfile({ photoURL: url })
        this.user.photoURL = url
        this.msg_popup = {
          message: '画像を変更しました。',
          variant: 'success',
        }
      }
    },
    // 画像削除
    imageRemove(imageURL) {
      firebase
        .storage()
        .refFromURL(imageURL)
        .delete()
        .then(() => {
          console.log('image delete ' + imageURL)
        })
        .catch(() => {
          console.error('error: image delete ' + imageURL)
        })
    },
    // ポップアップメッセージのリセット
    resetMsg() {
      this.msg_popup = { message: null, variant: '', isSpinner: false }
    },
    deleteUser() {
      firebase
        .auth()
        .currentUser.delete()
        .then(() => {
          this.msg_popup = {
            message: 'ユーザーを削除しました。',
            variant: 'success',
          }
        })
        .catch((error) => {
          if (error.code === 'auth/requires-recent-login') {
            this.msg_popup = {
              message: `直近のログインが無かったため、ユーザーを削除できませんでした。
                ログアウト後、再度ログインしてください。`,
              variant: 'danger',
            }
          } else {
            this.msg_popup = {
              message: 'ユーザーを削除できませんでした。',
              variant: 'danger',
            }
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
a.email,
.password,
.photoURL {
  color: #747474;
  &:hover {
    color: #474747;
  }
}
#avatar {
  position: absolute;
  right: 9rem;
  top: -0.5rem;
}
</style>
