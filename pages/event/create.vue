<script setup lang="ts">
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import UiPanel from "~/components/parts/ui-panel.vue";

definePageMeta({
  layout:"default",
  middleware:"ensure-login",
})
const loadingCreateResp=ref<Boolean>(false)
const createResp=ref<ApiResponse>()
const field_logo=ref(null)
const logo_preview=ref()
const formData=reactive({
  title:"",tags:'',content:'',logo:null,category:'',location:'',start_date:null,end_date:null
})
const {data:categResp,loading:loadingCategResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.event.category.index,{
  method:"post",
  body:{
    status:"active"
  },
  headers:pitLib.util.headers(),
  query:{pagination:500}
})
function submit() {
  loadingCreateResp.value=true
  var tags=formData.tags?JSON.parse(formData.tags).map(o=>o.value):null
  let fd=new FormData()
  fd.append("title",formData.title)
  if (tags){
    tags.forEach((item) => fd.append("tags", item))
  }
  fd.append("content",formData.content)
  fd.append("logo",formData.logo)
  fd.append("category",formData.category)
  fd.append("location",formData.location)
  fd.append("start_date",formData.start_date)
  fd.append("end_date",formData.end_date)
  $fetch<PaginatedApiResponse>(endpoints.event.create,{
    method:"post",
    headers:pitLib.util.headers(),
    body:fd
  }).then((d:PaginatedApiResponse)=>{
    loadingCreateResp.value=false
    createResp.value=d
  })
}
async function handleLogo() {
  logo_preview.value=await pitLib.media.getBase64(field_logo.value?.files[0])
  formData.logo=field_logo.value?.files[0]
}
onMounted(()=>{
  new Tagify(document.querySelector('#tags'))
})
</script>

<template>
  <!-- main content -->
  <div class="main-content right-chat-active">

    <div class="middle-sidebar-bottom">
      <div class="middle-sidebar-left">
        <!-- loader wrapper -->
        <!-- loader wrapper -->
        <div class="row feed-body">
          <div class="col-xl-8 col-xxl-9 col-lg-8">
            <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
              <div class="card-body p-0">
                <h5>Create New Event</h5>
              </div>
              <div class="row mt-3">
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group">
                    <label class="mont-font fw-600 font-xsss">Title</label>
                    <input v-model="formData.title" type="text" class="form-control">
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group" v-if="!loadingCategResponse">
                    <label class="mont-font fw-600 font-xsss">Category</label>
                    <select v-model="formData.category" class="form-control">
                      <option :value="c?._id" v-for="c in categResp?.data?.data">{{c?.title}}</option>
                    </select>
                  </div>
                </div>

                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group" >
                    <div class="form-group" v-if="!loadingCategResponse">
                      <label for="tags" class="mont-font fw-600 font-xsss">Tags</label>
                      <input @change="formData.tags=$event.target?.tagifyValue" id="tags" type="text" class="form-control">
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group" >
                    <div class="form-group" >
                      <label for="location" class="mont-font fw-600 font-xsss">Location</label>
                      <input v-model="formData.location" id="location" type="text" class="form-control">
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group" >
                    <div class="form-group" >
                      <label for="start_date" class="mont-font fw-600 font-xsss">From</label>
                      <input v-model="formData.start_date" id="start_date" type="datetime-local" class="form-control">
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group" >
                    <div class="form-group" >
                      <label for="end_date" class="mont-font fw-600 font-xsss">To</label>
                      <input v-model="formData.end_date" id="end_date" type="datetime-local" class="form-control">
                    </div>
                  </div>
                </div>
                <div class="col-12 mb-2">
                  <div class="form-group" >
                    <div class="form-group" v-if="!loadingCategResponse">
                      <label class="mont-font fw-600 font-xsss">Content</label>
                      <client-only>
                        <editor v-model="formData.content"></editor>
                      </client-only>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
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
              <ui-panel class="mt-3" ref="divResp" :type="createResp?.status?'success':'warning'" :content="createResp?.message" @show="createResp=$event" v-if="createResp"></ui-panel>
              <div class="row mt-3">
                <div class="col text-right">
                  <q-btn @click="submit()" class="" :loading="loadingCreateResp" :disable="loadingCreateResp" color="primary"  label="Post" ></q-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
            <FriendRequestCard></FriendRequestCard>
            <LatestEventCard></LatestEventCard>
          </div>

        </div>
      </div>

    </div>
  </div>
  <!-- main content -->
</template>

<style scoped>

</style>
