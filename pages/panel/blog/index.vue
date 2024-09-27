<script setup lang="ts">
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import type {PaginatedApiResponse} from "~/types";
import moment from "moment";

definePageMeta({
  layout:"panel",
  middleware:"ensure-panel-access"
})
const selTargets=ref()
const page=ref(1)
const loadingUpdStatus=ref<Boolean>(0)
const swal=useSwal()
const formData=reactive({
  status:"inactive"
})
const fd=ref({status:"inactive"})
watch(formData,p=>{
  fd.value=p.status?p:{}
  page.value=1
  refetch()
})
const {data:blogsResponse,loading:loadingBlogsResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.blog.index,{
  method:"post",
  body:fd,
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
watch(blogsResponse,v=>{
  if (blogsResponse.value.status){
    selTargets.value=blogsResponse.value.data.data
  }
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
        $fetch(endpoints.blog.update,{
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
        $fetch(endpoints.blog.update,{
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
  <PanelHeader title="Blogs" description="Approve or Reject uploaded blogs by users." icon="blog"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <div class="card _lift h-100" >
          <div class="card-header">
            Blogs
          </div>
          <div class="card-body d-flex justify-content-center flex-column">
            <div class="row mb-2">
              <div class="col-3">
                <label for="exampleFormControlSelect1">Filter by</label>
                <select v-model="formData.status" class="form-control" id="exampleFormControlSelect1">
                  <option selected value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <q-markup-table>
              <thead>
              <tr>
                <th class="text-left">Content</th>
                <th class="text-left">Creator</th>
                <th class="text-left" size="1">Posted At</th>
                <th class="text-left">Action</th>
              </tr>
              </thead>
              <tbody v-if="blogsResponse?.status">
              <tr v-for="v in blogsResponse?.data?.data" :key="n">
                <td class="text-left text-truncate">{{v?.title}}</td>
                <td class="text-left">{{v?.created_by[0]?.name}}</td>
                <td class="text-left" size="1">{{moment(v?.created_at).format("MMM Do YY")}}</td>
                <td class="text-left">
                  <q-btn size="sm" :to="'/panel/approval/blog/'+v?._id" class="m-2" round color="info" icon="fa fa-eye"></q-btn>
                  <q-btn size="sm" class="m-2" round color="green" @click="confUpd(true,v)" icon="fa fa-check"></q-btn>
                  <q-btn size="sm" class="m-2" round color="red" @click="confUpd(false,v)" icon="fa fa-trash"></q-btn>
                </td>
              </tr>
              <ui-table-skeleton v-if="loadingBlogsResponse" :rows="3" :columns="5"></ui-table-skeleton>

              </tbody>
            </q-markup-table>
            <q-pagination
                class="mt-3"
                v-if="blogsResponse?.status"
                v-model="page"
                :max="blogsResponse?.data?.pages"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
