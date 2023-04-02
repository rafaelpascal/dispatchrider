<template>
    <div class="container-fluid">
        <div class="row no-gutters">
            <header class="header" id="header">
                <div style="display: flex; justify-content:center; align-items: center;">
                    <div @click="close" id="togg" class="header_toggle">
                        <i class="fas fa-bars" id="header-toggle"></i>
                    </div>
                    <!-- <h6 class="namet" style="">Rafael Pascal</h6> -->
                </div>
                <div style="display: flex; justify-content:center; align-items: center;">
                    <span style="color: #0C4D6A; font-size: 15px" class="mx-2">{{email}}</span>
                    <v-avatar>
                        <img :src=avata alt="John">
                    </v-avatar>
                    <button class="mx-2" @click="pushNotification">
                        <span style="font-size: 25px">
                            <i class="fas fa-bell"></i>
                        </span>
                    </button>
                    <!-- <button style="color: #000" class="nav_link">Log Out</button> -->
                </div>
            </header>
            <div class="l-navbar" id="nav-bar">
                <nav class="nav">
                    <div>
                        <!-- <a href="#" style="text-decoration: none;" class="nav_logo">
                            <span style="display: flex; align-item:center;">
                                <img id="lightLogo" src="../../assets/Delivery servicesdark.png" alt="" srcset=""
                                    width="40px">
                                <span class="logoTxt">
                                    <h4>Xpress Riders</h4>
                                    <p>Delivery Service</p>
                                </span>
                            </span>
                        </a> -->

                        <div class="nav_list">
                            <ul style="padding: 0%; margin: 0%" class="list-unstyled components">
                                <li>
                                    <router-link class="nav_link" to="/insideDashboard"> <span style="font-size: 20px">
                                            <i class="fas fa-tachometer-alt"></i>
                                        </span> <span class="nav_name">Dashboard</span>
                                    </router-link>
                                </li>
                                <!-- <li>
                                    <router-link class="nav_link" to="/chat"> <span style="font-size: 20px">
                                            <i class="fas fa-folder-open"></i>
                                        </span> <span class="nav_name">Chat</span>
                                    </router-link>
                                </li> -->
                                <li>
                                    <router-link class="nav_link" to="/adminProfile"> <span style="font-size: 20px">
                                            <i class="fas fa-user"></i>
                                        </span> <span class="nav_name">Profile</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="nav_link" to="/newReuest"> <span style="font-size: 20px">
                                            <i class="fas fa-file"></i>
                                        </span> <span class="nav_name">New Request</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="nav_link" to="/completedRequest">
                                        <span style="font-size: 20px">
                                            <i class="fas fa-th-list"></i>
                                        </span> <span class="nav_name"> Completed Request</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="nav_link" to="/createRider">
                                        <span style="font-size: 20px">
                                            <i class="fas fa-user-plus"></i>
                                        </span> <span class="nav_name">Create Rider</span>
                                    </router-link>
                                </li>
                                <!-- <li>
                                    <router-link class="nav_link" to="/contactUs"> <span style="font-size: 20px">
                                            <i class="fas fa-folder-open"></i>
                                        </span> <span class="nav_name">Contact us</span>
                                    </router-link>
                                </li> -->
                                <!-- <li><a href="#homeSubmenu" style="text-decoration:none; " class="nav_link"><span
                                            style="font-size: 20px">
                                            <i class="fas fa-registered"></i>
                                        </span><span class="nav_name">Register for GS</span>
                                    </a></li> -->
                            </ul>
                        </div>
                    </div> <a style="text-decoration:none" href="#" class="nav_link"><span style="font-size: 20px">
                            <i class="fas fa-sign-out-alt"></i>
                        </span><span class="nav_name">Log
                            Out</span> </a>
                </nav>
            </div>
        </div>
        <div id="bodyPd" class="body-pd height-100 ">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import $ from "jquery"
import jwt_decode from "jwt-decode";


export default {
    data() {
        return {
            bell: '',
            email: '',
            avata: '',
            subMenu: false,
        }
    },

    async mounted() {
        const retrievedData = localStorage.getItem('token');
        console.log(JSON.parse(retrievedData));
        const token = JSON.parse(retrievedData);
        const decoded = jwt_decode(token);
        const userId = decoded.id

        await axios.all([
            axios.get('http://localhost:3000/api/v1/jwtauth/notification/user/get', {
                headers: {
                    'token': `Bearer ${token}`
                }
            }),
            axios.get(`http://localhost:3000/api/v1/jwtauth/user/users/${userId}`, {
                headers: {
                    'token': `Bearer ${token}`
                }
            }),

        ])
            .then(axios.spread((response1, response2) => {
                this.bell = response1.data.data.nbHits
                this.email = response2.data.user.email
                this.avata = response2.data.user.photo
            }))
            .catch(function (error) {
                console.log(error);
            });
        $(document).ready(function () {
            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
            });
        });
    },

    methods: {

        pushNotification() {
            this.$router.push('/notiFication')
        },
        hideShow() {
            this.subMenu = true
        },

        close() {
            // document.getElementById("nav-bar").classList.remove('l-navbar');
            document.getElementById("nav-bar").classList.toggle('l-navbar2');
            // document.getElementById("bodyPd").classList.remove('body-pd');
            document.getElementById("bodyPd").classList.toggle('body-pd2');
            document.getElementById("header").classList.toggle('body-pd3');
            document.getElementById("header-toggle").classList.toggle('bx-x')
            document.getElementById("togg").classList.toggle('header_toggle2')
            document.getElementById("lightLogo").classList.toggle('lightLogo2')
        }

    }
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";

