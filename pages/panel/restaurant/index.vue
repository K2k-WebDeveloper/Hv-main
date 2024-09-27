<script setup lang="ts">
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import moment from "moment";
import {env} from "~/helpers/env";
import UiPanel from "~/components/parts/ui-panel.vue";

definePageMeta({
  layout:"panel",
  middleware:"ensure-panel-access"
})

const page=ref(1)
const swal=useSwal()
const {data:categsResponse,loading:loadingCategsResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.restaurant.index,{
  method:"post",
  body:{
    // status:"pending"
  },
  headers:{
    Authorization: "Bearer "+pitLib.auth.get()?.token,
  },
  server:false,
  query:{page:page}
})

watch(page,p=>{
  refetch()
})

function confDel(v:any){
  swal.fire({
    title: "Are you sure?",
    text: "You are rejecting this post!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete"
  }).then((result) => {
    if (result.isConfirmed) {
      $fetch<ApiResponse>(endpoints.restaurant.delete,{
        method:"post",
        body:{
          _id:v?._id,
        },
        headers:pitLib.util.headers(),
      }).then(d=>{
        swal.fire({
          title: d?.message,
          icon: d?.status? "success":"warning",
          showCancelButton: false,
          timer:1500
        })
        refetch()
      })
    }
  });
}

</script>

<template>
  <PanelHeader title="Restaurants" description="List of Restaurants" icon="outdent"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <div class="card _lift h-100" >
          <div class="card-header">
            Restaurant List
          </div>
          <div class="card-body d-flex justify-content-center flex-column">

            <q-markup-table>
              <thead>
              <tr>
                <th class="text-left">Title</th>
                <th class="text-left">Creator</th>
                <th class="text-left" size="1">Posted At</th>
                <th class="text-left">Action</th>
              </tr>
              </thead>
              <tbody v-if="categsResponse?.status">
              <tr v-for="v in categsResponse?.data?.data" :key="n">
                <td class="text-left text-truncate">{{v?.title}}</td>
                <td class="text-left">{{v?.created_by[0]?.name}}</td>
                <td class="text-left" size="1">{{moment(v?.created_at).format("MMM Do YY")}}</td>
                <td class="text-left">
                  <q-btn class="m-2" round color="red" @click="confDel(v)" icon="fa fa-trash"></q-btn>
                </td>
              </tr>
              <ui-table-skeleton v-if="loadingCategsResponse" :rows="3" :columns="5"></ui-table-skeleton>

              </tbody>
            </q-markup-table>
            <q-pagination
                class="mt-3"
                v-if="categsResponse?.status"
                v-model="page"
                :max="categsResponse?.data?.pages"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
