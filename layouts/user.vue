<template>
  <div>
    <DefaultHeader />
    <UserHeader class="mb-5" />
    <nuxt style="min-height: 90vh;" />
    <DefaultFooter />
  </div>
</template>

<script>
import DefaultHeader from '~/components/layouts/defaultHeader.vue'
import DefaultFooter from '~/components/layouts/defaultFooter.vue'
import UserHeader from '~/components/layouts/userHeader.vue'

export default {
  components: {
    DefaultHeader,
    DefaultFooter,
    UserHeader,
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('user/authStateChanged')
  },
}
</script>

<style></style>