*,
::before,
::after {
    box-sizing: border-box
}

.lightLogo2 {
    display: none
}

body {
    position: relative;
    margin: 3rem 0 0 0;
    padding: 0 1rem;
    font-family: 'Nunito', sans-serif;
    font-size: 1rem;
    transition: .5s
}

a {
    text-decoration: none
}

.fa-bell {
    color: #4A869F
}

.logoTxt {
    display: flex;
    flex-direction: column;
    margin-left: 0.4rem;
    justify-content: center;
    align-items: flex-end;

    h4 {
        margin: 0%;
        color: #fff;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
    }

    p {
        margin: 0%;
        color: #fff;
        font-family: 'Caveat';
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
    }
}

.header {
    width: 100%;
    height: 2rem;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    background-color: #fff;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    z-index: 100;
    transition: .5s
}

.namet {
    color: #fff;
    margin-left: 0.2rem;
}

.header_toggle {
    color: #000;
    font-size: 1.5rem;
    cursor: pointer;
    padding-left: 20%;
    transition: .5s;
}

.header_toggle2 {
    color: #000;
    font-size: 1.5rem;
    cursor: pointer;
    padding-left: 10%;
}

.header_img {
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden
}

.header_img img {
    width: 40px
}

.l-navbar {
    position: fixed;
    top: 0;
    left: -20%;
    width: 224px;
    height: 100vh;
    background-color: #0C4D6A;
    padding: .5rem 1rem 0 0;
    transition: .5s;
    z-index: 100
}

.l-navbar2 {
    position: fixed;
    top: 0;
    left: 0;
    width: 70px;
    height: 100vh;
    background-color: #0C4D6A;
    padding: 1rem 1rem 0 0;
    transition: .5s;
    z-index: 100
}


body {
    font-family: 'Poppins', sans-serif;
    background: #fafafa;
}

p {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1em;
    font-weight: 300;
    line-height: 1.7em;
    color: #999;
}

a,
a:hover,
a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
}

.navbar {
    padding: 15px 10px;
    background: #fff;
    border: none;
    border-radius: 0;
    margin-bottom: 40px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
    box-shadow: none;
    outline: none !important;
    border: none;
}

.line {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #ddd;
    margin: 40px 0;
}

/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */


#sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

#sidebar ul li a {
    color: #fff;
    text-decoration: none;
    padding: 10px;
    font-size: 1.1em;
    display: block;
}

#sidebar ul li a:hover {
    color: #fff;
    background: #4A869F;
}

#sidebar ul li.active>a,
a[aria-expanded="true"] {
    color: #000;
    background: #4A869F;
}

a[data-toggle="collapse"] {
    position: relative;
}

.dropdown-toggle::after {
    display: block;
    position: absolute;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    color: #000;
    background: #4A869F;
}

ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    color: #000;
    background: #4A869F;
}

ul.CTAs {
    padding: 20px;
}

ul.CTAs a {
    text-align: center;
    font-size: 0.9em !important;
    display: block;
    border-radius: 5px;
    margin-bottom: 5px;
}

a.download {
    background: #fff;
    color: #7386D5;
}

a.article,
a.article:hover {
    background: #6d7fcc !important;
    color: #fff !important;
}

/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */

#content {
    width: 100%;
    padding: 20px;
    min-height: 100vh;
    transition: all 0.3s;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

@media (max-width: 768px) {
    #sidebar {
        margin-left: -250px;
    }

    #sidebar.active {
        margin-left: 0;
    }

    #sidebarCollapse span {
        display: none;
    }

    .dropdown-toggle::after {
        display: block;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: #fff;
        background: #4A869F;
    }
}

.nav {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden
}

.nav_logo,
.nav_link {
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: center;
    column-gap: 1rem;
    padding: .5rem 0 .5rem 1.5rem
}

.nav_link2 {
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: center;
    column-gap: 1rem;
    margin-left: 1.5rem;
    padding: .5rem 0 .5rem 1.5rem
}

.nav_logo {
    margin-bottom: 2rem;
    // display: flex;
    // justify-content: center;
    // align-items:center
}

