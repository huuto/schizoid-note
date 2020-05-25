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
      />
      <span v-html="msgPopup.message" />
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export type MsgPopupType = {
  message: string
  variant: '' | 'success' | 'info' | 'danger'
  isSpinner?: boolean
}

export default Vue.extend({
  props: {
    msgPopup: {
      type: Object as PropType<MsgPopupType>,
      default: null,
    },
  },
})
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
