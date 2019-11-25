<template>
  <div class="q-ma-md">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{title}} venue
    </div>
    <div class="q-ma-md">
      <q-input outlined label="Venue name" v-model="venue" />
    </div>
    <div class="q-ma-md">
      <q-input outlined label="Venue colour" v-model="colour" class="my-input">
        <template v-slot:append>
          <q-icon name="fa fa-palette" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="colour" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-ma-lg text-center">
      <q-btn @click="submit()" color="primary">OK</q-btn>
      <q-btn class="q-ml-md" @click="$router.go(-1)" color="secondary">Cancel</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$route.params.action.charAt(0).toUpperCase() + this.$route.params.action.slice(1),
      id: '',
      venue: '',
      colour: ''
    }
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      this.$axios.get(process.env.API + '/venues/' + this.$route.params.id + '/edit')
        .then((response) => {
          this.venue = response.data.venue
          this.colour = response.data.colour
          this.id = this.$route.params.id
          this.society_id = response.data.society_id
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  methods: {
    submit () {
      if (this.$route.params.action === 'add') {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('CHURCHNET_Token')
        this.$axios.post(process.env.API + '/venues',
          {
            society_id: this.$store.state.select,
            venue: this.venue
          })
          .then(response => {
            this.$router.go(-1)
          })
          .catch(function (error) {
            this.error = error
          })
      } else {
        this.$axios.post(process.env.API + '/venues/' + this.id,
          {
            society_id: this.society_id,
            venue: this.venue,
            colour: this.colour
          })
          .then(response => {
            this.$router.go(-1)
          })
          .catch(function (error) {
            console.log(error)
          })
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
  #map {
    text-align:center;
    height: 300px;
    width: 100%;
  }
  .my-input {
    max-width: 250px
  }
</style>
