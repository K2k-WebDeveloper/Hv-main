<script setup lang="ts">
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import type {PaginatedApiResponse} from "~/types";
import moment from "moment";
import {env} from "~/helpers/env";
import {Vue3Lottie} from "vue3-lottie";

definePageMeta({
  layout:"panel",
  middleware:"ensure-panel-access"
})
const page=ref(1)
const swal=useSwal()
const route=useRoute()
const html=ref<String>('')

const {data:recipesResponse,loading:loadingRecipesResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.recipe.index,{
  method:"post",
  body:{
    _id:route.params._id
  },
  headers:pitLib.util.headers(),
  query:{page:page},
  server:false,
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
        $fetch(endpoints.veganlog.update,{
          method:"post",
          body:{
            _id:v?._id,
            status:"rejected"
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
        $fetch(endpoints.veganlog.update,{
          method:"post",
          body:{
            _id:v?._id,
            status:"approved"
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

async function getHtml(path) {
  html.value=await $fetch(env.BASEPOINT+ path)
}
</script>

<template>
  <PanelHeader title="Recipe Detail View" description="Recipe Details" icon="recipe"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <div class="card _lift h-100" >
          <div class="card-header">
            Recipe Detail
          </div>
          <div class="card-body d-flex justify-content-center flex-column">
            <client-only>
              <Vue3Lottie
                  v-if="loadingRecipesResponse"
                  animationLink="/json/loading_1.json"
                  :height="300"
                  :width="300"
              />
            </client-only>
            <div class="h5 " v-if="!loadingRecipesResponse">
              <div class="row mb-2" >
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4 d-none d-sm-block d-md-block d-lg-block d-xl-block border-end">
                  Title
                </div>
                <div class="col">
                  {{recipesResponse?.data?.data?.[0]?.title}}
                </div>
              </div>
              <div class="row mb-2" >
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4 d-none d-sm-block d-md-block d-lg-block d-xl-block border-end">
                  Logo
                </div>
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4">
                  <div v-if="recipesResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                    <div v-for="media in recipesResponse?.data?.data?.[0]?.media" class="">
                      <img  @error="event.target.src=env.NO_IMG" v-if="media?.ref_code=='recipe_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid mb-2">
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mb-2" >
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4 d-none d-sm-block d-md-block d-lg-block d-xl-block border-end">
                  Tags
                </div>
                <div class="col">
                  <span class="badge bg-info">ok</span>
                </div>
              </div>
              <div v-if="recipesResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                <div v-for="media in recipesResponse?.data?.data?.[0]?.media" class="">
                  <div v-if="media?.ref_code=='recipe_content'&&getHtml(media?.path)" v-html="html??''">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
