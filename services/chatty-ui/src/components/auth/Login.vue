<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
          class="text-center p-5 border border-primary rounded"
          style="margin-top: 70px; height: auto; padding-top: 30px !important"
          @submit.prevent="loginUser"
        >
          <h1 class="align-center mb-5 text-primary">Login</h1>
          <input
            type="text"
            id="username"
            class="form-control mb-5"
            placeholder="Username"
            v-model="login.username"
            required
          />

          <!-- Password -->
          <input
            type="password"
            id="password"
            class="form-control mb-5"
            placeholder="Password"
            v-model="login.password"
            required
          />

          <p>
            Dont have an account??
            <router-link to="/signup">Click here</router-link>
          </p>

          <!-- Sign in button -->
          <center>
            <button
              class="btn btn-primary btn-block w-75 my-4"
              type="submit"
              @click="loginUser"
            >
              Login
            </button>
          </center>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";

export default {
  name: "Login",
  data() {
    return {
      login: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await this.$http.post("/user/login", this.login);
        if (
          !(
            response ||
            response.data ||
            response.data.data ||
            response.data.data.token
          )
        ) {
          swal("Error", "Something went wrong. Kindly try in a bit.", "error");
        }
        const token = response.data.data.token;
        localStorage.setItem("x-auth-token", token);
        localStorage.setItem("username", response.data.data.username);
        localStorage.setItem("userId", response.data.data._id);
        swal("Success", "Login Successful", "success");
        this.$router.push("/home");
      } catch (err) {
        swal("Error", err.data.message || "Something went wrong", "error");
      }
    },
  },
};
</script>