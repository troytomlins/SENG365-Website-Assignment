<template>
  <div id="profile">
    <Navbar/>

    <!-- Edit Modal -->
    <EditProfile v-bind:firstName="firstName" v-bind:lastName="lastName" v-bind:email="email"/>

    <!-- Change Profile Image Modal -->
    <div class="modal fade mt-5" id="imageChange" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
         aria-labelledby="imageChangeTitle" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 id="imageChangeTitle">Upload/Delete Profile Image</h4>
          </div>
          <div class="modal-body">
            <input class="mb-2" id="profileImage" type="file" accept="image/jpeg, image/png, image/gif" @change="filePicked($event)"
                   :class="toggleInvalidClass(imageError)">
            <div class="invalid-feedback">
              {{ imageError }}
            </div>
            <img v-if="newImage" class="img-fluid" :src="newImage">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger col mx-4" data-bs-dismiss="modal" @click="deleteImage()">Delete</button>
            <button type="button" class="btn btn-outline-primary col mx-4" data-bs-dismiss="modal" @click="resetImage()">Cancel</button>
            <button type="button" class="btn btn-success col mx-4" data-bs-dismiss="modal" @click="updateImage()">Confirm</button>
          </div>
        </div>
      </div>
    </div>

    <h1 class="text-center m-5">Profile</h1>
    <div class="container">
      <div class="shadow row p-5">
        <div class="col-4">
          <img class="img-fluid" :src="image">
          <button class="btn btn-primary m-2" data-bs-toggle="modal" data-bs-target="#imageChange">Change Image</button>
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
import {Modal} from "bootstrap";
export default {
  name: 'Profile',
  components: {EditProfile, Navbar},
  data() {
    return {
      newImageModal: null,
      firstName: "",
      lastName: "",
      email: "",
      image: null,

      newImage: null,
      imageError: "",
      imageType: ""
    }
  },
  methods: {
    resetImage() {
      this.newImage = null
      document.getElementById('profileImage').value = null
      this.imageError = ""
    },
    deleteImage() {
      const token = Cookies.get('token')
      const userId = Cookies.get('userId')
      Api.deleteUserImage(userId, token).then(() => {
        this.getUserImage(userId)
        this.resetImage()
      })
    },
    async updateImage() {
      const token = Cookies.get('token')
      const id = Cookies.get('userId')

      const base = ';base64,'
      const base64Index = this.newImage.indexOf(base) + base.length
      const base64 = this.newImage.substring(base64Index)
      const raw = window.atob(base64)
      const rawLength = raw.length
      let image = new Uint8Array(new ArrayBuffer(rawLength))

      for(let i = 0; i < rawLength; i++) {
        image[i] = raw.charCodeAt(i);
      }

      await Api.setUserImage(id, image, this.imageType, token).then(() => {
        this.getUserImage(id)
        this.resetImage()
      }).catch((e) => {
        console.log(e)
      })
    },
    async filePicked(event) {
      const files = event.target.files
      this.imageType = files[0].type
      if (this.imageType !== 'image/jpeg' && this.imageType !== 'image/png' && this.imageType !== 'image/gif') {
        this.imageError = "File must be of type jpeg, png or gif"
        this.newImage = null
        return
      }
      this.imageError = ""

      const fileReader = new FileReader()

      fileReader.onload = (e) => {
        this.newImage = e.target.result;
      }
      await fileReader.readAsDataURL(files[0])

    },
    toggleInvalidClass(errorMessage) {
      let classList = ['form-control']
      if (errorMessage) {
        classList.push('is-invalid')
      }
      return classList

    },
    getUser(id) {
      Api.getUser(id, Cookies.get('token')).then((res) => {
        let data = res.data
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.email = data.email
      }).catch((e) => {
        console.log(e)
      })
    },
    getUserImage(id) {
      Api.getUserImage(id, Cookies.get('token')).then((res) => {
        let image = `data:${res.headers['content-type']};base64,${Buffer.from(res.data, 'binary').toString('base64')}`
        this.image = image
      }).catch(() => {
        this.image = '/defaultUser.png'
      })
    },
    loggedOut() {
      this.$router.push({name: 'Events'})
    }
  },
  mounted() {
    if (!Cookies.get('userId') || !Cookies.get('token')) {
      this.$router.push({name: 'Unauthorized'})
    }
    const id = Cookies.get('userId')
    this.getUser(id);
    this.getUserImage(id)
    this.newImageModal = new Modal(document.getElementById("imageChange"));
  }
}
</script>

<style>

</style>