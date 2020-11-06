<template>
  <div>
    <nav class="navbar navbar-dark bg-dark d-flex flex-row">
      <span class="navbar-text"> YES OR NO </span>
      <div class="flex-end" v-if="isInSession">
        <div class="d-flex username">
          <router-link to="/home" class="mr-3 logout">
            {{ username }}
          </router-link>
          <span class="mr-3"> | </span>
          <router-link to="/" class="logout" @click="logoutUser">
            Logout
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      username: "",
    };
  },
  methods: {
    isInSession() {
      return !!localStorage.getItem("x-auth-token");
    },
    logoutUser() {
      // does not work yet
      localStorage.removeItem("x-auth-token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      this.$router.push("/login");
    },
  },
  mounted() {
    this.username = localStorage.getItem("username");
  },
};
</script>

<style scoped>
.logout {
  color: #777777;
}
.logout:hover {
  color: #ffffff;
  text-decoration: none;
}
.username {
  color: #999999;
}
</style>