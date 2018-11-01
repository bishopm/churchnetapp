<template>
  <div class="layout-padding">
    <p class="caption text-center">Send a message</p>
    <societyselect altered="searchdb" class="q-ma-md" :perms="['edit','admin']" showme="1"></societyselect>
    <q-input v-if="this.message.messagetype === 'email'" readonly class="q-ma-md" float-label="Reply to" v-model="message.sender" />
    <q-input v-if="this.message.messagetype === 'email'" ref="title" class="q-ma-md" float-label="Title" v-model="message.title" />
    <q-select class="q-ma-md" filter filter-placeholder="Search" chips multiple v-model="message.groups" float-label="Group" :options="groupOptions" />
    <q-select class="q-ma-md" v-model="message.messagetype" float-label="Type" radio :options="categoryOptions" />
    <q-editor class="q-ma-md" v-model="message.body" :toolbar="[
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
    <q-btn class="q-ml-md" slot="custom_btn2" dense color="primary" icon="check" label="send" @click="submit" />
  </div>
</template>

<script>
import societyselect from './Societyselect'
export default {
  data () {
    return {
      societies: [],
      groupOptions: [],
      message: {
        groups: [],
        sender: '',
        title: '',
        body: '',
        messagetype: 'email'
      },
      categoryOptions: [
        {
          label: 'Email',
          value: 'email'
        },
        {
          label: 'SMS',
          value: 'sms'
        }
      ],
      showHtml: false
    }
  },
  components: {
    'societyselect': societyselect
  },
  mounted () {
    this.message.sender = this.$store.state.user.email
    this.searchdb()
  },
  methods: {
    searchdb () {
      this.societies.push(this.$store.state.select)
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/groups/search',
        {
          search: '',
          societies: this.societies
        })
        .then(response => {
          for (var gkey in response.data) {
            var newitem = {
              label: response.data[gkey].groupname,
              value: response.data[gkey].id
            }
            this.groupOptions.push(newitem)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    submit () {
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
    }
  }
}
</script>

<style>
</style>
