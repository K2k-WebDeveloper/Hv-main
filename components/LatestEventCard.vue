<script setup lang="ts">
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import {pitLib} from "~/helpers/pitLib";
import {endpoints} from "~/helpers/endpoints";
import {env} from "~/helpers/env";
import moment from "moment";
const loadingTarget=ref()
const swal=useSwal()
const {data:eventResp,loading:loadingEventResp,refresh:refetchEventResp}=useFetch<PaginatedApiResponse>(endpoints.event.index,{
  method:"post",
  headers:pitLib.util.headers(),
  server:false,
  query:{
    pagination:3
  },body:{
    status:"active"
  }
})
const arrColors=["bg-success", "bg-warning", "bg-primary"]
function month_(d:any) {
  var date = moment(d);
  return date.format("MMM");
}
function date_(d:any) {
  var date = moment(d);
  return date.format("D");
}
const router=useRouter()
function redirect(e){
  router.push("/event/"+e?.slug)
}
</script>

<template>
  <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
    <div class="card-body d-flex align-items-center  p-4">
      <h4 class="fw-700 mb-0 font-xssss text-grey-900">Event</h4>
      <NuxtLink to="/event" class="fw-600 ms-auto font-xssss text-primary">See all</NuxtLink>
    </div>
    <div v-for="e in eventResp?.data.data" class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden cursor-pointer">
      <div @click="redirect(e)" class="bg-success me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">{{month_(e.start_date)}}</span>{{date_(e.start_date)}}</h4></div>
      <h4 @click="redirect(e)" class="fw-700 text-grey-900 font-xssss mt-2 text-truncate">{{e?.title}} <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">{{e?.title}} by {{e?.created_by?.[0].name}}</span> </h4>
    </div>

  </div>
</template>

<style scoped></style>
