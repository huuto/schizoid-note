<template>
  <div>
    <Header />
    <UserHeader class="mb-5" />
    <nuxt style="min-height: 90vh;" />
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/layouts/defaultHeader.vue'
import Footer from '~/components/layouts/defaultFooter.vue'
import UserHeader from '~/components/layouts/userHeader.vue'

export default {
  components: {
    Header,
    Footer,
    UserHeader
  },
  data () {
    return {}
  },
  mounted () {
    this.$store.dispatch('user/authStateChanged')
  }
}
</script>

<style></style>
