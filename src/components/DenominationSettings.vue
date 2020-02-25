<template>
  <div class="q-ma-md">
    <p class="caption text-center">Denomination settings</p>
    <denominationselect class="q-ma-md" @altered="setdenomination" :perms="['admin']" showme="1"></denominationselect>
    <div class="q-ma-md">
      <q-input outlined label="Name" v-model="form.denomination" />
    </div>
    <div class="q-ma-md">
      <q-input outlined label="National structure" v-model="form.national" />
    </div>
    <div class="q-ma-md">
      <q-input outlined label="Provincial structure" v-model="form.provincial" />
    </div>
    <div class="q-ma-md">
      <q-input outlined label="Regional structure" v-model="form.regional" />
    </div>
    <div class="q-ma-md">
      <q-input outlined label="Local structure" v-model="form.local" />
    </div>
  </div>
</template>

<script>
import denominationselect from './Denominationselect'
export default {
  data () {
    return {
      search: '',
      denomination: {},
      form: {
        denomination: '',
        national: '',
        provincial: '',
        regional: '',
        local: ''
      }
    }
  },
  methods: {
    setdenomination () {
      this.denomination = this.$store.state.user.denominations.full[this.$store.state.select]
      this.form = this.denomination
    },
    update () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        this.$axios.post(process.env.API + '/denominations/' + this.$store.state.select,
          {
            denomination: this.form.denomination
          })
          .then(response => {
            this.$q.notify('Circuit updated')
            this.$router.push({ name: 'denominationsettings' })
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  },
  components: {
    'denominationselect': denominationselect
  },
  mounted () {
    this.setdenomination()
  }

}
</script>

<style>
</style>
