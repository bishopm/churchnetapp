<template>
  <div class="layout-padding">
    <div class="q-mx-md text-center caption">
      Edit group
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.groupname.$error" error-label="The group name is required">
        <q-input float-label="Group name" v-model="form.groupname" @blur="$v.form.groupname.$touch()" :error="$v.form.groupname.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-btn color="primary" @click="submit">Submit</q-btn>
      <q-btn class="q-ml-md" color="secondary">Cancel</q-btn>
      <q-btn class="q-ml-md" color="red">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      form: {
        groupname: ''
      }
    }
  },
  validations: {
    form: {
      groupname: { required }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$q.notify('Good to go!')
      }
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/groups/' + this.$route.params.id)
      .then((response) => {
        this.form = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
