<template>
    <v-main>
        <div>
            <h1 class="font-weight-medium mb-5 font-weight-black">
                Laporan Pendapatan
            </h1>
            <v-card style="background-color: #E5EEDA; padding-bottom:20px">
                <v-card-title >
                    <v-form v-model="valid" ref="form">
                        <v-row jusify="center" align="center" v-if="form.waktu !== 'Tahunan'">
                            <v-col cols="12" md="2" sm="12" align="center">
                                <p class="font-weight-bold mb-5">Waktu</p>
                            </v-col>
                            <v-col cols="12" md="6" v-if="form.waktu === 'Harian'">
                                <v-row >
                                    <v-col cols="12" md="4" sm="12">
                                        <v-select
                                            :rules="waktuRules"
                                            :items="waktuOptions"
                                            v-model="form.waktu"
                                            placeholder="pilih waktu"
                                            outlined
                                            required
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-calendar</v-icon>
                                            </template>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-select 
                                            :rules="bulanRules"
                                            :items="bulanOptions"
                                            item-text="nama_bulan"
                                            item-value="id_bulan"
                                            v-model="form.id_bulan"
                                            placeholder="pilih bulan"
                                            outlined
                                            required
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-calendar</v-icon>
                                            </template>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" sm="12">
                                        <v-select
                                            :rules="tahunRules"
                                            :items="tahunOptions"
                                            v-model="form.tahun"
                                            placeholder="pilih tahun"
                                            outlined
                                            required
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-calendar</v-icon>
                                            </template>
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="6" v-else>
                                <v-row >
                                    <v-col cols="12" md="6" sm="12">
                                        <v-select
                                            :rules="waktuRules"
                                            :items="waktuOptions"
                                            v-model="form.waktu"
                                            placeholder="pilih waktu"
                                            outlined
                                            required
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-calendar</v-icon>
                                            </template>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" md="6" sm="12">
                                        <v-select
                                            :rules="tahunRules"
                                            :items="tahunOptions"
                                            v-model="form.tahun"
                                            placeholder="pilih tahun"
                                            outlined
                                            required
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-calendar</v-icon>
                                            </template>
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="2" sm="12" align="center">
                                    <v-btn
                                        class="ma-2 mb-7"
                                        color="secondary" 
                                        @click="generateLaporan" 
                                        style="padding-left: 30px; padding-right: 30px"
                                    >
                                        Generate
                                    </v-btn>
                            </v-col>
                        </v-row>
                        <v-row jusify="center" align="center" v-else>
                            <v-col cols="12" md="2" sm="12" align="center">
                                <p class="font-weight-bold mb-5">Waktu</p>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-row >
                                    <v-col cols="12">
                                        <v-select
                                            :rules="waktuRules"
                                            :items="waktuOptions"
                                            v-model="form.waktu"
                                            placeholder="pilih waktu"
                                            outlined
                                            required
                                        >
                                            <template v-slot:prepend-inner>
                                                <v-icon style="margin-right:15px; margin-left:5px; margin-top:-3px">mdi-calendar</v-icon>
                                            </template>
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" md="2" sm="12" align="center">
                                    <v-btn
                                        class="ma-2 mb-7"
                                        color="secondary" 
                                        @click="generateLaporan" 
                                        style="padding-left: 30px; padding-right: 30px"
                                    >
                                        Generate
                                    </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-title>

                <div style="margin:20px;" v-show="showLaporan">
                    <b-card no-body style="background-color: #E5EEDA; border:2px solid #7A9B57; ">
                        <b-tabs card active-nav-item-class="font-weight-bold text-uppercase text-success ">
                            <b-tab title="Chart" style="background-color:#E5EEDA;">
                                <b-card-text class="mt-5 mb-5">
                                    <v-row justify="center"> 
                                        <v-col cols="12" md="11" sm="12" style="background-color:white;">
                                            <div id="chart">
                                            </div>
                                        </v-col>
                                    </v-row>
                                </b-card-text>
                            </b-tab>
                            <b-tab title="Table" style="background-color: #E5EEDA;">
                                <b-card-text class="mt-5 mb-5">
                                    <div class="d-flex justify-content-center">
                                        <v-card  class="p-3" max-width="1000px" outlined style="border: px solid #dddddd">
                                            <v-card-title>
                                                <v-row justify="center" align="center">
                                                    <v-col cols="12" sm="12" md="4" align="center">
                                                        <img src="../assets/logo.png" alt="Logo Roemah Soto" width="250px" >
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="8" >
                                                        <h4 class="text-center" style="color:#344218">ROEMAH SOTO</h4>
                                                        <h4 class="text-center" style="color:#7A9B57">JALAN S.M. Tjsafioeddin No.25, Singkawang</h4>
                                                        <p class="text-center mb-0" style="color:#7A9B57">Kalimantan Barat 79122</p>
                                                        <p class="text-center mb-0" style="color:#7A9B57">Contact (+62)821-5935-9533</p>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-row>
                                                    <v-divider style="margin-left:0px; margin-right:0px; margin-top:-20px;" dark></v-divider>
                                                </v-row>
                                                <v-row>
                                                    <p class="text-center title">{{titleLaporanTable}}</p>    
                                                </v-row>
                                                <v-row>
                                                    <table>
                                                        <tr>
                                                            <th class="text-center">No.</th>
                                                            <th class="text-center">Tanggal</th>
                                                            <th class="text-center">Makanan</th>
                                                            <th class="text-center">Minuman</th>
                                                            <th class="text-center">Lain</th>
                                                            <th style="text-align:center;">Total Pendapatan</th>
                                                        </tr>
                                                        <tr v-for="(item,index) in data" :key="index">
                                                            <td style="text-align:center;">{{item.nomor}}</td>
                                                            <td  style="text-align:center;">{{item.tanggal}}</td>
                                                            <td v-if="item.jumlah_makanan != 0" style="text-align:center;">Rp. {{formatPrice(item.jumlah_makanan)}}</td>
                                                            <td v-else style="text-align:center;">-</td>
                                                            <td v-if="item.jumlah_minuman != 0" style="text-align:center;">Rp. {{formatPrice(item.jumlah_minuman)}}</td>
                                                            <td v-else style="text-align:center;">-</td>
                                                            <td v-if="item.jumlah_lain != 0" style="text-align:center;">Rp. {{formatPrice(item.jumlah_lain)}}</td>
                                                            <td v-else style="text-align:center;">-</td>
                                                            <td v-if="item.jumlahTotalBaris != 0" style="text-align:center;">Rp. {{formatPrice(item.jumlahTotalBaris)}}</td>
                                                            <td v-else style="text-align:center;">-</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="text-align:center;" class="total" colspan="5">Total Pendapatan Kotor</td>
                                                            <td style="text-align:center;" class="total">Rp. {{formatPrice(kotor)}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="text-align:center;" class="total" colspan="5">Pengeluaran Diskon</td>
                                                            <td style="text-align:center;" class="total">Rp. {{formatPrice(diskon)}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="text-align:center;" class="total" colspan="5">Total Pendapatan Bersih</td>
                                                            <td style="text-align:center;" class="total">Rp. {{formatPrice(total)}}</td>
                                                        </tr>
                                                    </table>
                                                </v-row>

                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </b-card-text>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </div>
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
    </v-main>
</template>
<script>
// import VueApexCharts from 'vue-apexcharts'
import ApexCharts from 'apexcharts';
export default {
    
    name:"Laporan Pendapatan",
    data(){
        return{
            token:'',
            id_karyawan:'',
            titleLaporanTable:'',

            dataChartHarian:[],
            kategoriHarian:[],

            dataChartBulanan:[],
            kategoriBulanan:[],

            dataChartTahunan:[],
            kategoriTahunan:[],

            data:[],

            total:0,
            kotor:0,
            diskon:0,


            menuOptions:[],
            waktuOptions:['Harian','Bulanan','Tahunan'],
            tahunOptions:[],
            bulanOptions:[
                            {id_bulan:1,nama_bulan:'Januari'},
                            {id_bulan:2,nama_bulan:'Februari'},
                            {id_bulan:3,nama_bulan:'Maret'},
                            {id_bulan:4,nama_bulan:'April'},
                            {id_bulan:5,nama_bulan:'Mei'},
                            {id_bulan:6,nama_bulan:'Juni'},
                            {id_bulan:7,nama_bulan:'Juli'},
                            {id_bulan:8,nama_bulan:'Agustus'},
                            {id_bulan:9,nama_bulan:'September'},
                            {id_bulan:10,nama_bulan:'Oktober'},
                            {id_bulan:11,nama_bulan:'November'},
                            {id_bulan:12,nama_bulan:'Desember'},
                        ],
            waktuRules: [(v) => !!v || "Waktu tidak boleh kosong"],
            bulanRules: [(v) => !!v || "Bulan tidak boleh kosong"],
            tahunRules: [(v) => !!v || "Tahun tidak boleh kosong"],

            form:{
                waktu:null,
                bulan:null,
                nama_bulan:null,
                tahun:null,
            },
            valid:false,

            load:false,
            showLaporan:false,
        }
    },
    methods:{
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        getTahunOption(){
            var date = new Date().getFullYear();
            for(let i = 2020; i<=date;i++){
                this.tahunOptions.push(i);
            }
        },
        getDataHarian(){
            var tambahan;
            this.load = true;
            console.log(this.form.id_bulan)
            var url = this.$api + "/laporan-harian-pendapatan/"+this.form.id_bulan+"/"+this.form.tahun;
            this.$http
            .get(url, {
                headers: {
                    Authorization: "Bearer " + this.token,
                },
            })
            .then((response) => {
                console.log(response.data.OUT_DATA)
                this.dataChartHarian = response.data.OUT_JUMLAH;
                this.kategoriHarian = response.data.OUT_TANGGAL;
                this.data = response.data.OUT_DATA;

                var nama_bulan;

                nama_bulan = response.data.MONTH_NAME

                this.titleLaporanTable = "Laporan Pendapatan Roemah Soto Bulan " + nama_bulan + " " + this.form.tahun;
                this.total = response.data.TOTAL;
                this.kotor = response.data.JUMLAH_KOTOR;
                this.diskon = response.data.DISKON;

                this.showLaporan = true;
                tambahan="Bulan "+ nama_bulan +" "+this.form.tahun;
                
                this.createChart(this.dataChartHarian, this.kategoriHarian, tambahan);
                this.load = false;
            })
            .catch((error) => {
                console.log(error.response.data.message)
                this.load = false;
            }); 
        },
        getDataBulanan(){
            var tambahan;
            this.load = true;

            var url = this.$api + "/laporan-bulanan-pendapatan/"+this.form.tahun;
            this.$http
            .get(url, {
                headers: {
                    Authorization: "Bearer " + this.token,
                },
            })
            .then((response) => {
                this.dataChartBulanan = response.data.OUT_DATA;
                this.kategoriBulanan = response.data.OUT_TANGGAL;
                this.data = response.data.OUT_TABLE;
                
                this.titleLaporanTable = "Laporan Pendapatan Roemah Soto Bulanan Tahun " + this.form.tahun;
                this.total = response.data.TOTAL;
                this.kotor = response.data.JUMLAH_KOTOR;
                this.diskon = response.data.DISKON;
                this.showLaporan = true;
                tambahan="Bulanan Tahun " + this.form.tahun;
                
                this.createChart(this.dataChartBulanan, this.kategoriBulanan, tambahan);
                this.load = false;
            })
            .catch((error) => {
                console.log(error.response.data.message)
            });    
        },
        getDataTahunan(){
            var tambahan;
            this.load = true;

            var url = this.$api + "/laporan-tahunan-pendapatan";
            this.$http
            .get(url, {
                headers: {
                    Authorization: "Bearer " + this.token,
                },
            })
            .then((response) => {
                this.dataChartTahunan = response.data.OUT_DATA;
                this.kategoriTahunan = response.data.OUT_TANGGAL;
                this.data = response.data.OUT_TABLE;

                this.titleLaporanTable = "Laporan Pendapatan Roemah Soto Tahunan";
                this.showLaporan = true;
                tambahan="Tahunan";
                this.total = response.data.TOTAL;
                this.kotor = response.data.JUMLAH_KOTOR;
                this.diskon = response.data.DISKON;
                
                this.createChart(this.dataChartTahunan, this.kategoriTahunan, tambahan);
                this.load = false;
            })
            .catch((error) => {
                console.log(error.response.data.message)
                this.load=false;
            });    
        },
        generateLaporan(){
            console.log(this.form);
            if(this.$refs.form.validate()){
                if(this.form.waktu === 'Bulanan'){
                    this.getDataBulanan();
                }else if(this.form.waktu === 'Tahunan'){
                    this.getDataTahunan();
                }else if(this.form.waktu === 'Harian'){
                    this.getDataHarian();
                }
            }
        },
        createChart(dataChart,kategori,tambahanTitle){
            var options = {
                title: {
                    text: "Grafik Pendapatan Roemah Soto " + tambahanTitle,
                    align: 'left',
                    floating: false,
                    style: {
                        fontSize:  '16px',
                        fontWeight:  'bold',
                        fontFamily:  undefined,
                        color:  '#263238'
                    },
                },
                chart: {
                    type: 'line',
                    toolbar:{
                        show: true,
                    }
                },
                series: [
                    {
                        name:"Jumlah Pendapatan (Rp)",
                        data:dataChart
                    },
                ],
                stroke: {
                  curve: 'smooth',
                },
                dataLabels:{
                    enabled:true
                },
                xaxis:{
                    categories:kategori,
                    labels:{
                        show:false,
                    }
                }
            }

            var chart;
            chart = new ApexCharts(document.querySelector("#chart"), options);

            chart.render();
            chart.resetSeries();
            // chart.updateSeries([{
            //     data:this.series[0].data
            // }])
        },
    },
    mounted() {
        this.token = localStorage.getItem('token');
        this.getTahunOption();
        // this.id_karyawan=localStorage.getItem('id_karyawan');
    },    
}
</script>
<style scoped>
td, th{
  border: 1px solid #344218;
  text-align: left;
  padding: 8px;
}

td{
    color:black;
}


.total, .title, th {
    font-weight: bolder;
    color:black
}
</style>
