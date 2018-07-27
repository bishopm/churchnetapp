<template>
  <div class="layout-padding">
    <p class="caption text-center">Publish content</p>
    <societyfilter></societyfilter>
    <circuitfilter></circuitfilter>
    <q-input class="q-mb-md" float-label="Title" v-model="title" />
    <q-editor v-model="body" :toolbar="[
      ['bold', 'italic', 'underline'],
      ['hr', 'link'],
      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
      [
      {
        label: 'Headings',
        list: 'no-icons',
        options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      }
    ],
    ]"/>
  </div>
</template>

<script>
import societyfilter from './Societyfilter'
import circuitfilter from './Circuitfilter'
export default {
  data () {
    return {
      title: '',
      body: ''
    }
  },
  components: {
    'circuitfilter': circuitfilter,
    'societyfilter': societyfilter
  }
}
</script>

<style>
</style>
