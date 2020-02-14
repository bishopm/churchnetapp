<template>
  <div>
    <q-tabs dense active-bg-color="primary" no-pane-border align="justify" class="q-mb-md bg-secondary text-white" indicator-color="primary" v-model="tab">
      <q-tab key="worshipTab" name="worshipTab" label="Worship"/>
      <q-tab key="otherTab" name="otherTab" label="Discipleship"/>
      <q-tab key="reportsTab" name="reportsTab" label="Reports"/>
    </q-tabs>
    <q-tab-panels dense v-model="tab">
      <q-tab-panel key="worshipTab" name="worshipTab">
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
            <q-input outlined v-model="statdate" mask="####-##-##">
              <template v-slot:append>
                <q-icon name="fa fa-calendar" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date mask="YYYY-MM-DD" v-model="statdate" @input="() => $refs.qDateProxy.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div v-for="(service, kkk) in attendance" :key="service.service_id" class="q-my-sm q-mx-md">
            <q-input outlined :label="'Attendance (' + service.servicetime + ')'" v-model="service.attendance" @blur="checknum(kkk)"/>
          </div>
          <div class="q-ma-lg text-center">
            <q-btn @click="submit()" color="primary">OK</q-btn>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel key="otherTab" name="otherTab">
        <div class="text-h6 text-center">Member statistics: {{currentyr}}</div>
        <q-markup-table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Connect</th>
              <th>Give</th>
              <th>Grow</th>
              <th>Serve</th>
              <th>Worship</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="measure in measures" :key="measure.id">
              <td class="text-center">{{months[measure.measuremonth]}}</td>
              <td class="text-center">{{measure.connect}}</td>
              <td class="text-center">{{measure.give}}</td>
              <td class="text-center">{{measure.grow}}</td>
              <td class="text-center">{{measure.serve}}</td>
              <td class="text-center">{{measure.worship}}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <vue-frappe v-if="ready"
          id="my-chart-id"
          type="line"
          :labels=mlabels
          :axisOptions="{ xIsSeries: true }"
          :lineOptions="{ dotSize: 4 }"
          :height="500"
          :tooltipOptions="{ formatTooltipY: d => d }"
          :colors="['#0000AA','#00AA00','#AA0000']"
          :dataSets=mdataSets
        ></vue-frappe>
      </q-tab-panel>
      <q-tab-panel key="reportsTab" name="reportsTab">
        Giving report (planned giving per month)<br>
        List of members
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  data () {
    return {
      tab: 'worshipTab',
      currentyr: '',
      header: '',
      allyears: [],
      labels: [],
      dataSets: [],
      mlabels: [],
      mdataSets: [],
      ready: false,
      statdate: null,
      attendance: [],
      society: {},
      measures: [],
      months: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  mounted () {
    var sun = new Date()
    sun.setDate(sun.getDate() - (sun.getDay()) % 7)
    this.statdate = date.formatDate(sun, 'YYYY-MM-DD')
    if (!this.$route.params.yr) {
      this.currentyr = 2020
      this.yr = this.currentyr
    } else {
      this.currentyr = this.$route.params.yr
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
    this.$axios.get(process.env.API + '/statistics/' + this.$route.params.society + '/' + this.currentyr)
      .then((response) => {
        if (!response.data.labels) {
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
          this.header = response.data.society.society + ' [' + this.currentyr + ']'
        }
        if (!response.data.mlabels === 0) {
          this.mdataSets.push({ name: 'No data for this year', values: [0, 0] })
          this.mlabels = ['No data', 'yet']
          this.ready = true
        } else {
          for (var mval in response.data.mdatasets) {
            var mnewitem = {
              name: mval,
              values: response.data.mdatasets[mval]
            }
            this.mdataSets.push(mnewitem)
          }
          for (var mlab in response.data.mlabels) {
            var mnew = {
              name: mlab,
              values: this.months[response.data.mlabels[mlab]]
            }
            this.mlabels.push(mnew.values)
          }
        }
        if (response.data.years) {
          this.allyears = response.data.years
          this.ready = true
        }
        this.society = response.data.society
        this.measures = response.data.measures
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
      this.$router.push({ name: 'statistic', params: { society: this.$route.params.society, yr: yy } })
      this.currentyr = yy
    },
    submit () {
      this.statdate = this.statdate.slice(0, 10)
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/statistics',
        {
          statdate: this.statdate,
          attendance: this.attendance
        })
        .then(response => {
          this.$q.notify('Database has been updated')
          this.$router.push({ name: 'statistics' })
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
      this.$axios.get(process.env.API + '/statistics/' + this.$route.params.society + '/getfordate/' + this.statdate.slice(0, 10))
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
