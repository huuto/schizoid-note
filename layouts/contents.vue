<template>
  <div>
    <Header />
    <ContentsHeader class="mb-5" />
    <nuxt />
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
    ContentsHeader
  },
  data() {
    return {}
  }
}
</script>

<style></style>
