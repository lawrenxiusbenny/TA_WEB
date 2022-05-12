<template>
    <div class="dashboard">
        <v-navigation-drawer
            class="fullheight" 
            width="250px" 
            v-model="drawer"
            app
            style="background-color: #7A9B57"
        >
            <v-list-item style="background-color:#BDD299">
                <v-list-content class="title">
                    <div class="logo" >
                        <v-list-item-title>
                            <img src="../assets/logo.png" alt="" width="200px">
                        </v-list-item-title>
                    </div>
                </v-list-content>
            </v-list-item>

            <v-list rounded v-if="id_role==1" dense>
                <!-- Data Akun -->
                <v-list-group
                    v-model="selectedItem"
                    :value="true"
                    color="#455E14"
                    prepend-icon="mdi-folder"
                    class="mt-3"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class='' style="color:#455E14; font-weight:bold">Data User</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="item in itemsOwner"
                        :key="item.title"
                        class="text-decoration-none ml-5"
                        link
                        active-class="black--text"
                        router-link
                        :to="item.to"
                    >
                        <v-list-item-icon>
                            <v-icon small color="#455E14">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" style="color:#455E14;" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>

                <!-- Data Master -->
                <v-list-group
                    v-model="selectedItem2"
                    :value="true"
                    color="#455E14"
                    prepend-icon="mdi-folder"
                    class="mt-3"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class='' style="color:#455E14; font-weight:bold">Data Master</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="item in itemsOwner2"
                        :key="item.title"
                        class="text-decoration-none ml-5"
                        link
                        active-class="black--text"
                        router-link
                        :to="item.to"
                    >
                        <v-list-item-icon>
                            <v-icon small color="#455E14">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" style="color:#455E14;" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>

                <!-- Data Kupon Diskon -->
                <v-list-group
                    v-model="selectedItem3"
                    :value="true"
                    color="#455E14"
                    prepend-icon="mdi-folder"
                    class="mt-3"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class='' style="color:#455E14; font-weight:bold">Data Kupon Diskon</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="item in itemsOwner3"
                        :key="item.title"
                        class="text-decoration-none ml-5"
                        link
                        active-class="black--text"
                        router-link
                        :to="item.to"
                    >
                        <v-list-item-icon>
                            <v-icon small color="#455E14">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" style="color:#455E14;" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>

            <v-list rounded v-if="id_role==2" dense>
                <!-- Data User -->
                <v-list-group
                    v-model="selectedItem"
                    :value="true"
                    color="#455E14"
                    prepend-icon="mdi-folder"
                    class="mt-3"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class='' style="color:#455E14; font-weight:bold">Data User</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="item in itemsWaiter"
                        :key="item.title"
                        class="text-decoration-none ml-5"
                        link
                        active-class="black--text"
                        router-link
                        :to="item.to"
                    >
                        <v-list-item-icon>
                            <v-icon small color="#455E14">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" style="color:#455E14;" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>

                <!-- Data Master -->
                <v-list-group
                    v-model="selectedItem2"
                    :value="true"
                    color="#455E14"
                    prepend-icon="mdi-folder"
                    class="mt-3"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class='' style="color:#455E14; font-weight:bold">Data Master</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="item in itemsWaiter2"
                        :key="item.title"
                        class="text-decoration-none ml-5"
                        link
                        active-class="black--text"
                        router-link
                        :to="item.to"
                    >
                        <v-list-item-icon>
                            <v-icon small color="#455E14">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" style="color:#455E14;" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>

            <v-list rounded v-if="id_role==3" dense>
                <!-- Data Master -->
                <v-list-group
                    v-model="selectedItem"
                    :value="true"
                    color="#455E14"
                    prepend-icon="mdi-folder"
                    class="mt-3"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title class='' style="color:#455E14; font-weight:bold">Data Master</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="item in itemsChef"
                        :key="item.title"
                        class="text-decoration-none ml-5"
                        link
                        active-class="black--text"
                        router-link
                        :to="item.to"
                    >
                        <v-list-item-icon>
                            <v-icon small color="#455E14">{{item.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title" style="color:#455E14;" ></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar 
            height="75px"
            absolute 
            app
            elevate-on-scroll
            color="#7A9B57"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <VSpacer/>
            <v-toolbar-title class="ma-2" color="#fff8f7">{{nama_karyawan}}</v-toolbar-title>
            <v-divider vertical></v-divider>
            <v-toolbar-title class="mr-5 ml-2" color="#fff8f7"> {{nama_role}}</v-toolbar-title>
            <v-divider vertical></v-divider>
            <v-toolbar-items>
                <v-btn text router @click="logout"><v-icon>mdi-power</v-icon></v-btn>
            </v-toolbar-items>
        </v-app-bar>

        <div class="fullheight pa-5" style="background-color: #BDD299">
            <router-view></router-view>
        </div>

        <v-dialog v-model="dialog" persistent max-width="400px">
            <v-card style="background-color:#E5EEDA;">
                <v-card-title style="background-color: #7A9B57;">
                    <h4 class="text-h4 font-weight-medium mb-1">Warning !</h4>
                </v-card-title>
                    <v-card-text class="mt-5">Anda yakin ingin keluar dari akun ini?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" @click="cancelLogout" class="mr-3 mb-5">Tidak</v-btn>
                        <v-btn color="grey" @click="logoutConfirm" class="mr-3 mb-5">Ya</v-btn>
                    </v-card-actions>
            </v-card>
        </v-dialog>

        <v-overlay :value="loading">
            <v-progress-circular
                indeterminate
                :size="80" 
                :width="5"
                color="primary">
            </v-progress-circular>
        </v-overlay>
    </div>
</template>
<script>
export default{
    name: "Dashboard",
    data(){
        return{
            dialog: false,
            lockSelection: false,
            loading: false,
            token:'',
            id_role:'',
            nama_role: '',
            nama_karyawan: '',
            drawer: true,
            today:'',
            Karyawan: '',
            selectedItem: false,
            selectedItem2: false,
            selectedItem3: false,
            selectedItem4: false,
            itemsOwner:[
                { title: "Karyawan", to: "/karyawan", icon: "mdi-account"},
                { title: "Customer", to: "/customer", icon: "mdi-account-multiple"},
            ],
            itemsOwner2:[
                { title: "Menu", to: "/menu", icon: "mdi-food"},
                { title: "Daftar Pesanan", to: "/pesanan", icon: "mdi-format-list-bulleted"},   
                { title: "Transaksi", to: "/transaksi", icon: "mdi-cash-multiple"},   
            ],
            itemsOwner3:[
                { title: "Daftar Royalty Point", to: "/royalty-point", icon: "mdi-format-list-bulleted"},
                { title: "Kupon Diskon", to: "/kupon", icon: "mdi-credit-card"},
            ],
            itemsWaiter:[
                { title: "Customer", to: "/customer", icon: "mdi-account-multiple"},
            ],
            itemsWaiter2:[
                { title: "Daftar Pesanan", to: "/pesanan", icon: "mdi-format-list-bulleted"},
                { title: "Transaksi", to: "/transaksi", icon: "mdi-cash-multiple"},   
            ],
            itemsChef:[
                { title: "Daftar Pesanan", to: "/pesanan", icon: "mdi-format-list-bulleted"},
            ],
            // itemsLaporan:[
            //     {title: "Laporan Stok", to:"/laporan-stok",icon:"mdi-file-document"},
            //     {title: "Laporan Pendapatan", to:"/laporan-pendapatan",icon:"mdi-file-import"},
            //     {title: "Laporan Pengeluaran", to:"/laporan-pengeluaran",icon:"mdi-file-export"},
            //     {title: "Laporan Penjualan", to:"/laporan-penjualan",icon:"mdi-file-check"}
            // ],
            // itemsMaster:[
            //     { title: "Karyawan", to: "/karyawan", icon: "mdi-account"},
            //     { title: "Customer", to: "/customer", icon: "mdi-account-multiple"},
            //     { title: "Meja", to: "/meja", icon: "mdi-desk"},
            //     { title: "Reservasi", to: "/reservasi",icon: "mdi-calendar"},
            //     { title: "Menu", to: "/menu",icon: "mdi-food"},
            // ],
            // itemsBahan:[
            //     { title: "Stok Masuk", to: "/stok-masuk", icon: "mdi-package-down"},
            //     { title: "Bahan", to: "/bahan", icon: "mdi-food-fork-drink"},
            //     { title: "Stok Keluar", to: "/stok-keluar", icon: "mdi-package-up"},
            // ],
            // itemsTransaksi:[
            //     { title: "Daftar Pesanan", to: "/pesanan", icon: "mdi-format-list-bulleted"},
            //     { title: "Data Kartu", to: "/data-kartu", icon: "mdi-credit-card-multiple"},
            //     { title: "Transaksi", to: "/transaksi", icon: "mdi-cash-multiple"},
            // ],
            
            // itemsWaiter2:[
            //     { title: "Daftar Pesanan", to: "/pesanan", icon: "mdi-format-list-bulleted"},
            // ],
            // itemsCashier:[
            //     { title: "Meja", to: "/meja", icon: "mdi-desk"},
            //     { title: "Reservasi", to: "/reservasi", icon: "mdi-calendar"},
            // ],
            // itemsCashier2:[
            //     { title: "Transaksi", to: "/transaksi", icon: "mdi-cash-multiple"},
            // ],
        
        };
    },
    methods:{
        readData() {
            var url = this.$api + "/karyawan/"+ localStorage.getItem("id_karyawan");
            this.$http
                .get(url, {
                    headers: {
                        Authorization: "Bearer " + this.token,
                    },
                })
                .then((response) => {
                    this.nama_karyawan = response.data.OUT_DATA.nama_karyawan;
                })

                .catch((error) => {
                    console.log(error.response.data.message);
                });
        },
    
        logout() {
        this.dialog = true;
        },
        logoutConfirm() {
            this.loading = true;
            this.dialog = false;
            
            localStorage.removeItem("token");
            localStorage.removeItem("id_karyawan");
            localStorage.removeItem("id_role");
            //   localStorage.removeItem("nama_karyawan");
            console.log(localStorage.getItem("token"));
            setTimeout(() => this.loading = false, 1000);
            setTimeout(() => this.$router.push("/login"), 1000);
        },
        cancelLogout() {
            this.dialog = false;
        },
    },
    mounted(){
        this.id_role = localStorage.getItem('id_role');
        this.token = localStorage.getItem('token');
        this.readData();
        if(this.id_role == 1){
            this.nama_role = 'Owner';
        }
        if(this.id_role == 2){
            this.nama_role = 'Waiter';
        }
        if(this.id_role == 3){
            this.nama_role = 'Chef';
        }
    }
};
</script>
<style scoped>
.fullheight{
    min-height: 100vh !important;
}
.title{
    height: 220px;
    margin: auto;
}
.logo{
    margin:auto;
}
</style>