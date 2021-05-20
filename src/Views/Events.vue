<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <div class="shadow align-content-center my-4">
        <event
            v-for="event in pageEvents" :id="event.index" v-bind:key="event.index"
            v-bind:eventId="event.eventId" v-bind:title="event.title" v-bind:capacity="event.capacity"
            v-bind:categories="event.categories" v-bind:date="event.date"
            v-bind:numAcceptedAttendees="event.numAcceptedAttendees"
            v-bind:organizerFirstName="event.organizerFirstName"
            v-bind:organizerLastName="event.organizerLastName"
        />
      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" v-if="page2"><a class="page-link" @click="pageDown()">Previous</a></li>
          <li class="page-item"><a class="page-link" @click="pageChange(page1)">{{ page1 }}</a></li>
          <li class="page-item" v-if="page2"><a class="page-link" @click="pageChange(page2)">{{ page2 }}</a></li>
          <li class="page-item" v-if="page3"><a class="page-link" @click="pageChange(page3)">{{ page3 }}</a></li>
          <li class="page-item" v-if="page2"><a class="page-link" @click="pageUp()">Next</a></li>
        </ul>
      </nav>
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
      events: [],
      pageEvents: [],

      filterCatIds: [],
      categories: [],
      allCatNames: [],

      page: 1,
      totalPages: 0,
      page1: null,
      page2: null,
      page3: null
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
      // for each event...
      for(let i=0; i < this.events.length; i++) {
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
      this.setPages();
    },
    setPages() {
      let entries = this.events.length;

      this.totalPages = 0;
      this.page = 0;

      // resets pagination
      this.page1 = 1;
      this.page2 = null;
      this.page3 = null;

      while (entries > 0) {
        this.totalPages += 1;
        entries -= 10
      }

      if (this.totalPages > 1) {
        this.page2 = 2
      }
      if (this.totalPages > 2) {
        this.page3 = 3
      }
      this.pageEvents = this.events.slice((this.page * 10), (this.page * 10) + 10)
    },
    pageChange(pageNo) {
      this.page = pageNo - 1;
      if (this.page === 0) {
        this.page1 = 1;
        if (this.totalPages > 1) {
          this.page2 = 2
        }
        if (this.totalPages > 2) {
          this.page3 = 3
        }
      } else if (this.page === this.totalPages-1) {
        if (this.totalPages === 2) {
          this.page1 = 1;
          this.page2 = 2
        } else {
          this.page1 = this.page-2;
          this.page2 = this.page-1;
          this.page3 = this.page;
        }
      } else {
        this.page1 = this.page-1;
        this.page2 = this.page;
        this.page3 = this.page+1;
      }
      this.getEventImages();
      this.pageEvents = this.events.slice((this.page * 10), (this.page * 10) + 10)
    },
    pageUp() {
      if (this.page < this.totalPages-1) {
        this.pageChange(this.page+2)
      }
    },
    pageDown() {
      if (this.page > 0) {
        this.pageChange(this.page)
      }
    },
    getEventImages() {

    },
  },
  async mounted() {
    await this.update()
  }
}
</script>

<style scoped>

</style>