const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

/**
 * ユーザー名、ユーザー画像、プロフィール更新を全記事に反映
 */
exports.updateUser = functions.firestore
  .document('users/{id}')
  .onUpdate(async (change, context) => {
    const snap = await db
      .collection('posts')
      .where('user_id', '==', context.params.id)
      .get()
    const posts = []
    snap.forEach((doc) => {
      // 匿名投稿でなければ
      if (doc.data().status !== 'anonym') {
        posts.push(doc.data())
      }
    })
    posts.forEach((post) => {
      db.collection('posts').doc(post.id).update({
        profile: post.profile,
        user_name: post.user_name,
        user_img: post.user_img,
      })
    })
  })
