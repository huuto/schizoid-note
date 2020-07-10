const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

exports.deleteUser = functions.firestore
  .document('users/{id')
  .onDelete(async (_snap, context) => {
    // 全記事取得
    const posts = await db
      .collection('posts')
      .where('user_id', '==', context.params.id)
      .get()
    // 画像の取得
    const imgs = []
    posts.forEach((post) => {
      // トップ画像
      if (post.data().top_img) imgs.push(post.data().top_img)
      // 本文内画像
      imgs.concat(
        post
          .data()
          .body?.match(/<img src="https[^"]*"/g)
          ?.map((text) => text.substring(10, text.length - 1))
      )
    })
    // 画像の削除
    if (imgs) {
      for (const img of imgs) {
        admin
          .storage()
          .refFromURL(img)
          .delete()
          .catch((e) => {
            console.log('error: image delete ' + img + '\n' + e)
          })
        console.log('success: image delete ' + img)
      }
    }
    // いいねの削除
    posts.forEach(async (post) => {
      const querySnapshot = await db
        .collection('likes')
        .where('post_id', '==', post.data().id)
        .get()
      querySnapshot
        .forEach((doc) => {
          doc.ref.delete()
        })
        .catch((e) => {
          console.log('error: like delete\n' + e)
        })
    })
    // 記事の削除
    posts
      .forEach((post) => {
        post.ref.delete()
      })
      .catch((e) => {
        console.log('error: posts delete\n' + e)
      })
  })

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
        posts.push(doc)
      }
    })
    posts.forEach((post) => {
      const user = change.after.data()
      db.collection('posts').doc(post.id).update({
        profile: user.profile,
        user_name: user.user_name,
        user_img: user.user_img,
      })
    })
  })

/**
 * いいね作成時
 */
exports.setLike = functions.firestore
  .document('likes/{id}')
  .onCreate((snap) => {
    db.collection('posts')
      .doc(snap.data().post_id)
      .update({ likes: admin.firestore.FieldValue.increment(1) })
  })

/**
 * いいね削除時
 */
exports.deleteLike = functions.firestore
  .document('likes/{id}')
  .onDelete(async (snap) => {
    const post = await db.collection('posts').doc(snap.data().post_id)
    if ((await post.get()).data()) {
      post.update({ likes: admin.firestore.FieldValue.increment(-1) })
    }
  })
