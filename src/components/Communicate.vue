<template>
  <div class="layout-padding">
    <div v-if="results.length">
      <p class="caption text-center">Results</p>
      <q-list class="no-border">
        <q-item v-for="result in results" :key="result.name">
          <q-item-main>
            <b>{{result.name}}</b> <small class="q-ml-sm">{{result.address}}</small>
          </q-item-main>
          <q-item-side>
            <q-icon v-if="checkresult(result)" name="fas fa-check" />
            <q-icon v-else name="fas fa-times" />
          </q-item-side>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      <p class="caption text-center">Send a message</p>
      <societyselect @altered="searchdb" class="q-ma-md" :perms="['editor','admin']" showme="1"></societyselect>
      <q-select @input="getcredits" class="q-ma-md" v-model="message.messagetype" float-label="Type" radio :options="categoryOptions" />
      <div class="q-ma-md" v-if="this.message.messagetype === 'sms'"><small>Credit balance: {{credits}}</small></div>
      <q-input v-if="this.message.messagetype === 'email'" readonly class="q-ma-md" float-label="Reply to" v-model="message.sender" />
      <q-field class="q-ma-md" :error="$v.message.title.$error" error-label="Please set an email title">
        <q-input v-if="this.message.messagetype === 'email'" ref="title" float-label="Title" v-model="message.title" @blur="$v.message.title.$touch()" :error="$v.message.title.$error" />
      </q-field>
      <q-field class="q-ma-md" :error="$v.message.groups.$error" error-label="Please choose a group">
        <q-select filter filter-placeholder="Search" chips multiple v-model="message.groups" float-label="Group" :options="groupOptions" @blur="$v.message.groups.$touch()" :error="$v.message.groups.$error"/>
      </q-field>
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
      <q-input class="q-ma-md" type="textarea" rows="6" v-else v-model="message.textmessage" float-label="Message" />
      <q-uploader v-if="this.message.messagetype === 'email'" ref="uploader" @add="$refs.uploader.upload()" float-label="Attachment" hide-upload-button hide-upload-progress :multiple=false @uploaded="addfile" v-model="message.attachment" url="" class="q-ma-md" clearable :upload-factory="uploadFile" send-raw :headers="{ 'content-type': 'application/x-www-form-urlencoded' }" :no-content-type="true"/>
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
      file: '',
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
      })}
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
    uploadFile (file, updateProgress) {
      return new Promise((resolve, reject) => {
        resolve(file)
      })
    },
    addfile (file, xhr) {
      this.file = file
      this.message.attachment.type = file.type
      this.message.attachment.name = file.name
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
        var formData = new FormData()
        if (this.file) {
          formData.append('file', this.file)
        }
        this.message.society_id = this.$store.state.select
        formData.append('message', JSON.stringify(this.message))
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
        this.$axios.post(process.env.API + '/messages', formData)
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
