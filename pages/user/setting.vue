<template>
  <b-container class="my-3">
    <b-container class="bg-white p-3" style="max-width: 640px">
      <MsgPopup :msg-popup="msgPopup" />
      <div style="max-width: 400px" class="m-auto">
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
              />
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
              />
              <label for="passwordConfimation">確認用パスワード</label>
              <b-form-input
                id="passwordConfimation"
                v-model="user.passwordConfimation"
                type="password"
                class="mb-3"
              />
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
            <div>ユーザーを削除します。よろしいですか？</div>
          </b-modal>
        </div>
        <div class="text-center" style="margin: 3vh 0 5vh 0">
          <h2>アカウント設定</h2>
        </div>
        <b-form>
          <b-form-group>
            <div class="text-center my-3" style="position: relative">
              <div v-if="!twitterLogin">
                <label for="photoURL" style="cursor: pointer">
                  <b-avatar :src="user.photoURL" size="5rem" variant="light" />
                  <i id="avatar" class="fas fa-plus-circle fa-lg photoURL" />
                  <b-form-file
                    id="photoURL"
                    v-model="photoFile"
                    style="display: none"
                    @input="editPhotoURL()"
                  />
                </label>
              </div>
              <div v-else>
                <b-avatar :src="user.photoURL" size="5rem" variant="light" />
              </div>
            </div>
            <div v-show="!twitterLogin">
              <label for="email">メールアドレス</label>
              <div class="mb-4 d-flex ml-2">
                <div>
                  {{ user.email }}
                </div>
                <b-link class="ml-auto email" @click="showEmailModal = true">
                  <i class="fas fa-edit fa-lg" />
                </b-link>
              </div>
              <label for="password">パスワード</label>
              <div class="mb-4 d-flex ml-2">
                <div>**********</div>
                <b-link
                  class="ml-auto password"
                  @click="showPasswordModal = true"
                >
                  <i class="fas fa-edit fa-lg" />
                </b-link>
              </div>
            </div>
            <label for="name">ユーザー名</label>
            <b-form-input
              id="name"
              v-model="user.name"
              type="text"
              required
              class="mb-3"
            />
            <label for="profile">紹介文</label>
            <b-form-textarea
              id="profile"
              v-model="user.profile"
              rows="4"
              class="mb-3"
            />
          </b-form-group>
          <div class="text-center mb-3">
            <b-button variant="primary" style="" @click="edit()">
              変更
            </b-button>
          </div>
          <div class="text-center">
            <b-button
              variant="link"
              style="color: #707070"
              to="posts"
              class="mb-5"
            >
              戻る
            </b-button>
          </div>
          <div class="text-center">
            <b-button
              variant="link"
              style="color: #ff6565"
              @click="showDeleteModal = true"
            >
              アカウント削除
            </b-button>
          </div>
        </b-form>
      </div>
    </b-container>
  </b-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'
import imageCompression from 'browser-image-compression'
import firebase from '~/plugins/firebase'
import MsgPopup, { MsgPopupType } from '~/components/common/msgPopup.vue'

type StoreUserType = {
  user_img?: string
  user_name?: string
  profile?: string
}

type DataType = {
  user: {
    id: string
    photoURL: string
    name: string
    profile: string
    password: string
    passwordConfimation: string
    email: string
  }
  twitterLogin: boolean
  photoFile: File | null
  msgPopup: MsgPopupType
  showEmailModal: boolean
  showPasswordModal: boolean
  showDeleteModal: boolean
  preEmail: string
}

