<script setup lang="ts">
import type {ApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import UiPanel from "~/components/parts/ui-panel.vue";
import nuxtStorage from "nuxt-storage/nuxt-storage";
import {env} from "~/helpers/env";
import {pitLib} from "~/helpers/pitLib";
import {getMessaging, getToken} from "@firebase/messaging";
import {initializeApp} from "@firebase/app";

definePageMeta({
  layout:"blank"
})
useHead({
  bodyAttrs: {
    class: ['app-default'].join(" "),
    id:'kt_app_body'
  },
  link: [
    { rel: 'stylesheet', href: '/tpl1/css/themify-icons.css' },
    { rel: 'stylesheet', href: '/tpl1/css/feather.css' },
    { rel: 'stylesheet', href: '/tpl1/css/style.css' },
    { rel: 'stylesheet', href: '/tpl1/css/emoji.css' },
    { rel: 'stylesheet', href: '/tpl1/css/lightbox.css' },
  ],
  script: [
    {src: 'tpl1/js/plugin.js', body: true},
    {src: 'tpl1/js/lightbox.js', body: true},
    {src: 'tpl1/js/scripts.js', body: true},
  ]
});

import { useFirebaseApp } from 'vuefire'
let currentToken
if (process.client){
  const firebaseApp = useFirebaseApp()
  const messaging = getMessaging(firebaseApp)
  currentToken = await getToken(messaging, { vapidKey: env.FCM.vapidKey }).catch(e=>{
    pitLib.swal("Please provide notification permission for better performance","warning","center",2000)
  })
}


const runTime=reactive({
  loading:false,
})
const fd=reactive({
  email:'',password:'',fcm_token:currentToken
})
const divResp=ref()
const loginResponse=ref<ApiResponse|any>()
function login() {
  runTime.loading=true
  $fetch(endpoints.user.login,{
    method:"post",body:fd
  }).then((d)=>{
    loginResponse.value=d
    if (loginResponse.value?.status){
      pitLib.auth.set(loginResponse.value?.data)
      location.href='/'
      // nuxtStorage.sessionStorage.setData(env.KEYWORDS.USER_SESSION_KEY,loginResponse.value?.data,env.SES_LOGIN_EXPIRY_DAYS,'d')
    }else {
      // $fetch(endpoints.fcm.send,{
      //   method:"post",body:{token:currentToken}
      // })
    }
    runTime.loading=false
  })
}

</script>

<template>
  <!--  <div class="preloader"></div>-->

  <div class="main-wrap" >

    <div class="nav-header bg-transparent shadow-none border-0" >
      <div class="nav-top w-30">
        <a href="/login"><img src="/tpl1/images/logo.png" alt="Logo" class="logo-img w-75 m-5" /></a>
        <a href="#" class="mob-menu ms-auto me-2 chat-active-btn"><i class="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
        <a href="#" class="mob-menu me-2"><i class="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
        <a href="#" class="me-2 menu-search-icon mob-menu"><i class="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
        <button class="nav-menu me-0 ms-2"></button>

      </div>


    </div>

    <div class="row" style="background-image: url(/tpl1/images/bg-23.png);">
      <div class="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat" style="background-image: url(/tpl1/images/bg2.png);"></div>
      <div class="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
        <div class="card shadow-none border-0 ms-auto me-auto login-card">
          <div class="card-body rounded-0 text-left">
            <h2 class="fw-700 display1-size display2-md-size mb-3">Login into <br>your account</h2>
            <form @submit.prevent="login()">
              <ui-panel ref="divResp" :type="loginResponse?.status===true?'success':'warning'" :content="loginResponse?.message" @show="loginResponse=$event" v-if="loginResponse"></ui-panel>
              <div class="form-group icon-input mb-3">
                <i class="font-sm ti-email text-grey-500 pe-0"></i>
                <input v-model="fd.email" type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address">
              </div>
              <div class="form-group icon-input mb-1">
                <input v-model="fd.password" type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password">
                <i class="font-sm ti-lock text-grey-500 pe-0"></i>
              </div>
              <div class="form-check text-left mb-3">
                <input type="checkbox" class="form-check-input mt-2" id="exampleCheck5">
                <label class="form-check-label font-xsss text-grey-500" for="exampleCheck5">Remember me</label>
                <a href="forgot.html" class="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</a>
              </div>
            </form>

            <div class="col-sm-12 p-0 text-left">
              <div class="form-group mb-1">
                <button @click="login()" type="submit" :disabled="runTime.loading"  class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                  <span v-if="runTime.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span v-if="!runTime.loading">Login</span>
                </button>
              </div>
              <h6 class="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Dont have account <NuxtLink to="/signup" class="fw-700 ms-1">Register</NuxtLink></h6>
            </div>
<!--            <div class="col-sm-12 p-0 text-center mt-2">-->

<!--              <h6 class="mb-0 d-inline-block bg-white fw-500 font-xsss text-grey-500 mb-3">Or, Sign in with your social account </h6>-->
<!--              <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-facebook border-0 p-0 mb-2"><img src="/tpl1/images/icon-1.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Google</a></div>-->
<!--              <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-twiiter border-0 p-0 "><img src="/tpl1/images/icon-3.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Facebook</a></div>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Login -->
  <div class="modal bottom fade" style="overflow-y: scroll;" id="Modallogin" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="ti-close text-grey-500"></i></button>
        <div class="modal-body p-3 d-flex align-items-center bg-none">
          <div class="card shadow-none rounded-0 w-100 p-2 pt-3 border-0">
            <div class="card-body rounded-0 text-left p-3">
              <h2 class="fw-700 display1-size display2-md-size mb-4">Login into <br>your account</h2>
              <form>

                <div class="form-group icon-input mb-3">
                  <i class="font-sm ti-email text-grey-500 pe-0"></i>
                  <input type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address">
                </div>
                <div class="form-group icon-input mb-1">
                  <input type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password">
                  <i class="font-sm ti-lock text-grey-500 pe-0"></i>
                </div>
                <div class="form-check text-left mb-3">
                  <input type="checkbox" class="form-check-input mt-2" id="exampleCheck2">
                  <label class="form-check-label font-xsss text-grey-500" for="exampleCheck2">Remember me</label>
                  <a href="forgot.html" class="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</a>
                </div>
              </form>

              <div class="col-sm-12 p-0 text-left">
                <div class="form-group mb-1"><a href="#" class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">Login</a></div>
                <h6 class="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Dont have account <NuxtLink to="/signup" class="fw-700 ms-1">Register</NuxtLink></h6>
              </div>
              <div class="col-sm-12 p-0 text-center mt-3 ">

                <h6 class="mb-0 d-inline-block bg-white fw-600 font-xsss text-grey-500 mb-4">Or, Sign in with your social account </h6>
                <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-facebook border-0 p-0 mb-2"><img src="/tpl1/images/icon-1.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Google</a></div>
                <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-twiiter border-0 p-0 "><img src="/tpl1/images/icon-3.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Facebook</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- Modal Register -->
  <div class="modal bottom fade" style="overflow-y: scroll;" id="Modalregister" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="ti-close text-grey-500"></i></button>
        <div class="modal-body p-3 d-flex align-items-center bg-none">
          <div class="card shadow-none rounded-0 w-100 p-2 pt-3 border-0">
            <div class="card-body rounded-0 text-left p-3">
              <h2 class="fw-700 display1-size display2-md-size mb-4">Create <br>your account</h2>
              <form>

                <div class="form-group icon-input mb-3">
                  <i class="font-sm ti-user text-grey-500 pe-0"></i>
                  <input type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Name">
                </div>
                <div class="form-group icon-input mb-3">
                  <i class="font-sm ti-email text-grey-500 pe-0"></i>
                  <input type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address">
                </div>
                <div class="form-group icon-input mb-3">
                  <input type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password">
                  <i class="font-sm ti-lock text-grey-500 pe-0"></i>
                </div>
                <div class="form-group icon-input mb-1">
                  <input type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Confirm Password">
                  <i class="font-sm ti-lock text-grey-500 pe-0"></i>
                </div>
                <div class="form-check text-left mb-3">
                  <input type="checkbox" class="form-check-input mt-2" id="exampleCheck3">
                  <label class="form-check-label font-xsss text-grey-500" for="exampleCheck3">Accept Term and Conditions</label>
                  <!-- <a href="#" class="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</a> -->
                </div>
              </form>

              <div class="col-sm-12 p-0 text-left">
                <div class="form-group mb-1"><a href="#" class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">Register</a></div>
                <h6 class="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Already have account <a href="login.html" class="fw-700 ms-1">Login</a></h6>
              </div>
              <div class="col-sm-12 p-0 text-center mt-3 ">

                <h6 class="mb-0 d-inline-block bg-white fw-600 font-xsss text-grey-500 mb-4">Or, Sign in with your social account </h6>
                <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-facebook border-0 p-0 "><img src="/tpl1/images/icon-1.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Google</a></div>
                <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-twiiter border-0 p-0 "><img src="/tpl1/images/icon-3.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Facebook</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>