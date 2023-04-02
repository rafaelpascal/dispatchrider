<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <v-card v-for="notification in notifications" :key="notification.id" class="mx-auto my-2 pa-4 elevation-2" max-width="50%" outlined>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="text-overline">
                                Notification
                            </div>
                            <div>
                                <h6>Delivery of :</h6>
                               <h6>{{notification.Items}}</h6>
                            </div>
                            <v-list-item-subtitle>{{notification.pickup}} to {{notification.location}}</v-list-item-subtitle>
                        </v-list-item-content>

                        <!-- <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar> -->
                        <div style="display:flex; justify-content:center; align-items:center; flex-direction: column;">
                            <v-avatar size="100">
                                <img :src=notification.img alt="John">
                            </v-avatar>
                            <h6 class="my-2">{{notification.riderFirstname}} {{notification.riderLastname}}</h6>
                            <p>{{notification.riderPhone}}</p>
                        </div>
                    </v-list-item>

                    <v-card-actions>
                        <v-btn outlined rounded text>
                            Button
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script>
    // import io from "socket.io-client";
    import axios from "axios";
    
    export default {
        data: () => ({
            notifications: []
        }),
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },
    
        watch: {
            dialog(val) {
                val || this.close()
            },
            dialogDelete(val) {
                val || this.closeDelete()
            },
        },
        beforeMount() {
            window.addEventListener('scroll', this.handleScroll)
    
        },
        async mounted() {
            // document.getElementById("bar").style.display = "none";
            // this.socketInstance = io("http://localhost:3000");
    
            // this.socketInstance.on(
            //     "message:recieved", (data) => {
            //         this.messages = this.messages.concat(data)
            //     }
            // )
    
            const retrievedData = localStorage.getItem('token');
            console.log(JSON.parse(retrievedData));
            const token = JSON.parse(retrievedData);
    
            await axios.all([
                axios.get('http://localhost:3000/api/v1/jwtauth/notification/user/get', {
                    headers: {
                        'token': `Bearer ${token}`
                    }
                }),
            ])
                .then(axios.spread((response1) => {
                    this.bell = response1.data.data.nbHits
                    console.log(response1.data.data.notifi);
                    response1.data.data.notifi.forEach(el => {
                        this.notifications.push({
                            img: el.rider.photo,
                            Items: el.request.cargo.toString(),
                            pickup: el.request.pickup,
                            location: el.request.dropoff,
                            riderFirstname:  el.rider.firstName,
                            riderLastname:  el.rider.lastName,
                            riderPhone: el.rider.phoneNumber,
                            riderEmail: el.rider.email,
                        })
                    })
                    //response2 is the result of second call
                }))
                .catch(function (error) {
                    console.log(error);
                });
        },
        methods: {
        },
    }
    </script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
@import url('https://fonts.googleapis.com/css?family=Caveat');

.container-fluid {
    // position: absolute;
    // top: 10%;
    padding: 5rem;
}
</style>