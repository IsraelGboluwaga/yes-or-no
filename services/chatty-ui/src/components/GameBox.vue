<template>
  <div class="card mt-3 col-md-6 m-auto p-3">
    <div class="card-body">
      <div class="card-title">
        <h3>Question Center</h3>
        <hr />
      </div>
      <div v-if="isToAsk()">
        <div class="card-body">
          <div v-for="(text, index) in questions" :key="index">
            <p>
              <span class="font-weight-bold">Question:</span>{{ question.text }}
            </p>
            <p>
              <span class="font-weight-bold">Answer:</span>{{ question.answer }}
            </p>
          </div>
        </div>
        <div class="card-footer">
          <form @submit.prevent="sendQuestion">
            <div class="form-group">
              <label for="user">Question:</label>
              <input type="text" v-model="questionText" class="form-control" />
            </div>
            <div class="form-group pb-3">
              <label for="message">Answer:</label>
              <input
                type="text"
                v-model="askerAnswerText"
                class="form-control"
              />
            </div>
            <button type="submit" class="btn btn-success">Send</button>
          </form>
        </div>
      </div>
      <div v-if="isToAnswer()">
        <p v-if="inWait">
          {{ game.player_one.username }} is preparing the question
        </p>
        <div v-if="!inWait">
          <div>{{ questions[questions.length - 1] }}</div>
          <div>
            <input
              type="button"
              class="btn col-md-3 game-btn"
              value="Yes"
              v-bind:class="{ 'is-selected': toAsk }"
              @click="
                () => {
                  answerText = 'yes';
                  answerQuestion();
                }
              "
            />
            <div class="d-inline-flex col-md-1"></div>
            <input
              type="button"
              class="btn col-md-3 game-btn"
              value="No"
              v-bind:class="{ 'is-selected': toAnswer }"
              @click="
                () => {
                  answerText = 'no';
                  answerQuestion();
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "GameBox",
  props: ["game"],
  data() {
    return {
      userId: "",
      questionText: "",
      askerAnswerText: "",
      answerText: "",
      inWait: false,
      socket: io(this.$baseUrl),
    };
  },
  methods: {
    isToAsk() {
      const isPlayerOne = this.userId == this.game.player_one._id;
      const isPlayerTwo = this.userId == this.game.player_two._id;
      return (
        (this.game.to_ask === 1 && isPlayerOne) ||
        (this.game.to_ask === 2 && isPlayerTwo)
      );
    },
    isToAnswer() {
      this.inWait = true;
      const isPlayerOne = this.userId == this.game.player_one._id;
      const isPlayerTwo = this.userId == this.game.player_two._id;
      return (
        (this.game.to_answer === 1 && isPlayerOne) ||
        (this.game.to_answer === 2 && isPlayerTwo)
      );
    },
    async sendQuestion() {
      this.inWait = true;
      const { data } = await this.$http.post("/question", {
        game_id: this.game._id,
        text: this.questionText,
        answer: this.askerAnswerText,
      });
      this.socket.emit("question-asked", data.data);
      this.on("question-saved", () => {
        this.$emit("updated-game");
        this.inWait = false;
      });
    },
    async answerQuestion() {
      this.inWait = true;
      const questions = this.questions;
      const { data } = await this.$http.patch("/question", {
        _id: questions[questions.length - 1]._id,
        is_answer_correct: this.askerAnswerText.trim() === this.answerText,
      });
      this.socket.emit("question-answered", data.data);
      this.inWait = false;
    },
  },
  mounted() {
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
</style>
