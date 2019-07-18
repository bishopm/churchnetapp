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
import jsPDF from 'jspdf'
export default {
  data () {
    return {
      society: {},
      societies: [],
      noservices: false,
      perm: '',
      websiteurl: ''
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
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/households/search',
        {
          search: '',
          societies: this.societies,
          scope: false
        })
        .then((response) => {
          var pdf = new jsPDF()
          pdf.text('List of Households: ' + this.society.society, 10, 10)
          pdf.setFontSize(10)
          var yy = 15
          for (var hndx in response.data) {
            if (yy >= 280) {
              pdf.addPage()
              yy = 15
            } else {
              if (response.data[hndx].individuals.length) {
                yy = yy + 5
              }
            }
            var thistxt = response.data[hndx].addressee + ' ('
            for (var indx in response.data[hndx].individuals) {
              thistxt = thistxt + response.data[hndx].individuals[indx].firstname + ', '
            }
            if (response.data[hndx].individuals.length) {
              pdf.text(thistxt.substring(0, thistxt.length - 2) + ')', 10, yy)
            } else {
              thistxt = ''
            }
          }
          window.open(pdf.output('bloburl'), '_blank')
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    addService () {
      this.$router.push({ name: 'serviceform', params: { society: JSON.stringify(this.society), action: 'add' } })
    },
    editService (id) {
      this.$router.push({ name: 'serviceform', params: { society: JSON.stringify(this.society), action: 'edit', service: id } })
    }
  },
  async mounted () {
    this.societies.push(this.$route.params.id)
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
