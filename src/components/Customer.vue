<template>
  <v-main class="list">
    <div v-show="tambah">
      <h1 class="font-weight-medium mb-5 font-weight-black">Data Customer</h1>
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
            Tambah Customer
          </v-btn>
        </v-card-title>
        <div>
            <v-data-table
            style="background-color: #E5EEDA"
            :items="customers"
            :headers="headers"
            :search="search"
            >
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                color="green"
                class="mr-2"
                @click="editPasswordHandler(item)"
                >mdi-lock</v-icon
                >
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
                @click="deleteHandler(item.id_customer)"
                >mdi-delete</v-icon
                >
            </template>
            </v-data-table>
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
                  <v-col class="col-12">
                    <p>Nama Customer</p>
                    <v-text-field
                      placeholder="nama customer"
                      :rules="nameRules"
                      v-model="form.nama_customer"
                      outlined
                      required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-account</v-icon>
                        </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-md-6 col-sm-12">
                    <p>Nomor Telepon Customer</p>
                    <v-text-field
                      placeholder="nomor telepon customer"
                      :rules="teleponRules"
                      v-model="form.telepon_customer"
                      outlined
                      required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-cellphone</v-icon>
                        </template>
                    </v-text-field>
                  </v-col>
                  <v-col class="col-md-6 col-sm-12">
                    <v-dialog
                        ref="dialog"
                        v-model="modal"
                        :return-value.sync="form.tanggal_lahir_customer"
                        persistent
                        width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <p>Tanggal Lahir Customer</p>
                        <v-text-field
                            placeholder="YYYY-MM-DD"  
                            :rules="tanggalRules"
                            v-model="form.tanggal_lahir_customer"
                            outlined
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-calendar</v-icon>
                            </template>
                        </v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date"
                            scrollable
                            :max="today"
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="modal = false"
                        >
                            Batal
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog.save(date)"
                        >
                            OK
                        </v-btn>
                        </v-date-picker>
                    </v-dialog>
                    </v-col>
                </v-row>
                <v-row v-show="inputType == 'Tambah'">
                    <v-col class="col-md-6 col-sm-12">
                        <p>Email Customer</p>
                        <v-text-field
                        placeholder="email customer"
                        :disabled="inputType == 'Ubah'"
                        :rules="emailRules"
                        v-model="form.email_customer"
                        outlined
                        required
                        >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-email</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                  <v-col class="col-md-6 col-sm-12">
                    <p>Password Customer</p>
                    <v-text-field
                      placeholder="password customer"
                      :disabled="inputType == 'Ubah'"
                      :rules="passwordRules"
                      v-model="form.password_customer"
                      type="password"
                      outlined
                      required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-key</v-icon>
                        </template>
                    </v-text-field>
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
          Apakah anda yakin ingin menghapus data customer ini?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogConfirm = false">Batal</v-btn>
          <v-btn color="grey" @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEditPassword" max-width="600px">
        <!-- <div class="cardinput">  -->
            <v-card style="background-color:#E5EEDA;">
                <v-card-title id="titleCard" class="font-weight-medium mb-3 justify-center text-h4 text-center">
                    Ubah Password
                </v-card-title>
                <v-card-body>
                <v-container>
                    <v-form v-model="validPassword" ref="formPassword">
                    <v-row>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Password Baru</p>
                            <v-text-field
                              placeholder="password baru"
                              :rules="passwordRules"
                              v-model="formPassword.newPassword"
                              type="password"
                              outlined
                              required
                            >
                                <template v-slot:prepend-inner>
                                    <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-key</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Konfirmasi Password Baru</p>
                            <v-text-field
                              placeholder="password baru"
                              :rules="confPasswordRules"
                              v-model="formPassword.newPasswordConf"
                              type="password"
                              outlined
                              required
                            >
                                <template v-slot:prepend-inner>
                                    <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-key</v-icon>
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
                        @click="cancelPassword"
                        >
                         Batal
                        </v-btn>
                        <v-btn depressed color="primary" @click="savePassword" style="padding-left: 30px; padding-right: 30px">
                          Simpan
                        </v-btn>
                    </v-card-actions>
                    </v-form>
                </v-container>
                </v-card-body>
            </v-card>
        <!-- </div> -->
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
  name: "Customer",
  data() {
    return {
      titleForm: "",
      token: "",
      inputType: "Tambah",
    
      snackbar: false,
      error_message: "",
      color: "",

      valid: "false",
      validPassword: "false",
      modal: "",
      search: "",

      tambah: true,
      dialogConfirm: false,
      dialogDelete: false,
      dialogEditPassword:false,

      customers: [],
      headers: [
        {
          text: "Nama Customer",
          align: "center",
          sortable: true,
          value: "nama_customer",
        },
        { text: "No. Telepon", align: "center", value: "telepon_customer" },
        { text: "Email Customer", align: "center", value: "email_customer"},
        { text: "Tanggal Lahir", align: "center", value: "tanggal_lahir_customer" },
        { text: "Tanggal Registrasi", align: "center", value: "created_at" },
        { text: "Aksi", align: "center", value: "actions" },
      ],

        nameRules: [(v) => !!v || "Nama customer tidak boleh kosong"],
      teleponRules: [
        (v) => !!v || "Nomor telepon customer tidak boleh kosong",
        (v) =>
          (v && v.length >= 11 && v.length <= 13) ||
          "Nomor telepon customer harus 11-13 Digit",
      ],
      tanggalRules: [(v) => !!v || "Tanggal lahir tidak boleh kosong"],
      emailRules: [
        (v) => !!v || "Email tidak boleh kosong",
        (v) => /.+@.+\..+/.test(v) || "Email invalid",
      ],
      passwordRules: [
        (v) => !!v || "Password tidak boleh kosong",
        (v) => (v && v.length >= 6) || "Password harus minimal 6 karakter",
      ],
       confPasswordRules: [
        (v) => !!v || "Konfirmasi password tidak boleh kosong",
        (v) => (v && v.length >= 6) || "Konfirmasi password harus minimal 6 karakter",
      ],

      customer: new FormData(),
      form: {
        nama_customer: null,
        email_customer: null,
        telepon_customer: null,
        password_customer: null,
        tanggal_lahir_customer: null,
      },
      formPassword:{
        newPassword: null,
        newPasswordConf: null,
      },
      deleteId: "",
      editId: "",
      editPasswordId:'',
      loading: false,
      today: "",
    };
  },
  methods: {
    getTanggalHariIni(){
        var today = new Date();

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd ;
        this.today = today;
    },
    readData() {
      this.loading = true;
      var url = this.$api + "/customer";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.loading = false;
          if(response.data.OUT_DATA == null){
            this.customers = [];
          }else{
             this.customers = response.data.OUT_DATA;
          }
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.loading = false;
        });
    },
    savePassword(){
      if (this.$refs.formPassword.validate()) {
        if(this.formPassword.newPasswordConf != this.formPassword.newPassword){
          this.error_message = "Konfirmasi password baru harus sama dengan password yang baru";
          this.color = "red";
          this.snackbar = true;
        }else{
          this.dialogEditPassword = false;
          this.loading = true;

          let newData = {
            new_password: this.formPassword.newPassword,
          };

          var url = this.$api + "/customer-edit-password/" + this.editPasswordId;
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
              this.$refs.formPassword.reset();
              this.loading = false;
            })
            .catch((error) => {
              this.error_message = error.response.data.message;
              this.color = "red";
              this.snackbar = true;
              this.loading = false;
            });
        }
      }
    },
    cancelPassword(){
      this.dialogEditPassword = false;
      this.editPasswordId = 0;
      this.$refs.formPassword.reset();
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
      this.titleForm = "Tambah Customer";
    },
    editPasswordHandler(item){
      this.editPasswordId = item.id_customer;
      this.dialogEditPassword = true;
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_customer;
      this.form.nama_customer = item.nama_customer;
      this.form.telepon_customer = item.telepon_customer;
      this.form.tanggal_lahir_customer = item.tanggal_lahir_customer;
      this.form.email_customer = item.email_customer;
      this.form.password_customer = item.password_customer;
      this.dialog = true;
      this.tambah = false;
      this.titleForm = "Ubah Customer";
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    deleteData() {
      //menghapus data
      this.dialogConfirm = false;
      this.loading = true;
      let newData;
      var url = this.$api + "/customer-soft/" + this.deleteId;
      //data dihapus berdasarkan id
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
          this.resetForm();
          this.inputType = "Tambah";
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
          nama_customer: this.form.nama_customer,
          telepon_customer: this.form.telepon_customer,
          tanggal_lahir_customer: this.form.tanggal_lahir_customer,
        };
        var url = this.$api + "/customer/" + this.editId;
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

        this.customer.append("nama_customer", this.form.nama_customer);
        this.customer.append("telepon_customer", this.form.telepon_customer);
        this.customer.append("tanggal_lahir_customer", this.form.tanggal_lahir_customer);
        this.customer.append("email_customer", this.form.email_customer);
        this.customer.append("password_customer", this.form.password_customer);

        var url = this.$api + "/customer";
        this.$http
          .post(url, this.customer, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green";
            this.snackbar = true;
            this.readData();
            this.changePage();
            this.loading = false;
          })
          .catch((error) => {
            console.log(error.response.data.message);
            this.error_message = "Email harus unik !";
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
    this.readData();
    this.getTanggalHariIni();
  },
};
</script>
<style scoped>
.cardinput {
  margin: 50px;
}
</style>
