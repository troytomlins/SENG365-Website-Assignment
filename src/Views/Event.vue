<template>
  <div id="event">
    <Navbar/>
    <div class="container shadow my-5 mx-auto text-start">
      <div class="row py-4">
        <h1 class="text-center">{{ title }}</h1>
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
            <div class="col">
              <button class="btn btn-light" type="button">See Current Attendees</button>
            </div>
            <div class="col" v-if="url">
              <p>Event URL: {{ url }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Api from "@/Api";
export default {
  name: "Event",
  components: {Navbar},
  data() {
    return {
      eventId: null,

      // Display data
      title: "",
      cost: "",
      date: "",
      location: "",
      description: "",
      numAttendees: "",
      capacity: "",
      categoriesDisplay: "",
      organizer: "",
      url: "",

      categories: [],
      attendees: [],
      otherEvents: []
    }
  },
  methods: {
    getEvent() {
      this.eventId = this.$route.params.id

      Api.getOneEvent(this.eventId).then((res) => {
        const data = res.data;

        this.title = data.title;
        this.location = data.venue;
        this.description = data.description;
        this.numAttendees = data.attendeeCount;
        this.capacity = data.capacity;
        this.organizer = data.organizerFirstName + " " + data.organizerLastName;
        this.url = data.url

        this.setPrice(data.fee)
        this.setDate(data.date);
        this.setCategories(data.categories);
        this.setOrganiserPhoto(data.organizerId);

      }).catch((e) => {
        console.log(e);
      })
    },
    setPrice(cost) {
      if (cost === "0.00") {
        this.cost = "FREE"
      } else {
        this.cost = "$" + cost
      }
    },
    setDate(date) {
      let parsedDate = new Date(date);
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
      if (cat) {
        // API call to get all categories
        Api.getCategories().then((res) => {
          const allCats = res.data;
          let cats = []

          for (let i=0; i < cat.length; i++) {
            for (let j=0; j < allCats.length; j++) {
              if (allCats[j].id === cat[i]) {
                cats.push(allCats[j].name)
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
    }
  },
  mounted() {
    this.getEvent();
  }
}
</script>

<style scoped>

</style>