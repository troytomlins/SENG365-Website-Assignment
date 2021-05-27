<template>
  <div id="createEvent">
    <Navbar/>
    <div class="container shadow align-content-center mx-auto my-5" id="event-form">
      <form id="registration" class="col-9 mx-auto needs-validation">
        <h1 class="pt-3">Edit Event</h1>
        <div class="row mb-2">

          <!-- Title -->
          <div class="row">
            <div class="col">
              <label for="title" class="form-label col-form-label-lg m-2">Title:</label>
              <input type="text" id="title" class="form-control form-control-lg" placeholder="Title" v-model="title"
                     :class="toggleInvalidClass(titleError)" :maxlength="config.title.maxLength" required>
              <div class="invalid-feedback">
                {{ titleError }}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <!-- Event Type -->
              <label class="form-label my-2" for="eventType">Event Type:</label>
              <select class="form-select col" id="eventType" v-model="eventType">
                <option value="0">In person</option>
                <option value="1">Online</option>
              </select>
            </div>

            <div class="col">
              <!-- Date / Time -->
              <label for="date" class="form-label my-2">When:</label>
              <input type="datetime-local" id="date" class="form-control" v-model="date"
                     :class="toggleInvalidClass(dateError)">
              <div class="invalid-feedback">
                {{ dateError }}
              </div>
            </div>

            <div class="col">
              <label for="fee" class="form-label m-2">Fee:</label>
              <input type="number" id="fee" class="form-control" placeholder="Leave black for free event" v-model="fee"
                     :class="toggleInvalidClass(feeError)" :maxlength="config.fee.maxLength" required>
              <div class="invalid-feedback">
                {{ feeError }}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col" v-if="eventType !== '1'">
              <!-- Event Venue -->
              <label for="venue" class="form-label my-2">Event Venue:</label>
              <input type="text" id="venue" class="form-control" placeholder="Event Venue" v-model="venue"
                     :class="toggleInvalidClass(venueError)">
              <div class="invalid-feedback">
                {{ venueError }}
              </div>
            </div>
            <div class="col">
              <!-- Event URL -->
              <label for="url" class="form-label my-2">Event URL:</label>
              <input type="text" id="url" class="form-control" placeholder="Event URL" v-model="url"
                     :class="toggleInvalidClass(urlError)">
              <div class="invalid-feedback">
                {{ urlError }}
              </div>
            </div>
            <div class="col">
              <!-- Capacity -->
              <label for="capacity" class="form-label my-2">Capacity:</label>
              <input type="number" id="capacity" class="form-control" placeholder="Max number of guests" v-model="capacity"
                     :class="toggleInvalidClass(capacityError)">
              <div class="invalid-feedback">
                {{ capacityError }}
              </div>
            </div>
          </div>

          <div class="form-check-inline mt-3">
            <input class="form-check-input me-2" type="checkbox" value="" id="attendanceControlCheck" v-model="requiresAttendanceControl">
            <label class="form-check-label ms-2" for="attendanceControlCheck">
              Requires Attendance Control
            </label>
          </div>

          <hr class="mt-5">

          <div class="row">
            <!-- Categories -->
            <label class="form-label m-2" for="categories">Categories:</label>
            <div class="col">
              <select class="form-select" id="categories" v-model="selectedCat">
                <option disabled selected>Select Categories</option>
                <option v-for="category in categories" v-bind:key="category.id" v-bind:value="{ id: category.id, name: category.name }">{{category.name}}</option>
              </select>
            </div>
            <div class="col-4">
              <button type="button" class="btn btn-primary" @click="addCategory()">Add Category</button>
            </div>
          </div>

          <div class="row">
            <!-- Selected Categories -->
            <div class="row mt-3" v-if="selectedCategories.length > 0">
              <p class="col-3 pt-2 m-0">Current categories:</p>
              <div class="col-9">
                <button type="button" class="btn v-btn--rounded btn-light" v-for="cat in selectedCategories" v-bind:key="cat.id" @click="removeCategory(cat.id)">{{cat.name}} x </button>
              </div>
            </div>
          </div>

          <hr class="mt-4">

          <!-- Description -->
          <div class="row">
            <div class="col">
              <label for="description" class="form-label m-2">Description:</label>
              <textarea type="text" id="description" class="form-control" placeholder="Description" v-model="description"
                        :class="toggleInvalidClass(descriptionError)" :maxlength="config.description.maxLength" rows="3" />
              <div class="invalid-feedback">
                {{ descriptionError }}
              </div>
            </div>
          </div>
        </div>

        <div class="row m-2" v-if="createError">
          <div class="alert alert-danger my-4">
            {{ createError }}
          </div>
        </div>
        <button type="button" class="btn btn-primary mx-2 my-2" @click="checkEvent($event)">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Event from '../config/Event'
import Navbar from "@/components/Navbar";
import Api from "@/Api";
import Cookies from 'js-cookie'

