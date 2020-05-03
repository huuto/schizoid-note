<template>
  <div>
    <b-alert
      id="msg-popup"
      dismissible
      :variant="msgPopup.variant"
      :show="msgPopup.message !== null && msgPopup.message !== ''"
    >
      <b-spinner
        v-if="msgPopup.isSpinner"
        variant="primary"
        label="Spinning"
        small
        class="mr-3"
      ></b-spinner>
      <span v-html="msgPopup.message">aaa</span></b-alert
    >
  </div>
</template>

<script>
export default {
  props: {
    msgPopup: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
#msg-popup {
  position: fixed;
  z-index: 100;
  top: 0px;
  width: 38rem;
  max-width: 100%;
}
</style>
