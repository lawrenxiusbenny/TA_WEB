<template>
    <v-main class="list">
    <div>
      <h1 class="font-weight-medium mb-5 font-weight-black">
        Data Royalty Point
      </h1>
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
            Tambah Point
          </v-btn>
        </v-card-title>
        <div>
          <v-data-table style="background-color: #E5EEDA;" :headers="headers" :items="points" :search="search">
            <template v-slot:[`item.jumlah_point`]="{ item }">
                {{ formatRibuan(item.jumlah_point)}} Point
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small color="blue" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
                <v-icon small color="red" class="mr-2" @click="deleteHandler(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </div>

    <v-dialog v-model="tambah" max-width="600px">
        <!-- <div class="cardinput">  -->
            <v-card style="background-color:#E5EEDA;">
                <v-card-title id="titleCard" class="font-weight-medium mb-3 justify-center text-h4 text-center">
                    {{ titleForm }}
                </v-card-title>
                <v-card-body>
                <v-container>
                    <v-form v-model="valid" ref="form">
                    <v-row>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Nama Customer</p>
                            <v-select
                                v-if="inputType === 'Tambah'"
                                :items="namaCustomerOptions"
                                item-text="nama_customer"
                                item-value="id_customer"
                                placeholder="nama customer"
                                :rules="namaCustomerRules"
                                v-model="form.id_customer"
                                outlined
                                required
                            >
                              <template v-slot:prepend-inner>
                                    <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-account</v-icon>
                                </template>
                            </v-select>
                            <v-text-field
                                v-else
                                v-model="form.nama_customer"
                                outlined
                                required
                                disabled
                            >
                              <template v-slot:prepend-inner>
                                    <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-account</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Jumlah Point</p>
                            <v-text-field
                                placeholder="jumlah Point"
                                :rules="jumlahRules"
                                v-model="form.jumlah_point"
                                outlined
                                type="number"
                                required
                            >
                              <template v-slot:prepend-inner>
                                  <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-package-up</v-icon>
                              </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-card-actions class="justify-content-center">
                        <v-btn
                        class="mr-5"
                        depressed
                        color="error"
                        style="padding-left: 30px; padding-right: 30px"
                        @click="cancel"
                        >
                        Batal
                        </v-btn>
                        <v-btn depressed color="primary" @click="setForm" style="padding-left: 30px; padding-right: 30px">
                        Simpan
                        </v-btn>
                    </v-card-actions>
                    </v-form>
                </v-container>
                </v-card-body>
            </v-card>
        <!-- </div> -->
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persisten max-width="400px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
          <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text> Apakah anda yakin ingin menghapus data royalty point ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogConfirm = false"
            >Batal</v-btn
          >
          <v-btn color="grey" @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="load">
      <v-progress-circular
        indeterminate
        :size="80" 
        :width="5"
        color="primary">
      </v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "Royalty Point",
  data() {
    return {
      titleForm: "",
      token: "",
      
      inputType: "Tambah",
      load: false,

      snackbar: false,
      error_message: "",    
      valid: "false",
      color: "",
      
      modal: false,
      search: "",
      tambah: false,

      namaCustomerRules: [(v) => !!v || "Nama Customer tidak boleh kosong"],
      jumlahRules: [(v) => v>-1 || "Jumlah point tidak boleh negatif"],

      dialogConfirm: false,
      dialogDelete: false,

      headers: [
        {
          text: "ID Royalty Point",
          align: "center",
          sortable: true,
          value: "id_royalty_point",
        },
        { text: "Nama Customer", align: "center", value: "nama_customer" },
        { text: "Tanggal Registrasi", align: "center", value: "created_at" },
        { text: "Jumlah Royalty Point", align: "center", value: "jumlah_point" },
        { text: "Aksi", value: "actions" },
      ],
      dataPoint: new FormData(),
      points:[],
      namaCustomerOptions:[],

      form: {
        id_customer: null,
        jumlah_point: null,
        nama_customer:null,
      },      
      deleteId: "", 
      editId: "",
    };
  },
  methods: {
    formatRibuan(value) {
        let val = (value/1).toFixed(0).replace('.')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    readNamaCustomer(){
        var url = this.$api + "/customer-name-2";
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.namaCustomerOptions = response.data.OUT_DATA;
          if(this.namaCustomerOptions == null){
            this.namaCustomerOptions = [];
          }
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
    },
    readData() {
      var url = this.$api + "/point";
      this.load = true;
      this.$http
        .get(url
            ,{
              headers:{
                  Authorization: "Bearer " + this.token,
              }
            }
        )
        .then((response) => {
          this.points= response.data.OUT_DATA;
          this.load =false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
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
        this.tambah = true;
        this.titleForm = "Tambah Royalty Point";
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_royalty_point;

      this.form.jumlah_point = item.jumlah_point;
      this.form.nama_customer = item.nama_customer;
      console.log(item.nama_customer);

      this.dialog = true;
      this.tambah = true;
      this.titleForm = "Ubah Royalty Point";
    },
    deleteHandler(item) {
      this.deleteId = item.id_royalty_point;
      this.dialogConfirm = true;
    },
    deleteData() {
      this.load = true;
      this.dialogConfirm = false;
      //menghapus data
      var url = this.$api + "/point/" + this.deleteId;
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
          this.readData();
          this.readNamaCustomer();
          this.resetForm();
          this.inputType = "Tambah";
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    cancel() {
      this.changePage();
      this.resetForm();
    },
    update() {
      if (this.$refs.form.validate()) {
        this.load = true;
        this.tambah = false;

        let newData;
        newData = {
          jumlah_point: this.form.jumlah_point,
        };
        
        var url = this.$api + "/point/" + this.editId;
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
            this.readData();
            this.readNamaCustomer();
            this.changePage();
            this.resetForm();
            this.load = false;
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }        
    },
    save() {
      if (this.$refs.form.validate()) {
        this.load = true;
        this.tambah = false;

        this.dataPoint.append("id_customer", this.form.id_customer);
        this.dataPoint.append("jumlah_point", this.form.jumlah_point);
        
        var url = this.$api + "/point";

        this.$http
          .post(url, this.dataPoint, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green";
            this.snackbar = true;
            this.readData();
            this.readNamaCustomer();
            this.changePage();
            this.load = false;
          })
          .catch((error) => {
            console.log(error.response.data.message);
            this.error_message = "Terjadi kesalahan server";
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    }, 
    changePage() {
      this.tambah = false;
      this.titleForm = "";
      this.inputType = "Tambah";
      this.resetForm();
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  mounted() {
    this.token = localStorage.getItem('token');
    this.readData();
    this.readNamaCustomer();
  },
};
</script>
<style scoped>

.cardinput{
    margin: 20px;
}

#titleCard{
    text-align: center;
    background-color: #7A9B57;
}
</style>
