<template>
  <div>
    <societyselect @altered="searchdb" class="q-ma-md" :perms="['editor','admin']" showme="showme()"></societyselect>
    <q-tabs v-model="selectedTab" color="primary" active-bg-color="secondary" class="bg-primary text-white" align="justify">
      <q-tab name="tab-1" icon="fas fa-calendar-alt">Bookings</q-tab>
      <q-tab name="tab-2" icon="fas fa-search-location">Venues</q-tab>
    </q-tabs>
    <q-tab-panels v-model="selectedTab">
      <q-tab-panel name="tab-1">
        <div class="row content-end">
          <q-btn class="col" color="primary" label="<" @click="calendarPrev" />
          <q-select class="col-9 q-mx-lg" :label="title" v-model="calendarView" :options="displayOptions" map-options emit-value/>
          <q-btn class="col" color="primary" label=">" @click="calendarNext" />
        </div>
        <q-separator />
        <q-calendar short-weekday-label ref="calendar" class="calendar" v-model="selectedDate" :show-month-label="false" :view="calendarView" :interval-start="7" :interval-count="14" :resources="venues" @click:interval="addBooking" @click:time="addBooking" @click:day="addBooking" @click:week="addBooking" @click:date="openDay">
          <template #day="{ date }">
            <template v-for="(event, index) in getEvents(date)">
              <q-badge :key="index" style="width: 100%; cursor: pointer; height: 14px; max-height: 14px" class="ellipsis" :style="badgeStyles(event, 'day')" @click.stop.prevent="showEvent(event)">
                <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.description }}</span>
              </q-badge>
            </template>
          </template>
          <template #day-header="{ date }">
            <div class="row justify-center">
              <template v-for="(event, index) in eventsMap[date]">
                <q-badge v-if="!event.time" :key="index" style="width: 100%; cursor: pointer; height: 14px; max-height: 14px" class="ellipsis" :style="badgeStyles(event, 'header')" @click.stop.prevent="showEvent(event)">
                  <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.description }}</span>
                </q-badge>
                <q-badge v-else :key="index" class="q-ma-xs self-end" :style="badgeStyles(event, 'header')" style="width: 10px; max-width: 10px; height: 10px; max-height: 10px"/>
              </template>
            </div>
          </template>
          <template #day-body="{ date, timeStartPos, timeDurationHeight }">
            <template v-for="(event, index) in getEvents(date)">
              <q-badge v-if="event.time" :key="index" class="my-event justify-center ellipsis" :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)" @click.stop.prevent="showEvent(event)">
                <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.description }}</span>
              </q-badge>
            </template>
          </template>
          <template #scheduler-resource-day="{ day, index, resource }">
            <template v-for="(event, index) in getResourcesEvents(day, resource)">
              <q-badge v-if="event.time" :key="index" :style="'background-color:' + event.colour" class="my-resource justify-center ellipsis" @click.stop.prevent="showEvent(event)">
                {{event.description}}
              </q-badge>
            </template>
          </template>
        </q-calendar>
      </q-tab-panel>
      <q-tab-panel name="tab-2">
        <div class="q-my-md">
          <q-list v-if="venues.length" class="no-border">
            <q-item class="q-mx-md" v-for="venue in venueOptions" :key="venue.id" :to="'/venues/edit/' + venue.value">
              {{venue.label}}
            </q-item>
          </q-list>
          <q-page-sticky expand position="top-right" :offset="[32, 202]">
            <q-btn size="sm" round color="primary" @click="addVenue" class="fixed" icon="fas fa-plus"/>
          </q-page-sticky>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog minimized v-model="modalopen" content-css="padding: 50px">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{booking.title}}</div>
        </q-card-section>
        <q-card-section>
          <div class="q-my-md">
            <q-input label="Description" outlined v-model="booking.description"/>
          </div>
          <div class="q-my-md">
            <q-input label="Start time" outlined v-model="booking.starttime" mask="####-##-## ##:##">
              <template v-slot:prepend>
                <q-icon name="fa fa-calendar" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="booking.starttime" mask="YYYY-MM-DD HH:mm" />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="fa fa-clock" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="booking.starttime" mask="YYYY-MM-DD HH:mm" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="q-my-md">
            <q-input label="End time" outlined v-model="booking.endtime" mask="####-##-## ##:##">
              <template v-slot:prepend>
                <q-icon name="fa fa-calendar" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="booking.endtime" mask="YYYY-MM-DD HH:mm" />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="fa fa-clock" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="booking.endtime" mask="YYYY-MM-DD HH:mm" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="q-my-md">
            <q-select outlined label="Venue" filter v-model="booking.venue_id" :options="venueOptions" map-options emit-value/>
          </div>
          <div class="q-my-md">
            <q-select @new-value="addUser" outlined label="Booked by" filter v-model="booking.venueuser" :options="userOptions" use-input clearable/>
          </div>
          <div class="q-my-md">
            <q-select outlined label="Status" v-model="booking.status" :options="statusOptions"/>
          </div>
          Recurring how many times?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="q-mt-md" color="primary" @click="saveChanges()" label="Save" />
          <q-btn class="q-mt-md q-ml-md" color="secondary" @click="modalopen = false" label="Cancel" />
          <q-btn v-if="booking.id" class="q-mt-md q-ml-md" color="black" @click="deleteBooking()" label="Delete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import societyselect from './Societyselect'
