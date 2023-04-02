<template>
    <div>
        <div class="logoDiv">
            <img class="lightLogo" src="../../assets/Delivery services.png" alt="" srcset="" width="10%">
            <img class="darkLogo" src="../../assets/Delivery servicesdark.png" alt="" srcset="" width="10%">
            <div class="logoTxt">
                <h4>Xpress Riders</h4>
                <p>Delivery Service</p>
            </div>
        </div>
        <div style="height: 100%;" class="container-fluid">
            <div class="row no-gutters">
                <div class="col-lg-6">
                    <div class="textD">
                        <h1>Xpress Logistics</h1>
                        <p>A virtual center for designers, devs, PMs, and all design parties to perform their duties in
                            unison. At
                            least 200% faster with Mockplus.</p>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="regDiv">
                        <div class="formDiv">
                            <h3>Forgot Password?</h3>
                            <div class="inputs">
                                <div class="mb-3">
                                    <div class="ma-auto position-relative" style="max-width: 300px">
                                        <v-otp-input length="4" v-model="otp" :disabled="loading"></v-otp-input>
                                        <!-- <v-overlay absolute :value="loading">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                        </v-overlay> -->
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <p class="alrdy">Have an Account? <button @click="signIn" class="signIn">Log
                                            in</button></p>
                                </div>
                                <div class="mt-3">
                                    <button @click="login" class="createBtn">Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from "axios"
import Swal from 'sweetalert2'
// import jwt_decode from "jwt-decode";

export default {
    data() {
        return {
            loading: false,
            snackbar: false,
            snackbarColor: 'default',
            userId: '',
            otp: '',
            text: '',
        }
    },
    async mounted() {
        const retrievedData = localStorage.getItem('userEmail');
        const userEmail = JSON.parse(retrievedData)
        console.log(JSON.parse(retrievedData));

        await axios.get(`http://localhost:3000/api/v1/jwtauth/user/user/email/${userEmail}`)
            .then(response => {
                console.log(response.data.user._id);
                this.userId = response.data.user._id
            })
            .catch(error => {
                console.log(error);
            });

    },
    methods: {
        onFinish(rsp) {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.snackbarColor = (rsp === this.expectedOtp) ? 'success' : 'warning'
                this.text = `Processed OTP with "${rsp}" (${this.snackbarColor})`
                this.snackbar = true
            }, 3500)
        },
        signIn() {
            this.$router.push('/signIn')
        },
        async login() {
            if (!this.otp) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Check your Email Address for the OTP',
                    width: 350,
                })
            } else {
                const logindata = {
                    otp: this.otp,
                }
                console.log(this.userId);
                await axios.post(`http://localhost:3000/api/v1/jwtauth/auth/verifyOtp/${this.userId}`, logindata)
                    .then(response => {
                        console.log(response);
                        Swal.fire({
                            icon: 'success',
                            title: 'Proceed',
                            showConfirmButton: false,
                            text: response.data.message,
                            width: 350,
                            timer: 1400
                        })
                        localStorage.setItem('userId', JSON.stringify(this.userId));
                        setTimeout(() => {
                            this.$router.push('/changePassword')
                        }, 1500);
                    })
                    .catch(error => {
                        console.log(error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: error.message,
                            width: 350,
                        })
                    });
            }
        }
    }
}
</script>
  
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
@import url('https://fonts.googleapis.com/css?family=Caveat');

.position-relative {
    position: relative;
}

.container-fluid {
    // background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(../../assets/landImg.jpg);
    // background-position: center;
    // background-repeat: no-repeat;
    // background-size: cover;
    background-color: #4A869F;

}

.lightLogo {
    display: block;
}

.darkLogo {
    display: none;
}

.logoDiv {
    position: fixed;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;

    .logoTxt {
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
        justify-content: center;
        align-items: flex-end;

        h4 {
            margin: 0%;
            color: #fff;
            font-family: 'Poppins';
            font-style: normal;
            font-weight: normal;
            font-size: 25px;
        }

        p {
            margin: 0%;
            color: #fff;
            font-family: 'Caveat';
            font-style: normal;
            font-weight: normal;
            font-size: 20px;
        }
    }

}

.textD {
    padding-left: 5rem;
    margin: 0%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;

    h1 {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 800;
        font-size: 38px;
        // margin-bottom: 2rem;
        color: #FFFFFF;
    }

    p {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        // line-height: 111px;
        color: #FFFFFF;
    }
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
            color: #4A869F;
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

@media(min-width: 320px) and (max-width: 1200px) {
    .container-fluid {
        background-color: #4A869F;

        // background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(../../assets/landImg.jpg);
        // background-position: center;
        // background-repeat: no-repeat;
        // background-size: cover;
        // padding: 0%;
        // margin: 0%;
    }

    .lightLogo {
        display: none;
    }

    .darkLogo {
        display: block;
        width: 20%;
    }

    .logoDiv {
        width: 100%;
        position: fixed;
        padding: 1rem;
        display: flex;
        align-items: center;
        background-color: #fdfdfd;
        margin: 0%;

        .logoTxt {
            display: flex;
            flex-direction: column;
            margin-left: 1rem;
            justify-content: center;
            align-items: flex-end;

            h4 {
                margin: 0%;
                color: #000;
                font-family: 'Poppins';
                font-style: normal;
                font-weight: normal;
                font-size: 25px;
            }

            p {
                margin: 0%;
                color: #000;
                font-family: 'Caveat';
                font-style: normal;
                font-weight: normal;
                font-size: 20px;
            }
        }

    }

    .textD {
        padding-left: 0;
        margin-top: 50%;
        margin-bottom: 10%;
        margin-left: 1rem;
        margin-right: 1rem;
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;

        h1 {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 800;
            font-size: 30px;
            margin-bottom: 1rem;
            color: #FFFFFF;
        }

        p {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            // line-height: 111px;
            color: #FFFFFF;
        }
    }

    .regDiv {
        margin: 0;
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .formDiv {
            // border-radius: 18px;
            background-color: #FFFFFF;
            width: 100%;
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
                color: #4A869F;
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
                    width: 100%;
                    height: 50px;
                    font-family: 'Poppins';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 18px;
                    margin-bottom: 2rem;
                    color: #FFFFFF;
                }
            }
        }
    }
}
</style>