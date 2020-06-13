<template>
  <div>
    <DefaultHeader />
    <ContentsHeader class="mb-5" />
    <nuxt style="min-height: 90vh;" />
    <DefaultFooter />
  </div>
</template>

<script>
import DefaultHeader from '~/components/layouts/defaultHeader.vue'
import DefaultFooter from '~/components/layouts/defaultFooter.vue'
import ContentsHeader from '~/components/layouts/contentsHeader.vue'

export default {
  components: {
    DefaultHeader,
    DefaultFooter,
    ContentsHeader,
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('user/authStateChanged')
    console.log(process.env.VUE_APP_apiKey)
  },
}
</script>

<style></style>
