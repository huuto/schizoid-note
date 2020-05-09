<template>
  <div>
    <Header />
    <ContentsHeader class="mb-5" />
    <nuxt style="min-height: 90vh;" />
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/layouts/header.vue'
import Footer from '~/components/layouts/footer.vue'
import ContentsHeader from '~/components/layouts/contentsHeader.vue'

export default {
  components: {
    Header,
    Footer,
    ContentsHeader,
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('authStateChanged')
    console.log(process.env.VUE_APP_apiKey)
  },
}
</script>

<style></style>
