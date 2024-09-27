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
  title:"",content:'',logo:'',category:'',contact:"",rating:"",discount:"",open:"",close:""
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
  fd.append("contact",formData.contact)
  fd.append("rating",formData.rating)
  fd.append("discount",formData.discount)
  fd.append("open",formData.open)
  fd.append("close",formData.close)
  $fetch<ApiResponse>(endpoints.restaurant.create,{
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
const {data:categResp,loading:loadingCategResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.restaurant.category.index,{
  method:"post",
  body:{
    status:"active"
  },
  headers:pitLib.util.headers(),
  server:false,
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
  <PanelHeader title="Restaurant Creation" description="Add new restaurant recommendation." icon="utensils"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <form @submit.prevent="submit()">
          <div class="card _lift h-100" >
            <div class="card-header">
              Add Restaurant
            </div>
            <div class="card-body d-flex justify-content-center flex-column">
              <ui-panel ref="divResp" :type="createResponse?.status?'success':'warning'" :content="createResponse?.message" @show="createResponse=$event" v-if="createResponse?.message"></ui-panel>

              <div class="row mb-2">
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <q-input id="title" filled v-model="formData.title" label="Title" />
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <q-file accept="image/*" max-files="1"  filled v-model="formData.logo" label="Logo File" stack-label></q-file>
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <input @change="formData.category=$event.target?.tagifyValue ? JSON.parse($event.target?.tagifyValue)[0].key:null" placeholder="Category" class="form-control-lg w-100" id="category" >
                </div>
              </div>

              <div class="row mb-3">
                <div class="col p-0">
                  <label for="description">Description</label>
                  <textarea placeholder="Description goes here." id="description" class="form-control" rows="4" v-model="formData.content"></textarea>
                </div>
              </div>

              <div class="row ">
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <q-input type="tel" id="contact" filled v-model="formData.contact" label="Contact Number" />
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <q-input type="number" id="rating" filled v-model="formData.rating" label="Rating" min="1" max="5"/>
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <q-input type="number" id="discount" filled v-model="formData.discount" label="Discount Percent" min="1" max="100"/>
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <q-input :type="'time'" id="open" filled v-model="formData.open" label="Open Timing" />
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2">
                  <q-input :type="'time'" id="close" filled v-model="formData.close" label="Closing Timing" />
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
