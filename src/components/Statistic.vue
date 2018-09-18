<template>
  <div>
    <p class="q-mt-md caption text-center">{{header}}</p>
    <vue-frappe v-if="ready"
      id="my-chart-id"
      type="line"
      :labels=labels
      :axisOptions="{ xIsSeries: true }"
      :lineOptions="{ dotSize: 4 }"
      :height="350"
      :tooltipOptions="{ formatTooltipY: d => 'Attendance: ' + d }"
      :colors="['#0000AA','#00AA00','#AA0000']"
      :dataSets=dataSets
    ></vue-frappe>
    <h4 class="text-center" v-if="dataSets.length === 1">{{dataSets[0].name}}</h4>
    <div class="text-center">
      <q-btn @click="moveto(yr)" class="q-ma-xs" v-for="yr in allyears" color="primary" :key="yr">
        <small>{{yr}}</small>
      </q-btn>
    </div>
    <div>
      <h4 class="text-center">Add worship statistics</h4>
      <div class="q-ma-md">
        <q-field>
          <q-datetime float-label="Service date" v-model="statdate" type="date" @input="checkdate ()"/>
        </q-field>
      </div>
      <div v-for="(service, kkk) in attendance" :key="service.service_id" class="q-my-xs q-mx-md">
        <q-field>
          <q-input :float-label="'Attendance (' + service.servicetime + ')'" v-model="service.attendance" @blur="checknum(kkk)"/>
        </q-field>
      </div>
      <div class="q-ma-lg text-center">
        <q-btn @click="submit()" color="primary">OK</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  data () {
    return {
      currentyr: '',
      header: '',
      allyears: [],
      labels: [],
      dataSets: [],
      ready: false,
      statdate: null,
      attendance: [],
      society: {}
    }
  },
  mounted () {
    var sun = new Date()
    sun.setDate(sun.getDate() - (sun.getDay()) % 7)
    this.statdate = date.formatDate(sun, 'YYYY-MM-DD')
    this.currentyr = this.$route.params.yr
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(this.$store.state.hostname + '/statistics/' + this.$route.params.society + '/' + this.currentyr)
      .then((response) => {
        if (response.data.labels.length === 0) {
          this.header = 'No statistics have been entered this year'
          this.dataSets.push({ name: 'No data for this year', values: [0, 0] })
          this.labels = ['No data', 'yet']
          this.ready = true
        } else {
          for (var val in response.data.datasets) {
            var newitem = {
              name: val,
              values: response.data.datasets[val]
            }
            this.dataSets.push(newitem)
          }
          this.labels = response.data.labels
          this.header = response.data.society.society + ' [' + this.$route.params.yr + ']'
        }
        if (response.data.years) {
          this.allyears = response.data.years
          this.ready = true
        }
        this.society = response.data.society
        for (var sss in response.data.society.services) {
          var news = {
            service_id: response.data.society.services[sss].id,
            attendance: '',
            servicetime: response.data.society.services[sss].servicetime
          }
          this.attendance.push(news)
        }
        this.checkdate()
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    moveto (yy) {
      this.$router.push({name: 'statistic', params: { society: this.$route.params.society, yr: yy }})
      this.currentyr = yy
    },
    submit () {
      this.statdate = this.statdate.slice(0, 10)
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(this.$store.state.hostname + '/statistics',
        {
          statdate: this.statdate,
          attendance: this.attendance
        })
        .then(response => {
          this.$q.notify('Database has been updated')
          this.$router.push({name: 'statistics'})
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    checknum (sid) {
      if (!parseInt(this.attendance[sid].attendance) > 0) {
        this.attendance[sid].attendance = ''
      }
    },
    checkdate () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(this.$store.state.hostname + '/statistics/' + this.$route.params.society + '/getfordate/' + this.statdate.slice(0, 10))
        .then((response) => {
          if (response.data.length !== 0) {
            for (var akey in this.attendance) {
              for (var dkey in response.data) {
                if (this.attendance[akey].service_id === parseInt(dkey)) {
                  this.attendance[akey].attendance = response.data[dkey]
                }
              }
            }
          } else {
            for (var akey2 in this.attendance) {
              this.attendance[akey2].attendance = ''
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

}
</script>

<style>
rect {
  height: 10px;
}
</style>
