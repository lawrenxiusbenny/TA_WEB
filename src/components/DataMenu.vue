<template>
    <v-main class="list">
    <div>
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
        </v-card-title>
        <div>
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
                </template>
            </v-data-table>
        </div>
      </v-card>
    </div>

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
      token: "",
      load: false,
      today: '',
      snackbar: false,
      error_message: "",    
      color: "",
      search: "",

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
      menus: [],
      dialogImage: false,
      imageUrlShow: '',
    };
  },
  methods: {
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    showImage(item){
      this.imageUrlShow = this.$url + "Gambar_menu/" + item.gambar_menu;
      this.dialogImage = true;
    },
    readData() {
      var url = this.$api + "/menu-mobile";
      this.load = true;
      this.$http
        .get(url
            // ,{
            //   headers:{
            //       Authorization: "Bearer " + this.token,
            //   }
            // }
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
  },
  mounted() {
    this.readData();
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
