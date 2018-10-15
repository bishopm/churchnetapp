<template>
  <div class="layout-padding">
    <p class="caption text-center">Send email or SMS</p>
    <q-input ref="title" class="q-mb-md" float-label="Title" v-model="post.title" />
    <q-select class="q-mb-md" v-model="post.messagetype" float-label="Type" radio :options="categoryOptions" />
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
    <q-btn class="q-ml-md" slot="custom_btn1" dense color="red" icon="cancel" label="cancel" />
    <q-btn class="q-ml-md" slot="custom_btn2" dense color="primary" icon="check" label="send" @click="submit" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      post: {
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
        },
        {
          label: 'Message',
          value: 'message'
        }
      ],
      showHtml: false
    }
  },
  methods: {
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
