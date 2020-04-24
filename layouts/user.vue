<template>
  <div>
    <Header />
    <UserHeader class="mb-5" />
    <nuxt style="min-height:90vh" />
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/layouts/header.vue'
import Footer from '~/components/layouts/footer.vue'
import UserHeader from '~/components/layouts/userHeader.vue'

export default {
  components: {
    Header,
    Footer,
    UserHeader
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('authStateChanged')
  }
}
</script>

<style></style>
