import Vue from "vue";
import VueRouter from "vue-router";
import authPage from "../components/auth/authPage";
import signIn from "../components/auth/signIn";
import forgotPassword from "../components/auth/forgotPassword";
import changePassword from "../components/auth/changePassword";
import otpVerification from "../components/auth/otpVerification";
import adminnewSidebar from "../components/dashBoard/adminnewSidebar";
// import dashBoard from "../components/dashBoard/dashBoard";
import insideDashboard from "../components/dashBoard/insideDashboard";
import newReuest from "../components/dashBoard/newReuest";
import completedRequest from "../components/dashBoard/completedRequest";
import chatPage from "../components/dashBoard/chatPage";
// import contactUs from "../components/dashBoard/contactUs";
import createRider from "../components/dashBoard/createRider";
import landingPage from "../components/userfolder/landingPage";
import contactUs from "../components/userfolder/contactUs";
import newSidebar from "../components/userfolder/newSidebar";
import userDashboard from "../components/userfolder/userDashboard";
import usernewReuest from "../components/userfolder/usernewReuest";
import notiFication from "../components/userfolder/notiFication";
import landingPageNav from "../components/userfolder/landingPageNav";
import userProfile from "../components/userfolder/userProfile";
import adminProfile from "../components/dashBoard/adminProfile";

Vue.use(VueRouter);

const routes = [
  {
    path: "/signUp",
    name: "authPage",
    component: authPage,
  },
  {
    path: "/signIn",
    name: "signIn",
    component: signIn,
  },
  {
    path: "/forgotPassword",
    name: "forgotPassword",
    component: forgotPassword,
  },
  {
    path: "/otpVerification",
    name: "otpVerification",
    component: otpVerification,
  },
  {
    path: "/changePassword",
    name: "changePassword",
    component: changePassword,
  },
  {
    path: "/adminnewSidebar",
    name: "adminnewSidebar",
    component: adminnewSidebar,
    children: [
      {
        path: "/insideDashboard",
        name: "insideDashboard",
        component: insideDashboard,
      },
      {
        path: "/newReuest",
        name: "newReuest",
        component: newReuest,
      },
      {
        path: "/chat",
        name: "chatPage",
        component: chatPage,
      },
      // {
      //   path: "/contactUs",
      //   name: "contactUs",
      //   component: contactUs,
      // },
      {
        path: "/createRider",
        name: "createRider",
        component: createRider,
      },
      {
        path: "/completedRequest",
        name: "completedRequest",
        component: completedRequest,
      },
      {
        path: "/adminProfile",
        name: "adminProfile",
        component: adminProfile,
      },
    ],
  },
  {
    path: "/newSidebar",
    name: "newSidebar",
    component: newSidebar,
    children: [
      {
        path: "/userDashboard",
        name: "userDashboard",
        component: userDashboard,
      },
      {
        path: "/usernewReuest",
        name: "usernewReuest",
        component: usernewReuest,
      },
      {
        path: "/notiFication",
        name: "notiFication",
        component: notiFication,
      },
      {
        path: "/userProfile",
        name: "userProfile",
        component: userProfile,
      },
    ],
  },
  {
    path: "/landingPageNav",
    name: "landingPageNav",
    component: landingPageNav,
    children: [
      {
        path: "/landingPage",
        name: "landingPage",
        component: landingPage,
      },
      {
        path: "/contactUs",
        name: "contactUs",
        component: contactUs,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
