<template>
  <div>
    <GameHeader v-bind:game="game" />
    <GameBox v-bind:game="game" v-on:updated-game="updateGameQuestions" />
  </div>
</template>

<script>
import swal from "sweetalert";
import GameBox from "../components/GameBox";
import GameHeader from "../components/GameHeader";

export default {
  name: "Game",
  data() {
    return {
      game: {},
    };
  },
  components: {
    GameHeader,
    GameBox,
  },
  methods: {
    async updateGameQuestions() {
      const { data } = await this.$http.get(`/game/${this.$attrs.gameId}`);
      this.game = data.data;
      return data.data;
    },
  },
  async mounted() {
    try {
      const { data } = await this.$http.get(`/game/${this.$attrs.gameId}`);
      const game = data.data;
      this.game = game;
    } catch (err) {
      swal("Error", err.data.message || "Invalid game id", "error");
      this.$router.push("/home");
    }
  },
};
</script>
