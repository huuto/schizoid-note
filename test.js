const moji =
  '<p>hhhhhhhhhhhhhhhhaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa　aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa　a　aa　aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p><p><br></p><p><br></p><p><br></p><p><img src="https://firebasestorage.googleapis.com/v0/b/schizoid-note-test.appspot.com/o/posts%2F1591500310031__c_chojudaD0016_s512_chojudaD0016_0.png?alt=media&amp;token=71584aee-ff87-4e0f-9190-ce1a25bff272"></p><p>akasidihannhijijああああかあかあいじゃいあいひｃｈ</p><p><br></p><p><br></p><h3>かかかｋぁはいｊひｈんしｈしｊにｊ</h3><p><br></p><p>ｋｊｊっじゃかあかっかｋ</p><p><br></p><p><br></p><p><img src="https://firebasestorage.googleapis.com/v0/b/schizoid-note-test.appspot.com/o/posts%2F1593843976016__c_choju23_0029_s512_choju23_0029_11.png?alt=media&amp;token=c374d325-24c2-4717-a599-7bf137befc25"></p><ol><li>ああああ</li><li>ああああああああ</li><li>うううう</li></ol><p><img src="https://firebasestorage.googleapis.com/v0/b/schizoid-note-test.appspot.com/o/posts%2F1593843977248__c_choju29_0007_s512_choju29_0007_10.png?alt=media&token=b5d9de2c-55fb-4e4c-81cb-4e54e6abc9ea"></p>'

const imgs = moji
  .match(/<img src="https[^"]*"/g)
  ?.map((text) => text.substring(10, text.length - 1))
if (imgs) {
  for (const img of imgs) {
    setTimeout(() => {
      console.log(img)
    }, 2000)
  }
}
