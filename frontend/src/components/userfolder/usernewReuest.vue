<template>
    <div class="mr-0 pr-4 container-fluid">
        <div class="row">
            <div class="mt-10 col-lg-12">
                <div class="tabTitle">
                    <h4 class="ml-4 mb-2">My Request</h4>
                    <v-data-table :headers="headers" :items="desserts" :search="search" sort-by="calories"
                        :items-per-page="5" class="">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-spacer></v-spacer>
                                <v-text-field v-model="search" dense append-icon="mdi-magnify" label="Search Table" solo-inverted></v-text-field>

                                <!-- <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details></v-text-field> -->
                                <v-dialog v-model="dialog" persistent max-width="500px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <button class="ml-8 newR" v-bind="attrs" v-on="on">
                                            New Request
                                        </button>
                                    </template>
                                    <v-card>
                                        <v-card-title
                                            style="background-color: #21618C; color: #fff; margin-bottom: 2rem">
                                            <span style="font-size: 20px">{{ formTitle }}</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" sm="12" md="12">
                                                        <v-text-field v-model="editedItem.delivery"
                                                            label="Delivery Location">
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="12" md="12">
                                                        <v-text-field v-model="editedItem.client" label="Your Location">
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="12" md="12">
                                                        <v-text-field v-model="editedItem.item" label="Items">
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row v-if="edititemBtn === true">
                                                    <v-col cols="12" sm="12" md="12">
                                                        <v-switch v-model="editedItem.status" label="Mark Completed">
                                                        </v-switch>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <button class="cancl" @click="close">
                                                Cancel
                                            </button>
                                            <button class="newR2" @click="save">
                                                Save
                                            </button>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title class="text-h5">Are you sure you want to delete this item?
                                        </v-card-title>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small @click="deleteItem(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                        <template v-slot:[`item.status`]="{ item }">
                            <span v-if="item.status === false" small style="color: red" class="mr-2">
                                Pending
                            </span>
                            <span v-else small style="color: green">
                                Completed
                            </span>
                        </template>
                        <!-- <template v-slot:no-data>
                        <v-btn color="primary" @click="initialize">
                            Reset
                        </v-btn>
                    </template> -->
                    </v-data-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import io from "socket.io-client";
import axios from "axios";

