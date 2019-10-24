<template>
  <div class="q-ma-md">
    <div v-if="results.length">
      <p class="caption text-center">Results</p>
      <q-list class="no-border">
        <q-item v-for="result in results" :key="result.name">
          <q-item-section>
            <b>{{result.name}}</b> <small class="q-ml-sm">{{result.address}}</small>
          </q-item-section>
          <q-item-section>
            <q-icon v-if="checkresult(result)" name="fas fa-check" />
            <q-icon v-else name="fas fa-times" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      <p class="caption text-center">Send a message</p>
      <societyselect @altered="searchdb" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
      <q-select outlined @input="getcredits" class="q-ma-md" v-model="message.messagetype" label="Type" radio :options="categoryOptions" map-options emit-value/>
      <div class="q-ma-md" v-if="this.message.messagetype === 'sms'"><small>Credit balance: {{credits}}</small></div>
      <q-input outlined v-if="this.message.messagetype === 'email'" readonly class="q-ma-md" label="Reply to" v-model="message.sender" />
      <q-input v-if="this.message.messagetype === 'email'" class="q-ma-md" label="Title" outlined hide-bottom-space error-message="The title field is required" v-model="message.title" :rules="[ val => val.length >= 1 ]"/>
      <q-select class="q-ma-md" outlined filter filter-placeholder="Search" use-chips multiple v-model="message.groups" label="Group" :options="groupOptions" map-options emit-value/>
      <q-editor v-if="this.message.messagetype === 'email'" class="q-ma-md" v-model="message.body" :toolbar="[
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
      <q-input outlined class="q-ma-md" type="textarea" rows="6" v-else v-model="message.textmessage" label="Message" />
      <q-input v-if="this.message.messagetype === 'email'" class="q-ma-md" @input="addfile" outlined type="file"/>
      <q-btn class="q-ml-md" slot="custom_btn2" dense color="primary" icon="fas fa-check" label="send" @click="submit" />
    </div>
  </div>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators'
import societyselect from './Societyselect'
export default {
  data () {
    return {
      results: [],
      reader: '',
      file: null,
      societies: [],
      groupOptions: [],
      credits: 'checking...',
      message: {
        groups: [],
        individuals: [],
        sender: '',
        title: '',
        body: '',
        attachment: {},
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
  validations: {
    message: {
      groups: { required },
      title: { required: requiredIf(function (a) {
        return this.message.messagetype === 'email'
      }) }
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
    checkresult (res) {
      if (res.smsresult) {
        if (res.smsresult.success) {
          return true
        } else {
          return false
        }
      } else if (res.emailresult) {
        if (res.emailresult === 'OK') {
          return true
        } else {
          return false
        }
      }
    },
    addfile (files, xhr) {
      this.file = files[0]
      this.message.attachment.type = this.file.type
      this.message.attachment.name = this.file.name
      var reader = new FileReader()
      reader.addEventListener('load', function () {
        this.message.attachment.data = reader.result
      }.bind(this), false)
      reader.readAsDataURL(this.file)
    },
    searchdb () {
      this.societies = []
      this.societies.push(this.$store.state.select)
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/groups/search',
        {
          search: '',
          societies: this.societies
        })
        .then(response => {
          this.groupOptions = []
          this.groupOptions.push({ label: 'All members (use with care!)', value: '0' })
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
    getcredits () {
      if (this.message.messagetype === 'sms') {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/messages/smscredits',
          {
            society: this.$store.state.select
          })
          .then(response => {
            this.credits = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    submit () {
      this.$v.message.$touch()
      if (this.$v.message.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.message.society_id = this.$store.state.select
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/messages',
          {
            message: this.message
          })
          .then(response => {
            this.results = response.data
            this.$q.notify('Messages sent')
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
}
</script>

<style>
</style>
