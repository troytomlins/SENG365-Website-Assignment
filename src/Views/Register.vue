<template>
  <div class="container" id="register">
    <div class="container shadow align-content-center mx-5 my-3" id="register-form">
      <form id="registration" class="col-9 mx-auto needs-validation">
        <h1>Registration</h1>
        <div class="row mb-2">
          <div class="col">
            <label for="fName" class="form-label">First Name</label>
            <input type="text" id="fName" class="form-control" placeholder="First Name" v-model="firstName"
                   :class="toggleInvalidClass(firstNameError)" :maxlength="config.firstName.maxLength" required>
            <div class="invalid-feedback">
              {{ firstNameError }}
            </div>
          </div>
          <div class="col">
            <label for="lName" class="form-label">Last Name</label>
            <input type="text" id="lName" class="form-control" placeholder="Last Name" v-model="lastName"
                   :class="toggleInvalidClass(lastNameError)" :maxlength="config.lastName.maxLength" required>
            <div class="invalid-feedback">
              {{ lastNameError }}
            </div>
          </div>
        </div>
        <div class="mb-2">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" class="form-control" placeholder="example@example.com" v-model="email"
                 :class="toggleInvalidClass(emailError)" :maxlength="config.email.maxLength" required>
          <div class="invalid-feedback">
            {{ emailError }}
          </div>
        </div>
        <div class="mb-2">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" class="form-control" placeholder="Password" v-model="password"
                 :class="toggleInvalidClass(passwordError)" :maxlength="config.password.maxLength" required>
          <div class="invalid-feedback">
            {{ passwordError }}
          </div>
          <div id="passwordHelp" class="form-text">
            Password must be 8 characters long
          </div>
        </div>
        <div class="mb-2">
          <label for="passwordConfirm" class="form-label">Re-enter Password</label>
          <input type="password" id="passwordConfirm" class="form-control" placeholder="Password" v-model="confirmPassword"
                 :class="toggleInvalidClass(confirmPasswordError)" :maxlength="config.password.maxLength" required>
          <div class="invalid-feedback">
            {{ confirmPasswordError }}
          </div>
        </div>

        <!-- Upload image -->
        <div class="row">
          <div class="col">
            <label for="eventImage">Upload Event Image:</label>
            <input class="m-2" id="eventImage" type="file" accept="image/jpeg, image/png, image/gif" @change="filePicked($event)"
                   :class="toggleInvalidClass(imageError)">
            <div class="invalid-feedback">
              {{ imageError }}
            </div>
          </div>
          <img v-if="image" class="col-2" :src="image">
        </div>

        <div class="row" v-if="registerError">
          <div class="alert alert-danger my-4">
            {{ registerError }}
          </div>
        </div>
        <button type="button" class="btn btn-outline-primary mx-2 my-2" @click="navigateTo('Login')">Back</button>
        <button type="button" class="btn btn-primary mx-2 my-2" @click="addNewUser($event)">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Api from "@/Api";
import User from "../config/User"
import Cookies from 'js-cookie'
export default {
  name: "Register",
  components: {
  },
  data() {
    return {
      config: User.config,

      firstName: "",
      firstNameError: "",

      lastName: "",
      lastNameError: "",

      email: "",
      emailError: "",

      password: "",
      passwordError: "",

      confirmPassword: "",
      confirmPasswordError: "",

      registerError: "",

      image: null,
      imageError: "",
      imageType: ""
    }
  },
  methods: {
    async filePicked(event) {
      const files = event.target.files
      this.imageType = files[0].type
      if (this.imageType !== 'image/jpeg' && this.imageType !== 'image/png' && this.imageType !== 'image/gif') {
        this.imageError = "File must be of type jpeg, png or gif"
        return
      }
      this.imageError = ""

      const fileReader = new FileReader()

      fileReader.onload = (e) => {
        this.image = e.target.result;
      }
      await fileReader.readAsDataURL(files[0])

    },
    navigateTo(page) {
      this.$router.push({name: page})
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
    async logInUser() {
      await Api.login(this.email, this.password).then((res) => {
        const data = res.data;
        Cookies.set("userId", data.userId);
        Cookies.set("token", data.token);
      })
    },
    addNewUser(e) {
      e.preventDefault(); // Stops page from reloading
      let addInvalid = false;

      if (this.imageError) {
        addInvalid = true
      }

      // First name error checking
      this.firstName.trim()
      this.firstNameError = this.getErrorMessage(
          this.config.firstName.name,
          this.firstName,
          this.config.firstName.minLength,
          this.config.firstName.maxLength,
          this.config.firstName.regexMessage,
          this.config.firstName.regex
      )
      if (this.firstNameError) {
        addInvalid = true;
      }

      // Last name error checking
      this.lastName.trim()
      this.lastNameError = this.getErrorMessage(
          this.config.lastName.name,
          this.lastName,
          this.config.lastName.minLength,
          this.config.lastName.maxLength,
          this.config.lastName.regexMessage,
          this.config.lastName.regex
      )
      if (this.lastNameError) {
        addInvalid = true
      }

      // Email error checking
      this.emailError = this.getErrorMessage(
          this.config.email.name,
          this.email,
          this.config.email.minLength,
          this.config.email.maxLength,
          this.config.email.regexMessage,
          this.config.email.regex
      )
      if (this.emailError) {
        addInvalid = true
      }

      // Password error checking
      this.passwordError = this.getErrorMessage(
          this.config.password.name,
          this.password,
          this.config.password.minLength,
          this.config.password.maxLength,
          this.config.password.regexMessage,
      )
      if (this.passwordError) {
        addInvalid = true
      }

      // Confirm password error checking
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = "Confirmation password does not equal password field."
      } else {
        this.confirmPasswordError = ""
      }
      if (this.confirmPasswordError) {
        addInvalid = true
      }

      if (addInvalid) {
        return
      }

      const userData = {
        firstName: this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1),
        lastName: this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1),
        email: this.email,
        password: this.password
      }

      const user = new User(userData);



      Api.addNewUser(user).then(async (res) => {
        await this.logInUser()
        await this.setImage(res.data.userId)
        await this.$router.push({name: 'Profile'})
      }).catch((e) => {
        if (e.response.status === 400) {
          if (e.response.statusText === "Bad Request: email already in use") {
            this.registerError = "Email already in use"
          } else {
            this.registerError = "BAD_REQUEST"
          }
        } else {
          this.registerError = "There was a problem with the request"
        }
      })

    },
    async setImage(id) {
      const token = Cookies.get('token')

      const base = ';base64,'
      const base64Index = this.image.indexOf(base) + base.length
      const base64 = this.image.substring(base64Index)
      const raw = window.atob(base64)
      const rawLength = raw.length
      let image = new Uint8Array(new ArrayBuffer(rawLength))

      for(let i = 0; i < rawLength; i++) {
        image[i] = raw.charCodeAt(i);
      }

      await Api.setUserImage(id, image, this.imageType, token).then((res) => {
        console.log(res.statusText)
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>

</style>