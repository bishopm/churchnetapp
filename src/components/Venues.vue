<template>
  <div>
    <q-tabs v-model="selectedTab" color="primary" active-bg-color="secondary" class="bg-primary text-white" align="justify">
      <q-tab name="tab-1" icon="fas fa-calendar-alt">Bookings</q-tab>
      <q-tab name="tab-2" icon="fas fa-search-location">Venues</q-tab>
    </q-tabs>
    <q-tab-panels v-model="selectedTab">
      <q-tab-panel name="tab-1">
        <societyselect @altered="searchdb" class="q-ma-md" :perms="['editor','admin']" showme="showme()"></societyselect>
        <div class="flex text-center">
          <div class="col">
            <q-btn stretch flat label="<" @click="calendarPrev" />
          </div>
          <div class="col">
            <q-select v-model="calendarview" :options="displayOptions" map-options emit-value/>
          </div>
          <div class="col">
            <q-btn stretch flat label=">" @click="calendarNext" />
          </div>
          <q-space />
        </div>
        <q-separator />
        <q-calendar :no-default-header-btn="nohead" ref="bcal" :view="calendarview" :resources="venues" v-model="selectedDate" @click:time="addBooking" interval-start="7" interval-count="14">
          <template #day="{ date }">
            <template v-for="(event, index) in getEvents(date)">
              <q-badge
                :key="index"
                style="width: 100%; cursor: pointer; height: 14px; max-height: 14px"
                class="ellipsis"
                :class="badgeClasses(event, 'day')"
                :style="badgeStyles(event, 'day')"
                @click.stop.prevent="showEvent(event)"
                :draggable="true"
                @dragstart.native="(e) => onDragStart(e, event)"
                @dragend.native="(e) => onDragEnd(e, event)"
                @dragenter.native="(e) => onDragEnter(e, event)"
                @touchmove.native="(e) => {}"
              >
                <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
              </q-badge>
            </template>
          </template>
          <template #day-header="{ date }">
            <div class="row justify-center">
              <template v-for="(event, index) in eventsMap[date]">
                <q-badge
                  v-if="!event.time"
                  :key="index"
                  style="width: 100%; cursor: pointer; height: 14px; max-height: 14px"
                  class="ellipsis"
                  :class="badgeClasses(event, 'header')"
                  :style="badgeStyles(event, 'header')"
                  @click.stop.prevent="showEvent(event)"
                  :draggable="true"
                  @dragstart.native="(e) => onDragStart(e, event)"
                  @dragend.native="(e) => onDragEnd(e, event)"
                  @dragenter.native="(e) => onDragEnter(e, event)"
                  @touchmove.native="(e) => {}"
                >
                  <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
                </q-badge>
                <q-badge
                  v-else
                  :key="index"
                  class="q-ma-xs self-end"
                  :class="badgeClasses(event, 'header')"
                  :style="badgeStyles(event, 'header')"
                  style="width: 10px; max-width: 10px; height: 10px; max-height: 10px"
                />
              </template>
            </div>
          </template>
          <template #day-body="{ date, timeStartPos, timeDurationHeight }">
            <template v-for="(event, index) in getEvents(date)">
              <q-badge
                v-if="event.time"
                :key="index"
                class="my-event justify-center ellipsis"
                :class="badgeClasses(event, 'body')"
                :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
                @click.stop.prevent="showEvent(event)"
                :draggable="true"
                @dragstart.native="(e) => onDragStart(e, event)"
                @dragend.native="(e) => onDragEnd(e, event)"
                @dragenter.native="(e) => onDragEnter(e, event)"
                @touchmove.native="(e) => {}"
              >
                <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
              </q-badge>
            </template>
          </template>
          <template #intervals-header="days">
            <div class="fit flex justify-center items-end">
              <span class="q-calendar-daily__interval-text">{{days}}</span>
            </div>
          </template>
        </q-calendar>
      </q-tab-panel>
      <q-tab-panel name="tab-2">
        <div class="q-my-md">
          <q-list v-if="venues" class="no-border">
            <p class="caption text-center">Venues</p>
            <q-input class="q-ma-md" outlined ref="search" @input="searchdb" v-model="search" debounce="500" placeholder="search by venue name">
              <template v-slot:append>
                <q-icon name="fa fa-search" />
              </template>
            </q-input>
            <q-item class="q-mx-md" v-for="venue in venues" :key="venue.id" :to="'/venues/' + venue.id">
              {{venue.venue}}
            </q-item>
          </q-list>
          <q-page-sticky expand position="top-right" :offset="[32, 92]">
            <q-btn size="sm" round color="primary" @click="addVenue" class="fixed" icon="fas fa-plus"/>
          </q-page-sticky>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog minimized v-model="modalopen" content-css="padding: 50px">
      <q-card>
        <q-card-section>
          <div class="text-h6">New booking</div>
        </q-card-section>
        <q-card-section>
          <q-input readonly label="Date" v-model="booking.startdate"/>
          <div class="q-my-md">
            <q-select label="Venue" filter v-model="booking.venue_id" :options="venueOptions" map-options emit-value/>
          </div>
          Recurring how many times?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="q-mt-md" color="primary" @click="savechanges()" label="Save" />
          <q-btn class="q-mt-md q-ml-md" color="secondary" @click="modalopen = false" label="Cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import societyselect from './Societyselect'
