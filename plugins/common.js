const hoge = () => {
  return null
}

export default ({}, inject) => {
  inject('hoge', hoge)
}
