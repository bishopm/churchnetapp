<template>
  <div class="text-center q-mt-lg" v-if="$store.state.user">
    <p v-if="$store.state.user.name" class="caption">Welcome, {{$store.state.user.name}}</p>
    <div v-if="$store.getters.hasEntity('districts')">
      <b>District permissions</b>
      <p v-for="district in $store.state.user['districts'].full" :key="district.id">
        {{district.district}} [{{district.pivot.permission}}]
      </p>
    </div>
    <div v-if="$store.getters.hasEntity('circuits')">
      <b>Circuit permissions</b>
      <p v-for="circuit in $store.state.user['circuits'].full" :key="circuit.id">
        {{circuit.circuit}} [{{circuit.pivot.permission}}]
      </p>
    </div>
    <div v-if="$store.getters.hasEntity('societies')">
      <b>Society permissions</b>
      <p v-for="society in $store.state.user['societies'].full" :key="society.id">
        {{society.society}} [{{society.pivot.permission}}]
      </p>
    </div>
    <div class="q-ma-md" v-if="!$store.getters.hasEntity('societies') && !$store.getters.hasEntity('circuits') && !$store.getters.hasEntity('disricts')">
      You still need to be given permission to access specific societies, circuits or districts
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style>
</style>
