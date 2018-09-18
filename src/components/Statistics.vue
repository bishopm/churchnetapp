<template>
  <div>
    <h4 class="text-center">Worship attendance statistics</h4>
    <q-list class="no-border">
      <q-item v-if="$store.state.user" v-for="society in $store.state.user.societies.full" :key="society.id" :to="'/statistics/' + society.id + '/' + (new Date()).getFullYear()">
        {{society.society}}
      </q-item>
    </q-list>
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
