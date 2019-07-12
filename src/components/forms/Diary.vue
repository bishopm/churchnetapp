<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} a diary entry
      <small v-if="entity.circuit">{{entity.circuit}}</small>
      <small v-if="entity.society">{{entity.society}}</small>
      <small v-if="entity.district">{{entity.district}}</small>
    </div>
    <div class="q-mx-md">
      <q-input class="q-my-sm" label="Description" outlined hide-bottom-space error-message="The surname name field is required" v-model="form.description" :rules="[ val => val.length >= 1 ]"/>
    </div>
    <div class="q-mx-md">
      <q-select outlined label="Venue" v-model="form.society_id" :options="societyOptions" map-options emit-value></q-select>
    </div>
    <div class="q-ma-md">
      <q-input outlined v-model="form.meetingdatetime" mask="####-##-## ##:##">
        <template v-slot:prepend>
          <q-icon name="fa fa-calendar" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="form.meetingdatetime" mask="YYYY-MM-DD HH:mm" />
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="fa fa-clock" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="form.meetingdatetime" mask="YYYY-MM-DD HH:mm" format24h />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-ma-md">
      <q-select outlined label="Display on preaching plan?" v-model="form.preachingplan" :options="pplanOptions" map-options emit-value></q-select>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
      <q-btn class="q-ml-md" @click="deleteme" color="black">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { format } from 'quasar'
const { capitalize } = format
export default {
  data () {
    return {
      title: capitalize(this.$route.params.action),
      entity: {},
      societyOptions: [],
      pplanOptions: [
        { label: 'No', 'value': 'no' },
        { label: 'Yes', 'value': 'yes' },
        { label: 'Yes (Previous quarter)', 'value': 'previous' },
        { label: 'Yes (Next quarter)', 'value': 'next' }
      ],
      id: '',
      form: {
        description: '',
        society_id: '',
        meetingdatetime: '',
        preachingplan: 'no'
      }
    }
  },
  validations: {
    form: {
      description: { required },
      meetingdatetime: { required }
    }
  },
  mounted () {
    this.entity = JSON.parse(this.$route.params.entity)
    if (this.entity.id) {
      this.entityid = this.entity.id
    } else {
      this.entityid = this.entity
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.post(process.env.API + '/societies/search',
      {
        search: '',
        scope: this.$route.params.scope,
        entity: this.entityid
      })
      .then((response) => {
        for (var skey in response.data) {
          var newitem = {
            label: response.data[skey].society,
            value: response.data[skey].id
          }
          this.societyOptions.push(newitem)
        }
        this.form.society_id = this.societyOptions[0]
        if (this.$route.params.action === 'edit') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.get(process.env.API + '/meetings/' + this.$route.params.id)
            .then((response) => {
              this.form.description = response.data.description
              this.form.society_id = response.data.society_id
              this.form.meetingdatetime = response.data.datestr
              this.form.preachingplan = response.data.preachingplan
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    deleteme () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
      this.$axios.delete(process.env.API + '/meetings/' + this.$route.params.id)
        .then(response => {
          this.$q.notify('Diary entry has been deleted')
          this.$router.go(-1)
        })
        .catch(function (error) {
          this.error = error
        })
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'add') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/meetings',
            {
              society_id: this.form.society_id.value,
              meetable_id: this.entity.id,
              meetable_type: this.$route.params.scope,
              description: this.form.description,
              meetingdatetime: this.form.meetingdatetime,
              preachingplan: this.form.preachingplan
            })
            .then(response => {
              this.$q.notify('Diary entry has been added')
              this.$router.go(-1)
            })
            .catch(function (error) {
              this.error = error
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
          this.$axios.post(process.env.API + '/meetings/' + this.$route.params.id + '/update',
            {
              society_id: this.form.society_id,
              meetable_id: this.entity.id,
              meetable_type: this.$route.params.scope,
              description: this.form.description,
              meetingdatetime: this.form.meetingdatetime,
              preachingplan: this.form.preachingplan
            })
            .then(response => {
              this.$q.notify('Diary entry has been updated')
              this.$router.go(-1)
            })
            .catch(function (error) {
              this.error = error
            })
        }
      }
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
