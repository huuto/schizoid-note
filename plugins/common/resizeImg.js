import Vue from 'vue'

// サイズ変換後の画像ファイル名
Vue.prototype.$resizeImg = (filename) => {
  const splitStr = filename.split(/(\.[^.0-9]+$)/)
  const sizeStr = '_' + 600 + 'x' + 1000
  return splitStr[0] + sizeStr + splitStr[1]
}
