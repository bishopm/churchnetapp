<template>
  <div class="q-ma-md">
    <h5 class="text-center">App settings <small>(v{{version}})</small></h5>
  </div>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  data () {
    return {
      version: ''
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
    if (localStorage.getItem('CHURCHNET_Version')) {
      this.version = localStorage.getItem('CHURCHNET_Version')
    }
  }
}
</script>

<style>
.q-ma-md {
  padding-top:0;
}
p {
  margin-bottom: 0;
}
h3 {
  line-height:0px;
}
</style>
