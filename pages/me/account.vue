<script setup lang="ts">
import {env} from "~/helpers/env";
import moment from "moment/moment";
import UiPanel from "~/components/parts/ui-panel.vue";
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";

definePageMeta({
  layout:"default",
  middleware:"ensure-login"
})
const field_logo=ref(null)
const logo_preview=ref(null)
const loadingCreateResp=ref(false)
const updResp=ref<ApiResponse>()
async function handleLogo() {
  logo_preview.value=await pitLib.media.getBase64(field_logo.value?.files[0])
  formData.image=field_logo.value?.files[0]
}

const {data:userResponse,loading:loadingUserResponse,refresh:userRefetch} =useFetch<PaginatedApiResponse>(endpoints.user.list, {
  method: 'POST', // GET/POST
  headers: pitLib.util.headers(),
  body: JSON.stringify({ _id:pitLib.auth.get()?._id??null}) ,
  server:false
})
const formData=reactive({
  _id:pitLib.auth.get()?._id,
  name:'',
  phone:'',
  email:'',
  password:'',
  image:null
})
watch(userResponse,ur=>{
  if (ur.status){
    formData.name=ur.data?.data?.[0].name
    formData.phone=ur.data?.data?.[0].phone
    formData.email=ur.data?.data?.[0].email
  }
})

function submit() {
  loadingCreateResp.value=true
  let fd=new FormData()
  fd.append("_id",formData._id)
  fd.append("name",formData.name)
  fd.append("phone",formData.phone)
  fd.append("email",formData.email)
  fd.append("password",formData.password)
  fd.append("image",formData.image)
  $fetch(endpoints.user.update,{
    method:"post",
    headers:pitLib.util.headers(),
    body:fd
  }).then((d:PaginatedApiResponse)=>{
    loadingCreateResp.value=false
    updResp.value=d
  })
}
</script>

<template>
  <!-- main content -->
  <div class="main-content bg-lightblue theme-dark-bg right-chat-active">

    <div class="middle-sidebar-bottom">
      <div class="middle-sidebar-left">
        <div class="middle-wrap">
          <client-only>
            <Vue3Lottie
                v-if="loadingUserResponse"
                animationLink="/json/loading_2.json"
                :height="200"
                :width="200"
            />
          </client-only>
          <form v-if="!loadingUserResponse" @submit.prevent="submit()">
            <div class="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
              <div class="card-body p-4 w-100 bg-primary border-0 d-flex rounded-3">
                <NuxtLink to="/me" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></NuxtLink>
                <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2">Account Details</h4>
              </div>
              <div class="card-body p-lg-5 p-4 w-100 border-0 ">
                <div class="row justify-content-center">
                  <div class="col-lg-4 text-center">
                    <figure class="avatar ms-auto me-auto mb-0 mt-2 w100"><img :src="userResponse?.data?.data.length?env.BASEPOINT+userResponse.data.data?.[0]?.media?.[0]?.path:env.NO_IMG" alt="image" class="shadow-sm rounded-3 w-100"></figure>
                    <h2 class="fw-700 font-sm text-grey-900 mt-3">{{pitLib.auth.get()?.name}}</h2>
                    <h4 class="text-grey-500 fw-500 mb-3 font-xsss mb-4">{{pitLib.auth.get()?.role?.title.toUpperCase()}}</h4>
                    <!-- <a href="#" class="p-3 alert-primary text-primary font-xsss fw-500 mt-2 rounded-3">Upload New Photo</a> -->
                  </div>
                </div>

                <form action="#">
                  <div class="row">
                    <div class="col-lg-6 mb-3">
                      <div class="form-group">
                        <label class="mont-font fw-600 font-xsss">Name</label>
                        <input v-model="formData.name" type="text" class="form-control">
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-6 mb-3">
                      <div class="form-group">
                        <label class="mont-font fw-600 font-xsss">Email</label>
                        <input v-model="formData.email" type="text" class="form-control">
                      </div>
                    </div>

                    <div class="col-lg-6 mb-3">
                      <div class="form-group">
                        <label class="mont-font fw-600 font-xsss">Phone</label>
                        <input v-model="formData.phone" type="text" class="form-control">
                      </div>
                    </div>
                  </div>


                  <div class="row">

                    <div class="col-lg-12 mb-3">
                      <div class="card mt-3 border-0">
                        <div class="card-body d-flex justify-content-between align-items-end p-0">
                          <div class="form-group mb-0 w-100">
                            <input ref="field_logo" @change="handleLogo()" type="file" name="file" id="file" class="input-file">
                            <label for="file" class="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed">
                              <i v-if="!logo_preview" class="ti-cloud-down large-icon me-3 d-block"></i>
                              <span v-if="!logo_preview" class="js-fileName">Choose Logo or Drop Here</span>
                              <img v-if="logo_preview" :src="logo_preview" class="img-thumbnail">
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg-12 text-right">
                      <a role="button" @click="submit()" class="bg-primary text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block" :class="{'disabled':loadingCreateResp}">
                        <span v-if="!loadingCreateResp">Save</span>
                        <i v-if="loadingCreateResp" class="fas fa-spinner fa-spin"></i>
                      </a>

                    </div>
                    <div class="row">
                      <div class="col">
                        <ui-panel class="mt-3" ref="divResp" :type="updResp?.status===true?'success':'warning'" :content="updResp?.message" @show="updResp=$event" v-if="updResp"></ui-panel>

                      </div>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </form>
          <!-- <div class="card w-100 border-0 p-2"></div> -->
        </div>
      </div>

    </div>
  </div>
  <!-- main content -->
</template>

<style scoped></style>