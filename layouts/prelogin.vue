<template>
  <div class="content">
    <PreloginHeader />
    <nuxt />
  </div>
</template>

<script>
import PreloginHeader from '~/components/layouts/preloginHeader.vue'

export default {
  components: {
    PreloginHeader,
  },
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #f1f1f1;
  min-height: 100vh;
}
</style>