export default Vue.extend({
  layout: 'user',
  components: {
    MsgPopup,
  },
  data(): DataType {
    return {
      user: {
        id: '',
        photoURL: '',
        name: '',
        profile: '',
        password: '',
        passwordConfimation: '',
        email: '',
      },
      twitterLogin: false,
      photoFile: null,
      msgPopup: { message: '', isSpinner: false, variant: '' },
      showEmailModal: false,
      showPasswordModal: false,
      showDeleteModal: false,
      preEmail: '',
    }
  },
  created() {
    if (process.client) {
      this.$store.dispatch('user/authRedirect')
    }
  },
  mounted() {
    this.getCurrentUser()
  },
  methods: {
    /**
     * Twitterログインを区別するためプロバイダー取得
     */
    getCurrentUser() {
      firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
        if (user) {
          this.user = {
            id: user.uid,
            photoURL: user.photoURL as string,
            name: user.displayName as string,
            profile: '',
            password: '',
            passwordConfimation: '',
            email: user.email as string,
          }
          user.providerData.forEach((profile) => {
            if (profile?.providerId === 'twitter.com') {
              this.twitterLogin = true
            }
          })
        }
        this.getProfile()
      })
    },
    getProfile() {
      firebase
        .firestore()
        .collection('users')
        .doc(this.user.id)
        .get()
        .then((doc) => {
          this.user.profile = doc.data()?.profile
        })
    },
    async edit() {
      try {
        await firebase.auth()?.currentUser?.updateProfile({
          displayName: this.user.name,
        })
        this.msgPopup = {
          message: 'アカウント設定を変更しました。',
          variant: 'success',
        }
        this.updateStoreUser({
          user_name: this.user.name,
          profile: this.user.profile,
        })
      } catch (error) {
        this.msgPopup = {
          message: 'アカウント設定を変更できませんでした。',
          variant: 'danger',
        }
        console.error(error)
      }
    },
    async editEmail() {
      try {
        await firebase.auth()?.currentUser?.updateEmail(this.user.email)
        this.msgPopup = {
          message: 'メールアドレスを変更しました。',
          variant: 'success',
        }
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          this.msgPopup = {
            message: `直近のログインが無かったため、メールアドレスを変更できませんでした。<br>
                ログアウト後、再度ログインしてください。`,
            variant: 'danger',
          }
        } else {
          this.msgPopup = {
            message: 'メールアドレスを変更できませんでした。',
            variant: 'danger',
          }
        }
        this.user.email = this.preEmail
        console.error(error)
      }
    },
    async editPassword() {
      if (this.user.password !== this.user.passwordConfimation) {
        this.msgPopup = {
          message:
            '新規パスワードと確認用パスワードが一致しません。もう一度お試しください。',
          variant: 'danger',
        }
      } else {
        try {
          await firebase.auth()?.currentUser?.updatePassword(this.user.password)
          this.msgPopup = {
            message: 'パスワードを変更しました。',
            variant: 'success',
          }
        } catch (error) {
          if (error.code === 'auth/requires-recent-login') {
            this.msgPopup = {
              message: `直近のログインが無かったため、パスワードを変更できませんでした。<br>
                ログアウト後、再度ログインしてください。`,
              variant: 'danger',
            }
          } else if (error.code === 'auth/weak-password') {
            this.msgPopup = {
              message: 'パスワードは6文字以上にしてください。',
              variant: 'danger',
            }
          } else {
            this.msgPopup = {
              message: 'パスワードを変更できませんでした。',
              variant: 'danger',
            }
          }
          console.error(error)
        }
      }
      this.user.password = ''
      this.user.passwordConfimation = ''
    },
    editPhotoURL() {
      this.setPhotoURL()
    },
    // トップ画像のアップロード
    async setPhotoURL() {
      this.msgPopup = {
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
            this.msgPopup = {
              message: '画像を変更できませんでした。',
              variant: 'danger',
            }
            console.error(error)
          })
        const url = await ref
          .child('users/' + fileName)
          .getDownloadURL()
          .catch((error) => {
            this.msgPopup = {
              message: '画像を変更できませんでした。',
              variant: 'danger',
            }
            console.error(error)
          })
        if (this.msgPopup.variant !== 'danger') {
          // 以前の画像を削除
          if (this.user.photoURL) {
            this.imageRemove(this.user.photoURL)
          }
          await firebase.auth()?.currentUser?.updateProfile({ photoURL: url })
          this.user.photoURL = url
          this.msgPopup = {
            message: '画像を変更しました。',
            variant: 'success',
          }
          this.updateStoreUser({ user_img: this.user.photoURL })
        }
      }
    },
    // 画像削除
    imageRemove(imageURL: string) {
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
    /**
     * ユーザー周り更新時はStoreのユーザーにも反映
     */
    updateStoreUser(update: StoreUserType) {
      firebase.firestore().collection('users').doc(this.user.id).update(update)
    },
    // ポップアップメッセージのリセット
    resetMsg() {
      this.msgPopup = { message: '', variant: '', isSpinner: false }
    },
    async deleteUser() {
      try {
        await firebase.auth()?.currentUser?.delete()
        this.msgPopup = {
          message: 'ユーザーを削除しました。',
          variant: 'success',
        }
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          this.msgPopup = {
            message: `直近のログインが無かったため、ユーザーを削除できませんでした。
                ログアウト後、再度ログインしてください。`,
            variant: 'danger',
          }
        } else {
          this.msgPopup = {
            message: 'ユーザーを削除できませんでした。',
            variant: 'danger',
          }
        }
      }
    },
  },
  head() {
    return {
      title: 'アカウント設定',
    }
  },
})
</script>

<style lang="scss" scoped>
button {
  width: 180px;
  height: 40px;
}
a.email,
a.password,
.photoURL {
  color: $icon-color;
  &:hover {
    color: $icon-color-hover;
  }
}
#avatar {
  position: absolute;
  right: 9rem;
  top: -0.5rem;
}
</style>
