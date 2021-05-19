<template>
  <div id="main">
    <div class="container shadow align-content-center py-3" id="login-form">
      <form id="login" class="col-8 mx-auto my-2">
        <h1>Login</h1>
        <br>
        <div class="row my-1">
          <label class="form-label" for="email">Email</label>
          <input class="form-control" placeholder="example@example.com" id="email" type="email" v-model="email"
                 :class="toggleInvalidClass(emailError)" :maxlength="config.email.maxLength" required>
          <div class="invalid-feedback">
            {{ emailError }}
          </div>
        </div>
        <div class="row my-1">
          <label class="form-label" for="password">Password</label>
          <input class="form-control" placeholder="Password" id="password" type="password" v-model="password"
                 :class="toggleInvalidClass(passwordError)" :maxlength="config.password.maxLength" required>
          <div class="invalid-feedback">
            {{ passwordError }}
          </div>
        </div>
        <div class="row" v-if="loginError">
          <div class="alert alert-danger my-4">
            {{ loginError }}
          </div>
        </div>
        <div class="row my-4">
          <div class="col">
            <button type="button" class="btn btn-outline-primary mx-5" @click="navigateTo('Register')">Register</button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-primary mx-5" @click="login()">Login</button>
          </div>
        </div>
        <br>
      </form>
    </div>
  </div>
</template>

<script>
import User from '../config/User.js'
import Api from "@/Api";
import Cookies from 'js-cookie'
export default {
  name: "Login",
  data() {
    return {
      config: User.config,
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
      loginError: ""
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
    navigateTo(page) {
      this.$router.push({name: page});
    },
    login() {
      let invalidLogin = false;

      this.email.trim();
      if (!this.email) {
        this.emailError = "Please enter a email address"
        invalidLogin = true
      } else {
        this.emailError = ""
      }

      this.password.trim();
      if (!this.password) {
        this.passwordError = "Please enter a password"
        invalidLogin = true
      } else {
        this.passwordError = ""
      }

      if (invalidLogin) {
        return
      }

      Api.login(this.email, this.password).then((res) => {
        const data = res.data;
        Cookies.set("userId", data.userId);
        Cookies.set("token", data.token);
        this.$router.push({name: 'Home'})
      }).catch((error) => {
        console.log(error.response.status)
        if (error.response.status === 400) {
          this.loginError = "Email/Password is incorrect"
        } else if (error.status === 500) {
          console.log(error);
        }
      });

    }
  }
}
</script>

<style scoped>

#login-form {
  background-color: #f9f9f9;
}

</style>