<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  name: "App",
  components: {
    Header,
  },
  methods: {
    logout() {
      localStorage.removeItem("x-auth-token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      this.$router.push("/login");
    }
  }
};
</script>
