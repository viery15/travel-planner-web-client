<template>
  <div>
    <br /><br />
    <v-client-table
      :data="dataWisata"
      :columns="columns"
      :options="optionsTable"
    >
      <div slot="action" slot-scope="props">
        <button
          v-on:click="detail(props.row)"
          style="margin-left:5px"
          type="button"
          class="btn btn-info btn-sm"
        >
          <font-awesome-icon icon="eye" />
        </button>
      </div>
    </v-client-table>

    <div
      class="modal fade"
      id="detail"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ modalDetail.tempat }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="word-break: break-all;">
            <div class="row">
              <div class="col-md-4">
                Nama
              </div>
              <div class="col-md-8">
                <b>{{ modalDetail.tempat }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Alamat
              </div>
              <div class="col-md-8">
                <b>{{ modalDetail.alamat }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Kota
              </div>
              <div class="col-md-8">
                <b>{{ modalDetail.kota }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Kategori
              </div>
              <div class="col-md-8">
                <b>{{ modalDetail.kategori }}</b>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Jam Buka
              </div>
              <div class="col-md-8">
                <div
                  class="row"
                  v-for="(data, index) in modalDetail.jam_buka"
                  v-bind:key="index"
                >
                  <div class="col-md-4">
                    <b>{{ data[0] }}</b>
                  </div>
                  <div class="col-md-1">:</div>
                  <div class="col-md-6">{{ data[1] }}</div>
                </div>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Nilai Sentiment
              </div>
              <div class="col-md-8">
                <b
                  ><span style="color:green">{{
                    modalDetail.sentiment_score
                  }}</span>
                  dari 100 orang menilai positif</b
                ><br /><br /><button class="btn btn-sm btn-success">
                  Lihat Review
                </button>
              </div>
            </div>
            <hr />

            <div class="row">
              <div class="col-md-4">
                Sumber
              </div>
              <div class="col-md-8">
                <a
                  class="btn btn-info btn-sm"
                  :href="modalDetail.url"
                  target="_blank"
                  >Google Places</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
import axios from "axios";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "DaftarWisata",
  data() {
    return {
      url: "http://127.0.0.1:3000/",
      dataWisata: [],
      modalDetail: "",
      columns: ["tempat", "alamat", "kota", "action"],
      optionsTable: {
        headings: {
          tempat: "Nama",
          alamat: "Alamat",
          kota: "Kota",
        },
        sortable: ["tempat", "alamat", "kota"],
        filterable: ["tempat", "alamat", "kota"],
      },
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      let loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false,
      });
      const response = await axios.get(this.url + "Wisata");
      this.dataWisata = response.data.response;
      loader.hide();
    },

    detail(tujuan) {
      this.modalDetail = "";
      var jamBuka = [];

      this.modalDetail = tujuan;
      var dataTujuan = this.modalDetail.jam_buka;

      var result = Object.keys(dataTujuan).map(function(key) {
        return [key, dataTujuan[key]];
      });

      this.modalDetail.jam_buka = result;
      console.log(this.modalDetail.jam_buka);

        $("#detail").modal("show");
    },
  },
};
</script>

<style>
#VueTables_th--tempat {
  width: 20%;
}
#VueTables_th--alamat {
  width: 30%;
}
#VueTables_th--action {
  width: 10%;
}
#VueTables_th--kota {
  width: 10%;
}
</style>
