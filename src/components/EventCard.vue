<template>
  <div class="card my-2">
    <div class="row card-body">
      <!-- Hero Image -->
      <div class="col-2">
        <img :src="imgSrc" class="img-thumbnail" alt="blah" >
      </div>

      <div class="col-10">
        <div class="row mb-3">
          <a class="col-8 nav-link" style="cursor: pointer" @Click="gotoEvent()"><h3 class="col-8 text-start text-dark">{{ title }}</h3></a>
          <p class="col-4 text-end">{{ displayTime }} {{ displayDate }}</p>
        </div>
        <div class="row">
          <div class="col">
            <p>Current No. of Attendees: {{ numAcceptedAttendees }}</p>
          </div>
          <div class="col">
            <p v-if="capacity">Capacity: {{ capacity }}</p>
          </div>
        </div>
        <div class="row">
          <p class="col-7 text-start">Categories: {{ categoryString }}</p>
          <p class="col text-end">Organiser: {{ organizerFirstName }} {{ organizerLastName }}</p>
          <img class="col-1" :src="orgImg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/Api";
export default {
  name: "Event",
  props: {
    eventId: {
      type: Number,
      default: -1,
      required: true
    },
    title: {
      type: String,
      default: 'TITLE',
      required: true
    },
    categories: {
      type: Array,
      default: new Array(),
      required: false
    },
    date: {
      type: String,
      default: null,
      required: true
    },
    numAcceptedAttendees: {
      type: Number,
      default: 0,
      required: false
    },
    capacity: {
      type: Number,
      default: -1,
      required: false
    },
    organizerFirstName: {
      type: String,
      default: "FIRST",
      required: false
    },
    organizerLastName: {
      type: String,
      default: "LAST",
      required: false
    },
    organizerId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      categoryString: "",
      displayDate: "",
      displayTime: "",
      imgSrc:  '/default-event-photo.png',
      orgImg: '/defaultUser.png'
    }
  },
  methods: {
    setCategoryString() {
      this.categoryString = ""
      for(let i=0; i < this.categories.length; i++) {
        this.categoryString += this.categories[i] + ", "
      }
      this.categoryString = this.categoryString.slice(0, -2)
    },
    gotoEvent() {
      this.$router.push({name: 'Event', params: {id: this.eventId}})
    },
    calculateDisplayDate() {
      let parsedDate = new Date(this.date);
      this.displayDate = parsedDate.toDateString();
      let hourTime = parsedDate.getHours();
      let minuteTime = parsedDate.getMinutes();
      let AmPm = "AM"
      if (hourTime > 12) {
        hourTime -= 12
        AmPm = "PM"
      }
      if (minuteTime === 0) {
        this.displayTime = hourTime + AmPm;
      } else {
        this.displayTime = hourTime + ":" + minuteTime + AmPm
      }
    },
    getImage() {
      Api.getEventImage(this.eventId).then((res) => {
        let image;
        image = `data:${res.headers['content-type']};base64,${Buffer.from(res.data, 'binary').toString('base64')}`
        this.imgSrc = image
      }).catch((e) => {
        this.imgSrc = '/default-event-photo.png'
        console.log(e)
      })
      Api.getUserImage(this.organizerId).then((res) => {
        let image;
        image = `data:${res.headers['content-type']};base64,${Buffer.from(res.data, 'binary').toString('base64')}`
        this.orgImg = image
      }).catch((e) => {
        if (e.request) {
          if (e.request.status === 404) {
            this.orgImg = '/defaultUser.png'
          } else {
            console.log(e.request.statusMessage)
          }
        } else {
          console.log(e)
        }
      })
    }
  },
  mounted() {
    this.getImage()
    this.calculateDisplayDate()
    this.setCategoryString()
  }
}
</script>

<style scoped>

</style>