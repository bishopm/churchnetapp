<template>
  <div class="text-center q-mt-lg" v-if="$store.state.user">
    <p class="caption">Welcome, {{$store.state.user.name}}</p>
    <p>You have the following system permissions:</p>
    <div v-if="$store.getters.hasEntity('districts')">
      <b>Districts</b>
      <p v-for="district in $store.state.user['districts'].full" :key="district.id">
        {{district.district}} [{{district.pivot.permission}}]
      </p>
    </div>
    <div v-if="$store.getters.hasEntity('circuits')">
      <b>Circuits</b>
      <p v-for="circuit in $store.state.user['circuits'].full" :key="circuit.id">
        {{circuit.circuit}} [{{circuit.pivot.permission}}]
      </p>
    </div>
    <div v-if="$store.getters.hasEntity('societies')">
      <b>Societies</b>
      <p v-for="society in $store.state.user['societies'].full" :key="society.id">
        {{society.society}} [{{society.pivot.permission}}]
      </p>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style>
</style>