.nav_logo-icon {
    font-size: 1.25rem;
    color: #fff
}

.nav_logo-name {
    color: #fff;
    font-weight: 700
}

.nav_link {
    position: relative;
    color: #fff;
    margin-bottom: .5rem;
    transition: .3s
}

.nav_link:hover {
    color: #000
}

.nav_icon {
    font-size: 1.25rem
}

.show {
    left: 0
}

.active {
    color: #000
}

.active::before {
    content: '';
    position: absolute;
    left: -230px;
    width: 2px;
    height: 32px;
    background-color: #000
}

.height-100 {
    height: 100vh
}

@media (min-width: 768px) {
    body {
        margin: 4rem 0 0 0;
        padding-left: 16rem;
    }

    .header {
        height: 4rem;
        padding: 0 2rem 0 15rem
    }

    .header_img {
        width: 40px;
        height: 40px
    }

    .header_img img {
        width: 45px
    }

    .l-navbar {
        left: 0;
        padding: 1rem 1rem 0 0
    }

    .show {
        width: 380px
    }

    .body-pd {
        padding-left: 144px;
        transition: .5s;
    }

    .body-pd2 {
        padding-left: 5px;
        transition: .5s;
    }

    .body-pd3 {
        padding-left: 80px;
        transition: .5s;
    }
}

