<template>
    <div class="mr-0 pr-0 container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>Dispatchers</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="450px">
                                <template v-slot:activator="{ on, attrs }">
                                    <button class="ma-2 newR" v-bind="attrs" v-on="on">
                                        New Dispatcher
                                    </button>
                                </template>
                                <v-card>
                                    <v-card-title style="background-color: #21618C; color: #fff; margin-bottom: 1rem">
                                        <span style="font-size: 20px">{{ formTitle }}</span>
                                    </v-card-title>
                                    <!-- <form @submit.prevent="save" enctype="multipart/form-data"> -->
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <v-text-field dense label="First Name" v-model="editedItem.firstname"></v-text-field>
                                               <!-- <input class="inputD" type="text" v-model="editedItem.firstname"
                                                    placeholder="First Name" name="fisrtname"> -->
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <v-text-field dense label="Last Name" v-model="editedItem.lastname"></v-text-field>
                                                <!-- <input class="inputD" type="text" v-model="editedItem.lastname"
                                                    placeholder="Last Name" name="lastname"> -->
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <v-text-field dense label="Email Address" v-model="editedItem.email"></v-text-field>
                                                <!-- <input class="inputD" type="email" v-model="editedItem.email"
                                                    placeholder="Email Address" name="email"> -->
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <v-text-field dense label="Phone Number" v-model="editedItem.phoneNO"></v-text-field>
                                                <!-- <input class="inputD" type="number" v-model="editedItem.phoneNO"
                                                    placeholder="Phone Number" name="phoneno"> -->
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <v-text-field dense label="Driver's Liscence" v-model="editedItem.liscence"></v-text-field>
                                                <!-- <input class="inputD" type="text" v-model="editedItem.liscence"
                                                    placeholder="Driver's Liscence" name="liscence"> -->
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <!-- <b-form-file accept="photo*" v-model="editedItem.image"
                                                            placeholder="Upload Image"
                                                            drop-placeholder="Drop file here..."></b-form-file> -->
                                                <input type="file" ref="img" @change="uploadFile">
                                            </div>
                                        </div>
                                    </div>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <button class="cancl" @click="close">
                                            Cancel
                                        </button>
                                        <button class="newR2" @click="save">
                                            Save
                                        </button>
                                    </v-card-actions>
                                    <!-- </form> -->
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
                            Not verified
                        </span>
                        <span v-else small style="color: green">
                            Verified
                        </span>
                    </template>
                    <template v-slot:[`item.image`]="{ item }">
                        <v-avatar>
                            <img :src=item.image :alt="desserts.firstname">
                        </v-avatar>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: 'Image', value: 'image' },
            {
                text: 'First Name',
                align: 'start',
                sortable: false,
                value: 'firstname',
            },
            { text: 'Last Name', value: 'lastname' },
            { text: 'Email Address', value: 'email' },
            { text: 'Liscence', value: 'liscence' },
            { text: 'Created At', value: 'createdAt' },
            { text: 'Created By', value: 'createdBy' },
            { text: 'Phone Number', value: 'phoneNO' },
            { text: 'Verified', value: 'status' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            riderId: '',
            image: '',
            firstname: '',
            lastname: '',
            email: '',
            phoneNO: '',
            liscence: '',
            createdAt: '',
            createdBy: '',
            status: '',
        },
        defaultItem: {
            riderId: '',
            image: '',
            firstname: '',
            lastname: '',
            email: '',
            phoneNO: '',
            liscence: '',
            createdAt: '',
            createdBy: '',
            status: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Dispatcher' : 'Edit Dispatcher'
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

    async mounted() {
        const retrievedData = localStorage.getItem('token');
        console.log(JSON.parse(retrievedData));
        const token = JSON.parse(retrievedData);

        await axios.all([
            axios.get('http://localhost:3000/api/v1/jwtauth/riders/rider', {
                headers: {
                    'token': `Bearer ${token}`
                }
            }),
            // axios.get('http://localhost:3000/api/v1/jwtauth/user/users', {
            //     headers: {
            //         'token': `Bearer ${token}`
            //     }
            // }),
            // axios.get('http://localhost:3000/api/v1/jwtauth/riders/rider', {
            //     headers: {
            //         'token': `Bearer ${token}`
            //     }
            // }),
        ])
            .then(axios.spread((response1) => {
                this.request = response1.data.data.nbHits
                console.log(response1.data.data);
                response1.data.data.riders.forEach(elem => {
                    this.desserts.push({
                        liscence: elem.driversLiscence,
                        createdAt: elem.createdAt.split("T")[0],
                        createdBy: elem.createdBy.name,
                        image: elem.photo,
                        riderId: elem._id,
                        firstname: elem.firstName,
                        lastname: elem.lastName,
                        email: elem.email,
                        phoneNO: elem.phoneNumber,
                        status: elem.verified,
                    })
                });
                //response2 is the result of second call
            }))
            .catch(function (error) {
                console.log(error);
            });
        // console.log(this.desserts[0].image);

    },

    methods: {
        uploadFile() {
            this.editedItem.image = this.$refs.img.files[0];
            console.log(this.editedItem.image);
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
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
            const riderId = this.editedItem.riderId
            console.log(this.editedItem.image);


            const formData = new FormData();
            formData.append('photo', this.editedItem.image)
            formData.append('firstName', this.editedItem.firstname)
            formData.append('lastName', this.editedItem.lastname)
            formData.append('driversLiscence', this.editedItem.liscence)
            formData.append('email', this.editedItem.email)
            formData.append('phoneNumber', this.editedItem.phoneNO)

            if (this.editedIndex > -1) {
                await axios.patch(`http://localhost:3000/api/v1/jwtauth/riders/rider/${riderId}`, formData,
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

            } else {
                await axios.post(`http://localhost:3000/api/v1/jwtauth/riders/rider`, formData,
                    {
                        headers: {
                            'token': `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        const item = response.data.rider;
                        console.log(response.data.rider);
                        this.editedItem = {
                            liscence: item.driversLiscence,
                            createdAt: item.createdAt.split("T")[0],
                            createdBy: item.createdBy.name,
                            image: item.photo,
                            riderId: item._id,
                            firstname: item.firstName,
                            lastname: item.lastName,
                            email: item.email,
                            phoneNO: item.phoneNumber,
                            status: item.verified,
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

.container-fluid {
    // position: absolute;
    // top: 10%;
    padding: 5rem;
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
    line-height: 20px;
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

.inputD {
    width: 100%;
    height: 46px;
    padding: 0 1rem;
    background: #FFFFFF;
    border-bottom: 0.5px solid #B0AFAF;
    border-radius: 4px;

    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height */


    color: #21618C;
}
</style>