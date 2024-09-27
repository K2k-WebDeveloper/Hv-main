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
const targetCateg=ref()
const loadingCreate=ref<true|false>(false)
const createResponse=ref<ApiResponse>()
const formdata=reactive({
  title:''
})
const page=ref(1)
const swal=useSwal()
const {data:categsResponse,loading:loadingCategsResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.restaurant.category.index,{
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
function confChange(ev:any) {
  console.log(ev)
}
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
      $fetch<ApiResponse>(endpoints.restaurant.category.delete,{
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

function submit() {
  loadingCreate.value=true
  $fetch<ApiResponse>(endpoints.restaurant.category.create,{
    method: 'POST', // GET/POST
    headers: pitLib.util.headers(),
    body:formdata
  }).then(d=>{
    createResponse.value=d
    loadingCreate.value=false
    refetch()
  })
}

</script>

<template>
  <PanelHeader title="Restaurant Categories" description="List of Restaurant Categories" icon="outdent"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <div class="card _lift h-100" >
          <div class="card-header">
            Restaurant Categories List
          </div>
          <div class="card-body d-flex justify-content-center flex-column">

            <form @submit.prevent="submit()" class="">
              <ui-panel ref="divResp" :type="createResponse?.status?'success':'warning'" :content="createResponse?.message" @show="createResponse=$event" v-if="createResponse?.message"></ui-panel>
              <h6>Create Restaurant Category</h6>
              <div class="row align-items-center">
                <div class="col-4">
                  <label for="title">Title</label>
                  <input @click="createResponse=null" v-model="formdata.title" id="title" placeholder="Title" type="text" class="form-control">
                </div>
                <div class="col-3">
                  <div class="text-left">
                    <q-btn
                        type="submit"
                        :loading="loadingCreate"
                        :disable="loadingCreate"
                        label="Save"
                        class="q-mt-md"
                        color="primary"></q-btn>
                  </div>
                </div>
              </div>
            </form>
<hr>
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