@media(min-width: 320px) and (max-width: 800px) {
    body {
        position: relative;
        margin: 3rem 0 0 0;
        padding: 0 1rem;
        font-family: 'Nunito', sans-serif;
        font-size: 1rem;
        transition: .5s
    }

    a {
        text-decoration: none
    }

    .namet {
        color: #fff;
        margin-left: 0.2rem;
    }


    .header_toggle {
        color: #000;
        font-size: 1.5rem;
        cursor: pointer;
        padding-left: 20%;
        transition: .5s;
        margin-left: 12rem;
    }

    .header_toggle2 {
        color: #000;
        font-size: 1.5rem;
        cursor: pointer;
        padding-left: 20%;
        margin-left: 0;
    }

    .header_img {
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden
    }

    .header_img img {
        width: 40px
    }

    .l-navbar {
        position: fixed;
        top: 0;
        left: 0%;
        width: 224px;
        height: 100vh;
        background-color: #4A869F;
        padding: .5rem 1rem 0 0;
        transition: .5s;
        z-index: 100
    }

    .l-navbar2 {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 100vh;
        background-color: #4A869F;
        padding: 1rem 1rem 0 0;
        transition: .5s;
        z-index: 100
    }

    .header {
        width: 100%;
        height: 3rem;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background-color: #fff;
        z-index: 100;
        transition: .5s
    }


    body {
        font-family: 'Poppins', sans-serif;
        background: #fafafa;
    }

    p {
        font-family: 'Poppins', sans-serif;
        font-size: 1.1em;
        font-weight: 300;
        line-height: 1.7em;
        color: #999;
    }

    a,
    a:hover,
    a:focus {
        color: inherit;
        text-decoration: none;
        transition: all 0.3s;
    }

    .navbar {
        padding: 15px 10px;
        background: #fff;
        border: none;
        border-radius: 0;
        margin-bottom: 40px;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    }

    .navbar-btn {
        box-shadow: none;
        outline: none !important;
        border: none;
    }

    .line {
        width: 100%;
        height: 1px;
        border-bottom: 1px dashed #ddd;
        margin: 40px 0;
    }

    /* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */


    #sidebar ul.components {
        padding: 20px 0;
        border-bottom: 1px solid #47748b;
    }

    #sidebar ul p {
        color: #fff;
        padding: 10px;
    }

    #sidebar ul li a {
        color: #fff;
        text-decoration: none;
        padding: 10px;
        font-size: 1.1em;
        display: block;
    }

    #sidebar ul li a:hover {
        color: #fff;
        background: #4A869F;
    }

    #sidebar ul li.active>a,
    a[aria-expanded="true"] {
        color: #000;
        background: #4A869F;
    }

    a[data-toggle="collapse"] {
        position: relative;
    }

    .dropdown-toggle::after {
        display: block;
        position: absolute;
        top: 50%;
        right: 2rem;
        transform: translateY(-50%);
        color: #000;
        background: #4A869F;
    }

    ul ul a {
        font-size: 0.9em !important;
        padding-left: 30px !important;
        color: #000;
        background: #4A869F;
    }

    ul.CTAs {
        padding: 20px;
    }

    ul.CTAs a {
        text-align: center;
        font-size: 0.9em !important;
        display: block;
        border-radius: 5px;
        margin-bottom: 5px;
    }

    a.download {
        background: #fff;
        color: #7386D5;
    }

    a.article,
    a.article:hover {
        background: #6d7fcc !important;
        color: #fff !important;
    }

    /* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */

    #content {
        width: 100%;
        padding: 20px;
        min-height: 100vh;
        transition: all 0.3s;
    }

    /* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

    @media (max-width: 768px) {
        #sidebar {
            margin-left: -250px;
        }

        #sidebar.active {
            margin-left: 0;
        }

        #sidebarCollapse span {
            display: none;
        }

        .dropdown-toggle::after {
            display: block;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            color: #fff;
            background: #4A869F;
        }
    }

    .nav {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden
    }

    .nav_logo,
    .nav_link {
        display: grid;
        grid-template-columns: max-content max-content;
        align-items: center;
        column-gap: 1rem;
        padding: .5rem 0 .5rem 1.5rem
    }

    .nav_link2 {
        display: grid;
        grid-template-columns: max-content max-content;
        align-items: center;
        column-gap: 1rem;
        margin-left: 1.5rem;
        padding: .5rem 0 .5rem 1.5rem
    }

    .nav_logo {
        margin-bottom: 2rem
    }

    .nav_logo-icon {
        font-size: 1.25rem;
        color: #fff
    }

    .nav_logo-name {
        color: #fff;
        font-weight: 700
    }

    .nav_link {
        position: relative;
        color: #fff;
        margin-bottom: .5rem;
        transition: .3s
    }

    .nav_link:hover {
        color: #000
    }

    .nav_icon {
        font-size: 1.25rem
    }

    .show {
        left: 0
    }

    .active {
        color: #000
    }

    .active::before {
        content: '';
        position: absolute;
        left: -230px;
        width: 2px;
        height: 32px;
        background-color: #000
    }

    .height-100 {
        height: 100vh
    }

    @media (min-width: 768px) {
        body {
            margin: 4rem 0 0 0;
            padding-left: 16rem;
        }

        .header {
            height: 4rem;
            padding: 0 2rem 0 15rem
        }

        .header_img {
            width: 40px;
            height: 40px
        }

        .header_img img {
            width: 45px
        }

        .l-navbar {
            left: 0;
            padding: 1rem 1rem 0 0
        }

        .show {
            width: 380px
        }

        .body-pd {
            padding-left: 210px;
            transition: .5s;
        }

        .body-pd2 {
            padding-left: 20px;
            transition: .5s;
        }

        .body-pd3 {
            padding-left: 80px;
            transition: .5s;
        }
    }
}

// @media(min-width: 320px) and (max-width: 1200px) {
//     body {
//         margin: 4rem 0 0 0;
//         padding-left: 16rem;
//     }

//     .namet {
//         // color: #fff;
//         // margin-left: 2rem;
//         // font-size: 10px;
//         display: none;

//     }

//     .namet2 {
//         // color: #fff;
//         // font-size: 10px;
//         display: none;
//     }

//     .header {
//         height: 4rem;
//         padding: 0 2rem 0 15rem
//     }

//     .header_img {
//         width: 40px;
//         height: 40px
//     }

//     .header_img img {
//         width: 45px
//     }

//     .l-navbar {
//         left: 0;
//         padding: 1rem 1rem 0 0
//     }

//     .show {
//         width: 380px
//     }

//     .body-pd {
//         padding-left: 0px;
//         transition: .5s;
//     }

//     .body-pd2 {
//         padding-left: 0px;
//         transition: .5s;
//     }

//     .body-pd3 {
//         padding-left: 240px;
//         transition: .5s;
//     }

//     .dropdown-toggle::after {
//         display: block;
//         position: absolute;
//         top: 50%;
//         right: 2rem;
//         transform: translateY(-50%);
//         color: #000;
//         background: #4A869F;
//     }

//     .header_toggle {
//         color: #fff;
//         font-size: 1.5rem;
//         cursor: pointer;
//         transition: .5s;
//         margin-left: 12rem;
//     }

//     .header_toggle2 {
//         color: #fff;
//         font-size: 1.5rem;
//         cursor: pointer;
//         // padding-left: 20%;
//         transition: .5s;
//     }

//     .l-navbar {
//         position: fixed;
//         top: 0;
//         left: 0%;
//         width: 224px;
//         height: 100vh;
//         background-color: #4A869F;
//         padding: .5rem 1rem 0 0;
//         transition: .5s;
//         z-index: 100
//     }

//     .l-navbar2 {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 224px;
//         height: 100vh;
//         background-color: #4A869F;
//         padding: 1rem 1rem 0 0;
//         transition: .5s;
//         z-index: 100
//     }

//     .header {
//         width: 100%;
//         height: 3rem;
//         position: fixed;
//         top: 0;
//         left: 0;
//         display: flex;
//         align-items: center;
//         justify-content: space-between;
//         padding: 0 1rem;
//         background-color: #4A869F;
//         z-index: 100;
//         transition: .5s
//     }
// }
</style>