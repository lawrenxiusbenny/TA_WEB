<template>
    <v-main class="list">
    <div v-show="tambah">
      <h1 class="font-weight-medium mb-5 font-weight-black">
        Data Menu
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
            Tambah Menu
          </v-btn>
        </v-card-title>
        <div>
            <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-success " content-class="mt-3">
                <b-tab title="Semua Menu" >
                    <v-data-table style="background-color: #E5EEDA" :headers="headers" :items="menus" :search="search">
                        <template v-slot:[`item.harga_menu`]="{ item }">
                            <span v-if="item.harga_menu != 0">Rp {{formatPrice(item.harga_menu)}}</span>
                            <span v-else>Free</span>
                        </template>
                        <template v-slot:[`item.jenis_menu`]="{ item }">
                            <v-chip
                                v-if="item.jenis_menu == 'Makanan'"       
                                class="ma-2"
                                color="deep-purple accent-4"
                                outlined
                                pill
                            >
                              <v-icon style="margin-top:-2px;margin-right:5px">mdi-food-variant</v-icon>
                                Makanan
                            </v-chip>
                            <v-chip 
                                v-else-if="item.jenis_menu == 'Minuman'"
                                color="indigo darken-3"
                                outlined
                            >
                                <v-icon style="margin-top:-2px;margin-right:5px">mdi-glass-flute</v-icon>
                                Minuman
                            </v-chip>
                            <v-chip 
                                v-else
                                class="ma-2"
                                color="cyan"
                                outlined
                            >
                              <v-icon style="margin-top:-2px;margin-right:5px">mdi-format-list-bulleted</v-icon>
                                Lain
                            </v-chip>
                        </template>
                        <template v-slot:[`item.nama_status`]="{ item }">
                            <v-chip
                                v-if="item.nama_status == 'Tersedia'"       
                                color="green"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-check</v-icon>
                              </v-avatar>
                                Tersedia
                            </v-chip>
                            <v-chip 
                                v-else-if="item.nama_status == 'Tidak Tersedia'"
                                color="red"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-close</v-icon>
                              </v-avatar>
                                Tidak Tersedia
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small color="green" class="mr-2" @click="showImage(item)">mdi-image</v-icon>
                            <v-icon small color="blue" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
                            <v-icon small color="red" class="mr-2" @click="deleteHandler(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </b-tab>
                <b-tab title="Makanan" >
                    <v-data-table style="background-color: #E5EEDA" :headers="headers2" :items="makanans" :search="search">
                        <template v-slot:[`item.harga_menu`]="{ item }">
                            Rp. {{item.harga_menu.toString()}}
                        </template>
                        <template v-slot:[`item.nama_status`]="{ item }">
                            <v-chip
                                v-if="item.nama_status == 'Tersedia'"       
                                color="green"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-check</v-icon>
                              </v-avatar>
                                Tersedia
                            </v-chip>
                            <v-chip 
                                v-else-if="item.nama_status == 'Tidak Tersedia'"
                                color="red"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-close</v-icon>
                              </v-avatar>
                                Tidak Tersedia
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small color="green" class="mr-2" @click="showImage(item)">mdi-image</v-icon>
                            <v-icon small color="blue" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
                            <v-icon small color="red" @click="deleteHandler(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </b-tab>
                <b-tab title="Minuman" >
                    <v-data-table style="background-color: #E5EEDA" :headers="headers2" :items="minumans" :search="search">
                        <template v-slot:[`item.harga_menu`]="{ item }">
                            Rp. {{item.harga_menu}}
                        </template>
                        <template v-slot:[`item.nama_status`]="{ item }">
                            <v-chip
                                v-if="item.nama_status == 'Tersedia'"       
                                color="green"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-check</v-icon>
                              </v-avatar>
                                Tersedia
                            </v-chip>
                            <v-chip 
                                v-else-if="item.nama_status == 'Tidak Tersedia'"
                                color="red"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-close</v-icon>
                              </v-avatar>
                                Tidak Tersedia
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small color="green" class="mr-2" @click="showImage(item)">mdi-image</v-icon>
                            <v-icon small color="blue" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
                            <v-icon small color="red" @click="deleteHandler(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </b-tab>
                <b-tab title="Lain" >
                    <v-data-table style="background-color: #E5EEDA" :headers="headers2" :items="lains" :search="search">
                        <template v-slot:[`item.harga_menu`]="{ item }">
                            Rp. {{item.harga_menu}}
                        </template>
                        <template v-slot:[`item.nama_status`]="{ item }">
                            <v-chip
                                v-if="item.nama_status == 'Tersedia'"       
                                color="green"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-check</v-icon>
                              </v-avatar>
                                Tersedia
                            </v-chip>
                            <v-chip 
                                v-else-if="item.nama_status == 'Tidak Tersedia'"
                                color="red"
                                text-color="white"
                            >
                              <v-avatar left>
                                <v-icon>mdi-close</v-icon>
                              </v-avatar>
                                Tidak Tersedia
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small color="green" class="mr-2" @click="showImage(item)">mdi-image</v-icon>
                            <v-icon small color="blue" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
                            <v-icon small color="red" @click="deleteHandler(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </b-tab>
            </b-tabs>
        </div>
      </v-card>
    </div>

    <div v-show="!tambah">
        <div class="cardinput"> 
            <v-card style="background-color:#E5EEDA;">
                <v-card-title id="titleCard" class="font-weight-medium mb-3 justify-center text-h4 text-center">
                    {{ titleForm }}
                </v-card-title>
                <v-card-body>
                <v-container>
                    <v-form v-model="valid" ref="form">
                    <v-row>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Nama Menu</p>
                            <v-text-field
                                prepend-inner-icon="mdi-food"
                                placeholder="nama menu"
                                :rules="namaMenuRules"
                                v-model="form.nama_menu"
                                outlined
                                required
                            >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-food</v-icon>
                            </template>
                            </v-text-field>
                        </v-col>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Status Menu</p>
                            <v-select
                                :items="statusMenuOptions"
                                placeholder="status menu"
                                prepend-inner-icon="mdi-food-fork-drink"
                                :rules="statusMenuRules"
                                v-model="form.status_menu"
                                outlined
                                required
                            >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-food-fork-drink</v-icon>
                            </template>
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="col-12">
                            <p>Deskripsi Menu</p>
                            <v-textarea
                                :rules="deskripsiRules"
                                v-model="form.deskripsi_menu"
                                placeholder="deskripsi menu"
                                :no-resize="false"
                                :outlined="true"
                                :rows="4"
                                required
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Jenis Menu</p>
                            <v-select
                                placeholder="jenis menu"
                                :rules="jenisMenuRules"
                                v-model="form.jenis_menu"
                                prepend-inner-icon="mdi-format-list-bulleted"
                                :items="jenisMenuOptions"
                                outlined
                                required
                            >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-format-list-bulleted</v-icon>
                            </template>
                            </v-select>
                        </v-col>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Harga Menu</p>
                            <v-text-field
                                placeholder="harga menu"
                                prefix="Rp. "
                                :rules="hargaRules"
                                v-model="form.harga_menu"
                                :min="0"
                                type="number"
                                outlined
                                required
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="col-md-5 col-sm-12">
                            <div class="image-preview"  v-if="this.inputType == 'Ubah'">
                                <img  :src="imagePathEdit" />
                            </div>
                            <div class="image-preview" v-if="this.inputType == 'Tambah'">
                                <p v-if="imagePathCreate==null">Image Preview</p>
                                <img v-else :src="imagePathCreate" />
                            </div>
                        </v-col>
                        <v-col class="col-md-6 col-sm-12">
                            <p>Gambar Menu</p>
                            <v-file-input
                              :rules="gambarRules"
                              @change="getImage"
                              v-model="form.gambar_menu"
                              accept="image/png, image/jpeg, image/bmp"
                              placeholder="pilih gambar menu"
                              prepend-icon="mdi-camera"
                            >
                            </v-file-input>
                        </v-col>
                    </v-row>
                    <v-card-actions class="justify-content-center mt-5">
                        <v-btn
                        class="ma-2"
                        depressed
                        color="error"
                        style="padding-left: 30px; padding-right: 30px"
                        @click="cancel"
                        >
                        Batal
                        </v-btn>
                        <v-btn class="ma-2" depressed color="primary" @click="setForm" style="padding-left: 30px; padding-right: 30px">
                        Simpan
                        </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-container>
                </v-card-body>
            </v-card>
        </div>
    </div>

    <v-dialog v-model="dialogConfirm" persisten max-width="400px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
          <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text> Apakah anda yakin ingin menghapus data menu ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogConfirm = false"
            >Batal</v-btn
          >
          <v-btn color="grey" @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogImage" persisten max-width="400px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px" class="font-weight-medium mb-3 justify-center text-h4 text-center">
          Gambar Menu
        </v-card-title>
        <v-card-text align='center'> 
          <img :src="imageUrlShow" alt="" style="max-width:350px" class="p-3">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogImage=false">Tutup</v-btn>
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
  name: "Menu",
  data() {
    return {
        imagePathEdit: null,
        imagePathCreate: null,
        fileInput: "",
      titleForm: "",
      token: "",
      inputType: "Tambah",
      load: false,
      today: '',
      snackbar: false,
      error_message: "",    
      valid: "false",
      color: "",
      modal: false,
      search: "",
      tambah: true,
      cekEditImage: 0,

      statusMenuRules: [(v) => !!v || "Status menu tidak boleh kosong"],
      namaMenuRules: [(v) => !!v || "Nama menu tidak boleh kosong"],
      jenisMenuRules: [(v) => !!v|| "Jenis menu tidak boleh kosong"],
      hargaRules: [(v) => v>-1 || "Harga menu tidak boleh negatif"],
      deskripsiRules: [(v) => !!v || "Deskripsi menu tidak boleh kosong"],
      gambarRules: [(v) => !!v || "Pilih gambar menu"],

      
      dialogConfirm: false,
      dialogDelete: false,      

      headers: [
        {
          text: "Nama Menu",
          align: "center",
          sortable: true,
          value: "nama_menu",
        },
        { text: "Jenis Menu",align: "center", value: "jenis_menu" },
        { text: "Harga Menu",align: "center", value: "harga_menu" },
        { text: "Deskripsi Menu",align: "center", value: "deskripsi_menu" },
        { text: "Status Menu",align: "center", value: "nama_status" },
        { text: "Aksi",align: "center", value: "actions" },
      ],
      headers2: [
        {
          text: "Nama Menu",
          align: "center",
          sortable: true,
          value: "nama_menu",
        },
        { text: "Harga Menu",align: "center", value: "harga_menu" },
        { text: "Deskripsi Menu",align: "center", value: "deskripsi_menu" },
        { text: "Status Menu",align: "center", value: "nama_status" },
        { text: "Aksi",align: "center", value: "actions" },
      ],
      dataMenu: new FormData(),
      statusMenuOptions: [],
      jenisMenuOptions:[],
      menus: [],
      makanans:[],
      minumans:[],
      lains:[],
      form: {
        id_status_menu:null,
        id_jenis_menu:null,
        status_menu:null,
        jenis_menu:null,
        nama_menu: null,
        harga_menu: null,
        deskripsi_menu: null,
        gambar_menu: null,
      },
      deleteId: "", 
      editId: "",
      dialogImage: false,
      imageUrlShow: '',
    };
  },
  methods: {
    readStatusMenu(){
        var url = this.$api + "/status-menu";
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.statusMenuOptions = response.data.OUT_DATA;
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
    },
    readJenisMenu(){
        var url = this.$api + "/jenis-menu";
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.jenisMenuOptions = response.data.OUT_DATA;
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
    },
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    showImage(item){
      this.imageUrlShow = this.$url + "Gambar_menu/" + item.gambar_menu;
      this.dialogImage = true;
    },
    getImage() {
      var reader = new FileReader();
      reader.readAsDataURL(this.form.gambar_menu);
      reader.onload = () => {
        if (this.inputType == "Ubah"){
          this.imagePathEdit = reader.result;
          this.cekEditImage = 1;
        }
        this.imagePathCreate = reader.result;
      };
    },
    uploadImage() {
      let image = new FormData();
      image.append("gambar_menu", this.form.gambar_menu);
      var url = this.$api + "/menu/upload-image/" + this.editId;
      this.imagePathEdit = this.imagePathCreate;
      this.$http
        .post(
          url,
          image
          ,{
                    headers:{
                        Authorization: "Bearer " + this.token,
                    }
            }
        )
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
        });
    },
    readData() {
      var url = this.$api + "/menu";
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
          this.load = false;
          this.menus= response.data.OUT_DATA;
          this.load = false;
        })
        .catch((error) => {
          this.load = false;
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
        });
    },
    readDataMakanan(){
      var url = this.$api + "/menu-jenis/1";
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
          this.makanans= response.data.OUT_DATA;
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    readDataMinuman(){
      var url = this.$api + "/menu-jenis/2";
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
          this.minumans= response.data.OUT_DATA;
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    readDataLain(){
      var url = this.$api + "/menu-jenis/3";
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
          this.lains= response.data.OUT_DATA;
          this.load = false;
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
        this.tambah = false;
        this.titleForm = "Tambah Data Menu";
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_menu;
      console.log(item.gambar_menu);
      this.form.nama_menu = item.nama_menu;
      this.form.harga_menu = item.harga_menu;
      this.form.deskripsi_menu = item.deskripsi_menu;
      this.form.jenis_menu = item.jenis_menu;
      this.form.status_menu = item.nama_status;

      this.form.gambar_menu = item.gambar_menu;

      this.imagePathEdit = this.$url + "Gambar_menu/" + item.gambar_menu;

      console.log(this.imagePathEdit);

      this.tambah = false;
      this.titleForm = "Ubah Data Menu";
    },
    deleteHandler(item) {
      this.deleteId = item.id_menu;
      this.dialogConfirm = true;
    },
    deleteData() {
      //menghapus data
      var url = this.$api + "/menu-delete/" + this.deleteId;
      console.log(this.deleteId);
      let newData;
      this.load = true;
      this.dialogConfirm = false;
      //data dihapus berdasarkan id
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
            this.readData();
            this.readDataMakanan();
            this.readDataMinuman();
            this.readDataLain();
            this.resetForm();
            this.inputType = "Tambah";
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
        if(this.cekEditImage == 1){
          this.uploadImage();
        }
        var url = this.$api + "/status-menu/"+this.form.status_menu;
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
            console.log(response.data.OUT_DATA)
            this.form.id_status_menu = response.data.OUT_DATA;
            var url = this.$api + "/jenis-menu/"+this.form.jenis_menu;
            this.$http
            .get(url, {
              headers: {
                Authorization: "Bearer " + this.token,
              },
            })
            .then((response) => {
                console.log(response.data.OUT_DATA)
                this.form.id_jenis_menu = response.data.OUT_DATA;
                
                let newData = {
                  id_status_menu: this.form.id_status_menu,
                  id_jenis_menu:this.form.id_jenis_menu,
                  nama_menu: this.form.nama_menu,
                  harga_menu: this.form.harga_menu,
                  deskripsi_menu: this.form.deskripsi_menu,
                };
                var url = this.$api + "/menu/"+this.editId;
                this.$http
                .put(
                    url,
                    newData
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
                    this.readData();
                    this.readDataMakanan();
                    this.readDataMinuman();
                    this.readDataLain();
                    this.changePage();
                    this.resetForm();
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            })
            .catch((error) => {
              console.log(error.response.data.message)
            });

        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        this.load = true;
        var url = this.$api + "/status-menu/"+this.form.status_menu;
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
            console.log(response.data.OUT_DATA)
            this.form.id_status_menu = response.data.OUT_DATA;
            var url = this.$api + "/jenis-menu/"+this.form.jenis_menu;
            this.$http
            .get(url, {
              headers: {
                Authorization: "Bearer " + this.token,
              },
            })
            .then((response) => {
                console.log(response.data.OUT_DATA)
                this.form.id_jenis_menu = response.data.OUT_DATA;
                this.dataMenu.append("id_status_menu", this.form.id_status_menu);
                this.dataMenu.append("id_jenis_menu", this.form.id_jenis_menu);
                this.dataMenu.append("nama_menu", this.form.nama_menu);
                this.dataMenu.append("harga_menu", this.form.harga_menu);
                this.dataMenu.append("deskripsi_menu", this.form.deskripsi_menu);
                this.dataMenu.append("gambar_menu", this.form.gambar_menu);

                console.log(this.form.status_menu);
                console.log(this.form.jenis_menu);
                console.log(this.form.id_status_menu);
                console.log(this.form.id_jenis_menu);
                var url = this.$api + "/menu";
                this.$http
                .post(
                    url,
                    this.dataMenu
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
                    this.readData();
                    this.readDataMakanan();
                    this.readDataMinuman();
                    this.readDataLain();
                    this.changePage();
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    console.log(this.error_message);
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            })
            .catch((error) => {
              console.log(error.response.data.message)
            });

        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
      }
    },
    changePage() {
      this.tambah = true;
      this.titleForm = "";
      this.inputType = "Tambah";
       this.imagePathEdit = null;
      this.imagePathCreate = null;
      this.cekEditImage= 0;
      this.resetForm();
    },
    resetForm() {
      this.$refs.form.reset();
      this.$refs.fileInput.value = null;
    },
  },
  mounted() {
    this.token = localStorage.getItem('token');
    this.readStatusMenu();
    this.readJenisMenu();
    this.readData();
    this.readDataMakanan();
    this.readDataMinuman();
    this.readDataLain();
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

.image-preview{
  margin-left: 50px;
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
