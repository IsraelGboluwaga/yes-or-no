<template>
  <div>
    <Loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="true"
    />
    <section>
      <div class="container mt-5">
        <div class="row">
          <h1 class="col-md-10 mx-auto mb-5 text-secondary">Start Game</h1>
          <div class="col-md-10 m-auto">
            <h4>Welcome to Yes or No!</h4>
            <p>
              Here's how it works- A player (Player 1) asks questions
              potentially up to 20 times. However, for any of the questions
              asked, if the other player (Player 2) answers rightly, they have
              won the game. If after the 20th question, there's no right answer,
              then Player 1 wins the game. Do you want to be the one to ask the
              questions or the one to answer?
            </p>
          </div>
          <div
            v-if="gameId.length === 24 && isCreator"
            class="col-md-10 mx-auto my-3"
          >
            You should sent this game ID to who you want to play with:
            <p class="game-id">{{ gameId }}</p>
          </div>
          <div
            class="col-md-10 mx-auto my-3"
            v-if="!gameId || (gameId && !isCreator)"
          >
            <form @submit.prevent="initGame">
              <div class="mb-3">
                <input
                  type="button"
                  class="btn col-md-3 game-btn ask-btn"
                  value="Ask"
                  v-bind:class="{ 'is-selected': toAsk }"
                  @click="setToAsk"
                />
                <div class="d-inline-flex col-md-1"></div>
                <input
                  type="button"
                  class="btn col-md-3 game-btn answer-btn"
                  value="Answer"
                  v-bind:class="{ 'is-selected': toAnswer }"
                  @click="setToAnswer"
                />
              </div>
              <input
                type="submit"
                class="btn col-md-7 bg-secondary submit-btn"
                value="Start"
                :disabled="!(toAsk || toAnswer)"
              />
            </form>
            <div class="mx-auto my-5">
              <h5>Want to join an existing game?</h5>
              <form class="col-md-0 mx-0 my-3" @submit.prevent="joinGame">
                <div class="mb-3 form-group">
                  <input
                    type="input"
                    class="form-control col-md-7"
                    placeholder="Game ID"
                    v-model="gameId"
                  />
                </div>
                <input
                  type="submit"
                  class="btn col-md-7 bg-secondary submit-btn"
                  value="Start"
                  :disabled="!Boolean(gameId.trim()) && gameId.length === 24"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import io from "socket.io-client";
import swal from "sweetalert";
import Loading from "vue-loading-overlay";
export default {
  name: "StartGame",
  data() {
    return {
      isLoading: false,
      username: "",
      userId: "",
      gameId: "",
      toAsk: false,
      toAnswer: false,
      isCreator: false,
      socket: io(this.$baseUrl),
    };
  },
  components: {
    Loading,
  },
  methods: {
    async initGame(e) {
      e.preventDefault();
      if (!(this.toAsk || this.toAnswer)) {
        return swal(
          "Oops!",
          "You really have to decide if you will be asking or answering",
          "error"
        );
      }
      this.isLoading = true;
      const { data } = await this.$http.post("/game", {
        to_ask: this.toAsk,
        to_answer: this.toAnswer,
      });
      this.isCreator = true;
      this.gameId = data.data._id;
      this.isLoading = false;
      this.socket.on("game-start", () => {
        // what's wrong??
        this.$emit("start-game", data.data);
        this.$router.push(`/game/${data.data._id}`);
      });
    },
    setToAsk() {
      this.toAsk = !this.toAsk;
      this.toAnswer = false;
    },
    setToAnswer() {
      this.toAsk = false;
      this.toAnswer = !this.toAnswer;
    },
    async joinGame(e) {
      e.preventDefault();
      try {
        this.isLoading = true;
        const { data } = await this.$http.patch("/game", {
          _id: this.gameId,
          player_two: this.userId,
          is_active: true,
        });
        this.gameId = data.data._id;
        this.$emit("start-game", data.data);
        this.socket.emit("game-joined");
        return this.$router.push(`/game/${data.data._id}`);
      } catch (err) {
        this.isLoading = false;
        swal("Error", "Error creating game. Kindly try again.", "error");
      }
    },
  },
  mounted() {
    this.username = localStorage.getItem("username");
    this.userId = localStorage.getItem("userId");
  },
};
</script>

<style scoped>
.game-btn {
  background-color: #cccccc;
}

.is-selected {
  background: #59bdca;
}

.submit-btn:hover {
  background-color: #2e8b57 !important;
  color: #ffffff;
}

.submit-btn:disabled {
  background-color: #cccccc !important;
  color: inherit;
  cursor: not-allowed;
}

.game-id {
  font-weight: bolder;
  font-size: 120%;
  color: #2e8b57;
}
</style>
