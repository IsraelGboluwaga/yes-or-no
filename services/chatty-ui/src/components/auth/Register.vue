<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
          class="text-center border border-primary p-5"
          style="margin-top: 70px; height: auto; padding-top: 100px !important"
          @submit.prevent="registerUser"
        >
          <h1 class="align-center mb-5 text-primary">Sign Up</h1>
          <input
            type="text"
            id="username"
            class="form-control mb-5"
            placeholder="Username"
            v-model="register.username"
            required
          />

          <!-- Password -->
          <input
            type="password"
            id="password"
            class="form-control mb-5"
            placeholder="Password"
            v-model="register.password"
          />
          <p>
            Already have an account??
            <router-link to="/">Click here</router-link>

            <!-- Sign in button -->
            <center>
              <button
                class="btn btn-primary btn-block w-75 my-4"
                type="submit"
                @click="registerUser"
              >
                Sign Up
              </button>
            </center>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
export default {
  data() {
    return {
      register: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await this.$http.post("/user", this.register);
        const token = response.data.data.token;
        if (token) {
          localStorage.setItem("x-auth-token", token);
          this.$router.push("/");
          swal("Success", "Registration successful", "success");
        } else {
          swal("Error", "Something Went Wrong", "error");
        }
      } catch (err) {
        swal("Error", err.data.message || "Something Went Wrong", "error");
      }
    },
  },
};
</script>
