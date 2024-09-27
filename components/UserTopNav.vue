<script setup lang="ts">
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";
import {useSocket} from "~/composables/socket";
import {env} from "~/helpers/env";
definePageMeta({
  layout:"default",
  middleware:"ensure-login",
})
const route=useRoute()
const notificationPage=ref(1)

const {data:notifResp,loading:loadingNotifResp,refresh:refetchNotifResp}=useFetch<PaginatedApiResponse>(endpoints.notification.index,{
  method:"post",
  body:{
    target_user:pitLib.auth.get()?._id
  },
  headers:pitLib.util.headers(),
  server:false,
  query:{page:notificationPage}
})

function delNotif(n) {
  $fetch<ApiResponse>(endpoints.notification.delete,{
    method:"post",
    body:{
      _id:n?._id,
    },
    headers:pitLib.util.headers(),
  }).then(d=>{
    if(d.status){
      refetchNotifResp()
    }
  })
}
const notifStore=useState(env.SOCKET_NOTIFICATION_RECEIVE)

onMounted(()=>{
  const successAud=new Audio("https://res.cloudinary.com/duzyv2zxc/video/upload/v1727061685/cwob3ut5qkyzlbcae4zm.wav")
  watch(notifStore,n=>{
    successAud.play()
    notifResp.value?.data?.data.push(n);
  })
})

</script>

