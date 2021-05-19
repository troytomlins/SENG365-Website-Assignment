<template>
  <div class="container">
    <div class="container shadow align-content-center mx-5 my-3" id="register-form">
      <form id="registration" class="col-9 mx-auto needs-validation">
        <p class="h1">Registration</p>
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
        <button type="button" class="btn btn-outline-primary mx-2 my-2">Back</button>
        <button type="button" class="btn btn-primary mx-2 my-2" @click="addNewUser($event)">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import Api from "@/Api";
import User from "../config/User"
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
      confirmPasswordError: ""
    }
  },
  methods: {
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
    addNewUser(e) {
      e.preventDefault(); // Stops page from reloading
      let addInvalid = false;

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

      Api.addNewUser(user).then((res) => {
        console.log(res);
      }).catch((e) => {
        console.log(e)
      })

    }
  }
}
</script>

<style scoped>

</style>