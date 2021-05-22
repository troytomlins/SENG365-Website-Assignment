<template>
  <!-- Modal -->
  <div class="modal fade" id="editPopup" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="editPopupTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <!--title-->
        <div class="modal-header">
          <h2 id="editPopupTitle" class="text-center">Edit Profile</h2>
        </div>

        <!--modal body-->
        <div class="modal-body form">
          <form id="editProfile" @submit.prevent>

            <div class="row mb-2">
              <div class="col">
                <label for="fName" class="form-label">First Name</label>
                <input type="text" id="fName" class="form-control" :placeholder="firstName" v-model="newFirstName"
                       :class="toggleInvalidClass(firstNameError)" :maxlength="config.firstName.maxLength" required>
                <div class="invalid-feedback">
                  {{ firstNameError }}
                </div>
              </div>
              <div class="col">
                <label for="lName" class="form-label">Last Name</label>
                <input type="text" id="lName" class="form-control" :placeholder="lastName" v-model="newLastName"
                       :class="toggleInvalidClass(lastNameError)" :maxlength="config.lastName.maxLength" required>
                <div class="invalid-feedback">
                  {{ lastNameError }}
                </div>
              </div>
            </div>
            <div class="mb-2">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" class="form-control" :placeholder="email" v-model="newEmail"
                     :class="toggleInvalidClass(emailError)" :maxlength="config.email.maxLength" required>
              <div class="invalid-feedback">
                {{ emailError }}
              </div>
            </div>
            <hr class="m-4">
            <div class="mb-2">
              <label for="password" class="form-label">New Password</label>
              <input type="password" id="newPassword" class="form-control" placeholder="Password" v-model="newPassword"
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
            <div class="mb-2">
              <label for="password" class="form-label">Current Password*:</label>
              <input type="password" id="password" class="form-control" placeholder="Password" v-model="currentPassword"
                     :class="toggleInvalidClass(currentPasswordError)" :maxlength="config.password.maxLength">
              <div class="invalid-feedback">
                {{ currentPasswordError }}
              </div>
              <div class="form-text">
                *Required when changing password
              </div>
            </div>

            <div class="row" v-if="editError">
              <div class="alert alert-danger my-4">
                {{ editError }}
              </div>
            </div>

          </form>
        </div>


        <!--footer-->
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-outline-primary" @click="dataReset()" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary " @click="confirmEdit()">Confirm</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import { Modal } from "bootstrap";
import User from "@/config/User";
import Api from "@/Api";
import Cookies from 'js-cookie'

export default {
  name: 'EditProfile',
  props: {
    firstName: {
      type: String,
      default: "First",
      required: true
    },
    lastName: {
      type: String,
      default: "Last",
      required: true
    },
    email: {
      type: String,
      default: "example@example.com",
      required: true
    }
  },
  data() {
    return {
      modal: null,
      config: User.config,

      newFirstName: "",
      firstNameError: "",

      newLastName: "",
      lastNameError: "",

      newEmail: "",
      emailError: "",

      newPassword: "",
      passwordError: "",

      confirmPassword: "",
      confirmPasswordError: "",

      currentPassword: "",
      currentPasswordError: "",

      editError: ""
    }
  },
  methods: {
    confirmEdit() {
      let data = {}
      let changeInvalid = false;

      // If First name Change
      if (this.newFirstName.trim()) {
        // Checks change against regex and displays error if any
        this.firstNameError = this.getErrorMessage(
            this.config.firstName.name,
            this.newFirstName,
            this.config.firstName.minLength,
            this.config.firstName.maxLength,
            this.config.firstName.regexMessage,
            this.config.firstName.regex
        )
        if (this.firstNameError) {
          changeInvalid = true;
        }
        data['firstName'] = this.newFirstName
      } else {
        this.firstNameError = ""
      }

      // If last name change
      if (this.newLastName.trim()) {
        // Checks change against regex and displays error if any
        this.lastNameError = this.getErrorMessage(
            this.config.lastName.name,
            this.newLastName,
            this.config.lastName.minLength,
            this.config.lastName.maxLength,
            this.config.lastName.regexMessage,
            this.config.lastName.regex
        )
        if (this.lastNameError) {
          changeInvalid = true
        }
        data['lastName'] = this.newLastName
      } else {
        this.lastNameError = ""
      }

      // if email change
      if (this.newEmail.trim()) {
        // Checks change against regex and displays error if any
        this.emailError = this.getErrorMessage(
            this.config.email.name,
            this.newEmail,
            this.config.email.minLength,
            this.config.email.maxLength,
            this.config.email.regexMessage,
            this.config.email.regex
        )
        if (this.emailError) {
          changeInvalid = true
        }
        data['email'] = this.newEmail
      } else {
        this.emailError = ""
      }

      if (this.newPassword) {
        // Password error checking
        this.passwordError = this.getErrorMessage(
            this.config.password.name,
            this.newPassword,
            this.config.password.minLength,
            this.config.password.maxLength,
            this.config.password.regexMessage,
        )
        if (this.passwordError) {
          changeInvalid = true
        }
        data['password'] = this.newPassword
      } else {
        this.passwordError = ""
      }

      if (this.newPassword !== this.confirmPassword) {
        this.confirmPasswordError = "Passwords must match"
        changeInvalid = true
      } else {
        this.confirmPasswordError = ""
      }

      if (this.newPassword && !this.currentPassword) {
        this.currentPasswordError = "Password required"
        changeInvalid = true
      } else {
        this.currentPasswordError = ""
      }

      if (this.currentPassword.trim()) {
        data['currentPassword'] = this.currentPassword
      }


      if (!changeInvalid) {
        const userId = Cookies.get('userId')
        const token = Cookies.get('token')
        Api.updateUser(userId, data, token).then(() => {
          this.editError = ""
          this.dataReset()
          this.modal.hide()
        }).catch((e) => {
          if (e.request.status === 400) {
            this.editError = e.request.statusText
          } else if (e.request.status === 401) {
            this.editError = "Unauthorized"
          } else if (e.request.status === 403) {
            this.editError = "Forbidden"
          } else {
            console.log(e)
          }
        })
      }
    },
    dataReset() {
      this.newFirstName = ""
      this.firstNameError = ""

      this.newLastName = ""
      this.lastNameError = ""

      this.newEmail = ""
      this.emailError = ""

      this.newPassword = ""
      this.passwordError = ""

      this.confirmPassword = ""
      this.confirmPasswordError = ""

      this.currentPassword = ""
      this.currentPasswordError = ""

      this.editError = ""
    },
    toggleInvalidClass(errorMessage) {
      let classList = ['form-control']
      if (errorMessage) {
        classList.push('is-invalid')
      }
      return classList
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
    between(val, min, max) {
      return min <= val && val <= max;
    }
  },
  mounted() {
    this.modal = new Modal(document.getElementById("editPopup"));
  }
}
</script>