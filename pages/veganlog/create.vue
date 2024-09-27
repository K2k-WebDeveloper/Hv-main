<script setup lang="ts">
import {pitLib} from "~/helpers/pitLib";
import {endpoints} from "~/helpers/endpoints";
import type {ApiResponse} from "~/types";
import UiPanel from "~/components/parts/ui-panel.vue";

const fd=reactive({
  content:'',image:null,video:null
})
let target_image=ref()
let target_video=ref()
let swal=useSwal()
let createResp=ref<ApiResponse>()
let loadingCreateResp=ref<Boolean>(false)
function submit(){
  loadingCreateResp.value=true
  let _fd=new FormData()
  _fd.append("content",fd.content)
  _fd.append("image",fd.image?.[0]??null)
  _fd.append("video",fd.video?.[0]??null)
  $fetch(endpoints.veganlog.create,{
    method:"post",
    body:_fd,
    headers:{Authorization:"Bearer "+pitLib.auth.get()?.token}
  }).then((d:ApiResponse)=>{
    createResp.value=d
    if (createResp.value?.status){
      swal.fire({
        title:d?.message,icon:"success"
      }).then(()=>{
        navigateTo("/")
      })
    }
    loadingCreateResp.value=false
  })
}
function filePicker() {
  document.getElementsByClassName('sel_image')[0].click();
}
function vidPicker() {
  document.getElementsByClassName('sel_video')[0].click();
}

async function setImage() {
  pitLib.media.getBase64(fd.image[0]).then(d=>{
    target_image.value=d
  })
}
async function setVideo() {
  pitLib.media.getBase64(fd.video[0]).then(d=>{
    target_video.value=d
  })
}
watch(fd,()=>{createResp.value=null})


</script>

<template>
  <!-- main content -->
  <div class="main-content right-chat-active">

    <div class="middle-sidebar-bottom">
      <div class="middle-sidebar-left">

        <div class="row ">
          <div class="col-xl-8 col-xxl-9 col-lg-8">

            <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
              <div class="card-body p-0">
                <a href="#" class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"><i class="btn-round-sm font-xs text-primary feather-edit-3 me-2 bg-greylight"></i>Share Your Thoughts</a>
              </div>
              <div class="card-body p-0 mt-3 position-relative">
                <figure class="avatar position-absolute ms-2 mt-1 top-5"><img src="/tpl1/images/user-8.png" alt="image" class="shadow-sm rounded-circle w30"></figure>
                <textarea v-model="fd.content" class="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg" cols="30" rows="10" placeholder="What's on your mind?"></textarea>
              </div>
              <div class="card-body d-flex p-0 mt-0">
                <a @click="vidPicker()" class="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"><i class="font-md text-danger feather-video me-2"></i><span class="d-none-xs">Video</span></a>
                <q-input class="sel_video d-none" @change="setVideo()" v-model="fd.video" accept="video/*" type='file'></q-input>
                <a @click="filePicker()" href="#" class="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"><i class="font-md text-success feather-image me-2"></i><span class="d-none-xs">Photo</span></a>
                <q-input class="sel_image d-none" @change="setImage()" v-model="fd.image" accept="image/*" type='file'></q-input>
<!--                <a href="#" class="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"><i class="font-md text-warning feather-camera me-2"></i><span class="d-none-xs">Feeling/Activity</span></a>-->
<!--                <a @click="submit()" class="ms-auto"><i class="fa-solid fa-check text-grey-900 btn-round-md btn-success font-xss"></i></a>-->
                <a href="#" class="ms-auto" id="dropdownMenu4" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i></a>
                <div class="dropdown-menu dropdown-menu-start p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu4">
                  <div class="card-body p-0 d-flex">
                    <i class="feather-bookmark text-grey-500 me-3 font-lg"></i>
                    <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Save Link <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Add this to your saved items</span></h4>
                  </div>
                  <div class="card-body p-0 d-flex mt-2">
                    <i class="feather-alert-circle text-grey-500 me-3 font-lg"></i>
                    <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Hide Post <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
                  </div>
                  <div class="card-body p-0 d-flex mt-2">
                    <i class="feather-alert-octagon text-grey-500 me-3 font-lg"></i>
                    <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Hide all from Group <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
                  </div>
                  <div class="card-body p-0 d-flex mt-2">
                    <i class="feather-lock text-grey-500 me-3 font-lg"></i>
                    <h4 class="fw-600 mb-0 text-grey-900 font-xssss mt-0 me-4">Unfollow Group <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
                  </div>
                </div>
              </div>
              <div class="card-body p-0 mt-3" >
                <div class="text-right">
                  <q-btn @click="submit" class="" :loading="loadingCreateResp" :disable="loadingCreateResp" color="primary"  label="Post" ></q-btn>

                </div>
              </div>
            </div>

            <ui-panel ref="divResp" :type="createResp?.status===true?'success':'warning'" :content="createResp?.message" @show="createResp=$event" v-if="createResp"></ui-panel>

            <div class="card w-100 text-center shadow-xss rounded-xxl border-0 p-4 mb-3 mt-3" v-if="target_image">
              <div class="col-3 mb-3" >
                <img :src="target_image" class="img-thumbnail"  alt="">
              </div>
            </div>

          </div>
          <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">

          </div>

        </div>
      </div>

    </div>
  </div>
  <!-- main content -->
</template>

<style scoped></style>
