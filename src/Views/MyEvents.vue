<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <h2>My Events</h2>
      <div class="shadow align-content-center my-4">
        <h2 class="p-5" v-if="pageEvents.length === 0">No events found!</h2>
        <event
            v-for="event in pageEvents" :id="event.index" v-bind:key="event.index"
            v-bind:eventId="event.eventId" v-bind:title="event.title" v-bind:capacity="event.capacity"
            v-bind:categories="event.displayCategories" v-bind:date="event.date"
            v-bind:numAcceptedAttendees="event.numAcceptedAttendees"
            v-bind:organizerFirstName="event.organizerFirstName"
            v-bind:organizerLastName="event.organizerLastName"
            v-bind:organizerId="event.organizerId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/Api";
import Navbar from "@/components/Navbar";
import Event from "@/components/EventCard";
import Cookies from 'js-cookie'
export default {
  name: "My Events",
  components: {
    Event,
    Navbar
  },
  data() {
    return {
      events: [],
      pageEvents: [],
      myEvents: [],

      noEvents: false,

      categories: [],
      allCatNames: [],

      userId: null
    }
  },
  methods: {
    async getMyEvents() {
      await Api.search('startIndex=0&organizerId=' + this.userId).then((res) => {
        this.myEvents = res.data
      })
    },
    async getAllEvents() {
      await Api.search('startIndex=0').then(async (res) => {
        const data = res.data
        this.events = []
        for (let i = 0; i < data.length; i++) {
          let found = false
          for (let j = 0; j < this.myEvents.length; j++) {
            if (data[i].eventId === this.myEvents[j].eventId) {
              this.events.push(data[i])
              found = true
              break
            }
          }
          if (found === false) {
            await Api.getAttendees(data[i].eventId, Cookies.get('token')).then((res) => {
              const attendees = res.data
              for (let j = 0; j < attendees.length; j++) {
                if (attendees[j].attendeeId === this.userId) {
                  this.events.push(data[i])
                  break
                }
              }
            })
          }
        }
      }).catch((e) => {
        console.log(e)
      })
      await this.setCategories()
      await this.getOrganizerIds()
      this.pageEvents = this.events
    },
    async getCategories() {
      // Gets list of categories
      await Api.getCategories().then((res) => {
        this.categories = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    async setCategories() {
      // for each new event...
      for(let i=0; i < this.events.length; i++) {
        this.events[i].displayCategories = []
        // for each category in event...
        for(let j=0; j < this.events[i].categories.length; j++) {
          // find each categories name
          for(let k=0; k < this.categories.length; k++) {
            if(this.categories[k].id === this.events[i].categories[j]) {
              this.events[i].displayCategories.push(this.categories[k].name)
              break
            }
          }
        }
      }
    },
    async getOrganizerIds() {
      for (let i=0; i < this.events.length; i++) {
        await Api.getOneEvent(this.events[i].eventId).then((res) => {
          this.events[i].organizerId = res.data.organizerId
        })
      }
    },
    loggedOut() {
      this.$router.push({name: 'Events'})
    }
  },
  async mounted() {
    if (!Cookies.get('userId') || !Cookies.get('token')) {
      await  this.$router.push({name: 'Unauthorized'})
    }
    this.userId = parseInt(Cookies.get('userId'))

    await this.getCategories()
    await this.getMyEvents()
    await this.getAllEvents()
  }
}
</script>

<style scoped>

</style>