<template>
  <div>
    <Navbar></Navbar>
    <div class="container">
      <div class="row m-2">
        <div class="col-2">
          Filter:
          <select id="filter" class="form-select" @change="addFilter($event)">
            <option selected disabled>Category</option>
            <option v-for="category in categories" v-bind:key="category.index">{{category.name}}</option>
          </select>
        </div>
        <div class="col">
          <div class="row">
            <p class="col-3 pt-2" v-if="currentFilters.length > 0">Current Filters:</p>
            <div class="col-9 align-content-start">
              <button class="btn v-btn--rounded btn-light" v-for="filter in currentFilters" v-bind:key="filter" @click="removeFilter(filter)">{{filter}} x </button>
            </div>
          </div>
        </div>
        <div class="col-2">
          Sort:
          <select id="sort" class="form-select" @change="changeSort($event)">
            <option selected default value="DATE_ASC">Date (Earliest)</option>
            <option value="DATE_DESC">Date (Latest)</option>
            <option value="ALPHABETICAL_ASC">Title (A-Z)</option>
            <option value="ALPHABETICAL_DESC">Title (Z-A)</option>
            <option value="ATTENDEES_DESC">Attendees (Most)</option>
            <option value="ATTENDEES_ASC">Attendees (Least)</option>
            <option value="CAPACITY_DESC">Capacity (Most)</option>
            <option value="CAPACITY_ASC">Capacity (Least)</option>
          </select>
        </div>
      </div>
      <div class="shadow align-content-center my-4">
        <h2 class="p-5" v-if="noEvents">No events found!</h2>
        <event
            v-for="event in pageEvents" :id="event.index" v-bind:key="event.eventId"
            v-bind:eventId="event.eventId" v-bind:title="event.title" v-bind:capacity="event.capacity"
            v-bind:categories="event.categories" v-bind:date="event.date"
            v-bind:numAcceptedAttendees="event.numAcceptedAttendees"
            v-bind:organizerFirstName="event.organizerFirstName"
            v-bind:organizerLastName="event.organizerLastName"
            v-bind:organizerId="event.organizerId"
        />
      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" v-if="page !== 0"><a class="page-link" style="cursor:pointer;" @click="pageDown()">Previous</a></li>
          <li class="page-item active"><a class="page-link" href="#">{{ page+1 }}</a></li>
          <li class="page-item" v-if="!finalPage"><a class="page-link" style="cursor:pointer;" @click="pageUp()">Next</a></li>
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
      events: [],
      pageEvents: [],
      noEvents: false,

      filterCatIds: [],
      categories: [],
      allCatNames: [],
      currentFilters: [],

      searchQuery: "",
      sortBy: "DATE_ASC",

      page: 0,
      firstPage: true,
      finalPage: false
    }
  },
  methods: {
    async search() {
      // Sets up search query for getPage()
      const urlParams = new URLSearchParams(window.location.search);

      const query = urlParams.get('q');

      this.searchQuery = ""

      if (query) {
        this.searchQuery += "q=" + query + "&"
      }
      if (this.filterCatIds.length > 0) {
        for (let i=0; i < this.filterCatIds.length; i++) {
          this.searchQuery += "categoryIds=" + this.filterCatIds[i] + "&"
        }
      }
      if (this.sortBy) {
        this.searchQuery += "sortBy=" + this.sortBy + "&"
      }

      await this.getPage(0);
    },
    async getCategories() {
      // Gets list of categories
      await Api.getCategories().then((res) => {
        this.categories = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    setCategories() {
      // for each new event...
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
      this.noEvents = false
      this.events = [];
      this.page = 0;

      await this.search()
      this.setCategories()

      this.page = 0;
      this.firstPage = true

      if (this.events.length === 0) {
        this.noEvents = true
      }
    },
    async pageChange(pageNo) {
      console.log(pageNo)
      if (pageNo === 0) {
        this.firstPage = true
      } else {
        this.firstPage = false
      }
      this.page = pageNo;
      await this.getPage(pageNo)
    },
    async getPage(pageNo) {

      let searchQuery = this.searchQuery

      const startIndex = pageNo * 10

      searchQuery += "startIndex=" + startIndex + "&count=11"

      await Api.search(searchQuery).then(async (res) => {
        this.events = []
        this.finalPage = true
        if(res.data.length > 0) {
          for(let i=0; i < res.data.length; i++) {
            if (i === 10) {
              this.finalPage = false
            } else {
              this.events.push(res.data[i])
            }
          }
          this.setCategories()
          await this.getOrganizerIds()
        }
      }).catch((e) => {
        console.log(e)
      })
      this.pageEvents = this.events
    },
    pageUp() {
      console.log('PageUp', this.finalPage)
      if (!this.finalPage) {
        this.pageChange(this.page+1)
      }
    },
    pageDown() {
      if (!this.firstPage) {
        this.pageChange(this.page-1)
      }
    },
    changeSort(event) {
      let sort = event.target.value.trim();

      if (sort !== this.sortBy) {
        this.sortBy = sort;
      }
      this.update()
    },
    addFilter(event) {
      let name = event.target.value.trim();
      // Checks if filter already in filters
      for (let i=0; i < this.currentFilters.length; i++) {
        if (this.currentFilters[i] === name) {
          event.target.value = "Category"
          return
        }
      }

      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].name === name) {
          this.filterCatIds.push(this.categories[i].id)
          this.currentFilters.push(name);
          break
        }
      }
      event.target.value = "Category"
      this.update();
    },
    removeFilter(filter) {
      let id;
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].name === filter) {
          id = this.categories[i].id;
          break
        }
      }
      // If id found
      if(id) {
        // Remove from filterCatIds
        for (let i=0; i < this.filterCatIds.length; i++) {
          if (this.filterCatIds[i] === id) {
            this.filterCatIds.splice(i, 1);
          }
        }
        // Remove from currentFilters
        for (let i=0; i < this.currentFilters.length; i++) {
          if (this.currentFilters[i] === filter) {
            this.currentFilters.splice(i, 1)
          }
        }
        this.update()
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
      return
    }
  },
  async mounted() {
    await this.getCategories()
    await this.update()
  }
}
</script>

<style scoped>

</style>