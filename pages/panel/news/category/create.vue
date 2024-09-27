<script setup lang="ts">
import moment from "moment/moment";
import type {ApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import UiPanel from "~/components/parts/ui-panel.vue";

definePageMeta({
  layout:"panel",
  middleware:"ensure-panel-access"
})

const formData=reactive({
  title:"",image:null
})
const loadingCreate=ref(false)
const swal=useSwal()
const createResponse=ref<ApiResponse>()

function submit() {
  loadingCreate.value=true
  let fd=new FormData()
  fd.append("title",formData.title)
  fd.append("image",formData.image)
  $fetch(endpoints.news.category.create,{
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
</script>

<template>
  <PanelHeader title="News Categories" description="Create and list blog categories. Users will choose one of them." icon="blog"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <form @submit.prevent="submit()">
          <div class="card _lift h-100" >
            <div class="card-header">
              Create News Categories
            </div>
            <div class="card-body d-flex justify-content-center flex-column">
              <ui-panel ref="divResp" :type="createResponse?.status===true?'success':'warning'" :content="createResponse?.message" @show="createResponse=$event" v-if="createResponse?.message"></ui-panel>

              <div class="row">
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
                  <q-input filled v-model="formData.title" label="Title" />
                </div>
                <div class="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
                  <q-file accept="image/*" max-files="1"  filled v-model="formData.image" label="Logo File" stack-label></q-file>
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
