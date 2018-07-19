<template>
  <div class="layout-padding">
    <h3 class="text-center">App settings</h3>
  </div>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  data () {
    return {
    }
  },
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'JOURNEY_Settings'
      }
    }
  },
  mounted () {
    localStorage.setItem('CHURCHNET_user_id', 1)
  }
}
</script>

<style>
.layout-padding {
  padding-top:0;
}
p {
  margin-bottom: 0;
}
h3 {
  line-height:0px;
}
</style>
