<script setup lang="ts">
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import {pitLib} from "~/helpers/pitLib";
import {endpoints} from "~/helpers/endpoints";
import {env} from "~/helpers/env";
const loadingTarget=ref()
const swal=useSwal()
const {data:friendRequests,loading:loadingFriendRequests,refresh:refetchFriendRequests}=useFetch<PaginatedApiResponse>(endpoints.friend.index.requests,{
  method:"post",
  headers:pitLib.util.headers(),
  server:false,
  query:{
    pagination:5
  }
})

function confirmRequest(u:any) {
  // alert(u._id+"_"+pitLib.auth.get()?._id)
  loadingTarget.value=u._id+'_confirm'
  $fetch<ApiResponse>(endpoints.friend.respond,{
    method:"post",
    body:{
      user_id:u?._id,
      status:"confirmed"
    },
    headers:pitLib.util.headers(),
  }).then(d=>{
    pitLib.swal(d.message,d?.status?"success":"warning","top-right",1500)
    loadingTarget.value=false
  }).then(()=>{
    refetchFriendRequests()
  })
}
function deleteRequest(u) {
  loadingTarget.value=u._id+'_delete'
}
</script>

<template>
  <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
    <div class="card-body d-flex align-items-center p-4">
      <h4 class="fw-700 mb-0 font-xssss text-grey-900">Friend Request</h4>
      <NuxtLink href="/me/friends" class="fw-600 ms-auto font-xssss text-primary">See all</NuxtLink>
    </div>
    <q-linear-progress v-if="loadingFriendRequests" indeterminate color="primary" class="q-mt-sm mt-3 mb-3 " />

    <div v-for="u in friendRequests?.data?.data">
      <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 border-top-xs bor-0">
        <figure class="avatar me-3"><img :src="u?.media.length?env.BASEPOINT+u?.media?.[0].path:env.NO_IMG" alt="image" class="shadow-sm rounded-circle w45"></figure>
        <h4 class="fw-700 text-grey-900 font-xssss mt-1">{{u?.name}} </h4>
      </div>
      <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
        <a :class="{'disabled':loadingTarget==u._id+'_confirm'}" role="button" @click="confirmRequest(u)" class="p-2 lh-20 w100 btn-primary me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">
          <span v-if="loadingTarget!==u._id+'_confirm'">CONFIRM</span>
          <span v-if="loadingTarget==u._id+'_confirm'" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </a>
        <a :class="{'disabled':loadingTarget==u._id+'_delete'}" role="button" @click="deleteRequest(u)" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">
          <span v-if="loadingTarget!==u._id+'_delete'">DELETE</span>
          <span v-if="loadingTarget==u._id+'_delete'" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </a>
      </div>
    </div>
    <div v-if="!friendRequests?.data?.data.length">
      <div class="row">
        <div class="col text-center">
          <img height="60" width="60" class="img-fluid" src="https://cdn-icons-png.flaticon.com/512/10995/10995666.png">
          <br>
          <h6 class="text-muted">No pending friend resquests.</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
