<template>
  <div class="">
    <b-container>
      <b-row>
        <b-col cols="12" md="8">
          <New />
        </b-col>
        <b-col cols="12" md="4">
          <Favorite />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import New from '~/components/index/new.vue'
import Favorite from '~/components/index/favorite.vue'
export default {
  layout: 'contents',
  components: {
    New,
    Favorite
  }
}
</script>

<style></style>
