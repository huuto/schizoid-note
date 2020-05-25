<template>
  <div class="">
    <b-container style="max-width: 940px;" class="mx-auto">
      <b-row class="">
        <b-col cols="12">
          <New />
        </b-col>
        <!-- <b-col cols="12" md="8">
          New />
        </b-col> -->
        <!-- <b-col cols="12" md="4">
          <Favorite />
        </b-col> -->
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import New from '~/components/pages/index/new.vue'
// import Favorite from '~/components/pages/index/favorite.vue'

export type Head = {
  titleTemplate: string
  title: string
}

export default Vue.extend({
  layout: 'contents',
  components: {
    New,
    // Favorite
  },
  head(): Head {
    return {
      titleTemplate: '%s',
      title: 'スキゾイド帳',
    }
  },
})
</script>

<style></style>
