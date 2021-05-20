<template>
  <div>
    <Navbar></Navbar>
    <div class="container shadow align-content-center my-4">
      <event
          v-for="event in pageEvents" :id="event.index" v-bind:key="event.index"
          v-bind:eventId="event.eventId" v-bind:title="event.title" v-bind:capacity="event.capacity"
          v-bind:categories="event.categories" v-bind:date="event.date"
          v-bind:numAcceptedAttendees="event.numAcceptedAttendees"
          v-bind:organizerFirstName="event.organizerFirstName"
          v-bind:organizerLastName="event.organizerLastName"
      />
    </div>
  </div>
</template>

<script>
import Api from "@/Api";
import Navbar from "@/components/Navbar";
import Event from "@/components/EventCard";
export default {
  name: "Events",
  components: {
    Event,
    Navbar
  },
  data() {
    return {
      currentPage: "",
      filterCatIds: [],
      events: [],
      pageEvents: [],
      categories: [],
      page: 0,
      allCatNames: []
    }
  },
  methods: {
    async search() {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');

      if (query !== null || this.filterCatIds.length > 0) {
        if (query !== null && this.filterCatIds.length > 0) {
          query.trim();
          await Api.searchQC(query, this.filterCatIds).then((res) => {
            this.events = res.data
          }).catch((e) => {
            console.log(e)
          })
        } else if (query !== null) {
          query.trim();
          await Api.searchQ(query).then((res) => {
            this.events = res.data
          }).catch((e) => {
            console.log(e)
          })
        } else {
          await Api.searchC(this.filterCatIds).then((res) => {
            this.events = res.data
          }).catch((e) => {
            console.log(e)
          })
        }
      } else {
        // Search and Categories empty ~ Get All events
        await Api.getAllEvents().then((res) => {
          this.events = res.data
        }).catch((e) => {
          console.log(e)
        })
      }
    },
    async setCategories() {
      // Gets list of categories
      await Api.getCategories().then((res) => {
        this.categories = res.data
      }).catch((e) => {
        console.log(e)
      })
      let numEvents = 0;
      if (this.events.length > 10) {
        numEvents = 10;
      } else {
        numEvents = this.events.length
      }
      // for each event...
      for(let i=0; i < numEvents; i++) {
        // for each category in event...
        for(let j=0; j < this.events[i].categories.length; j++) {
          // find each categories name
          for(let k=0; k < this.categories.length; k++) {
            if(this.categories[k].id === this.events[i].categories[j]) {
              this.events[i].categories[j] = this.categories[k].name
              break
            }
          }
        }
      }
    },
    async update() {
      this.events = [];
      this.pageEvents = [];
      await this.search()
      await this.setCategories()
      this.pageEvents = this.events.slice(0, 10)
    }
  },
  async mounted() {
    await this.update()
  }
}
</script>

<style scoped>

</style>