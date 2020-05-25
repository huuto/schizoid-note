<template>
  <b-container class="my-5" style="max-width: 640px;">
    <h1 v-if="error.statusCode === 404">
      404 Not Found<br />
      このページは存在しません。
    </h1>
    <h1 v-else>
      {{ error.statusCode }}<br />
      エラーが発生しました。
    </h1>
    <NuxtLink to="/">
      ホームに戻る
    </NuxtLink>
  </b-container>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'このページは存在しません',
      otherError: 'エラーが発生しました',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 1.75rem;
}
a {
  font-size: 1.25rem;
}
</style>
