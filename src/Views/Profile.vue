<template>
  <div id="profile">
    <Navbar/>

    <EditProfile v-bind:firstName="firstName" v-bind:lastName="lastName" v-bind:email="email"/>

    <h1 class="text-center m-5">Profile</h1>
    <div class="container">
      <div class="shadow row p-5">
        <div class="col-4">
          <img style="width: 150px" src=""/>
        </div>
        <div class="col-8 text-start">
          <button type="button" class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#editPopup">Edit</button>
          <div class="row">
            <h2 class="pb-4">{{ firstName }} {{ lastName }}</h2>
          </div>
          <div class="row" v-if="email">
            <p>Email: {{ email }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Api from "@/Api";
import Cookies from 'js-cookie'
import Navbar from "@/components/Navbar";
import EditProfile from "@/components/EditProfile";
export default {
  name: 'Profile',
  components: {EditProfile, Navbar},
  data() {
    return {
      firstName: "",
      lastName: "",
      email: ""
    }
  },
  methods: {
    getUser(id) {
      Api.getUser(id, Cookies.get('token')).then((res) => {
        let data = res.data
        console.log(data)
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.email = data.email
        console.log(res)
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  mounted() {
    let id = Cookies.get('userId')
    this.getUser(id);
  }
}
</script>

<style>

</style>