<template>
  <!-- navigation top-->
  <div class="nav-header bg-white shadow-xs border-0">
    <div class="nav-top">
      <NuxtLink to="/">
        <div class="row">
          <div class="col">
            <img src="/tpl1/images/logo.png" class="img-fluid w-50">
          </div>
        </div>
        <!--        <span class="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0">{{env.APP.NAME}} </span>-->
      </NuxtLink>
      <a href="#" class="mob-menu ms-auto me-2 chat-active-btn"><i class="fea3ther-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
      <a href="" class="mob-menu me-2"><i class="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
      <a href="#" class="me-2 menu-search-icon mob-menu"><i class="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
      <button class="nav-menu me-0 ms-2"></button>
    </div>

    <form action="#" class="float-left header-search">
      <div class="form-group mb-0 icon-input">
        <i class="feather-search font-sm text-grey-400"></i>
        <input type="text" placeholder="Start typing to search.." class="bg-grey-2 border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w350 theme-dark-bg">
      </div>
    </form>
    <NuxtLink to="/" class="p-2 text-center ms-3 menu-icon center-menu-icon"><img src="/tpl1/images/home.jpg"  class=" font-lg  btn-round-lg theme-dark-bg" :class="{'alert-primary':route.path.includes('veganlog'),'bg-greylight text-grey-500':!route.path.includes('veganlog')}"></img></NuxtLink>
    <NuxtLink to="/group" class="p-2 text-center ms-0 menu-icon center-menu-icon"><img src="/tpl1/images/group.jpg" class=" font-lg  btn-round-lg theme-dark-bg " :class="{'alert-primary':route.path.includes('group'),'bg-greylight text-grey-500':!route.path.includes('group')}"></img></NuxtLink>
    <a href="#" class="p-2 text-center ms-auto menu-icon" id="dropdownMenu3" data-bs-toggle="dropdown" aria-expanded="false"><span v-if="notifResp?.data?.data.length" class="dot-count bg-warning"></span><img src="/tpl1/images/notification.jpg" class=" font-lg btn-round-lg text-current"></img></a>
    <div class="dropdown-menu dropdown-menu-end p-4 rounded-3 border-0 shadow-lg" style="width: 18%;" aria-labelledby="dropdownMenu3">

      <h4 class="fw-700 font-xss mb-4">Notification</h4>
      <client-only >
        <Vue3Lottie v-if="loadingNotifResp"
                    animationLink="/json/loading_2.json"
                    :height="200"
                    :width="200"
        />
      </client-only>
      <div class="notif_scroll w-100" v-if="!loadingNotifResp">
        <div v-for="(n,i) in notifResp?.data.data" class="card bg-transparent-card w-100 border-0 ps-5 mb-4 ">
          <img src="https://cdn-icons-png.flaticon.com/512/9187/9187534.png" alt="user" class="w30 position-absolute left-0">
          <h5 class=" font-xssss text-grey-900 mb-0 mt-0 fw-500  d-block">{{n?.title}} <br/> </h5>
          <h6 class="text-grey-500 fw-500 font-xssss lh-4" v-html="n?.content"></h6>
          <h7 class="text-grey-400 font-xsssss fw-60 float- "> {{pitLib.dt.fromNow(n.created_at)}}</h7>
          
            <div class="col"></div>
           </div>
      </div>

    </div>
    <a href="#" class="p-2 text-center ms-3 menu-icon chat-active-btn"><img class="w40 rounded-circle" src="/images/chat.jpeg"></a>
    <div class="p-2 text-center ms-3 position-relative dropdown-menu-icon menu-icon cursor-pointer d-none">
      <i class="feather-settings animation-spin d-inline-block font-xl text-current"></i>
      <div class="dropdown-menu-settings switchcolor-wrap">
        <h4 class="fw-700 font-sm mb-4">Settings</h4>
        <h6 class="font-xssss text-grey-500 fw-700 mb-3 d-block">Choose Color Theme</h6>
        <ul>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="red" checked=""><i class="ti-check"></i>
              <span class="circle-color bg-red" style="background-color: #ff3b30;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="green"><i class="ti-check"></i>
              <span class="circle-color bg-green" style="background-color: #4cd964;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="blue" checked=""><i class="ti-check"></i>
              <span class="circle-color bg-blue" style="background-color: #132977;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="pink"><i class="ti-check"></i>
              <span class="circle-color bg-pink" style="background-color: #ff2d55;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="yellow"><i class="ti-check"></i>
              <span class="circle-color bg-yellow" style="background-color: #ffcc00;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="orange"><i class="ti-check"></i>
              <span class="circle-color bg-orange" style="background-color: #ff9500;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="gray"><i class="ti-check"></i>
              <span class="circle-color bg-gray" style="background-color: #8e8e93;"></span>
            </label>
          </li>

          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="brown"><i class="ti-check"></i>
              <span class="circle-color bg-brown" style="background-color: #D2691E;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="darkgreen"><i class="ti-check"></i>
              <span class="circle-color bg-darkgreen" style="background-color: #228B22;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="deeppink"><i class="ti-check"></i>
              <span class="circle-color bg-deeppink" style="background-color: #FFC0CB;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="cadetblue"><i class="ti-check"></i>
              <span class="circle-color bg-cadetblue" style="background-color: #5f9ea0;"></span>
            </label>
          </li>
          <li>
            <label class="item-radio item-content">
              <input type="radio" name="color-radio" value="darkorchid"><i class="ti-check"></i>
              <span class="circle-color bg-darkorchid" style="background-color: #9932cc;"></span>
            </label>
          </li>
        </ul>

        <div class="card bg-transparent-card border-0 d-block mt-3">
          <h4 class="d-inline font-xssss mont-font fw-700">Header Background</h4>
          <div class="d-inline float-right mt-1">
            <label class="toggle toggle-menu-color"><input type="checkbox"><span class="toggle-icon"></span></label>
          </div>
        </div>
        <div class="card bg-transparent-card border-0 d-block mt-3">
          <h4 class="d-inline font-xssss mont-font fw-700">Menu Position</h4>
          <div class="d-inline float-right mt-1">
            <label class="toggle toggle-menu"><input type="checkbox"><span class="toggle-icon"></span></label>
          </div>
        </div>
        <div class="card bg-transparent-card border-0 d-block mt-3">
          <h4 class="d-inline font-xssss mont-font fw-700">Dark Mode</h4>
          <div class="d-inline float-right mt-1">
            <label class="toggle toggle-dark"><input type="checkbox"><span class="toggle-icon"></span></label>
          </div>
        </div>

      </div>
    </div>


    <NuxtLink to="/me" class="p-0 ms-3 menu-icon"><img src="/tpl1/images/profile-4.png" alt="user" class="w40 mt--1"></NuxtLink>

  </div>
  <!-- navigation top -->
</template>

<style scoped></style>
