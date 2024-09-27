<script setup lang="ts">
import {endpoints} from "~/helpers/endpoints";
import nuxtStorage from "nuxt-storage/nuxt-storage";
import {env} from "~/helpers/env";
import type {ApiResponse} from "~/types";
import UiPanel from "~/components/parts/ui-panel.vue";

const swal=useSwal()
const router=useRouter()
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
const fd=reactive({
  name:'',phone:'',email:'',password:'',password_confirmation:''
})
const runTime=reactive({
  loading:false,
})
const signupResponse=ref<ApiResponse>()
function signup() {
  runTime.loading=true
  $fetch(endpoints.user.create,{
    method:"post",body:fd
  }).then((d)=>{
    signupResponse.value=d
    if (signupResponse.value?.status){
      swal.fire({
        title:"Account created successfully!. Please login",timer:3200,icon:"success",showConfirmButton:false
      }).then(()=>{
        router.push('/login')
      })
    //   nuxtStorage.sessionStorage.setData(env.KEYWORDS.USER_SESSION_KEY,signupResponse.value?.data,env.SES_LOGIN_EXPIRY_DAYS,'d')
    }

    runTime.loading=false
  })
}

</script>

<template>
  <div class="main-wrap">

    <div class="nav-header bg-transparent shadow-none border-0">
      <div class="nav-top w-100">
        <a href="index.html"><i class="feather-zap text-success display1-size me-2 ms-0"></i><span class="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">{{env.APP.NAME}}. </span> </a>
        <a href="#" class="mob-menu ms-auto me-2 chat-active-btn"><i class="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
        <a href="default-video.html" class="mob-menu me-2"><i class="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
        <a href="#" class="me-2 menu-search-icon mob-menu"><i class="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
        <button class="nav-menu me-0 ms-2"></button>

        <a href="#" class="header-btn d-none d-lg-block bg-dark fw-500 text-white font-xsss p-3 ms-auto w100 text-center lh-20 rounded-xl"  data-bs-toggle="modal" data-bs-target="#Modallogin">Login</a>
        <a href="#" class="header-btn d-none d-lg-block bg-current fw-500 text-white font-xsss p-3 ms-2 w100 text-center lh-20 rounded-xl"  data-bs-toggle="modal" data-bs-target="#Modalregister">Register</a>

      </div>


    </div>

    <div class="row">
      <div class="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat" style="background-image: url(/tpl1/images/login-bg_2.jpg);"></div>
      <div class="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
        <div class="card shadow-none border-0 ms-auto me-auto login-card">
          <div class="card-body rounded-0 text-left">
            <h2 class="fw-700 display1-size display2-md-size mb-4">Create <br>your account</h2>
            <form @submit.prevent="signup()">
              <ui-panel ref="divResp" :type="signupResponse?.status===true?'success':'warning'" :content="signupResponse?.message" :show="signupResponse" v-if="signupResponse?.message"></ui-panel>

              <div class="form-group icon-input mb-3">
                <i class="font-sm ti-user text-grey-500 pe-0"></i>
                <input v-model="fd.name" type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Name">
              </div>
              <div class="form-group icon-input mb-3">
                <i class="font-sm ti-email text-grey-500 pe-0"></i>
                <input v-model="fd.email" type="email" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address">
              </div>
              <div class="form-group icon-input mb-3">
                <i class="font-sm ti-mobile text-grey-500 pe-0"></i>
                <input v-model="fd.phone" type="tel" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Phone">
              </div>
              <div class="form-group icon-input mb-3">
                <input v-model="fd.password" type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password">
                <i class="font-sm ti-lock text-grey-500 pe-0"></i>
              </div>
              <div class="form-group icon-input mb-1">
                <input v-model="fd.password_confirmation" type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Confirm Password">
                <i class="font-sm ti-lock text-grey-500 pe-0"></i>
              </div>
              <div class="form-check text-left mb-3">
                <input type="checkbox" class="form-check-input mt-2" id="exampleCheck2">
                <label class="form-check-label font-xsss text-grey-500" for="exampleCheck2">Accept Term and Conditions</label>
                <!-- <a href="#" class="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</a> -->
              </div>
            </form>

            <div class="col-sm-12 p-0 text-left">
              <div class="form-group mb-1">
                <button @click="signup()" class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                  <span v-if="runTime.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span v-if="!runTime.loading">Signup</span>
                </button>
              </div>
              <h6 class="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Already have account <NuxtLink to="/login" class="fw-700 ms-1">Login</NuxtLink></h6>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
