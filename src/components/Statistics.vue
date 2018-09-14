<template>
  <div>
    <h4 class="text-center">Stats</h4>
    <p v-for = "society in $store.state.user.societies.full" :key="society.id">
      {{society.society}}
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
