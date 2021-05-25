<template>
  <div id="event">
    <Navbar/>

    <!-- Attendee Modal -->
    <Attendees v-bind:attendees="attendees" v-bind:is-organizer="isOrganizer" v-bind:eventId="eventId"/>

    <!-- Delete Event Modal -->
    <div class="modal fade mt-5" id="confirmDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
         aria-labelledby="confirmDeleteTitle" aria-hidden="true">>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 id="confirmDeleteTitle"> Confirm delete </h1>
          </div>
          <div class="modal-body">
            Are you sure you want to delete {{ title }}?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteEvent()">Yes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <div class="modal fade mt-5" id="loginPopup" ref="login" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
         aria-labelledby="loginPopupTitle" aria-hidden="true">>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="loginPopupTitle">Can not join Event</h3>
          </div>
          <div class="modal-body">
            Must be logged in to attend event
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Back</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="gotoLogin()">Go to login</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container shadow my-5 mx-auto text-start">
      <div class="row py-4">
        <h1 class="col text-center">{{ title }}</h1>
        <div class="col-1" v-if="isOrganizer && inFuture">
          <button class="btn px-4 btn-primary float-end" @click="editEvent()">Edit</button>
        </div>
      </div>
      <div class="row px-2">
        <div class="col-4">
          <img>
        </div>
        <div class="col-8">

          <div class="row">
            <div class="col">
              <p><b>When:</b> {{ date }}</p>
            </div>
            <div class="col" v-if="location">
              <p><b>Where:</b> {{ location }}</p>
            </div>
          </div>

          <p class="py-2">{{ description }}</p>

          <div class="row">
            <div class="col">
              <p>Price: {{ cost }}</p>
            </div>
            <div class="col" v-if="numAttendees">
              <p>Number of Attendees: {{ numAttendees }}</p>
            </div>
            <div class="col" v-if="capacity">
              <p>Capacity: {{ capacity }}</p>
            </div>
          </div>

          <div class="row">
            <div class="col" v-if="categoriesDisplay">
              <p>Categories: {{ categoriesDisplay }}</p>
            </div>
            <div class="col">
              <p>Organised by: {{ organizer }}</p>
            </div>
          </div>

          <div class="row">
            <div class="col" v-if="url">
              <p>Event URL: {{ url }}</p>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <button class="btn btn-light" type="button" data-bs-toggle="modal" data-bs-target="#attendeesPopup">See Current Attendees</button>
            </div>
            <div class="col">
              <div v-if="canJoin">
                <button class="btn btn-light" type="button" @click="joinEvent()">Join Event</button>
              </div>
              <div v-if="canLeave">
                <button class="btn btn-light" type="button" @click="leaveEvent()">Leave Event</button>
              </div>
            </div>
          </div>

          <div class="pb-5">
            <div v-if="isOrganizer && inFuture">
              <button class="btn btn-danger px-2 float-end" data-bs-toggle="modal" data-bs-target="#confirmDelete">Delete Event</button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="container shadow my-5 mx-auto text-start" v-if="otherEvents.length > 0">
      Similar Events:
      <div class="row p-2">
        <div class="col-3 card px-3" v-for="event in otherEvents" v-bind:key="event.eventId" @click="gotoEvent(event.eventId)">
          <img class="row">
          <p class="row m-0">{{ event.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Api from "@/Api";
import Cookies from 'js-cookie'
import Attendees from "@/components/Attendees";
import {Modal} from "bootstrap";
export default {
  name: "Event",
  components: {Navbar, Attendees},
  data() {
    return {
      loginModal: null,
      eventId: null,

      fee: null,

      // Display data
      title: "",
      cost: null,
      date: null,
      location: "",
      description: "",
      numAttendees: null,
      capacity: null,
      categoriesDisplay: "",
      organizer: null,
      url: "",

      currentAttendee: false,
      isOrganizer: false,
      rejected: false,
      loggedIn: false,
      canJoin: false,
      canLeave: false,
      inFuture: false,

      categories: [],
      attendees: [],
      otherEvents: []
    }
  },
  methods: {
    async getEvent() {
      this.eventId = this.$route.params.id
      const token = Cookies.get('token')

      await Api.getOneEvent(this.eventId, token).then((res) => {
        const data = res.data;

        this.title = data.title;
        this.location = data.venue;
        this.description = data.description;
        this.numAttendees = data.attendeeCount;
        this.capacity = data.capacity;
        this.organizer = data.organizerFirstName + " " + data.organizerLastName;
        this.url = data.url

        const userId = parseInt(Cookies.get('userId'))
        if (userId === data.organizerId) {
          this.isOrganizer = true
        }

        this.setPrice(data.fee)
        this.setDate(data.date);
        this.setCategories(data.categories);
        this.setOrganiserPhoto(data.organizerId);

      }).catch((e) => {
        console.log(e);
      })
    },
    async getAttendees() {
      const token = Cookies.get('token')

      await Api.getAttendees(this.eventId, token).then((res) => {
        this.attendees = res.data

        this.currentAttendee = false
        // Checks if user is currently attending event
        const userId = parseInt(Cookies.get('userId'))
        for (let i=0;i < this.attendees.length; i++) {
          if (userId === this.attendees[i].attendeeId) {
            if (this.attendees[i].status === 'rejected') {
              this.rejected = true
            }
            this.currentAttendee = true
          }
        }
      })
      this.checkIfJoinLeave()
    },
    joinEvent() {
      const token = Cookies.get('token')
      if (!token) {
        this.loginModal.show()
        return
      }
      Api.joinEvent(this.eventId, token).then(() => {
        this.getAttendees()
      })
    },
    leaveEvent() {
      const token = Cookies.get('token')
      Api.leaveEvent(this.eventId, token).then(() => {
        this.getAttendees()
      })
    },
    setPrice(cost) {
      this.fee = cost
      if (cost === "0.00") {
        this.cost = "FREE"
      } else {
        this.cost = "$" + cost
      }
    },
    setDate(date) {
      let parsedDate = new Date(date);
      let now = new Date();
      if(parsedDate > now) {
        this.inFuture = true
      }

      let displayDate = parsedDate.toDateString();
      let hourTime = parsedDate.getHours();
      let minuteTime = parsedDate.getMinutes();
      let AmPm = "AM"
      if (hourTime > 12) {
        hourTime -= 12
        AmPm = "PM"
      }
      let displayTime;
      if (minuteTime === 0) {
        displayTime = hourTime + AmPm;
      } else {
        displayTime = hourTime + ":" + minuteTime + AmPm
      }
      this.date = displayTime + " " + displayDate
    },
    setCategories(cat) {
      this.categoriesDisplay = ""
      if (cat) {
        // API call to get all categories
        Api.getCategories().then((res) => {
          const allCats = res.data;
          let cats = []

          for (let i=0; i < cat.length; i++) {
            for (let j=0; j < allCats.length; j++) {
              if (allCats[j].id === cat[i]) {
                cats.push(allCats[j])
                this.categoriesDisplay += allCats[j].name + ", "
              }
            }
          }
          this.categories = cats;
          this.categoriesDisplay = this.categoriesDisplay.slice(0, -2);
        })


      }
    },
    setOrganiserPhoto(userId) { // TODO
      Api.getUserImage(userId).then((res) => {
        console.log(res);
      }).catch(() => {

      })
    },
    checkIfJoinLeave() {
      if (Cookies.get('token')) {
        this.loggedIn = true
      }
      this.canJoin = false
      this.canLeave = false
      if(this.inFuture && !this.isOrganizer && !this.currentAttendee && this.numAttendees < this.capacity) {
        this.canJoin = true
      }
      // Checks user is not organizer && that user is logged in && that date of event is in future
      if(!this.isOrganizer && this.loggedIn && this.inFuture && this.currentAttendee && !this.rejected) {
        this.canLeave = true
      }
    },
    editEvent() {
      this.$router.push({name: 'Edit Event', params: {'id': this.eventId}})
    },
    deleteEvent() {
      const token = Cookies.get('token')
      Api.deleteEvent(this.eventId, token).then(() => {
        this.$router.push({name: 'Events'})
      })
    },
    gotoLogin() {
      this.$router.push({name: 'Login'})
    },
    getOtherEvents() {
      let q = ""
      for (let i=0;i < this.categories.length; i++) {
        q += "categoryIds=" + this.categories[i].id + "&"
      }
      q += "count=5"
      console.log(q)
      Api.search(q).then((res) => {
        const data = res.data
        this.otherEvents = []
        for (let i=0; i < data.length; i++) {
          if (this.otherEvents.length === 4) {
            break
          }
          if (res.data[i].eventId !== parseInt(this.$route.params.id)) {
            this.otherEvents.push(res.data[i])
          }
        }
      })
    },
    async gotoEvent(eventId) {
      await this.$router.push({path: `/events/${eventId}`})
      await this.getEvent()
      await this.getAttendees();
      this.getOtherEvents()
    }
  },
  async mounted() {
    await this.getEvent();
    await this.getAttendees();
    this.loginModal = new Modal(document.getElementById("loginPopup"));
    this.getOtherEvents()
  }
}
</script>

<style scoped>

</style>