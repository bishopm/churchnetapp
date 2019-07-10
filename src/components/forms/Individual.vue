<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} INDIVIDUAL
    </div>
    <div class="q-ma-md">
      <q-input class="q-my-sm" label="Surname" outlined hide-bottom-space error-message="The surname field is required" v-model="form.surname" :rules="[ val => val.length >= 1 ]"/>
    </div>
    <div class="q-mx-md">
      <q-input class="q-my-sm" label="First name" outlined hide-bottom-space error-message="The first name field is required" v-model="form.firstname" :rules="[ val => val.length >= 1 ]"/>
    </div>
    <div class="q-ma-md">
      <q-select outlined label="Sex" v-model="form.sex" :options="['female', 'male']"/>
    </div>
    <div class="q-ma-md">
      <q-select outlined label="Title" v-model="form.title" :options="['Dr', 'Mr', 'Mrs', 'Ms', 'Prof', 'Rev']"/>
    </div>
    <div class="q-ma-md">
      <q-input label="Date of birth" outlined v-model="form.birthdate" mask="####-##-##">
        <template v-slot:append>
          <q-icon name="fa fa-calendar" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date mask="YYYY-MM-DD" v-model="form.birthdate" @input="() => $refs.qDateProxy.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-ma-md">
      <q-input label="Email" outlined v-model="form.email"/>
    </div>
    <div class="q-ma-md">
      <q-input outlined label="Cellphone" v-model="form.cellphone"/>
    </div>
    <div class="q-mx-md">
      <q-input outlined label="Giving" v-model="form.giving" />
    </div>
    <div class="q-ma-md">
      <q-select outlined multiple use-chips label="Roles" v-model="roles" :options="roleOptions" map-options emit-value/>
    </div>
    <div class="text-center" v-if="form.id">
      <div class="card-body">
        <img :src="profilepic" style="border-radius:50%" width="250"/>
        <div class="card-img-overlay">
          <q-btn color="primary" id="pick-avatar">{{buttontext}}</q-btn>
          <q-btn v-if="form.image" @click="removeImage" class="q-ml-md" color="negative">Delete image</q-btn>
        </div>
      </div>
      <div class="card-footer text-muted" v-html="message"></div>
      <avatar-cropper  :labels="{submit: 'OK', cancel: 'Cancel'}" @uploading="handleUploading" @uploaded="handleUploaded" @completed="handleCompleted" @error="handlerError" trigger="#pick-avatar" :upload-url="uploadurl" :upload-headers="uploadHeaders"/>
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn class="q-ml-md" color="black" @click="modalopen = true">Delete</q-btn>
    </div>
    <q-dialog minimized v-model="modalopen" content-css="padding: 50px">
      <q-card class="q-pa-md">
        <p class="text-center text-h5">Confirm removal reason</p>
        <q-option-group @input="checkDeath" color="secondary" type="radio" v-model="subform.deletereason" :options="[
          { label: 'Individual has left the church', value: 'archive' },
          { label: 'Individual was added in error', value: 'delete' },
          { label: 'Individual has died', value: 'death' }
        ]"/>
        <q-datetime label="Date of death" format="YYYY-MM-DD" format-model="string" v-if="showdate" v-model="subform.deathdate" type="date" />
        <q-btn class="q-mt-md" color="black" @click="deleteMe" label="Delete" />
        <q-btn class="q-mt-md q-ml-md" color="secondary" @click="modalopen = false" label="Cancel" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required, numeric, email } from 'vuelidate/lib/validators'
import AvatarCropper from 'vue-avatar-cropper'

export default {
  data () {
    return {
      form: {
        surname: '',
        firstname: '',
        birthdate: '',
        title: '',
        email: '',
        sex: '',
        cellphone: '',
        image: ''
      },
      uploadurl: null,
      userAvatar: null,
      message: null,
      uploadHeaders: {
        'Authorization': 'Bearer ' + this.$store.state.token
      },
      subform: {
        deletereason: 'archive',
        deathdate: ''
      },
      modalopen: false,
      showdate: false,
      roleOptions: [],
      roles: []
    }
  },
  components: {
    AvatarCropper
  },
  validations: {
    form: {
      surname: { required },
      firstname: { required },
      email: { email },
      giving: { numeric },
      cellphone: { numeric }
    }
  },
  computed: {
    profilepic () {
      if (this.form.image) {
        return process.env.WEB + '/vendor/bishopm/images/profile/' + this.form.image
      } else {
        return ''
      }
    },
    buttontext () {
      if (this.form.image) {
        return 'Change image'
      } else {
        return 'Add profile image'
      }
    }
  },
  methods: {
    removeImage () {
      this.form.image = ''
      this.$q.notify('Press OK to make this change permanent')
    },
    handleUploading (form, xhr) {
      this.message = 'uploading...'
    },
    handleUploaded (response) {
      if (response.status === 'success') {
        this.message = 'user avatar updated'
      }
    },
    handleCompleted (response, form, xhr) {
      this.message = 'upload completed'
      this.$router.push('/households/' + this.form.household_id)
    },
    handlerError (message, type, xhr) {
      this.message = 'Oops! Something went wrong...'
    },
    checkDeath () {
      if (this.subform.deletereason === 'death') {
        this.showdate = true
      } else {
        this.showdate = false
      }
    },
    deleteMe () {
      this.modalopen = false
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/individuals/delete/' + this.form.id,
        {
          id: this.form.id,
          reason: this.subform.deletereason,
          deathdate: this.subform.deathdate.slice(0, 10).replace(/-/g, '/')
        })
        .then(response => {
          this.$q.loading.hide()
          this.$q.notify(response.data)
          this.$router.push({ name: 'household', params: { id: this.form.household_id } })
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'edit') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/individuals/' + this.form.id,
            {
              surname: this.form.surname,
              firstname: this.form.firstname,
              sex: this.form.sex,
              title: this.form.title,
              birthdate: this.form.birthdate,
              email: this.form.email,
              giving: this.form.giving,
              cellphone: this.form.cellphone,
              roles: this.roles
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Individual updated')
              this.$router.push({ name: 'household', params: { id: response.data.household_id } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
          this.$axios.post(process.env.API + '/individuals',
            {
              surname: this.form.surname,
              firstname: this.form.firstname,
              sex: this.form.sex,
              title: this.form.title,
              birthdate: this.form.birthdate,
              email: this.form.email,
              cellphone: this.form.cellphone,
              giving: this.form.giving,
              roles: this.roles,
              household_id: this.form.household_id
            })
            .then(response => {
              this.$q.loading.hide()
              this.$q.notify('Individual added')
              this.$router.push({ name: 'household', params: { id: response.data.household_id } })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      }
    }
  },
  mounted () {
    this.form = this.$route.params.individual
    for (var rkey in this.form.alltags) {
      var newitem = {
        label: this.form.alltags[rkey].name,
        value: this.form.alltags[rkey].tag_id
      }
      this.roleOptions.push(newitem)
    }
    if (this.$route.params.action === 'edit') {
      for (var tkey in this.form.tags) {
        this.roles.push(this.form.tags[tkey].tag_id)
      }
    }
    this.userAvatar = this.profilepic
    this.uploadurl = process.env.API + '/individuals/' + this.form.id + '/image'
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
