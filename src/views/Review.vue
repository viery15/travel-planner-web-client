<template>
  <div v-if="data.review.length > 0">
    <br />
    <br />
    <h1>{{ data.tempat }}</h1>
    <br><br>
    <p><span style="color:green">{{data.sentiment_score}}</span> dari 100 berkomentar positif</p>
    <br />
    <div v-for="(review, index) in data.review" v-bind:key="index">
      <div
        v-if="review.sentiment < 0"
        style="border: 1px solid black; padding:15px; text-align:justify; margin-bottom: 30px; background-color:red; color:white"
      >
        <p>{{ review.review }}</p>
      </div>

      <div
        v-else-if="review.sentiment > 1"
        style="border: 1px solid black; padding:15px; text-align:justify; margin-bottom: 30px; background-color:green; color:white"
      >
        <p>{{ review.review }}</p>
      </div>

      <div
        v-else-if="review.sentiment == 0"
        style="border: 1px solid black; padding:15px; text-align:justify; margin-bottom: 30px; background-color:white; color:black"
      >
        <p>{{ review.review }}</p>
      </div>
    </div>
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
import axios from "axios";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "review",
  data() {
    return {
      id: "",
      // url: "http://127.0.0.1:3000/",
      url: "https://travel-main-proccess.herokuapp.com/",
      data: {
        review: []
      },
      columns: ["review"],
      optionsTable: {
        headings: {
          review: "Review"
        }
      }
    };
  },

  mounted() {
    this.id = this.$route.params.id;
    this.loadData();
  },

  methods: {
    async loadData() {
      let loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false
      });

      const newComponent = new URLSearchParams();
      newComponent.append("id", this.id);
      axios
        .post(this.url + "Review", newComponent)
        .then(response => {
          loader.hide();
          this.data = response.data.response[0];
        })
        .catch(e => {
          /* eslint-disable no-console */
          console.log(e);
          /* eslint-enable no-console */
        });
    }
  }
};
</script>
