<template>
  <div class="layout-padding">
    <p class="caption text-center">Feed content</p>
    <societyfilter showme="2" ref="sfilter"></societyfilter>
    <circuitfilter showme="2" ref="cfilter"></circuitfilter>
    <q-input ref="title" class="q-mb-md" float-label="Title" v-model="post.title" />
    <q-select class="q-mb-md" v-model="post.category" float-label="Category" radio :options="categoryOptions" />
    <q-datetime float-label="Publication date" v-model="post.publicationdate" format="YYYY-MM-DD" type="date" />
    <q-select class="q-mb-md" float-label="Store in library" v-model="post.library" :options="[{ label: 'no', value: 'no' }, { label: 'yes', value: 'yes' }]"/>
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
    <div class="q-mt-sm text-center">
      <q-btn slot="custom_btn" dense color="secondary" icon="fas fa-code" label="show HTML" @click="showHtml = !showHtml" />
      <q-btn class="q-ml-md" slot="custom_btn1" dense color="black" icon="fas fa-times" label="cancel" @click="$router.go(-1)" />
      <q-btn class="q-ml-md" slot="custom_btn2" dense color="primary" icon="fas fa-check" label="submit" @click="submit" />
    </div>
    <q-input v-if="showHtml" class="q-mt-md" v-model="post.body" type="textarea" float-label="HTML" :max-height="100" rows="7"/>
  </div>
</template>

<script>
import societyfilter from './../Societyfilter'
import circuitfilter from './../Circuitfilter'
import { date } from 'quasar'
export default {
  data () {
    return {
      post: {
        title: '',
        body: '',
        category: 'groups',
        library: 'no',
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
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/feedpost/' + this.$route.params.id)
        .then(response => {
          this.$store.commit('setSFilter', response.data.societies)
          this.$refs.sfilter.societies = response.data.societies
          this.$store.commit('setCFilter', response.data.circuits)
          this.$refs.cfilter.circuits = response.data.circuits
          this.post.body = response.data.body
          this.post.title = response.data.title
          this.post.publicationdate = response.data.publicationdate
          this.post.category = response.data.category
          this.post.library = response.data.feeditems[0].library
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    } else {
      this.$refs.title.focus()
    }
  },
  methods: {
    submit () {
      this.post.publicationdate = this.post.publicationdate.slice(0, 10)
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      if (this.$route.params.action === 'edit') {
        this.$axios.post(process.env.API + '/feeditems/update',
          {
            id: this.$route.params.id,
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
      } else {
        this.$axios.post(process.env.API + '/feeditems',
          {
            post: this.post,
            societies: this.$store.state.societyfilter,
            circuits: this.$store.state.circuitfilter
          })
          .then(response => {
            this.$q.notify('Your content has been updated!')
            this.$router.push({name: 'home'})
          })
          .catch(function (error) {
            console.log(error)
          })
      }
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
