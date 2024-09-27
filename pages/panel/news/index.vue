<script setup lang="ts">
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import type {PaginatedApiResponse} from "~/types";
import moment from "moment";

definePageMeta({
  layout:"panel",
  middleware:"ensure-panel-access"
})
const selTargets=ref({})
const page=ref(1)
const loadingUpdStatus=ref<Boolean>(0)
const swal=useSwal()
const {data:newsResponse,loading:loadingBlogsResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.news.index,{
  method:"post",
  body:{
    status:"inactive"
  },
  headers:{
    Authorization: "Bearer "+pitLib.auth.get()?.token,
  },
  query:{page:page}
})
function confChange(ev) {
  console.log(ev)
}
watch(page.value,p=>{
  refetch()
})
watch(newsResponse,v=>{
  if (newsResponse.value.status){
    selTargets.value=newsResponse.value.data.data.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});
  }
  console.log(selTargets.value)
})
function confUpd(accept:Boolean,v:any){
  if (!accept){
    swal.fire({
      title: "Are you sure?",
      text: "You are rejecting this post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete"
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        $fetch(endpoints.news.update,{
          method:"post",
          body:{
            _id:v?._id,
            status:"rejected"
          },
          headers:pitLib.util.headers(),
        }).then(updr=>{
          if (updr?.status){
            swal.fire({
              title: updr?.message,
              text: "You are accepting this post!",
              icon: "success",
              showCancelButton: false,
              timer:1500
            })
            refetch()
          }
        })
      }
    });
  } else {
    swal.fire({
      title: "Are you sure?",
      text: "You are accepting this post!",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Accept"
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        $fetch(endpoints.news.update,{
          method:"post",
          body:{
            _id:v?._id,
            status:"active"
          },
          headers:{
            Authorization: "Bearer "+pitLib.auth.get()?.token,
          },
        }).then(updr=>{
          if (updr?.status){
            swal.fire({
              title: updr?.message,
              text: "You are accepting this post!",
              icon: "success",
              showCancelButton: false,
              timer:1500
            })
            refetch()
          }
        })
      }
    });
  }
}
</script>

<template>
  <PanelHeader title="News" description="News List" icon="newspaper"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <div class="card _lift h-100" >
          <div class="card-header">
            News
          </div>
          <div class="card-body d-flex justify-content-center flex-column">
            <q-markup-table>
              <thead>
              <tr>
                <th class="text-left">Content</th>
                <th class="text-left">Creator</th>
                <th class="text-left" size="1">Posted At</th>
                <th class="text-left">Action</th>
              </tr>
              </thead>
              <tbody v-if="newsResponse?.status">
              <tr v-for="v in newsResponse?.data?.data" :key="n">
                <td class="text-left text-truncate">{{v?.title}}</td>
                <td class="text-left">{{v?.created_by[0]?.name}}</td>
                <td class="text-left" size="1">{{moment(v?.created_at).format("MMM Do YY")}}</td>
                <td class="text-left">
                  <q-btn size="sm" :to="'/panel/news/'+v?._id" class="m-2" round color="info" icon="fa fa-eye"></q-btn>
                  <q-toggle
                      checked-icon="check"
                      color="green"
                      unchecked-icon="clear"
                  />
                  <q-btn size="sm" class="m-2" round color="red" @click="confUpd(false,v)" icon="fa fa-trash"></q-btn>
                </td>
              </tr>
              <ui-table-skeleton v-if="loadingBlogsResponse" :rows="3" :columns="5"></ui-table-skeleton>

              </tbody>
            </q-markup-table>
            <q-pagination
                class="mt-3"
                v-if="newsResponse?.status"
                v-model="page"
                :max="newsResponse?.data?.pages"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
