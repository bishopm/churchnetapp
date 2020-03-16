<template>
  <div class="q-ma-md">
    The lectionary readings will always be displayed for each Sunday. Here you can add additional readings
    <span class="title">Add a reading</span>
    <q-select outlined :value="model" use-input hide-selected fill-input input-debounce="0" :options="bookOptions" @filter="filterFn" @input-value="setModel" title="Text autocomplete" style="width: 250px; padding-bottom: 32px">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null,
      bookOptions: [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
        'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans'
      ]
    }
  },
  mounted () {
  },
  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLocaleLowerCase()
        this.bookOptions = this.bookOptions.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
      })
    },
    setModel (val) {
      this.model = val
    }
  }
}
</script>

<style>
</style>
