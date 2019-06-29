<template>
<q-select outlined @filter="filterFn" v-model="society" @input="updateme" class="q-my-md" label="Society" :options="filteredOptions"  map-options use-input emit-value clearable>
  <template v-slot:no-option>
    <q-item>
      <q-item-section class="text-grey">
        No results
      </q-item-section>
    </q-item>
  </template>
</q-select>
</template>

<script>
export default {
  data () {
    return {
      society: '',
      societyOptions: [],
      filteredOptions: []
    }
  },
  props: ['showme', 'perms'],
  mounted () {
    if (this.$store.state.user.level === 1) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/denominations/1/societies')
        .then(response => {
          for (var sndx in response.data) {
            this.societyOptions.push({ 'label': response.data[sndx].society + ' (' + response.data[sndx].circuit + ')', 'value': response.data[sndx].society_id })
          }
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    } else {
      for (var skey in this.$store.state.user.societies.full) {
        if (this.perms.includes(this.$store.state.user.societies.full[skey].pivot.permission)) {
          var newitem = {
            label: this.$store.state.user.societies.full[skey].society,
            value: this.$store.state.user.societies.full[skey].id
          }
          this.societyOptions.push(newitem)
        }
      }
    }
    this.filteredOptions = this.societyOptions
    this.society = this.societyOptions[0].value
    this.$store.commit('setSelect', this.society)
  },
  methods: {
    updateme () {
      this.$store.commit('setSelect', this.society)
      this.$emit('altered')
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filteredOptions = this.societyOptions
        } else {
          this.filteredOptions = []
          for (var fndx in this.societyOptions) {
            if (this.societyOptions[fndx].label.toLowerCase().includes(val.toLowerCase())) {
              this.filteredOptions.push(this.societyOptions[fndx])
            }
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
