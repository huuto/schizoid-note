const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

const functionsRegion = functions.region('asia-northeast1')
const logger = functions.logger

/**
 * ユーザー削除時に記事も削除
 */
// exports.deleteUser = functionsRegion.firestore
//   .document('users/{id}')
//   .onDelete(async (_snap, context) => {
//     // 全記事取得
//     const posts = await db
//       .collection('posts')
//       .where('user_id', '==', context.params.id)
//       .get()
//     // 記事の削除
//     posts
//       .forEach((post) => {
//         post.ref.delete()
//         logger.log(`post ${post.id} is deleted!`)
//       })
//       .catch((e) => {
//         logger.error(`post ${post.id} is deleted!`)
//       })  

//   })

/**
 * ユーザー名、ユーザー画像、プロフィール更新を全記事に反映
 */
exports.updateUser = functionsRegion.firestore
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
 * 記事削除時
 */
// exports.deletePost = functionsRegion.firestore
//   .document('posts/{id}')
//   .onDelete(async (snap, context) => {
//     const post = snap.data()
//     // 画像の取得
//     const imgs = []
//     // トップ画像
//     if (post.top_img) imgs.push(post.top_img)

//     // 本文内画像
//     let bodyImgs = post.body.match(/<img src="https[^"]*"/g)
//     if(bodyImgs) bodyImgs = bodyImgs.map((text) => text.substring(10, text.length - 1))
//     await imgs.concat(bodyImgs)
//     // 画像の削除
//     for (const img of imgs) {
//       admin
//         .storage()
//         .refFromURL(img)
//         .delete()
//         .catch((e) => {
//           logger.error('image cant delete ' + img, e)
//         })
//         logger.log('image deleted! ' + img)
//     }
//     // いいねの削除
//     const querySnapshot = await db
//       .collection('likes')
//       .where('post_id', '==', context.params.id)
//       .get()
//     querySnapshot
//       .forEach((doc) => {
//         doc.ref.delete().catch((e) => {
//           logger.error('like cant delete', e)
//         })
//       })
//     // 記事の削除
//     snap.ref.delete().catch((e) => {
//       logger.error('post cant delete', e)
//     })
//   })

/**
 * いいね作成時
 */
exports.setLike = functionsRegion.firestore
  .document('likes/{id}')
  .onCreate((snap) => {
    db.collection('posts')
      .doc(snap.data().post_id)
      .update({ likes: admin.firestore.FieldValue.increment(1) })
  })

/**
 * いいね削除時
 */
exports.deleteLike = functionsRegion.firestore
  .document('likes/{id}')
  .onDelete(async (snap) => {
    const post = await db.collection('posts').doc(snap.data().post_id).get()
    if (post.data()) {
      post.update({ likes: admin.firestore.FieldValue.increment(-1) })
    }
  })

/**
 * ローカルテスト用HTTP
 */
// exports.deletePostTest = functionsRegion.https.onRequest(async (req, res) => {
//   let result = 'delete post ID:' + req.query.id
//   await db
//     .collection('posts')
//     .doc(req.query.id)
//     .delete()
//     .catch((e) => {
//       result = 'error delete post ID:' + req.query.id + ' ' + e
//     })
//   res.json({ result })
// })
