<template>
  <div>
    <nav class="navbar navbar-dark bg-dark d-flex flex-row">
      <span class="navbar-text"> YES OR NO </span>
      <div class="flex-end" v-if="isInSession">
        <div class="d-flex username">
          <router-link to="/home" class="mr-3 header-btn">
            {{ username }}
          </router-link>
          <span class="mr-3"> | </span>
          <button class="header-btn logout" @click="logout">Logout</button>
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
    logout() {
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
.header-btn {
  color: #777777;
}
.header-btn:hover {
  color: #ffffff;
  text-decoration: none;
}
.username {
  color: #999999;
}
.logout {
  border: none;
  background: inherit;
}
</style>