import { date } from 'quasar'
export default {
  data () {
    return {
      venues: [],
      modalopen: false,
      nohead: false,
      search: '',
      events: [{
        title: 'Meeting',
        details: 'Time to pitch my idea to the company',
        date: '2019-11-18',
        time: '10:00',
        duration: 120,
        bgcolor: 'red',
        icon: 'fas fa-handshake'
      }],
      calendarview: 'scheduler',
      displayOptions: [
        { label: 'Day view', value: 'day' },
        { label: 'Week view', value: 'week' },
        { label: 'Month view', value: 'month' },
        { label: 'Venue view', value: 'scheduler' }
      ],
      venueOptions: [],
      selectedDate: null,
      selectedTab: 'tab-1',
      title: '',
      booking: {
        startdate: '',
        venue_id: ''
      }
    }
  },
  components: {
    'societyselect': societyselect
  },
  methods: {
    addBooking (day, type) {
      this.booking.startdate = day.date + ' ' + day.time.substr(0, 2) + ':00'
      this.modalopen = true
    },
    calendarNext () {
      this.$refs.bcal.next()
    },
    calendarPrev () {
      this.$refs.bcal.prev()
    },
    addVenue () {
      this.$router.push({ name: 'venueform', params: { action: 'add' } })
    },
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    },
    getEvents (dt) {
      let events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        if (this.events[i].date === dt) {
          if (this.events[i].time) {
            if (events.length > 0) {
              // check for overlapping times
              let startTime = new Date(this.events[i].date + ' ' + this.events[i].time).getTime()
              let endTime = date.addToDate(startTime, { minutes: this.events[i].duration }).getTime()
              for (let j = 0; j < events.length; ++j) {
                let startTime2 = new Date(events[j].date + ' ' + events[j].time).getTime()
                let endTime2 = date.addToDate(startTime2, { minutes: events[j].duration }).getTime()
                if ((startTime >= startTime2 && startTime < endTime2) || (startTime2 >= startTime && startTime2 < endTime)) {
                  events[j].side = 'left'
                  this.events[i].side = 'right'
                  events.push(this.events[i])
                  added = true
                  break
                }
              }
            }
          }
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
    badgeClasses (event, type) {
      const cssColor = '#444444'
      const isHeader = type === 'header'
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },
    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      let s = {}
      s['background-color'] = event.bgcolor
      s['color'] = '#ffffff'
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
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.post(process.env.API + '/venues/search',
        {
          search: this.search,
          society: this.$store.state.select
        })
        .then(response => {
          for (var vv in response.data) {
            var newitem = {
              label: response.data[vv].venue,
              value: response.data[vv].id
            }
            this.venueOptions.push(newitem)
            this.venues.push({ label: response.data[vv].venue })
          }
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.searchdb()
    this.title = this.selectedDate
  }

}
</script>

<style>
</style>