import { date, colors } from 'quasar'
export default {
  data () {
    return {
      venues: [],
      modalopen: false,
      nohead: false,
      search: '',
      events: [],
      calendarView: 'day',
      userOptions: [],
      displayOptions: [
        { label: 'Day view', value: 'day' },
        { label: 'Week view', value: 'week' },
        { label: 'Month view', value: 'month' },
        { label: 'Venue view', value: 'scheduler' }
      ],
      statusOptions: ['requested', 'confirmed'],
      venueOptions: [],
      selectedDate: null,
      selectedTab: 'tab-1',
      booking: {
        starttime: '',
        endtime: '',
        venue_id: '',
        recurring: 0,
        id: null,
        venueuser: '',
        status: 'requested'
      },
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  components: {
    'societyselect': societyselect
  },
  computed: {
    title () {
      if (this.selectedDate) {
        return this.months[this.selectedDate.substr(5, 2) - 1] + ' ' + this.selectedDate.substr(0, 4)
      } else {
        return this.months[(new Date().getMonth())] + ' ' + new Date().getFullYear()
      }
    }
  },
  methods: {
    addBooking (day) {
      if (day.hour === 0) {
        this.booking.starttime = day.date + ' 09:00'
        this.booking.endtime = day.date + ' 10:00'
      } else if (day.hour < 9) {
        this.booking.starttime = day.date + ' ' + day.time.substr(0, 2) + ':00'
        this.booking.endtime = day.date + ' ' + '0' + (day.hour + 1).toString() + ':00'
      } else {
        this.booking.starttime = day.date + ' ' + day.time.substr(0, 2) + ':00'
        this.booking.endtime = day.date + ' ' + (day.hour + 1).toString() + ':00'
      }
      this.booking.description = ''
      this.booking.title = 'Add venue booking'
      this.booking.id = null
      this.booking.venue_id = ''
      this.booking.venueuser = ''
      this.modalopen = true
    },
    openDay (day) {
      this.calendarView = 'day'
    },
    showEvent (event) {
      this.booking.description = event.description
      this.booking.starttime = event.starttime
      this.booking.endtime = event.endtime
      this.booking.venue_id = event.venue_id
      this.booking.id = event.id
      this.booking.title = 'Edit venue booking'
      this.booking.venueuser = event.name
      this.modalopen = true
    },
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    addVenue () {
      this.$router.push({ name: 'venueform', params: { action: 'add' } })
    },
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    },
    getResourcesEvents (date, resource) {
      let events = []
      for (var endx in this.events) {
        if ((this.events[endx].venue === resource.label) && (this.events[endx].date === date.date)) {
          events.push(this.events[endx])
        }
      }
      return events
    },
    getEvents (dt) {
      let events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        if (this.events[i].date === dt) {
          if (!added) {
            this.events[i].side = void 0
            events.push(this.events[i])
          }
        } else if (this.events[i].days) {
          // check for overlapping dates
          let startDate = new Date(this.events[i].date)
          let endDate = date.addToDate(startDate, { days: this.events[i].days })
          if (date.isBetweenDates(dt, startDate, endDate)) {
            events.push(this.events[i])
            added = true
          }
        }
      }
      return events
    },
    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      let s = {}
      s['width'] = event.width + '%'
      s['left'] = event.x + '%'
      s['background-color'] = event.colour
      s['color'] = colors.luminosity(event.colour) > 0.5 ? 'black' : 'white'
      if (timeStartPos) {
        s['top'] = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s['height'] = timeDurationHeight(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    },
    showme () {
      return this.$store.state.user.societies.keys.length
    },
    addUser (val, done) {
      if (val.length > 0) {
        if (!this.userOptions.includes(val)) {
          this.userOptions.push(val)
        }
        done(val, 'toggle')
      }
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/venues/' + this.$store.state.select)
        .then(response => {
          for (var vv in response.data.venues) {
            var newitem = {
              label: response.data.venues[vv].venue,
              value: response.data.venues[vv].id
            }
            this.venueOptions.push(newitem)
            this.venues.push({ label: response.data.venues[vv].venue })
          }
          this.events = response.data.events
          for (var uu in response.data.venueusers) {
            this.userOptions.push(response.data.venueusers[uu].name)
          }
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    saveChanges () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/venuebookings',
        {
          venue_id: this.booking.venue_id,
          description: this.booking.description,
          starttime: this.booking.starttime,
          endtime: this.booking.endtime,
          status: this.booking.status,
          venueuser: this.booking.venueuser
        })
        .then(response => {
          this.modalopen = false
          this.searchdb()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    deleteBooking () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.delete(process.env.API + '/venuebookings/' + this.booking.id)
        .then(response => {
          this.modalopen = false
          this.searchdb()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.searchdb()
  }

}
</script>

<style lang="stylus">
  // calendar overrides
  .q-calendar-daily__day-interval:hover
    background-color rgba(0,0,255,.1)
  .q-calendar-weekly__workweek:hover
    background-color rgba(0,0,255,.1)
  .q-calendar-weekly__day:hover
    background-color rgba(0,0,255,.1)
  .q-calendar-weekly__head-weekday:hover
    background-color rgba(0,0,255,.1)
  // this page
  .calendar-container
    position relative
  .my-event
    width 100%
    position absolute
    font-size 12px
  .my-resource
    width 100%
    position relative
    font-size 10px
  .full-width
    left 0
    width 100%
  </style>
