<template>
    <v-main class="list">
    <div v-show="tambahPending">
      <h1 class="font-weight-medium mb-5 font-weight-black">
        Daftar Transaksi
      </h1>
      <v-card style="background-color: #E5EEDA; padding-bottom:20px">
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-icon
            style="margin-top:15px"
            class="ml-5"
            @click="refresh"
          >
            mdi-refresh
          </v-icon>
          <v-spacer></v-spacer>
          <v-btn class="light-blue darken-3 rounded" small dark @click="TambahPending">
            Tambah Pesanan
          </v-btn>
        </v-card-title>
        <div>
            <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-success" content-class="mt-3" @click="readData()">
                <b-tab title="Daftar Transaksi" class="text">
                    <v-data-table 
                      style="background-color: #E5EEDA;" 
                      :headers="headers" 
                      :items="transaksis" 
                      :search="search"
                      :expanded.sync="expanded"
                      :single-expand="singleExpand"
                      item-key="id_transaksi"
                      @click:row="readDataPesanan"
                      >
                        <template v-slot:[`item.status_transaksi`]="{ item }">
                            <v-chip
                                v-if="item.status_transaksi == 'Lunas'"
                                class="ma-2"
                                depressed
                                color="green"
                                text-color="white"
                            >
                                {{item.status_transaksi}}
                            </v-chip>
                            <v-chip 
                                v-else
                                class="ma-2"
                                color="red"
                                text-color="white"
                            >
                                {{item.status_transaksi}}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.total_harga`]="{ item }">
                          Rp {{formatPrice(item.total_harga)}}
                        </template>
                        <template v-slot:[`item.metode_pembayaran`]="{ item }">
                            <v-chip
                                v-if="item.metode_pembayaran == 'Cash'"
                                class="ma-2"
                                depressed
                                color="green"
                                outlined
                                text-color="green"
                            >
                                {{item.metode_pembayaran}}
                            </v-chip>
                            <v-chip 
                                v-else
                                class="ma-2"
                                outlined
                                color="primary"
                                text-color="primary"
                            >
                                {{item.metode_pembayaran}}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon v-if="item.status_transaksi == 'Lunas'" small color="blue" class="mr-2" @click="showStruk(item)">mdi-cloud-print-outline</v-icon>
                            <v-icon v-if="item.status_transaksi == 'Belum Lunas'" small color="green" class="mr-2" @click="editStatusHandler(item)">mdi-pencil</v-icon>
                            <v-icon v-if="item.status_transaksi == 'Belum Lunas'" small color="red" class="mr-2" @click="cancelTransaksiHandler(item)">mdi-close</v-icon>
                        </template>
                        <template v-slot:expanded-item="{headers}">
                          <td :colspan="headers.length">
                            <v-data-table
                              style="margin-top:10px; margin-bottom:10px" 
                              hide-default-footer
                              :headers="headersPesanan"
                              :items="dataPesanans"
                              :loading="loadInfoPesanan"
                              >
                              <template v-slot:[`item.id_pesanan`]="{ item }">
                                  <span>Order-{{item.id_pesanan}}</span>
                              </template>
                              <template v-slot:[`item.sub_total`]="{ item }">
                                  Rp {{formatPrice(item.sub_total)}}
                              </template>
                            </v-data-table>
                          </td>
                        </template>
                    </v-data-table>
                </b-tab>
                <b-tab title="Pesanan Pending" class="text">
                  <v-data-table
                    style="background-color: #E5EEDA"
                    :items="pesanansPending"
                    :headers="headersPesananPending"
                    :search="search"
                  >
                    <template v-slot:[`item.id_pesanan`]="{ item }">
                        <span>Order-{{item.id_pesanan}}</span>
                    </template>
                    <template v-slot:[`item.catatan`]="{ item }">
                        <span v-if="item.catatan === null">-</span>
                        <span v-else>{{item.catatan}}</span>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small color="blue" class="mr-2" @click="editPendingHandler(item)">mdi-pencil</v-icon>
                        <v-icon small color="red" class="mr-2" @click="deletePendingHandler(item.id_pesanan)">mdi-delete</v-icon>
                    </template>
                  </v-data-table>
                </b-tab>
                <b-tab title="Pembayaran" class="text">

                  <div class="m-4" v-show="!showStepper">
                    <v-form v-model="validInput" ref="formInput">
                        <v-row>
                            <v-col class="col-md-3 col-sm-12">   
                                <v-select
                                    placeholder="nama customer"
                                    :rules="namaCustomerRules"
                                    :items="namaCustomerOptions"
                                    item-text="nama_customer"
                                    item-value="id_customer"
                                    v-model="formInput.id_customer"
                                    outlined
                                    required
                                >
                                    <template v-slot:prepend-inner>
                                        <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-account-multiple</v-icon>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col class="col-md-3 col-sm-12">
                                <v-btn
                                    class="ma-2"
                                    color="secondary" 
                                    @click="cekPesanan" 
                                    style="padding-left: 30px; padding-right: 30px"
                                >
                                    Cek Pesanan
                                    
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>

                    <v-row v-if="dialogPesananEmpty" justify="center" class="my-5">
                        <v-row class="col-md-8 col-sm-12">
                            <v-card  class="col" style="background-color:#7A9B57; margin-bottom: 50px">
                                <v-card-title class="justify-center">
                                    <v-icon large>mdi-emoticon-sad</v-icon>
                                </v-card-title>
                                <v-card-text class="text-center">
                                    Daftar pesanan masih kosong, silahkan tambah data pesanan terlebih dahulu
                                </v-card-text>
                            </v-card>
                        </v-row>
                    </v-row>
                  </div>
                  
                  <v-stepper class="ma-4" v-model="e1" v-show="showStepper">
                    <v-stepper-header>
                      <v-stepper-step
                        :complete="e1 > 1"
                        step="1"
                      >
                        Detil Pesanan
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        :complete="e1 > 2"
                        step="2"
                      >
                        Transaksi Pembayaran
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step step="3">
                        Notifikasi Berhasil
                      </v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-items>
                      <v-stepper-content step="1">
                          <v-row v-show="showPesanan">
                            <v-col class="col-md-8 col-sm-12">
                                <v-data-table
                                    v-model="selected" 
                                    :headers="headers2" 
                                    :items="pesanans" 
                                    :search="search" 
                                    item-key="nama_menu"
                                    show-select>
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
                                        </v-chip>
                                        <v-chip 
                                            v-else
                                            color="green"
                                            outlined
                                            pill
                                        >
                                            <v-icon style="margin-top:-2px;margin-right:5px">mdi-check</v-icon>
                                            {{item.nama_status}}
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.harga_menu`]="{ item }">
                                      Rp {{formatPrice(item.harga_menu)}}
                                    </template>
                                    <template v-slot:[`item.sub_total`]="{ item }">
                                      Rp {{formatPrice(item.sub_total)}}
                                    </template>
                                    <template v-slot:[`item.gambar_menu`]="{ item }">
                                        <div class="p-2">
                                          <img :src="'http://api.roemahsoto.xyz/Gambar_menu/' + item.gambar_menu" width="150px"/>
                                        </div>
                                    </template>
                                    
                                

                                    <template v-slot:[`item.actions`]="{ item }">
                                        <v-icon small color="blue" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
                                        <v-icon small color="red" class="mr-2" @click="deleteHandler(item)">mdi-delete</v-icon>
                                    </template>
                                </v-data-table>
                            </v-col>
                            <v-col class="col-md-4 col-sm-12">
                                <v-card style="background-color: #E5EEDA">
                                    <v-container>
                                        <h4 class="text-center font-weight-bold">Ringkasan Pesanan</h4>
                                        <v-divider></v-divider>
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <p>Subtotal</p>
                                            </div>
                                            <div style="align: right;" >
                                              Rp {{formatPrice(this.selected.reduce((acc, item) => parseFloat(acc) + parseFloat(item.sub_total), 0))}}
                                            </div>
                                        </div>
                                        <v-divider></v-divider>
                                        <div class="d-flex justify-content-between">
                                            <div >
                                                <h4 class="font-weight-bold">Total</h4>
                                            </div>
                                            <div style="align: right;" >
                                              Rp {{formatPrice(this.selected.reduce((acc, item) => parseFloat(acc) + parseFloat(item.sub_total), 0))}}
                                            </div>
                                        </div>
                                    </v-container>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-divider class="my-5"></v-divider>

                        <v-btn color="primary" @click="cekStep1" class="mr-5">Lanjut</v-btn>
                        <v-btn color="secondary" @click="closeStepper">Batal</v-btn>
                      </v-stepper-content>

                      <v-stepper-content step="2">
                            <v-container>
                              <div class="font-weight-medium mb-3 justify-center text-h4 text-center">
                                Data Transaksi Pembayaran
                              </div>
                              <v-divider></v-divider>
                                <v-container>
                                    <v-form v-model="validTransaksi" ref="formTransaksi">
                                        <v-row >
                                            <v-col cols="12" md="2" sm="12">
                                                <p>ID Customer</p>
                                                <v-text-field
                                                    v-model="formInput.id_customer"
                                                    outlined
                                                    disabled
                                                    required
                                                >
                                                    <template v-slot:prepend-inner>
                                                        <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-account-multiple</v-icon>
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="5" sm="12" style=" border:4px solid #E5EEDA; ">
                                                <v-row>
                                                    <v-col cols="12">
                                                        <v-text-field
                                                            :value="dataCustomer.nama_customer"
                                                            label="Nama Customer"
                                                            filled
                                                            disabled
                                                        ></v-text-field>
                                                        <v-text-field
                                                            :value="dataCustomer.email_customer"
                                                            label="Email Customer"
                                                            filled
                                                            disabled
                                                        ></v-text-field>
                                                        <v-text-field
                                                            :value="dataCustomer.telepon_customer"
                                                            label="No. Telepon Customer"
                                                            filled
                                                            disabled
                                                        ></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col cols="12" md="5" sm="12" align="center">
                                                <v-row>
                                                    <v-col cols="12">
                                                        <p style="font-size:30px; font-weight: medium;">Metode Pembayaran</p>
                                                    </v-col>
                                                </v-row>
                                                <v-row justify="center" style="margin-top:-40px">
                                                    <v-col cols="6">
                                                        <v-radio-group v-model="formTransaksi.metode_pembayaran" row>
                                                            <v-radio
                                                            color="success"
                                                            label="Cash" 
                                                            value="Cash"
                                                            ></v-radio>
                                                            <v-radio
                                                                color="success"
                                                                label="Cashless"
                                                                value="Cashless"
                                                            ></v-radio>
                                                        </v-radio-group>
                                                    </v-col>
                                                </v-row>
                                                <div v-if="formTransaksi.metode_pembayaran=='Cashless'">
                                                    <div>
                                                        <v-row justify="center">
                                                            <v-col cols="8">
                                                                <v-text-field
                                                                    placeholder="nama metode jika ada"  
                                                                    :rules="namaMetodeRules"
                                                                    v-model="nama_metode"
                                                                    outlined
                                                                    required
                                                                >
                                                                     <template v-slot:prepend-inner>
                                                                        <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-cards</v-icon>
                                                                    </template>
                                                                </v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                </div>
                                                <v-row>
                                                    <v-col cols="12">
                                                        <p style="font-size:30px; font-weight: medium;">Nomor meja</p>
                                                    </v-col>
                                                </v-row>
                                                <v-row justify="center" style="margin-top:-20px">
                                                    <v-col cols="8">
                                                        <v-text-field
                                                            placeholder="nomor meja jika makan di tempat"  
                                                            v-model="formTransaksi.nomor_meja"
                                                            outlined
                                                            required
                                                        >
                                                              <template v-slot:prepend-inner>
                                                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-cards</v-icon>
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-container>
                            </v-container>
                          <v-divider class="my-5"></v-divider>
                        <v-btn @click="e1 = 1" class="mr-5">Kembali</v-btn>
                        <v-btn color="primary" @click="save" class="mr-5">Tambah</v-btn>
                        <v-btn color="secondary" @click="closeStepper">Batal</v-btn>
                      </v-stepper-content>

                      <v-stepper-content step="3">
                        <template>
                          
                            <div class="text-center">
                              <sweetalert-icon icon="success"/>
                              <transition name="fade">
                                <h4>Berhasil Menambah Data Transaksi Pembayaran</h4>
                              </transition>
                            </div>
                          
                        </template>
                        <v-btn color="secondary" @click="closeStepper">Tutup</v-btn>
                      </v-stepper-content>
                    </v-stepper-items>
                  </v-stepper>

                </b-tab>
            </b-tabs>
        </div>
      </v-card>
    </div>

    <div v-show="!tambahPending">
      <div class="cardinput">
        <v-card class="m-2" style="background-color: #E5EEDA;">
          <v-card-title
            style="background-color: #7A9B57"
            class="font-weight-medium mb-3 justify-center text-h4 text-center"
          >
            {{ titleFormPending }}
          </v-card-title>
          <v-card-body >
            <v-container>
              <v-form v-model="valid" ref="form">
                <v-row>
                    <v-col cols="12" md="4" sm="12">
                        <p>Nama Customer</p>
                        <v-select
                            @change="getCustomerInfoPending"
                            :loading="loadInfoC"
                            :items="namaCustomerOptionsPending"
                            item-text="nama_customer"
                            item-value="id_customer"
                            placeholder="pilih nama customer"
                            :rules="namaCustomerRules"
                            v-model="form.id_customer"
                            outlined
                            required
                            :disabled="cekEditPending"
                        >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-account</v-icon>
                            </template>
                        </v-select>
                        
                    </v-col>
                    <v-col cols="12" md="4" sm="12">
                        <p>Nama Menu</p>
                        <v-select
                            @change="getMenuInfoPending"
                            :loading="loadInfoM"
                            :items="namaMenuOptionsPending"
                            item-text="nama_menu"
                            item-value="id_menu"
                            placeholder="pilih nama menu"
                            :rules="namaMenuRules"
                            v-model="form.id_menu"
                            outlined
                            required
                            :disabled="cekEditPending"
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
                                    :value="customerPending.nama_customer"
                                    label="Nama Customer"
                                    filled
                                    disabled
                                ></v-text-field>
                            </v-row>
                            <v-row class="ma-1">
                                <v-text-field
                                    :loading="loadInfoC"
                                    :value="customerPending.email_customer"
                                    label="Email Customer"
                                    filled
                                    disabled
                                ></v-text-field>
                            </v-row>
                            <v-row class="ma-1">
                                <v-text-field
                                    :loading="loadInfoC"
                                    :value="customerPending.telepon_customer"
                                    label="Telepon Customer"
                                    filled
                                    disabled
                                ></v-text-field>
                            </v-row>
                            <v-row class="ma-1">
                                <v-text-field
                                    :loading="loadInfoC"
                                    :value="customerPending.tanggal_lahir_customer"
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
                                <v-col class="image-preview" align="center">
                                    <img width="300px" :loading="loadInfoM" :src="imagePath"/>
                                    <!-- <p>Image Preview</p> -->
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field
                                        :loading="loadInfoM"
                                        :value="menuPending.nama_menu"
                                        label="Nama Menu"
                                        filled
                                        disabled
                                    ></v-text-field>
                                    <v-text-field
                                        :loading="loadInfoM"
                                        prefix="Rp."
                                        :value="formatPrice(menuPending.harga_menu)"
                                        label="Harga Menu"
                                        filled
                                        disabled
                                    ></v-text-field>
                                    <v-textarea
                                        :loading="loadInfoM"
                                        rows="3"
                                        :value="menuPending.deskripsi_menu"
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
                        @click="cancelPending"
                    >
                        Batal
                    </v-btn>
                    <v-btn
                        class="ma-2"
                        depressed
                        color="primary"
                        @click="setFormPending"
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

    <v-dialog v-model="dialogConfirmPending" persistent max-width="400px">
      <v-card style="background-color: #E5EEDA">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
          <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text>
          Apakah anda yakin ingin menghapus data pesanan ini?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogConfirmPending = false">Batal</v-btn>
          <v-btn color="grey" @click="deleteDataPending">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog transition="dialog-top-transition" v-model="dialogEdit" max-width="600px">
      <v-card style="background-color:#E5EEDA;">
          <v-card-title id="titleCard" class="font-weight-medium mb-3 justify-center text-h4 text-center">
              Edit Pesanan
          </v-card-title>
          <v-card-body>
          <v-container>
              <v-form v-model="validEdit" ref="formEdit">
              <v-row>
                  <v-col class="col-md-6 col-sm-12">
                      <p>Nama Menu</p>
                      <v-text-field
                          placeholder="nama menu"
                          prepend-inner-icon="mdi-food-fork-drink"
                          v-model="namaMenuEdit"
                          outlined
                          disabled
                          required
                      >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-food-fork-drink</v-icon>
                            </template>
                      </v-text-field>
                  </v-col>
                  <v-col class="col-md-6 col-sm-12">
                      <p>Jumlah Pesanan</p>
                      <v-text-field
                          type="number"
                          :min="1"
                          placeholder="jumlah pesanan"
                          :rules="jumlahRules"
                          v-model="jumlahEdit"
                          outlined
                          required
                      >
                            <template v-slot:prepend-inner>
                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-map-marker</v-icon>
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
                  @click="dialogEdit = false"
                  >
                  Batal
                  </v-btn>
                  <v-btn depressed color="primary" @click="update" style="padding-left: 30px; padding-right: 30px">
                  Simpan
                  </v-btn>
              </v-card-actions>
              </v-form>
          </v-container>
          </v-card-body>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persisten max-width="400px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
           <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text> Apakah anda yakin ingin menghapus pesanan ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogDelete = false"
            >Batal</v-btn
          >
          <v-btn color="grey" @click="deleteData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogContinue" persisten max-width="400px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
           <h4 class="text-h4 font-weight-medium mb-1">Warning!</h4>
        </v-card-title>
        <v-card-text> Pilih pesanan terlebih dahulu untuk melanjutkan</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogContinue = false"
            >Tutup</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSave" persisten max-width="400px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
           <h4 class="text-h4 font-weight-medium mb-1">Konfirmasi Transaksi</h4>
        </v-card-title>
        <v-card-text>Apakah anda yakin ingin menambah data transaksi? ketika memilih ya, maka data transaksi tidak akan bisa diubah lagi.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogSave = false"
            >Batal</v-btn
          >
          <v-btn color="grey" @click="saveData">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCancelTransaksi" persisten max-width="500px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
           <h4 class="text-h4 font-weight-medium mb-1">Konfirmasi Batal Transaksi</h4>
        </v-card-title>
        <v-card-text>Apakah anda yakin ingin membatalkan data transaksi ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogCancelTransaksi = false"
            >Batal</v-btn
          >
          <v-btn color="grey" @click="cancelTransaksi">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogStatus" persisten max-width="420px">
      <v-card style="background-color:#E5EEDA;">
        <v-card-title style="background-color: #7A9B57; margin-bottom: 20px">
           <h4 class="text-h4 font-weight-medium mb-1">Konfirmasi Ubah Status</h4>
        </v-card-title>
        <v-card-text>Apakah anda yakin ingin mengubah status transaksi ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialogStatus = false"
            >Batal</v-btn
          >
          <v-btn color="grey" @click="ubahStatus">Ya</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div id="cetak" class="" >
      <v-card class="p-3"  width="545px" outlined v-show="dialogStruk">
          <v-card-title>
              <v-row justify="center">
                <v-col justify="center" cols="8">
                    <img  style="margin-top:-100px" src="../assets/logo.png" alt="Logo Roemah Soto" width="300">
                </v-col>
              </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
                <p class="font-weight-bold" style="margin-top:-50px">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</p>
            </v-row>  
            <v-row style="margin-top:-40px">
                <v-col cols="4" >
                    <p class="font-weight-bold">No Transaksi</p>
                </v-col>
                <v-col align="right">
                    <p class="font-weight-bold">:</p>
                </v-col>
                <v-col cols="6" align="left">
                    <p>{{dataTransaksi.id_transaksi}}</p>
                </v-col>
            </v-row>
            <v-row style="margin-top:-40px">
                <v-col cols="4" >
                    <p class="font-weight-bold">Kasir</p>
                </v-col>
                <v-col align="right">
                    <p class="font-weight-bold">:</p>
                </v-col>
                <v-col cols="6" align="left">
                    <p>{{dataTransaksi.nama_karyawan}}</p>
                </v-col>
            </v-row>
            <v-row style="margin-top:-40px">
                <v-col cols="4" >
                    <p class="font-weight-bold">Tanggal Transaksi</p>
                </v-col>
                <v-col align="right">
                    <p class="font-weight-bold">:</p>
                </v-col>
                <v-col cols="6" align="left">
                    <p>{{dataTransaksi.tanggal_transaksi}}</p>
                </v-col>
            </v-row>
            <v-row style="margin-top:-40px">
                <v-col cols="4" >
                    <p class="font-weight-bold">Tanggal Cetak</p>
                </v-col>
                <v-col align="right">
                    <p class="font-weight-bold">:</p>
                </v-col>
                <v-col cols="6" align="left">
                    <p>{{dataTransaksi.tanggal_transaksi}}</p>
                </v-col>
            </v-row>
            <v-row>
                <p class="font-weight-bold" style="margin-top:-35px">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</p>
            </v-row>  
            <v-row style="margin-top:-33px">
                <v-col cols="4" >
                    <p class="font-weight-bold">Nama Customer</p>
                </v-col>
                <v-col align="right">
                    <p class="font-weight-bold">:</p>
                </v-col>
                <v-col cols="6" align="left">
                    <p>{{dataTransaksi.nama_customer}}</p>
                </v-col>
            </v-row>
            <v-row style="margin-top:-40px">
                <v-col cols="4" >
                    <p class="font-weight-bold">Royalty Point</p>
                </v-col>
                <v-col align="right">
                    <p class="font-weight-bold">:</p>
                </v-col>
                <v-col cols="6" align="left">
                    <p>{{dataTransaksi.royalty_point}}</p>
                </v-col>
            </v-row>
            <v-row>
                <p class="font-weight-bold" style="margin-top:-35px">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</p>
            </v-row>  
            <v-divider class="my-5 font-weight-bold"></v-divider>
            <v-row style="margin-top:-10px">
              <t-head>
                <tr>
                  <th width="70px" class="text-center">Jumlah</th>
                  <th width="150px" style="text-align:center;">Nama Menu</th>
                  <th width="140px" style="text-align:center;">Harga Menu</th>
                  <th width="140px" style="text-align:center;">Sub Total</th>
                </tr>
              </t-head>
              <v-divider style="margin-left:10px; margin-right:15px; margin-top:0px"></v-divider>
              <t-body style="margin-top:-10px">
                <tr v-for="(item,index) in pesananStruk" :key='index'>
                  <td width="70px" class="text-center">{{item.jumlah_pesanan}}</td>
                  <td width="150px" style="text-align:center;">{{item.nama_menu}}</td>
                  <td width="140px" style="text-align:center;">Rp {{formatPrice(item.harga_menu)}}</td>
                  <td width="140px" style="text-align:center;">Rp {{formatPrice(item.harga_menu * item.jumlah_pesanan)}}</td>
                </tr>
                  <p class="font-weight-bold" style="margin-bottom:-3px" >- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</p>
                <tr >
                  <td width="70px" class="text-center"></td>
                  <td width="150px"></td>
                  <td width="140px" style="text-align:center;">Sub Total</td>
                  <td width="140px" style="text-align:center;">Rp {{formatPrice(totalHarga)}}</td>
                </tr>
                <tr >
                  <td width="70px" class="text-center"></td>
                  <td width="150px"></td>
                  <td width="140px" style="text-align:center;">Discount</td>
                  <td width="140px" style="text-align:center;">Rp {{formatPrice(totalHarga*(discount/100))}}</td>
                </tr>
                    <p class="font-weight-bold" style="margin-top:-3px; margin-bottom:-3px" >- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</p>
                <tr>
                  <td width="70px" class="text-center"></td>
                  <td width="150px"></td>
                  <td width="140px" class="font-weight-bold" style="text-align:center;">Total</td>
                  <td width="140px" class="font-weight-bold" style="text-align:center;">Rp {{formatPrice(totalHarga - (totalHarga*(discount/100)))}}</td>
                </tr>
                <v-divider style="margin-top:5px"></v-divider>
              </t-body>
            </v-row>
            <v-row style="margin-top: 50px;">
              <h4 style="text-align: center;" class="font-weight-bold">Terima Kasih</h4>
              <v-icon style="margin-bottom: 50px;">mdi-emoticon-happy</v-icon>
            </v-row>
          </v-card-text>
      </v-card>
    </div>

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
import SweetalertIcon from 'vue-sweetalert-icons';
import html2PDF from 'jspdf-html2canvas';
export default {
  name: "Transaksi",
   components: {
    SweetalertIcon,
    },
  data() {
    return {
      token: "",
      e1: 1,
      load: false,
      today: '',
      showStepper: false,

      expanded:[],
      singleExpand:true,

      snackbar: false,
      error_message: "",    
      color: "",

      validInput: "false",
      validEdit: "false",
      validTransaksi: "false",
      
      search: "",

      modal: false,
        dialogDelete: false,

      headers: [
        {
          text: "Kode Transaksi",
          align: "center",
          sortable: true,
          value: "id_transaksi",
        },
        { text: "Nama Customer", value: "nama_customer", align: "center", },
        { text: "Total Harga", value: "total_harga", align: "center", },
        { text: "Metode Pembayaran", value: "metode_pembayaran", align: "center", },
        { text: "Status Transaksi", value: "status_transaksi", align: "center", },
        { text: "Tanggal Transaksi", value: "created_at", align: "center", },
        { text: "",align: "center", value: "actions" },
      ],
      headers2: [
        {
          text: "Menu",
          align: "center",
          value: "gambar_menu",
        },
        { text: "Nama pesanan", align: "center", value: "nama_menu" },
        { text: "Harga Menu", align: "center", value: "harga_menu" },
        { text: "Jumlah", align: "center", value: "jumlah_pesanan" },
        { text: "Sub Total", align: "center", value: "sub_total" },
        { text: "", align: "center", value: "actions" },
      ],
      headersPesananPending: [
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
        { text: "", align: "center", value: "actions" },
      ],

       headersPesanan: [
        {
          text: "ID Pesanan",
          align: "center",
          sortable: true,
          value: "id_pesanan",
        },
        { text: "Nama Pesanan", align: "center", value: "nama_menu"},
        { text: "Jumlah Pesanan", align: "center", value: "jumlah_pesanan" },
        { text: "Sub Total", align: "center", value: "sub_total" },
      ],
      
        transaksis: [],
        pesanans:[],
        pesananStruk:[],

        dataPesanans:[],

        idPesanans:[],
    
        namaCustomerOptions:[],

        dialogPesananEmpty:false,
        dialogStatus:false,
        showPesanan: false,
        selected:[],
    
        dataTransaksi:{
            nama_customer:null,
            nama_karyawan:null,
            tanggal_transaksi:null,
            tanggal_cetak:null,
            royalty_point:0,
        },
      formInput: {
        id_customer:null,
      },

      formTransaksi:{
          id_customer:null,
          id_karyawan:null,
          total_harga:null,
          status_transaksi:null,
          metode_pembayaran:'Cash',
          nomor_meja:null,
      },
      nama_metode:'',


      dataCustomer:{
        nama_customer: null,
        email_customer: null,
        telepon_customer:null,
      },

      jumlahRules: [(v) => !!v || "Jumlah pesanan tidak boleh kosong"],
      namaCustomerRules: [(v) => !!v || "Nama customer tidak boleh kosong"],

      id_meja:0,
      editId: 0,
      editIdStatus:0,
      deleteId: 0,
      cancelId:0,
      jumlahEdit: 0,
      namaMenuEdit: "",


      dialogEdit: false,
      dialogContinue:false,
      dialogSave: false,
      dialogCancelTransaksi:false,

      totalHarga: 0,
      discount:0,


      quantity:0,
      item: 0,

      dialogStruk: false,
      pesananStruks:[],
      
      textPrinted:"",

      // tambahan revisi
      imagePath: null,
      titleFormPending: "",
      inputTypePending: "Tambah",
      valid: "false",

      tambahPending: true,
      dialogConfirmPending: false,
      dialogDeletePending: false,

      cekInfoCustomer:false,
      cekInfoMenu:false,
      cekEditPending:false,

      //  namaCustomerRules: [(v) => !!v || "Nama customer tidak boleh kosong"],
        namaMenuRules: [(v) => !!v || "Nama menu tidak boleh kosong"],
        // jumlahRules: [(v) => v>0 || "Jumlah pesanan tidak boleh kosong"],

      pesananPending: new FormData(),
      pesanansPending:[],
      namaCustomerOptionsPending:[],
      namaMenuOptionsPending:[],
      form: {
        id_status_pesanan:null,
        id_transaksi: null,
        id_menu: null,
        id_customer: null,
        jumlah_pesanan: null,
        catatan:null,
      },
      customerPending:{
        nama_customer: null,
        email_customer: null,
        telepon_customer: null,
        tanggal_lahir_customer: null,
      },
      nama_customer:null,
      menuPending: {
        nama_menu: null,
        harga_menu: null,
        deskripsi_menu: null,
        gambar_menu: null,
      },

      editIdPending: 0,
      deleteIdPending:0,

      loadInfoC: false,
      loadInfoM: false,
      loadInfoPesanan:false,
    };
  },
  methods: {
    refresh(){
      this.readData();
      this.readPesananPending();
    },
    getCustomerInfo(){
      
      var url = this.$api + "/customer/"+this.formInput.id_customer;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.dataCustomer = response.data.OUT_DATA[0];
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          console.log(this.error_message);
        });
    },
    readPesananPending(){
      this.load = true;
      var url = this.$api + "/pesanan-pending";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.load = false;
           if(response.data.OUT_DATA == null){
            this.pesanansPending = [];
          }else{
            this.pesanansPending = response.data.OUT_DATA;
          }
          console.log(response.data.OUT_DATA);
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    readData() {
      var url = this.$api + "/transaksi";
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
          if(response.data.OUT_DATA == null){
            this.transaksis = [];
          }else{
            this.transaksis= response.data.OUT_DATA;
          }
          this.load =false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    readDataPesanan(item,slot){
      console.log(item.id_transaksi);
      slot.expand(!slot.isExpanded);
      this.loadInfoPesanan = true;
      this.dataPesanans = [];
       var url = this.$api + "/pesanan-transaksi/"+item.id_transaksi;
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          if(response.data.OUT_DATA == null){
            this.dataPesanans = [];
          }else{
            this.dataPesanans = response.data.OUT_DATA;
          }
          this.loadInfoPesanan  = false;
          console.log(response.data.OUT_DATA);
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
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
    cekStep1(){
        if(this.selected.length == 0){
            this.dialogContinue = true;
        }else{
            this.getCustomerInfo();
            this.e1 = 2;
        }
    },
    editStatusHandler(item){
        this.editIdStatus = item.id_transaksi;
        this.dialogStatus = true;
    },
    ubahStatus(){
        this.dialogStatus = false;
        this.load = true;
        var url = this.$api + "/transaksi-status/"+ this.editIdStatus;
        let newData;
        this.$http
        .put(url,newData
            ,{
                headers:{
                    Authorization: "Bearer " + this.token,
                }
            }
        )
        .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green"
            this.snackbar = true;
            this.load = false;
            this.readData();
        })
        .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
        });
    },
    cancelTransaksi(){
        this.dialogCancelTransaksi = false;
        this.load = true;
        var url = this.$api + "/transaksi/"+ this.cancelId;
        this.$http
        .delete(url,{
                headers:{
                    Authorization: "Bearer " + this.token,
                }
            }
        )
        .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green"
            this.snackbar = true;
            this.load = false;
            this.readData();
        })
        .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
        });
    },
    showStruk(item){

      if(item.id_kupon_customer == null){
          this.discount = 0;
      }else{
        var url = this.$api + "/kupon-struk/"+item.id_kupon_customer;
        console.log(item.id_kupon_customer)
        this.$http
            .get(url, {
            headers: {
                Authorization: "Bearer " + this.token,
            },
            })
            .then((response) => {
                this.discount=response.data.OUT_DATA.persentase_potongan;
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                console.log(this.error_message);
            });
      }

        var urlPoint = this.$api + "/point-struk/"+item.id_customer;
        console.log(item.id_customer)
        this.$http
            .get(urlPoint, {
            headers: {
                Authorization: "Bearer " + this.token,
            },
            })
            .then((response) => {
                this.dataTransaksi.royalty_point=response.data.OUT_DATA.jumlah_point;
                if(response.data.OUT_DATA.jumlah_point == null){
                    this.dataTransaksi.royalty_point = 0;
                }
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                console.log(this.error_message);
            });

      this.dataTransaksi.id_transaksi = item.id_transaksi;
      this.dataTransaksi.nama_karyawan = item.nama_karyawan;
      this.dataTransaksi.tanggal_transaksi = item.created_at;
      this.dataTransaksi.tanggal_cetak = item.created_at;
      this.dataTransaksi.nama_customer = item.nama_customer;

      this.getPesananStruks(item.id_transaksi);
      this.dialogStruk = true;
    
      this.load = true;
      

      let cetak = document.getElementById("cetak");
      setTimeout(() => this.load = false, 8000);
      setTimeout(() => html2PDF(cetak,{
        jsPDF: {
          format: 'a4',
        },
        imageType: 'image/jpeg',
        html2canvas : {
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        output : "Struk Transaksi " + item.id_transaksi+".pdf"
      }), 1000);

      setTimeout(() => this.dialogStruk = false, 8000);
      
    },
    getPesananStruks(id){
        var url = this.$api + "/pesanan-struk/"+ id;
        this.$http
        .get(url
            ,{
                headers:{
                    Authorization: "Bearer " + this.token,
                }
            }
        )
        .then((response) => {
            this.pesananStruk = response.data.OUT_DATA;
            this.totalHarga = response.data.total_harga;
            console.log(response.data.OUT_DATA);
            console.log(this.pesananStruk);
        })
        .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
        });
    },
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    closeStepper(){
      this.showStepper = false;
      this.e1 = 1;
      this.clearData();
    },
    deleteHandler(item) {
      this.deleteId = item.id_pesanan;
      this.dialogDelete = true;
    },
    deleteData() {
      //menghapus data
      var url = this.$api + "/pesanan/" + this.deleteId;
      //data dihapus berdasarkan id
      this.dialogDelete = false;
      this.load = true;
      this.$http
        .delete(
          url, {
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
          this.cekPesanan();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    save(){
        let i;
        for(i in this.selected){
            this.idPesanans.push(this.selected[i].id_pesanan);
        }

        this.formTransaksi.id_customer = this.formInput.id_customer;
        this.formTransaksi.id_karyawan = localStorage.getItem('id_karyawan');
        this.formTransaksi.total_harga = this.selected.reduce((acc, item) => parseFloat(acc) + parseFloat(item.sub_total), 0);
        this.formTransaksi.status_transaksi = "Lunas";
        if(this.formTransaksi.nomor_meja == null){
          this.formTransaksi.nomor_meja = "-";
        }
      if(this.$refs.formTransaksi.validate()){
          this.dialogSave = true;
      }
    },
    saveData(){
      var url = this.$api + "/transaksi";
      let newData;

      console.log(this.idPesanans);
    
        newData={
            id_customer:this.formTransaksi.id_customer,
            id_karyawan:this.formTransaksi.id_karyawan,
            total_harga: this.formTransaksi.total_harga,
            metode_pembayaran: this.formTransaksi.metode_pembayaran,
            status_transaksi: this.formTransaksi.status_transaksi,
            device:"web",
            list_id_pesanan: this.idPesanans,
            nomor_meja: this.formTransaksi.nomor_meja
        };
      
      this.dialogSave = false;
      this.load = true;
      this.$http
        .post(
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
          this.e1 = 3;
          this.readData();
          this.readPesananPending();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    cekPesanan(){
        if(this.$refs.formInput.validate()){
            var url = this.$api + "/pesanan/"+ this.formInput.id_customer;
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
                this.pesanans = response.data.OUT_DATA;
                if(this.pesanans == null){
                    this.dialogPesananEmpty = true;
                    this.showStepper = false;
                    this.showPesanan = false;
                    this.pesanans = [];
                }else{
                    this.dialogPesananEmpty = false;
                    this.showStepper = true;
                    this.showPesanan = true;
                }
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
    editHandler(item){
      this.editId = item.id_pesanan;
      this.jumlahEdit = item.jumlah_pesanan;
      this.namaMenuEdit= item.nama_menu;
      this.dialogEdit = true;
    },
    cancelTransaksiHandler(item){
      this.cancelId = item.id_transaksi;
      this.dialogCancelTransaksi = true;
    },
    update(){
        if(this.$refs.formEdit.validate()){

            let newData = {
            jumlah_pesanan: this.jumlahEdit
            };
            var url = this.$api + "/pesanan/" + this.editId;
            this.load = true;
            this.dialogEdit = false;
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
                this.cekPesanan();
                this.editId = 0;
                this.namaMenuEdit = "";
                this.jumlahEdit = 0;
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        }
    },
    clearData(){
        this.$refs.formInput.reset();
    },
    setFormPending() {
        
      if (this.inputTypePending === "Tambah") {
        this.savePending();
      } else {
        this.updatePending();
      }
    },
    savePending(){
      if (this.$refs.form.validate()) {
        this.load = true;

        this.pesananPending.append("id_menu", this.form.id_menu);
        this.pesananPending.append("id_customer", this.form.id_customer);
        this.pesananPending.append("jumlah_pesanan", this.form.jumlah_pesanan);
        if(this.form.catatan != null){
          this.pesananPending.append("catatan", this.form.catatan);
        }
        

        var url = this.$api + "/pesanan";
        this.$http
          .post(url, this.pesananPending, {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          })
          .then((response) => {
            this.error_message = response.data.OUT_MESSAGE;
            this.color = "green";
            this.snackbar = true;
            this.readPesananPending();
            this.changePagePending();
            this.load= false;
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
    updatePending() {
      if (this.$refs.form.validate()) {
        this.load = true;

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
        
        var url = this.$api + "/pesanan/" + this.editIdPending;
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
            this.readPesananPending();
            this.readNamaCustomerPending();
            this.readNamaMenuPending();
            this.changePagePending();
            this.resetFormPending();
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
    TambahPending() {
      this.tambahPending = false;
      this.titleFormPending = "Tambah Pesanan";
    },
    editPendingHandler(item) {
      this.menuPending = [];
      this.customerPending = [];
      this.inputTypePending = "Ubah";
      this.cekEditPending= true;
      this.editIdPending = item.id_pesanan;
      this.form.id_customer = item.id_customer;
      this.form.id_menu = item.id_menu;
      this.form.jumlah_pesanan = item.jumlah_pesanan;
      this.form.catatan = item.catatan;
      this.dialogPending = true;
      this.getCustomerInfoPending();
      this.getMenuInfoPending();
      this.tambahPending = false;
      this.titleFormPending = "Ubah Pesanan";
    },
    deletePendingHandler(id) {
      this.deleteIdPending = id;
      this.dialogConfirmPending = true;
    },
    deleteDataPending() {
      //menghapus data
      this.dialogConfirmPending = false;
      this.load = true;

      var url = this.$api + "/pesanan/" + this.deleteIdPending;
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
          this.readPesananPending();
          this.readNamaCustomerPending();
          this.readNamaMenuPending();
          // this.resetForm();
          this.inputTypePending = "Tambah";
          this.load = false;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    readNamaCustomerPending(){
        var url = this.$api + "/customer-name";
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.namaCustomerOptionsPending = response.data.OUT_DATA;
          if(this.namaCustomerOptionsPending == null){
            this.namaCustomerOptionsPending = [];
          }
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
    },
    readNamaMenuPending(){
        var url = this.$api + "/menu-name";
        this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((response) => {
          this.namaMenuOptionsPending = response.data.OUT_DATA;
          console.log(response.data.OUT_DATA);
          if(this.namaMenuOptionsPending == null){
            this.namaMenuOptionsPending = [];
          }
        })
        .catch((error) => {
          console.log(error.response.data.message)
        });
    },
    getCustomerInfoPending(){
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
          this.customerPending = response.data.OUT_DATA[0];
          this.loadInfoC = false;
          this.cekInfoCustomer = true;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    getMenuInfoPending(){
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
          this.menuPending = response.data.OUT_DATA[0];
          this.imagePath = this.$url + "Gambar_menu/" + this.menuPending.gambar_menu;
          this.loadInfoM = false;
          this.cekInfoMenu = true;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    cancelPending() {
      this.changePagePending();
      this.resetFormPending();
    },
    changePagePending() {
      this.tambahPending = true;
      this.titleFormPending = "";
      this.inputTypePending = "Tambah";
      this.cekInfoCustomer = false;
      this.cekInfoMenu = false;
      this.cekEditPending = false;
      this.resetFormPending();
    },
    resetFormPending() {
      this.$refs.form.reset();
    },
  },
  mounted() {
    this.token = localStorage.getItem('token');
    this.readData();
    this.readNamaCustomer();
    this.readPesananPending();
    this.readNamaCustomerPending();
    this.readNamaMenuPending();
    // this.getTanggalHariIni();
    // this.getAllNomor();
    // this.getNomorKartu();
    // this.formInput.tanggal = this.today;
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

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
{
  transform: translateX(10px);
  opacity: 0;
}
</style>