export default {
    data: () => ({
        avata: 150,
        sent: false,
        recieved: false,
        edititemBtn: false,
        search: '',
        request: '',
        users: '',
        riders: '',
        messages: [],
        Items: [],
        ridersDetails: [],
        // messages2: [],
        mesg: "",
        view: {
            topOfPage: true
        },

        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: 'Name',
                align: 'start',
                sortable: false,
                value: 'name',
                class: 'blue-grey lighten-4'
            },
            { text: 'Date', value: 'date', class: 'blue-grey lighten-4' },
            { text: 'Pickup Location', value: 'client', class: 'blue-grey lighten-4' },
            { text: 'Delivery Location', value: 'delivery', class: 'blue-grey lighten-4' },
            // { text: 'Dispatcher', value: 'rider' },
            { text: 'Item', value: 'item', class: 'blue-grey lighten-4' },
            { text: 'Status', value: 'status', class: 'blue-grey lighten-4' },
            { text: 'Actions', value: 'actions', sortable: false, class: 'blue-grey lighten-4' },
        ],
        // desserts: [],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            itemId: '',
            name: '',
            date: '',
            rider: '',
            item: '',
            delivery: '',
            client: '',
            status: '',
        },
        defaultItem: {
            name: '',
            date: '',
            rider: '',
            item: '',
            delivery: '',
            client: '',
            status: '',
        },
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Request' : 'Edit Request'
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
            axios.get('http://localhost:3000/api/v1/jwtauth/request/requests', {
                headers: {
                    'token': `Bearer ${token}`
                }
            }),
            axios.get('http://localhost:3000/api/v1/jwtauth/user/users', {
                headers: {
                    'token': `Bearer ${token}`
                }
            }),
            axios.get('http://localhost:3000/api/v1/jwtauth/riders/rider', {
                headers: {
                    'token': `Bearer ${token}`
                }
            }),
        ])
            .then(axios.spread((response1, response2, response3) => {
                this.request = response1.data.data.nbHits
                this.users = response2.data.data.nbHits
                this.riders = response3.data.data.nbHits
                console.log(response1.data.data);
                response1.data.data.requests.forEach(elem => {
                    this.desserts.push({
                        itemId: elem._id,
                        name: elem.requestedBy.name,
                        date: elem.createdAt.split("T")[0],
                        delivery: elem.dropoff,
                        client: elem.pickup,
                        item: elem.cargo,
                        status: elem.status,
                        riderId: elem.rider._id
                    })
                });
                response3.data.data.riders.forEach(el => {
                    this.ridersDetails.push({
                        riderId: el._id,
                        img: el.photo,
                        firstName: el.firstName,
                        lastName: el.lastName,
                    })
                })
                //response2 is the result of second call
            }))
            .catch(function (error) {
                console.log(error);
            });
        // await axios.get('http://localhost:3000/api/v1/jwtauth/request/admin/requests', {
        // headers: {
        //     'token': `Bearer ${token}`
        // }
        // })
        //     .then((res) => {
        //         console.log(res)
        //         console.log(res.data.data.nbHits);
        //         this.request = res.data.data.nbHits
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     })
    },
    methods: {
        sendMessage() {
            this.sent = true,
                this.addMessage()
            this.mesg = ""
        },

        // addMessage() {
        //     this.sent = true;
        //     const message = {
        //         id: new Date().getTime(),
        //         text: this.mesg
        //     };
        //     this.messages = this.messages.concat(message)
        //     this.socketInstance.emit('message', message)
        //     console.log(this.messages);
        //     if (this.messages.id === this.messages.id) {
        //         document.getElementById("chatId").classList.add('adminChat');
        //     } else {
        //         document.getElementById("chatId").classList.remove('adminChat');
        //         document.getElementById("chatId").classList.add('userChat');
        //     }
        //     console.log(this.socketInstance);
        // },
        handleScroll() {
            if (window.pageYOffset > 0) {
                if (this.view.topOfPage) this.view.topOfPage = false
                // document.getElementById("bar").style.display = "block";
            } else {
                if (!this.view.topOfPage) this.view.topOfPage = true
                // document.getElementById("bar").style.display = "none";
            }
        },

        editItem(item) {
            this.edititemBtn = true
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            console.log(this.editedItem);
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm() {
            const retrievedData = localStorage.getItem('token');
            console.log(JSON.parse(retrievedData));
            const token = JSON.parse(retrievedData);
            const itemId = this.editedItem.itemId
            console.log(itemId);
            await axios.delete(`http://localhost:3000/api/v1/jwtauth/request/request/${itemId}`,
                {
                    headers: {
                        'token': `Bearer ${token}`
                    }
                })
                .then((response) => {
                    console.log(response);
                    this.desserts.splice(this.editedIndex, 1)
                })
                .catch((error) => {
                    console.log(error);
                })
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.edititemBtn = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async save() {
            const retrievedData = localStorage.getItem('token');
            console.log(JSON.parse(retrievedData));
            const token = JSON.parse(retrievedData);
            const itemId = this.editedItem.itemId
            const riderId = this.editedItem.riderId
            console.log(riderId);
            console.log(this.editedIndex);
            if (this.editedIndex > -1) {
                await axios.patch(`http://localhost:3000/api/v1/jwtauth/request/request/${itemId}`,
                    {
                        location: this.editedItem.delivery,
                        distance: this.editedItem.client,
                        cargo: this.editedItem.item,
                        status: this.editedItem.status
                    },
                    {
                        headers: {
                            'token': `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        console.log(response);
                        Object.assign(this.desserts[this.editedIndex], this.editedItem)
                        this.close()
                    })
                    .catch((error) => {
                        console.log(error);
                    })

                await axios.patch(`http://localhost:3000/api/v1/jwtauth/riders/rider/${riderId}`,
                    {
                        occupied: false,
                    },
                    {
                        headers: {
                            'token': `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        console.log(response);
                        Object.assign(this.desserts[this.editedIndex], this.editedItem)
                        this.close()
                    })
                    .catch((error) => {
                        console.log(error);
                    })

                await axios.delete(`http://localhost:3000/api/v1/jwtauth/notification/${itemId}`,
                    {
                        headers: {
                            'token': `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        console.log(response);
                        // Object.assign(this.desserts[this.editedIndex], this.editedItem)
                        // this.close()
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            } else {
                await axios.post(`http://localhost:3000/api/v1/jwtauth/request/create`,
                    {
                        pickup: this.editedItem.client,
                        dropoff: this.editedItem.delivery,
                        cargo: this.editedItem.item,
                    },
                    {
                        headers: {
                            'token': `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        const item = response.data.data.createdRequest;
                        // console.log(response.data.data.createdRequest);
                        this.editedItem = {
                            itemId: item._id,
                            name: item.requestedBy.name,
                            date: item.createdAt.split("T")[0],
                            rider: item.rider,
                            item: item.cargo,
                            delivery: item.dropoff,
                            client: item.pickup,
                            status: item.status,
                        };
                        this.desserts.push(this.editedItem)
                        this.close()
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }

            // if (this.editedIndex > -1) {
            //     Object.assign(this.desserts[this.editedIndex], this.editedItem)
            // } else {
            //     this.desserts.push(this.editedItem)
            // }
            // this.close()
        },
    },
}
</script>
    
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
@import url('https://fonts.googleapis.com/css?family=Caveat');

$color-base: #fff;
$color-text: #222;
$color-accent: desaturate(navy, 80%);

.container-fluid {
    // position: absolute;
    // top: 10%;
    padding: 5rem;
}
.tabTitle {
    width: 100%;
    padding: 20px 0;
    height: auto;
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    h4 {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 16px;
        /* identical to box height */
        display: flex;
        align-items: center;
        text-align: center;
        color: #4F4F4F;
    }
}
.sideBtn {
    padding: 0.5rem 0;
    color: #21618C;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    // border-radius: 3px;
}

.chartD {
    background-color: #fff;
    height: 435px;
}

.mainChat {
    width: 100%;
    position: relative;
    background-color: #fff;
    padding: 0%;

    h5 {
        margin-bottom: 0.8rem;
        color: #21618C;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 800;
        font-size: 20px;
        text-align: left;
    }

    .textAre {
        position: absolute;
        // top: 90%;
        left: 5%;
        bottom: 2%;
        width: 90%;
        background: #FFFFFF;
        border: 0.5px solid #D3D8DD;
        border-radius: 4px;
    }

    .chatD {
        width: 100%;
        height: 300px;
        background-color: #fff;
        overflow-y: scroll;
        margin-bottom: 4rem;


        .adminChat {
            width: 100%;
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            margin: 2rem 0;


            .caretTxt {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                position: relative;

                span {
                    position: absolute;
                    left: 22px;
                    top: 0;
                    color: #e5e5e5;

                }

                .textCnt {
                    margin: 0 2rem;
                    border-radius: 8px;
                    padding: 1rem;
                    width: 100%;
                    // display: block;
                    height: auto;
                    background-color: #e5e5e5;

                    p {
                        color: grey;
                        text-align: left;
                        font-size: 12px;
                        font-family: 'Poppins';
                        font-style: normal;
                        font-weight: normal;
                    }
                }
            }

        }

        .userChat {
            margin: 2rem;
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;

            .caretTxt {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                position: relative;

                span {
                    position: absolute;
                    right: 22px;
                    top: 0;
                    color: #e5e5e5;

                }

                .textCnt {
                    margin: 0 2rem;
                    border-radius: 8px;
                    padding: 1rem;
                    width: 50%;
                    height: auto;
                    background-color: #e5e5e5;

                    p {
                        color: grey;
                        text-align: left;
                        font-size: 12px;
                        font-family: 'Poppins';
                        font-style: normal;
                        font-weight: normal;

                    }
                }
            }
        }
    }

    .chatD::-webkit-scrollbar {
        display: block;
        width: 5px;
        height: 5px
    }

    .chatD::-webkit-scrollbar-track {
        background: transparent;
    }

    .chatD::-webkit-scrollbar-thumb {
        background-color: #21618C;
        border-right: none;
        border-left: none;
    }

    .chatD::-webkit-scrollbar-track-piece:end {
        background: transparent;
        margin-bottom: 10px;
    }

    .chatD::-webkit-scrollbar-track-piece:start {
        background: transparent;
        margin-top: 10px;
    }
}

.reviews {
    background-color: #fff;
    border-radius: 5px;
    padding: 1rem;

    h5 {
        margin: 10px;
        color: #21618C;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 800;
        font-size: 20px;
        text-align: left;
    }

    .contDi {
        overflow-x: scroll;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 335px;

        .riderReview {
            margin: 0 1rem;
            padding: 1rem 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 50%;
            height: auto;
            border-radius: 5px;


            .nameTxt {
                margin-top: 10px;
                text-align: center;

                h4 {
                    color: #21618C;
                    font-family: 'Poppins';
                    font-style: normal;
                    font-weight: normal;
                    font-size: 20px;
                }

                p {
                    color: #21618C;
                    font-family: 'Poppins';
                    font-style: normal;
                    font-weight: normal;
                    font-size: 18px;
                }
            }
        }
    }

}

.contDi::-webkit-scrollbar {
    display: block;
    width: 5px;
    height: 5px
}

.contDi::-webkit-scrollbar-track {
    background: transparent;
}

.contDi::-webkit-scrollbar-thumb {
    background-color: #21618C;
    border-right: none;
    border-left: none;
}

.contDi::-webkit-scrollbar-track-piece:end {
    background: transparent;
    margin-bottom: 10px;
}

.contDi::-webkit-scrollbar-track-piece:start {
    background: transparent;
    margin-top: 10px;
}

.logoDiv {
    position: fixed;
    // padding: 1rem 2rem;
    display: flex;
    align-items: center;
    margin-bottom: 5rem;

    .logoTxt {
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
        justify-content: center;
        align-items: flex-end;

        h4 {
            margin: 0%;
            color: #21618C;
            font-family: 'Poppins';
            font-style: normal;
            font-weight: normal;
            font-size: 20px;
        }

        p {
            margin: 0%;
            color: #21618C;
            font-family: 'Caveat';
            font-style: normal;
            font-weight: normal;
            font-size: 20px;
        }
    }

}

.cnt {
    display: flex;
    justify-content: space-between;

    .textD {
        // border: 1px solid grey;
        // padding-left: 5rem;
        background-color: #fff;
        // border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 5px;
        // margin: 0%;
        width: 50%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        .numbertxt {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: bolder;
            font-size: 45px;
            text-align: left;
            color: #2e4765;
        }

        .numbertxt2 {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 500;
            font-size: 15px;
            text-align: left;
            color: #2e4765;
        }
    }
}

.newR {
    width: auto;
    height: auto;
    padding: 0.5rem;
    background: #21618C;
    // border-radius: 3px;
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    // line-height: 20px;
    text-align: center;

    color: #FFFFFF;
}

.newR2 {
    width: auto;
    height: auto;
    padding: 0.5rem 3rem;
    margin-left: 2rem;
    background: #21618C;
    // border-radius: 3px;
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    text-align: center;

    color: #FFFFFF;
}

.cancl {
    width: auto;
    height: auto;
    padding: 0.5rem 3rem;
    margin-left: 2rem;
    background: grey;
    // border-radius: 3px;
    font-family: 'Proxima Nova';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    text-align: center;
    color: #fff;
}

.regDiv {
    width: 80%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;

    .formDiv {
        // border-radius: 18px;
        background-color: #FFFFFF;
        width: 80%;
        height: auto;
        padding: 2rem;
        margin: 0%;

        h3 {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 600;
            font-size: 25px;
            // line-height: 30px;
            /* identical to box height */
            text-align: center;
            color: #393939;
        }

        .inputs {
            // margin-top: 2rem;

            .label-f {
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 13px;
                /* identical to box height */
                color: #4A869F;
            }

            .textField {
                background-color: #fdfdfd;
                border: 1px solid #dfdbdb;
                border-radius: 5px;
                width: 100%;
                height: 50px;
                padding: 0 1rem;
            }

            .createBtn {
                background-color: #4A869F;
                width: 40%;
                height: 50px;
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 500;
                font-size: 18px;
                margin-bottom: 2rem;
                color: #FFFFFF;
            }

            .signIn {
                color: #4A869F;
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 13px;
                margin-left: 2px;

                &:hover {
                    color: red;
                    font-family: 'Poppins';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 13px;
                }
            }

            .alrdy {
                color: grey;
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 500;
                font-size: 14px;
                line-height: 13px;
            }
        }
    }
}

* {
    padding: 0;
    margin: 0;
}

a,
a:hover {
    color: $color-accent;
    text-decoration: none;
    font-weight: 600;
}

nav {
    position: fixed;
    width: 100%;
    height: 60px;
    background-color: transparent;
    display: flex;
    align-items: center;
    transition: all .2s ease-in-out;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    // height: 50px;
    // box-shadow: 0 0px 9px 4px rgba(#000, .1), 0 -5px 2px 2px rgba(#000, .1);
    z-index: 1000;
    min-width: 580px;

    &.onScroll {
        box-shadow: 0 0 10px #aaa;
        background-color: #fff;
        // border: 1px solid #21618C;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

        ul li {
            color: #10b761;
        }
    }


    .links {
        // width: 100%;
        float: right;
        margin-right: 30px;
        position: relative;

        li {
            float: left;
            list-style: none;
            position: relative;
            margin: 10px;
            display: inline-block;
            color: #21618C;

            &>a {
                position: relative;
                display: inline-block;
                padding: 0 10px;
                line-height: 30px;
                height: 30px;
                color: #21618C;


                &:hover {
                    color: $color-base;
                    background: $color-accent;
                    border-radius: 2px;
                }

                &[class^="trigger-"] {
                    padding-right: 40px;
                }

                .arrow {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    top: 35%;
                    text-align: center;
                    right: 10px;
                    border-width: 5px 5px 0 5px;
                    border-style: solid;
                    border-color: rgba(#000, .3) transparent;

                    &:after {
                        content: "";
                        border-left: 1px solid rgba(#000, .15);
                        top: -10px;
                        left: -15px;
                        position: absolute;
                        height: 15px;
                    }

                }

            }

            ul {
                position: absolute;
                left: 0;
                //top:40px;
                margin: 0;
                background: $color-base;
                border-radius: 2px;
                box-shadow: 0 0 5px rgba(#000, .15);
                display: none;

                >li {
                    clear: both;
                    list-style: none;
                    display: block;
                    padding: 0 10px;
                    margin: 0;
                    width: 100%;

                    &:hover {

                        background: lighten($color-accent, 40);

                        >a {
                            background: lighten($color-accent, 40);
                            color: $color-base;
                        }
                    }
                }

            }

            &:hover {
                >.drop {
                    display: block;
                    animation: fadeInRight .3s ease;
                    -webkit-animation: fadeInRight .3s ease;
                }
            }

        }
    }

}

@keyframes fadeInRight {
    0% {
        opacity: 0;
        transform: translate3d(100%, 0, 0)
    }

    100% {
        opacity: 1;
        transform: none
    }
}

@media(min-width: 320px) and (max-width: 1200px) {
    .mainChat {
        margin-top: 2rem;
        width: 100%;
        position: relative;
        background-color: #fff;
        padding: 0%;

        .textAre {
            position: absolute;
            // top: 90%;
            left: 5%;
            bottom: 2%;
            width: 90%;
        }

        .chatD {
            width: 100%;
            height: 300px;
            background-color: #fff;
            overflow-y: scroll;
            margin-bottom: 4rem;


            .adminChat {
                display: flex;
                align-items: flex-start;
                justify-content: flex-start;

                .textCnt {
                    margin-left: 10px;
                    margin-top: 0;
                    margin-bottom: 0;
                    margin-right: 0;
                    border-radius: 8px;
                    padding: 1rem;
                    width: 100%;
                    height: auto;
                    background-color: #e5e5e5;

                    p {
                        color: grey;
                        text-align: left;

                    }
                }
            }

            .userChat {
                margin: 2rem 10px;
                display: flex;
                align-items: flex-start;
                justify-content: flex-end;

                .textCnt {
                    margin-right: 10px;
                    margin-top: 0;
                    margin-bottom: 0;
                    margin-left: 0;
                    border-radius: 8px;
                    padding: 1rem;
                    width: 100%;
                    height: auto;
                    background-color: #e5e5e5;

                    p {
                        color: grey;
                        text-align: left;

                    }
                }
            }
        }

        .chatD::-webkit-scrollbar {
            display: block;
            width: 5px;
            height: 5px
        }

        .chatD::-webkit-scrollbar-track {
            background: transparent;
        }

        .chatD::-webkit-scrollbar-thumb {
            background-color: #21618C;
            border-right: none;
            border-left: none;
        }

        .chatD::-webkit-scrollbar-track-piece:end {
            background: transparent;
            margin-bottom: 10px;
        }

        .chatD::-webkit-scrollbar-track-piece:start {
            background: transparent;
            margin-top: 10px;
        }
    }

    .container-fluid {
        position: absolute;
        top: 10%;
        padding: 1rem;
    }

    .reviews {
        background-color: #fff;
        border-radius: 5px;
        padding: 1rem;
        // margin-top: 1rem;

        h5 {
            margin: 10px;
            color: #21618C;
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 800;
            font-size: 20px;
            text-align: left;
        }

        .contDi {
            overflow-x: scroll;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 335px;

            .riderReview {
                margin: 0 1rem;
                padding: 1rem 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                width: 50%;
                height: auto;
                border-radius: 5px;


                .nameTxt {
                    margin-top: 10px;
                    text-align: center;

                    h4 {
                        color: #21618C;
                        font-family: 'Poppins';
                        font-style: normal;
                        font-weight: normal;
                        font-size: 20px;
                    }

                    p {
                        color: #21618C;
                        font-family: 'Poppins';
                        font-style: normal;
                        font-weight: normal;
                        font-size: 18px;
                    }
                }
            }
        }

    }

    .cnt {
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;

        .textD {
            // border: 1px solid grey;
            // padding-left: 5rem;
            margin: 1rem 0;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            // margin: 0%;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;

            .numbertxt {
                font-family: 'Poppins';
                font-style: normal;
                font-weight: bolder;
                font-size: 45px;
                text-align: left;
                color: #2e4765;
            }

            .numbertxt2 {
                font-family: 'Poppins';
                font-style: normal;
                font-weight: 500;
                font-size: 15px;
                text-align: left;
                color: #2e4765;
            }
        }
    }
}
</style>