export default {
  name: 'EditEvent',
  components: {Navbar},
  data() {
    return {
      config: Event.config,

      title: "",
      titleError: "",

      description: "",
      descriptionError: "",

      date: "",
      dateError: "",

      eventType: "Select Event Type",

      url: "",
      urlError: "",

      venue: "",
      venueError: "",

      capacity: null,
      capacityError: "",

      requiresAttendanceControl: false,

      fee: null,
      feeError: "",

      categories: [],

      createError: "",

      selectedCat: "Select Categories",
      selectedCategories: []
    }
  },
  methods: {
    getCategories() {
      Api.getCategories().then((res) => {
        this.categories = res.data
      })
    },
    addCategory() {
      for (let i=0; i < this.selectedCategories.length; i++) {
        if(this.selectedCategories[i].id === this.selectedCat.id) {
          return
        }
      }
      this.selectedCategories.push(this.selectedCat)
    },
    removeCategory(cat) {
      for (let i=0; i < this.selectedCategories.length; i++) {
        if (this.selectedCategories[i].id === cat) {
          this.selectedCategories.splice(i, 1);
          return
        }
      }
    },
    toggleInvalidClass(errorMessage) {
      let classList = ['form-control']
      if (errorMessage) {
        classList.push('is-invalid')
      }
      return classList

    },
    between(val, min, max) {
      return min <= val && val <= max;
    },
    getErrorMessage(name, inputVal, minLength, maxLength, regexMessage = "", regex = /^[\s\S]*$/) {
      let errorMessage = "";
      if (inputVal === "" && minLength >= 1) {
        errorMessage = "Please enter input";
      }
      else if (!regex.test(inputVal)) {
        errorMessage = regexMessage;
      } else if (!this.between(inputVal.length, minLength, maxLength)) {
        errorMessage = `Input must be between ${minLength} and ${maxLength} characters long.`
      }
      return errorMessage;
    },
    checkEvent() {
      let isValid = true;
      let data = {}

      // Title error check
      this.titleError = this.getErrorMessage(
          this.config.title,
          this.title,
          this.config.title.minLength,
          this.config.title.maxLength,
          this.config.title.regexMessage,
          this.config.title.regex
      )
      if (this.titleError) {
        isValid = false
      } else {
        data['title'] = this.title;
      }

      // Description error check
      this.descriptionError = this.getErrorMessage(
          this.config.description,
          this.description,
          this.config.description.minLength,
          this.config.description.maxLength,
          this.config.description.regexMessage,
          this.config.description.regex
      )
      if (this.descriptionError) {
        isValid = false
      } else {
        data['description'] = this.description
      }

      // Selected Categories error checking
      if (this.selectedCategories.length === 0) {
        isValid = false
      } else {
        let cats = []
        for (let i=0; i < this.selectedCategories.length; i++) {
          cats.push(this.selectedCategories[i].id)
        }
        data['categoryIds'] = cats
      }

      // Event type
      if (this.eventType === "Online") {
        data['isOnline'] = true
      } else if (this.eventType === "In person") {
        data['isOnline'] = false
      }

      // Date error checking
      if (this.date) {
        let now = new Date()
        let selected = new Date(this.date)

        if (selected < now) {
          isValid = false;
          this.dateError = "Date must be in the future"
        } else {
          data['date'] = this.date
          this.dateError = ""
        }
      } else {
        this.dateError = "A date must be entered"
        isValid = false
      }

      // Fee error checking
      this.feeError = this.getErrorMessage(
          this.config.fee,
          this.fee,
          this.config.fee.minLength,
          this.config.fee.maxLength,
          this.config.fee.regexMessage,
          this.config.fee.regex
      )
      if (this.feeError) {
        isValid = false
      } else {
        data['fee'] = parseFloat(this.fee)
      }

      // Venue error checking
      if (this.eventType !== 'Online') {
        this.venueError = this.getErrorMessage(
            this.config.venue,
            this.venue,
            this.config.venue.minLength,
            this.config.venue.maxLength,
            this.config.venue.regexMessage,
            this.config.venue.regex
        )
        if (this.venueError) {
          isValid = false
        } else {
          data['venue'] = this.venue
        }
      }

      // Event URL error checking
      if (this.eventType === 'Online' && !this.url) {
        this.urlError = "Online events must have url"
        isValid = false
      } else if (this.url) {
        data['url'] = this.url
      }

      // Capacity error checking
      if (this.capacity) {
        this.capacityError = this.getErrorMessage(
            this.config.capacity,
            this.capacity,
            this.config.capacity.minLength,
            this.config.capacity.maxLength,
            this.config.capacity.regexMessage,
            this.config.capacity.regex
        )
        if (this.capacity < this.numAttendees) {
          this.capacityError = "Current number of attendees is greater than new capacity"
        }
        if (this.capacityError) {
          isValid = false
        } else {
          data['capacity'] = parseInt(this.capacity)
        }
      }

      // Attendance Control
      if (this.requiresAttendanceControl) {
        data['requiresAttendanceControl'] = true
      } else {
        data['requiresAttendanceControl'] = false
      }

      if (isValid) {
        this.editEvent(data);
      }

    },
    editEvent(data) {
      const token = Cookies.get('token');
      const eventId = this.$route.params.id
      Api.editEvent(data, eventId, token).then(() => {
        this.$router.push({name: 'Event', params: {id: eventId}})
      }).catch((e) => {
        console.log(e)
      })
    },
    getCurrentData() {
      const eventId = this.$route.params.id
      const token = Cookies.get('token')
      Api.getOneEvent(eventId, token).then((res) => {
        const data = res.data
        console.log(data)
        this.title = data.title
        this.description = data.description
        this.url = data.url
        this.capacity = data.capacity.toString()
        this.fee = data.fee.toString()
        this.venue = data.venue
        this.eventType = data.isOnline

        let date = data.date.toString().substr(0, 23)
        this.date = date

        for (let i=0; i < data.categories.length; i++) {
          for (let j=0; j < this.categories.length; j++) {
            if (data.categories[i] === this.categories[j].id) {
              this.selectedCategories.push(this.categories[j])
              break
            }
          }
        }
      })
    },
    loggedOut() {
      const eventId = this.$route.params.id
      this.$router.push({name: 'Event', params: {id: eventId}})
    }
  },
  mounted() {
    if (!Cookies.get('userId') || !Cookies.get('token')) {
      this.$router.push({name: 'Unauthorized'})
    }
    this.getCategories()
    this.getCurrentData()
  }
}
</script>

<style>

</style>