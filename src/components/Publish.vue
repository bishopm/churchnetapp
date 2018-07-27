<template>
  <div class="layout-padding">
    <p class="caption text-center">Publish content</p>
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
export default {
  data () {
    return {
      title: '',
      body: ''
    }
  }
}
</script>

<style>
</style>
