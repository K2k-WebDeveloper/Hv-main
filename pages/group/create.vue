<script setup lang="ts">
import {env} from "~/helpers/env";
import moment from "moment/moment";
import UiPanel from "~/components/parts/ui-panel.vue";
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";
import SharerCard from "~/components/parts/SharerCard.vue";

definePageMeta({
  layout:"default",
  middleware:"ensure-login"
})
const formData = reactive({
  title:"",logo:null,description:""
})
const logo_preview=ref()
const friendsPage=ref<number>(1)
const field_logo=ref(null)
const members=ref()
async function handleLogo() {
  logo_preview.value=await pitLib.media.getBase64(field_logo.value?.files[0])
  formData.logo=field_logo.value?.files[0]
}
const createResponse=ref<ApiResponse>()
const loadingCreateResp=ref<Boolean>(false)
const {data:friendsResp,loading:loadingFriendsResp,refresh:refetchFriendsResp}=useFetch<PaginatedApiResponse>(endpoints.friend.index.my,{
  method:"post",
  headers:pitLib.util.headers(),
  server:false,
  query:{pagination:1000}
})
watch(friendsResp,f=>{
  new Tagify(document.querySelector('#friends'),{
    enforceWhitelist: true,
    whitelist: friendsResp.value?.data.data.map(item => ({
      value: item.name,
      key: item._id
    })),
    maxTags: 10,
    dropdown: {
      maxItems: 20,           // <- mixumum allowed rendered suggestions
      classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
      enabled: 0,             // <- show suggestions on focus
      closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
    }
  })
})
watch(members,f=>{
  try {
    members.value=f?JSON.parse(f)?.map((o:any)=>o.key):[]
  } catch (e) {}
})
function submit() {
  loadingCreateResp.value=true
  let fd=new FormData()
  fd.append("title",formData.title)
  fd.append("logo",formData.logo)
  fd.append("description",formData.description)
  $fetch<ApiResponse>(endpoints.group.create,{
    method:"post",
    headers:pitLib.util.headers(),
    body:fd
  }).then((d:ApiResponse)=>{
    createResponse.value=d
  }).then(()=>{
    if(createResponse.value?.status){
      $fetch<ApiResponse>(endpoints.group.member.create,{
        method:"post",
        headers:pitLib.util.headers(),
        body:{
          group_id:createResponse.value.data._id,
          user_id:members.value
        }
      }).then((d:ApiResponse)=>{
        loadingCreateResp.value=false
        createResponse.value=d
      })
    }
  })
}
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
                <h5>Create New Group</h5>
              </div>
              <div class="row mt-3">
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group">
                    <label class="mont-font fw-600 font-xsss">Title</label>
                    <input v-model="formData.title" type="text" class="form-control">
                  </div>
                </div>
                <div class="col">
                  <label class="mont-font fw-600 font-xsss">Description</label>
                  <textarea rows="6" v-model="formData.description" type="text" class="form-control"></textarea>
                </div>
              </div>
              <div class="row">
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
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label class="mont-font fw-600 font-xsss">Friends</label>
                    <input @change="members=$event?.target?.tagifyValue" id="friends" type="text" class="form-control">
                  </div>
                </div>
              </div>
              <ui-panel class="mt-3" ref="divResp" :type="createResponse?.status?'success':'warning'" :content="createResponse?.message" @show="createResponse=$event" v-if="createResponse"></ui-panel>
              <div class="row mt-3">
                <div class="col text-right">
                  <q-btn @click="submit" class="" :loading="loadingCreateResp" :disable="loadingCreateResp" color="primary"  label="Post" ></q-btn>
                </div>
              </div>
            </div>

          </div>
          <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
            <FriendRequestCard></FriendRequestCard>




            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
              <div class="card-body d-flex align-items-center  p-4">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Event</h4>
                <a href="default-event.html" class="fw-600 ms-auto font-xssss text-primary">See all</a>
              </div>
              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-success me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">FEB</span>22</h4></div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Meeting with clients <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-warning me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">APR</span>30</h4></div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Developer Programe <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-primary me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">APR</span>23</h4></div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Aniversary Event <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  <!-- main content -->
</template>

<style>

</style>
