<template>
  <div id="navbar">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" @click="navigateTo('Home')" style="cursor:pointer;">AppName</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mb-2 mb-lg-0 col">
            <li class="nav-item">
              <a class="nav-link" @click="navigateTo('Events')" style="cursor:pointer;">Events</a>
            </li>
            <li class="nav-item" v-if="loggedIn">
              <a class="nav-link" @click="navigateTo('Create Event')" style="cursor: pointer">Create Event</a>
            </li>
          </ul>
          <form class="d-flex col">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="searchQuery">
            <button class="btn btn-outline-success" type="submit" @click="search($event)">Search</button>
          </form>
          <div class="mx-2 col row" v-if="loggedIn">
            <div class="mx-2 col-8">
              <ul class="navbar-nav">
                <li class="nav-item ms-auto px-2">
                  <a class="nav-link" @click="navigateTo('My Events')" style="cursor: pointer">My Events</a>
                </li>
                <li class="nav-item px-2">
                  <a class="nav-link" @click="navigateTo('Profile')" style="cursor: pointer">Profile</a>
                </li>
              </ul>
            </div>
            <button class="btn btn-outline-primary float-end col" @click="logOut()">Log out</button>
          </div>
          <div v-else class="mx-2 col">
            <button class="btn btn-outline-primary float-end" @click="navigateTo('Login')">Log in/Register</button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Api from "@/Api";
export default {
  name: "Navbar",
  data() {
    return {
      loggedIn: false,
      searchQuery: ""
    }
  },
  methods: {
    logOut() {
      Api.logOut(Cookies.get('token')).catch((e) => {
        console.log(e)
      })
      Cookies.remove('token')
      Cookies.remove('userId')
      this.loggedIn = false
    },
    navigateTo(page) {
      this.$router.push({name: page});
    },
    async search(e) {
      e.preventDefault();
      const query = this.searchQuery.trim();
      if(query.length > 0) {
        if (this.$route.name === 'Events') {
          await this.$router.push({name: 'Events', query: {q: `${query}`}})
          this.$parent.update();
        } else {
          await this.$router.push({name: 'Events', query: {q: `${query}`}})
        }
      } else if (this.$route.name === 'Events') {
        await this.$router.push({name: 'Events'})
        this.$parent.update();
      } else {
        await this.$router.push({name: 'Events'})
      }
    }
  },
  mounted () {
    if (Cookies.get('token')) {
      this.loggedIn = true
    }
  }
}
</script>

<style scoped>

</style>