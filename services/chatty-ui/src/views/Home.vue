<template>
  <div>
    <StartGame v-if="indicateGameStatus" v-on:start-game="startGame" />
  </div>
</template>
<script>
import StartGame from "../components/StartGame";
export default {
  name: "Home",
  components: {
    StartGame,
  },
  data() {
    return {
      isGameStarted: false,
      gameId: "",
      game: {},
    };
  },
  methods: {
    indicateGameStatus() {
      if (this.isGameStarted && this.gameId) {
        return this.$router.push(`/game/${this.gameId}`);
      }
      return true;
    },
    startGame(data) {
      this.isGameStarted = true;
      this.gameId = data._id;
      this.game = data;
    },
  },
};
</script>

<style scoped></style>
