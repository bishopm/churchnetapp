<template>
  <div class="text-center q-mt-lg">
    <p class="caption">Welcome!</p>
    <p v-if="$store.state.user">You are logged in as <b>{{$store.state.user.name}}</b> with the following permission level: <b>{{$store.state.user.level}}</b></p>
  </div>
</template>

<script>
export default {
  methods: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>

<style>
</style>
