<template>
  <v-main class="list">
    <div v-show="tambah">
      <h1 class="font-weight-medium mb-5 font-weight-black">Daftar Pesanan</h1>
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
            Tambah Pesanan
          </v-btn>
        </v-card-title>
        <div>
            <v-data-table
              style="background-color: #E5EEDA"
              :items="pesanans"
              :headers="headers"
              :search="search"
            >
              <template v-slot:[`item.id_pesanan`]="{ item }">
                  <span>Order-{{item.id_pesanan}}</span>
              </template>
              <template v-slot:[`item.nama_status`]="{ item }">
                <v-chip
                    v-if="item.nama_status == 'Belum Disajikan'"       
                    class="ma-2"
                    color="red"
                    outlined
                    pill
                >
                  <v-icon style="margin-top:-2px;margin-right:5px">mdi-close</v-icon>
                    {{item.nama_status}}
                  <v-icon
                    small
                    color="green"
                    class="ml-2"
                    @click="editPenyajianHandler(item.id_pesanan)"
                  >
                    mdi-pencil
                  </v-icon>
                </v-chip>
                <v-chip 
                    v-else
                    color="green"
                    outlined
                    pill
                >
                    <v-icon style="margin-top:-2px;margin-right:5px">mdi-mdi-check</v-icon>
                    {{item.nama_status}}
                    <v-icon
                      small
                      color="green"
                      class="ml-2"
                      @click="editPenyajianHandler(item.id_pesanan)"
                    >
                      mdi-pencil
                    </v-icon>
                </v-chip>
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
                  @click="deleteHandler(item.id_pesanan)"
                  >mdi-delete
                </v-icon>
              </template>
              <template v-slot:[`item.catatan`]="{ item }">
                  <span v-if="item.catatan === null">-</span>
                  <span v-else>{{item.catatan}}</span>
              </template>
            </v-data-table>
        </div>
      </v-card>
    </div>

    <div v-show="!tambah">
      <div class="cardinput">
        <v-card class="m-2" style="background-color: #E5EEDA;">
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
                    <v-col cols="12" md="4" sm="12">
                        <p>Nama Customer</p>
                        <v-select
                            @change="getCustomerInfo"
                            :loading="loadInfoC"
                            :items="namaCustomerOptions"
                            item-text="nama_customer"
                            item-value="id_customer"
                            placeholder="pilih nama customer"
                            :rules="namaCustomerRules"
                            v-model="form.id_customer"
                            outlined
                            required
                            :disabled="cekEdit"
                        >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-account</v-icon>
                            </template>
                        </v-select>
                        
                    </v-col>
                    <v-col cols="12" md="4" sm="12">
                        <p>Nama Menu</p>
                        <v-select
                            @change="getMenuInfo"
                            :loading="loadInfoM"
                            :items="namaMenuOptions"
                            item-text="nama_menu"
                            item-value="id_menu"
                            placeholder="pilih nama menu"
                            :rules="namaMenuRules"
                            v-model="form.id_menu"
                            outlined
                            required
                            :disabled="cekEdit"
                        >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-food-fork-drink</v-icon>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                        <p>Jumlah Pesanan</p>
                        <v-text-field
                        placeholder="jumlah pesanan"
                        :rules="jumlahRules"
                        v-model="form.jumlah_pesanan"
                        :min="0"
                        type="number"
                        outlined
                        required
                        >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-package-up</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-md-4" v-show="cekInfoCustomer">
                    <v-card style="background-color: #E5EEDA;" height="440px">
                        <v-card-title
                            style="background-color: #7A9B57"
                            class=" mb-3 justify-center text-center"
                        >
                            Informasi Customer
                        </v-card-title>
                        <v-card-text style="margin-top:20px;">
                            <v-row class="ma-1">
                                <v-text-field
                                    :loading="loadInfoC"
                                    :value="customer.nama_customer"
                                    label="Nama Customer"
                                    filled
                                    disabled
                                ></v-text-field>
                            </v-row>
                            <v-row class="ma-1">
                                <v-text-field
                                    :loading="loadInfoC"
                                    :value="customer.email_customer"
                                    label="Email Customer"
                                    filled
                                    disabled
                                ></v-text-field>
                            </v-row>
                            <v-row class="ma-1">
                                <v-text-field
                                    :loading="loadInfoC"
                                    :value="customer.telepon_customer"
                                    label="Telepon Customer"
                                    filled
                                    disabled
                                ></v-text-field>
                            </v-row>
                            <v-row class="ma-1">
                                <v-text-field
                                    :loading="loadInfoC"
                                    :value="customer.tanggal_lahir_customer"
                                    label="Tanggal lahir customer"
                                    filled
                                    disabled
                                ></v-text-field>
                            </v-row>
                        </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col class="col-md-8 col-sm-12" v-show="cekInfoMenu">
                    <v-card style="background-color: #E5EEDA;" >
                        <v-card-title
                            style="background-color: #7A9B57"
                            class=" mb-3 justify-center text-center"
                        >
                            Informasi Menu
                        </v-card-title>
                        <v-card-text style="margin-top:20px">
                            <v-row class="ma-1">
                                <v-col class="image-preview">
                                    <img width="100px" :loading="loadInfoM" :src="imagePath"/>
                                    <!-- <p>Image Preview</p> -->
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field
                                        :loading="loadInfoM"
                                        :value="menu.nama_menu"
                                        label="Nama Menu"
                                        filled
                                        disabled
                                    ></v-text-field>
                                    <v-text-field
                                        :loading="loadInfoM"
                                        prefix="Rp."
                                        :value="formatPrice(menu.harga_menu)"
                                        label="Harga Menu"
                                        filled
                                        disabled
                                    ></v-text-field>
                                    <v-textarea
                                        :loading="loadInfoM"
                                        rows="3"
                                        :value="menu.deskripsi_menu"
                                        label="Deskripsi Menu"
                                        filled
                                        disabled
                                    ></v-textarea>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <p>Catatan</p>
                    <v-textarea
                        v-model="form.catatan"
                        placeholder="catatan pesanan"
                        :no-resize="true"
                        :outlined="true"
                        :rows="3"
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
          Apakah anda yakin ingin menghapus data pesanan ini?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogConfirm = false">Batal</v-btn>
          <v-btn color="grey" @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEditPenyajian" persistent max-width="400px">
      <v-card style="background-color: #E5EEDA">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
          <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text>
          Apakah anda yakin ingin mengubah status penyajian pesanan ini?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogEditPenyajian = false">Batal</v-btn>
          <v-btn color="grey" @click="editPenyajian">Ya</v-btn>
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
  name: "Pesanan",
  data() {
    return {
      imagePath: null,
      titleForm: "",
      token: "",
      inputType: "Tambah",
    
      snackbar: false,
      error_message: "",
      color: "",

      valid: "false",
      modal: "",
      search: "",

      tambah: true,
      dialogConfirm: false,
      dialogDelete: false,
      dialogEditPenyajian: false,

      cekInfoCustomer:false,
      cekInfoMenu:false,
      cekEdit:false,

      pesanans: [],
      headers: [
        {
          text: "ID Pesanan",
          align: "center",
          sortable: true,
          value: "id_pesanan",
        },
        { text: "Nama Customer", align: "center", value: "nama_customer" },
        { text: "Nama Pesanan", align: "center", value: "nama_menu"},
        { text: "Jumlah Pesanan", align: "center", value: "jumlah_pesanan" },
        { text: "Sub Total", align: "center", value: "sub_total" },
        { text: "Catatan", align: "center", value: "catatan" },
        { text: "Status Penyajian", align: "center", value: "nama_status" },
        { text: "Aksi", align: "center", value: "actions" },
      ],

        namaCustomerRules: [(v) => !!v || "Nama customer tidak boleh kosong"],
        namaMenuRules: [(v) => !!v || "Nama menu tidak boleh kosong"],
        jumlahRules: [(v) => v>0 || "Jumlah pesanan tidak boleh kosong"],

      pesanan: new FormData(),
      namaCustomerOptions:[],
      namaMenuOptions:[],
      form: {
        id_status_pesanan:null,
        id_transaksi: null,
        id_menu: null,
        id_customer: null,
        jumlah_pesanan: null,
        catatan:null,
      },
      customer:{
        nama_customer: null,
        email_customer: null,
        telepon_customer: null,
        tanggal_lahir_customer: null,
      },
      nama_customer:null,
      menu: {
        nama_menu: null,
        harga_menu: null,
        deskripsi_menu: null,
        gambar_menu: null,
      },

      deleteId: "",
      editId: "",
      editPenyajianId: "",

      loading: false,
      loadInfoC: false,
      loadInfoM: false,
      today: "",
    };
  },
  methods: {
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    readNamaCustomer(){
        var url = this.$api + "/customer-name";
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
    readNamaMenu(){
        var url = this.$api + "/menu-name";
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.namaMenuOptions = response.data.OUT_DATA;
          if(this.namaMenuOptions == null){
            this.namaMenuOptions = [];
          }
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
    },
    getCustomerInfo(){
      this.loadInfoC = true;
      
      var url = this.$api + "/customer/"+this.form.id_customer;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          console.log(response.data.OUT_DATA)
          this.customer = response.data.OUT_DATA[0];
          this.loadInfoC = false;
          this.cekInfoCustomer = true;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.loading = false;
        });
    },
    getMenuInfo(){
      this.loadInfoM = true;
      
      var url = this.$api + "/menu/"+this.form.id_menu;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          console.log(response.data.OUT_DATA)
          this.menu = response.data.OUT_DATA[0];
          this.imagePath = this.$url + "Gambar_menu/" + this.menu.gambar_menu;
          this.loadInfoM = false;
          this.cekInfoMenu = true;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.loading = false;
        });
    },
    readData() {
      this.loading = true;
      var url = this.$api + "/pesanan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.loading = false;
          this.pesanans = response.data.OUT_DATA;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
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
      this.titleForm = "Tambah Pesanan";
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.cekEdit = true;
      this.editId = item.id_pesanan;
      this.form.id_customer = item.id_customer;
      this.form.id_menu = item.id_menu;
      this.form.jumlah_pesanan = item.jumlah_pesanan;
      this.form.catatan = item.catatan;
      this.dialog = true;
      this.tambah = false;
      this.getCustomerInfo();
      this.getMenuInfo();
      this.titleForm = "Ubah Pesanan";
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    deleteData() {
      //menghapus data
      this.dialogConfirm = false;
      this.loading = true;

      var url = this.$api + "/pesanan/" + this.deleteId;
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
          this.readNamaMenu();
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

        let newData;
        if(this.form.catatan != null){
          newData = {
            jumlah_pesanan: this.form.jumlah_pesanan,
            catatan: this.form.catatan,
          };
        }else{
          newData = {
            jumlah_pesanan: this.form.jumlah_pesanan,
          };
        }
        
        var url = this.$api + "/pesanan/" + this.editId;
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
            this.readNamaMenu();
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
    editPenyajianHandler(id){
      this.editPenyajianId = id;
      this.dialogEditPenyajian = true;
    },
    editPenyajian(){
      this.dialogEditPenyajian = false;
      this.loading = true;

      var url = this.$api + "/pesanan-penyajian/" + this.editPenyajianId;
      let newData;

      this.$http
        .put(
          url,newData
          ,{
              headers:{
                  Authorization: "Bearer " + this.token,
              }
            }
        )
        .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.readNamaCustomer();
            this.readNamaMenu();
            this.readData();
            this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });

    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        this.pesanan.append("id_menu", this.form.id_menu);
        this.pesanan.append("id_customer", this.form.id_customer);
        this.pesanan.append("jumlah_pesanan", this.form.jumlah_pesanan);
        if(this.form.catatan != null){
          this.pesanan.append("catatan", this.form.catatan);
        }
        

        var url = this.$api + "/pesanan";

        this.$http
          .post(url, this.pesanan, {
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
            this.error_message = "Terjadi kesalahan server";
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
      this.cekInfoCustomer = false;
      this.cekInfoMenu = false;
      this.cekEdit = false;
      this.resetForm();
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.readNamaCustomer();
    this.readNamaMenu();
    this.readData();
  },
};
</script>
<style scoped>
.cardinput {
  margin: 50px;
}

.image-preview{
  width:300px; 
  border:2px solid #dddddd; 
  min-height: 300px;
  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  color: #dddddd;
}
</style>
