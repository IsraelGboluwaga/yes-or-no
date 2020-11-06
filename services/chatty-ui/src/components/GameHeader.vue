<template>
  <div>
    <section>
      <div class="container mt-5 mb-3">
        <div class="row">
          <div class="col-md-0 mx-auto mb-3">
            <h1 class="mb-2 text-secondary">
              {{ game.player_one.username }} vs {{ game.player_two.username }}
            </h1>
            <div class="d-flex flex-row justify-content-center">
              Questions asked: {{ game.questions.length }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "GameHeader",
  props: ["game"],
};
</script>