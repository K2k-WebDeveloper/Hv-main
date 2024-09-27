<script setup lang="ts">
import moment from "moment/moment";
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import UiPanel from "~/components/parts/ui-panel.vue";

definePageMeta({
  layout:"panel",
  middleware:"ensure-panel-access"
})

const formData=reactive({
  title:"",content:'',logo:'',category:''
})
const loadingCreate=ref(false)
const swal=useSwal()
const createResponse=ref<ApiResponse>()
function submit() {
  let fd=new FormData()
  fd.append("title",formData.title)
  fd.append("content",formData.content)
  fd.append("category",formData.category)
  fd.append("logo",formData.logo)
  $fetch(endpoints.news.create,{
    method: 'POST', // GET/POST
    headers: pitLib.util.headers(),
    body:fd
  }).then(d=>{
    createResponse.value=d
    loadingCreate.value=false
  })
}
watch(formData,()=>{
  createResponse.value=null
})
const {data:categResp,loading:loadingCategResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.news.category.index,{
  method:"post",
  body:{
    status:"active"
  },
  headers:pitLib.util.headers(),
  query:{pagination:500}
})
watch(categResp,c=>{
  if (c?.status){
    new Tagify(document.querySelector('#category'),{
      enforceWhitelist: true,
      mode : "select",
      whitelist: c?.data.data.map(item => ({
        value: item.title,
        key: item._id
      }))
    })
  }

})
</script>

<template>
  <PanelHeader title="News Creation" description="Create and publish new news articles." icon="newspaper"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <form @submit.prevent="submit()">
          <div class="card _lift h-100" >
            <div class="card-header">
              Add News
            </div>
            <div class="card-body d-flex justify-content-center flex-column">
              <ui-panel ref="divResp" :type="createResponse?.status===true?'success':'warning'" :content="createResponse?.message" @show="createResponse=$event" v-if="createResponse?.message"></ui-panel>

              <div class="row mb-2">
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
                  <q-input id="title" filled v-model="formData.title" label="Title" />
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
                  <q-file accept="image/*" max-files="1"  filled v-model="formData.logo" label="Logo File" stack-label></q-file>
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
                  <input @change="formData.category=$event.target?.tagifyValue ? JSON.parse($event.target?.tagifyValue)[0].key:null" placeholder="Category" class="form-control-lg w-100" id="category" >
                </div>
              </div>

              <div class="row mb-2">
                <div class="col p-0">
                  <editor v-model="formData.content"></editor>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="text-right">
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
