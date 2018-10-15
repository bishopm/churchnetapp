<template>
  <div class="layout-padding">
    <p class="caption text-center">Publish content</p>
    <societyfilter showme="2"></societyfilter>
    <circuitfilter showme="2"></circuitfilter>
    <q-input ref="title" class="q-mb-md" float-label="Title" v-model="post.title" />
    <q-select class="q-mb-md" v-model="post.category" float-label="Category" radio :options="categoryOptions" />
    <q-datetime class="q-mb-md" float-label="Publication date" v-model="post.publicationdate" format="YYYY-MM-DD" type="date" />
    <q-editor v-model="post.body" :toolbar="[
      ['bold', 'italic', 'underline'],
      ['hr', 'link'],
      ['quote', 'unordered', 'ordered'],
      [
      {
        label: 'Headings',
        list: 'no-icons',
        options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      },
      ['custom_btn','custom_btn1','custom_btn2'],
    ],
    ]"/>
    <q-btn slot="custom_btn" dense color="secondary" icon="code" label="show HTML" @click="showHtml = !showHtml" />
    <q-btn class="q-ml-md" slot="custom_btn1" dense color="red" icon="cancel" label="cancel" @click="showHtml = !showHtml" />
    <q-btn class="q-ml-md" slot="custom_btn2" dense color="primary" icon="check" label="submit" @click="submit" />
    <q-input v-if="showHtml" class="q-mt-md" v-model="post.body" type="textarea" float-label="HTML" :max-height="100" rows="7"/>
  </div>
</template>

<script>
import societyfilter from './Societyfilter'
import circuitfilter from './Circuitfilter'
import { date } from 'quasar'
export default {
  data () {
    return {
      post: {
        title: '',
        body: '',
        category: 'groups',
        publicationdate: this.monday()
      },
      categoryOptions: [
        {
          label: 'Community',
          value: 'community'
        },
        {
          label: 'Groups',
          value: 'groups'
        },
        {
          label: 'Media',
          value: 'media'
        },
        {
          label: 'Practice',
          value: 'practice'
        }
      ],
      showHtml: false
    }
  },
  components: {
    'circuitfilter': circuitfilter,
    'societyfilter': societyfilter
  },
  mounted () {
    this.$refs.title.focus()
  },
  methods: {
    submit () {
      this.post.publicationdate = this.post.publicationdate.slice(0, 10)
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/feeditems',
        {
          post: this.post,
          societies: this.$store.state.societyfilter,
          circuits: this.$store.state.circuitfilter
        })
        .then(response => {
          this.$q.notify('Your content has been published!')
          this.$router.push({name: 'home'})
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    monday () {
      var mon = new Date()
      mon.setDate(mon.getDate() + (8 - mon.getDay()) % 7)
      return date.formatDate(mon, 'YYYY-MM-DD')
    }
  }
}
</script>

<style>
</style>
