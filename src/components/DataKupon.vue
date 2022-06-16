<template>
  <v-main class="list">
    <div v-show="tambah">
      <h1 class="font-weight-medium mb-5 font-weight-black">Data Kupon Diskon</h1>
      <v-card style="background-color: #E5EEDA">
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="light-blue darken-3 rounded" small dark @click="Tambah">
            Tambah Kupon
          </v-btn>
        </v-card-title>
        <div>
          <b-tabs
            active-nav-item-class="font-weight-bold text-uppercase text-success "
            content-class="mt-3"
          >
            <b-tab title="Daftar Kupon Diskon">
              <v-data-table
                style="background-color: #E5EEDA"
                :headers="headers"
                :items="kuponDiskons"
                :search="search"
              >
                <template v-slot:[`item.persentase_potongan`]="{ item }">
                  <span>{{item.persentase_potongan}} %</span>
                </template>
                <template v-slot:[`item.jumlah_point_tukar`]="{ item }">
                  <span>{{item.jumlah_point_tukar}} Point</span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    small
                    color="blue"
                    class="mr-2"
                    @click="editHandler(item)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    small
                    color="red"
                    @click="deleteHandler(item.id_kupon_diskon)"
                    >mdi-delete</v-icon
                  >
                </template>
              </v-data-table>
            </b-tab>
            <b-tab title="Daftar Kupon Customer">
              <v-data-table
                style="background-color: #E5EEDA"
                :headers="headers2"
                :items="kuponCustomers"
                :search="search"
              >
                <template v-slot:[`item.nama_status`]="{ item }">
                    <v-chip
                        v-if="item.id_status_kupon == 1"       
                        class="ma-2"
                        color="primary"
                        text-color="white"
                    >
                        <v-icon style="margin-top:-2px;margin-right:5px">mdi-check</v-icon>
                        {{item.nama_status}}
                    </v-chip>
                    <v-chip 
                        v-else-if="item.id_status_kupon == 2"
                        color="green"
                        text-color="white"
                    >
                        <v-icon style="margin-top:-2px;margin-right:5px">mdi-check</v-icon>
                        {{item.nama_status}}
                    </v-chip>
                    <v-chip 
                        v-else
                        class="ma-2"
                        color="red"
                        text-color="white"
                    >
                        <v-icon style="margin-top:-2px;margin-right:5px">mdi-close</v-icon>
                        {{item.nama_status}}
                    </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    small
                    color="red"
                    @click="deleteHandler2(item.id_kupon_customer)"
                    >mdi-delete</v-icon
                  >
                </template>
              </v-data-table>
            </b-tab>
          </b-tabs>
        </div>
      </v-card>
    </div>

    <div v-show="!tambah">
      <div class="cardinput">
        <v-card class="m-5" style="background-color: #E5EEDA;">
          <v-card-title
            style="background-color: #7A9B57"
            class="font-weight-medium mb-3 justify-center text-h4 text-center"
          >
            {{ titleForm }}
          </v-card-title>
          <v-card-body >
            <v-container>
              <v-form v-model="valid" ref="form">
                <v-row>
                  <v-col class="col-md-4 col-sm-12">
                    <p>Nama Kupon</p>
                    <v-text-field
                      placeholder="nama kupon"
                      :rules="nameRules"
                      v-model="form.nama_kupon"
                      outlined
                      required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-credit-card</v-icon>
                        </template>
                    </v-text-field>
                  </v-col>
                  <v-col class="col-md-4 col-sm-12">
                    <p>Persentase Potongan</p>
                    <v-text-field
                        placeholder="persentase potongan"
                        suffix="%"
                        :rules="persentaseRules"
                        v-model="form.persentase_potongan"
                        :min="0"
                        type="number"
                        outlined
                        required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-percent</v-icon>
                        </template>
                    </v-text-field>
                  </v-col>
                  <v-col class="col-md-4 col-sm-12">
                    <p>Jumlah Point Tukar</p>
                    <v-text-field
                        placeholder="jumlah point tukar"
                        suffix="point"
                        :rules="jumlahRules"
                        v-model="form.jumlah_point_tukar"
                        :min="0"
                        :max="100"
                        type="number"
                        outlined
                        required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-cards</v-icon>
                        </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                    <v-col class="col-12">
                        <p>Deskripsi Kupon</p>
                        <v-textarea
                            :rules="deskripsiRules"
                            v-model="form.deskripsi_kupon"
                            placeholder="deskripsi kupon"
                            :no-resize="false"
                            :outlined="true"
                            :rows="4"
                            required
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-card-actions class="justify-content-center">
                  <v-btn
                    class="ma-2"
                    depressed
                    color="error"
                    style="padding-left: 30px; padding-right: 30px"
                    @click="cancel"
                  >
                    Batal
                  </v-btn>
                  <v-btn
                  class="ma-2"
                    depressed
                    color="primary"
                    @click="setForm"
                    style="padding-left: 30px; padding-right: 30px"
                  >
                    Simpan
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card-body>
        </v-card>
      </div>
    </div>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card style="background-color: #E5EEDA">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
          <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data kupon diskon ini?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogConfirm = false">Batal</v-btn>
          <v-btn color="grey" @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm2" persistent max-width="400px">
      <v-card style="background-color: #E5EEDA">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
          <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data kupon customer ini?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogConfirm2 = false">Batal</v-btn>
          <v-btn color="grey" @click="deleteData2">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate :size="80" :width="5" color="primary">
      </v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{
      error_message
    }}</v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "Kupon",
  data() {
    return {
      titleForm: "",
      token: "",
      inputType: "Tambah",
      
      snackbar: false,
      error_message: "",
      valid: "false",
      color: "",
      modal: "",
      search: "",
      // id_role: 0,
      tambah: true,
      jabatans: [],
      sexOption: ["Laki-laki", "Perempuan"],
        nameRules: [(v) => !!v || "Nama kupon tidak boleh kosong"],
        persentaseRules: [(v) => v>0 || "persentase potongan tidak boleh kosong"],
        jumlahRules: [(v) => v>-1 || "Jumlah point tukar tidak boleh negatif"],  
        deskripsiRules: [(v) => !!v || "Deskripsi kupon tidak boleh kosong"],
      dialogConfirm: false,
      dialogConfirm2: false,

      headers: [
        {
          text: "Nama Kupon",
          align: "center",
          sortable: true,
          value: "nama_kupon",
        },
        { text: "Persentase Potongan", align: "center", value: "persentase_potongan" },
        { text: "Jumlah Point Tukar", align: "center", value: "jumlah_point_tukar" },
        { text: "Deskripsi Kupon", align: "center", value: "deskripsi_kupon" },
        { text: "Aksi", align: "center", value: "actions" },
      ],
      headers2: [
        {
          text: "Tanggal Claim",
          align: "center",
          sortable: true,
          value: "created_at",
        },
        { text: "Nama Customer", align: "center", value: "nama_customer" },
        { text: "Nama Kupon", align: "center", value: "nama_kupon" },
        { text: "Status Kupon", align: "center", value: "nama_status" },
        { text: "Aksi", align: "center", value: "actions" },
      ],
      kupon: new FormData(),
      kuponDiskons: [],
      kuponCustomers: [],
      form: {
        nama_kupon: null,
        persentase_potongan:null,
        jumlah_point_tukar: null,
        deskripsi_kupon: null,
      },

      deleteId: "",
      deleteIdCustomer: "",
      editId: "",
      loading: false,      
    };
  },
  methods: {
    readDataKuponCustomer(){
        var url = this.$api + "/kupon-customer";
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          if(response.data.OUT_DATA == null){
            this.kuponCustomers = [];
          }else{
             this.kuponCustomers = response.data.OUT_DATA;
          }
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
    },
    readDataKupon() {
      this.loading = true;
      var url = this.$api + "/kupon";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.loading = false;
          if(response.data.OUT_DATA == null){
            this.kuponDiskons = [];
          }else{
             this.kuponDiskons = response.data.OUT_DATA;
          }
        })
        .catch((error) => {
          this.error_message = error.response.data.OUT_MESSAGE;
          this.color = "red";
          this.snackbar = true;
          this.loading = false;
        });
    },
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    Tambah() {
      this.tambah = false;
      this.titleForm = "Tambah Kupon Diskon";
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_kupon_diskon;
      this.form.nama_kupon = item.nama_kupon;
      this.form.persentase_potongan = item.persentase_potongan;
      this.form.jumlah_point_tukar = item.jumlah_point_tukar;
      this.form.deskripsi_kupon = item.deskripsi_kupon;
      this.dialog = true;
      this.tambah = false;
      this.titleForm = "Ubah Kupon Diskon";
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    deleteHandler2(id) {
      this.deleteIdCustomer = id;
      this.dialogConfirm2 = true;
    },
    deleteData() {
        this.dialogConfirm = false;
      this.loading = true;
      var url = this.$api + "/kupon-delete/" + this.deleteId;
      //data dihapus berdasarkan id
      let newData;
      this.$http
        .put(url,newData, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.error_message = response.data.OUT_MESSAGE;
          this.color = "green";
          this.snackbar = true;
          this.readDataKupon();
          this.readDataKuponCustomer();
          this.resetForm();
          this.loading = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.loading = false;
        });
    },
    deleteData2() {
      //menghapus data
      this.dialogConfirm2 = false;
      this.loading = true;
      var url = this.$api + "/kupon-customer-delete/" + this.deleteIdCustomer;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.error_message = response.data.OUT_MESSAGE;
          this.color = "green";
          this.snackbar = true;
          this.readDataKuponCustomer();
          this.resetForm();
          this.loading = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.loading = false;
        });
    },
    cancel() {
      this.changePage();
      this.resetForm();
    },
    update() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        let newData = {
          nama_kupon: this.form.nama_kupon,
          persentase_potongan: this.form.persentase_potongan,
          jumlah_point_tukar: this.form.jumlah_point_tukar,
          deskripsi_kupon: this.form.deskripsi_kupon,
        };
        var url = this.$api + "/kupon/" + this.editId;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green";
            this.snackbar = true;
            this.readDataKuponCustomer();
            this.readDataKupon();
            this.changePage();
            this.resetForm();
            this.loading = false;
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.loading = false;
          });
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.kupon.append("nama_kupon", this.form.nama_kupon);
        this.kupon.append("persentase_potongan", this.form.persentase_potongan);
        this.kupon.append("jumlah_point_tukar", this.form.jumlah_point_tukar);
        this.kupon.append("deskripsi_kupon", this.form.deskripsi_kupon);
        

        var url = this.$api + "/kupon";

        this.$http
          .post(url, this.kupon, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green";
            this.snackbar = true;
            this.readDataKuponCustomer();
            this.readDataKupon();
            this.changePage();
            this.loading = false;
          })
          .catch((error) => {
            console.log(error.response.data.message);
            this.error_message = "Terjadi kesalahan serve";
            this.color = "red";
            this.snackbar = true;
            this.loading = false;
          });
      }
    },
    changePage() {
      this.tambah = true;
      this.titleForm = "";
      this.inputType = "Tambah";
      this.resetForm();
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.readDataKupon();
    this.readDataKuponCustomer();    
  },
};
</script>
<style scoped>
.cardinput {
  margin: 50px;
}
</style>
