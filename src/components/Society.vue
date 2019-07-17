<template>
  <div>
    <leafletmap v-if="society.location" :latitude="society.location.latitude" :longitude="society.location.longitude" :popuplabel="society.society + ' Methodist Church'" editable="no"></leafletmap>
    <div v-if="society" class="text-center q-ma-md">
      <p class="text-h5">
        {{society.society}}
        <q-icon v-if="perm === 'admin'" class="q-ml-sm cursor-pointer" @click.native="editSociety()" name="far fa-edit"></q-icon>
        <q-icon v-if="perm !== ''" class="q-ml-sm cursor-pointer" @click.native="showReport()" name="far fa-file-alt"></q-icon>
      </p>
      <p v-for="service in society.services" :key="service.id">{{service.servicetime}} ({{service.language}})
        <q-icon v-if="perm !== ''" class="cursor-pointer" @click.native="editService(service.id)" name="fas fa-edit"></q-icon>
      </p>
      <p v-if="noservices">No services have been added yet</p>
      <q-btn v-if="perm === 'edit'" @click="addService()" color="primary">Add a service</q-btn>
      <div v-if="society.website"><a target="_blank" :href="websiteurl">{{society.website}}</a></div>
    </div>
  </div>
</template>

<script>
import leafletmap from './Leafletmap'
import { openURL } from 'quasar'
import jsPDF from 'jspdf'
export default {
  data () {
    return {
      society: {},
      noservices: false,
      perm: ''
    }
  },
  components: {
    'leafletmap': leafletmap
  },
  methods: {
    editSociety () {
      this.$router.push({ name: 'societyform', params: { society: JSON.stringify(this.society), action: 'edit' } })
    },
    showReport () {
      var doc = new jsPDF()
      doc.text('Hello world!', 10, 10)
      openURL(doc.output('bloburl'))
    },
    addService () {
      this.$router.push({ name: 'serviceform', params: { society: JSON.stringify(this.society), action: 'add' } })
    },
    editService (id) {
      this.$router.push({ name: 'serviceform', params: { society: JSON.stringify(this.society), action: 'edit', service: id } })
    }
  },
  async mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/societies/' + this.$route.params.id)
      .then((response) => {
        this.society = response.data
        this.longitude = this.society.location.longitude
        this.latitude = this.society.location.latitude
        if (!this.society.services.length) {
          this.noservices = true
        }
        this.perm = this.$store.state.user.societies[this.society.id]
        if (this.society.website) {
          if ((this.society.website) && (!this.society.website.includes('http'))) {
            this.websiteurl = 'http://' + this.society.website
          } else {
            if (this.society.website) {
              this.websiteurl = this.society.website
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>

<style>
</style>
