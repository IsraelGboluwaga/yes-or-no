<template>
  <div>
    <nav class="navbar navbar-dark bg-dark flex">
      <span class="navbar-text"> YES OR NO </span>
      <div class="flex-end" v-if="isInSession">
        <router-link to="/" class="logout" @click="logoutUser">
          Logout
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    isInSession() {
      return localStorage.getItem("x-auth-token") == null;
    },
    logoutUser() {
      localStorage.removeItem("x-auth-token");
      this.$router.push("/");
    },
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
</style>