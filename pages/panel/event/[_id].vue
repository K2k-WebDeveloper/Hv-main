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

const {data:eventsResponse,loading:loadingEventsResponse,refresh:refetch} =useFetch<PaginatedApiResponse>(endpoints.event.index,{
  method:"post",
  body:{
    _id:route.params._id
  },
  headers:pitLib.util.headers(),
  query:{page:page},
  server:false
})


async function getHtml(path) {
  html.value=await $fetch(env.BASEPOINT+ path)
}
</script>

<template>
  <PanelHeader title="Event Detail View" description="Event Details" icon="calendar"></PanelHeader>
  <div class="container-xl px-4 mt-n10">
    <div class="row">
      <div class="col">
        <!-- Dashboard example card 1-->
        <div class="card _lift h-100" >
          <div class="card-header">
            Event Detail
          </div>
          <div class="card-body d-flex justify-content-center flex-column">
            <client-only>
              <Vue3Lottie
                  v-if="loadingEventsResponse"
                  animationLink="/json/loading_1.json"
                  :height="300"
                  :width="300"
              />
            </client-only>
            <div class="h5 " v-if="!loadingEventsResponse">
              <div class="row mb-2" >
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4 d-none d-sm-block d-md-block d-lg-block d-xl-block border-end">
                  Title
                </div>
                <div class="col">
                  {{eventsResponse?.data?.data?.[0]?.title}}
                </div>
              </div>
              <div class="row mb-2" >
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4 d-none d-sm-block d-md-block d-lg-block d-xl-block border-end">
                  Logo
                </div>
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4">
                  <div v-if="eventsResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                    <div v-for="media in eventsResponse?.data?.data?.[0]?.media" class="">
                      <img  @error="event.target.src=env.NO_IMG" v-if="media?.ref_code=='event_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid mb-2">
                    </div>
                  </div>
                </div>
              </div>
              <div class="row mb-2" >
                <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-4 d-none d-sm-block d-md-block d-lg-block d-xl-block border-end">
                  Tags
                </div>
                <div class="col" v-if="eventsResponse?.data?.data?.[0]?.tags.length">
                  <span class="badge bg-info m-1" v-for="t in eventsResponse?.data?.data?.[0]?.tags">{{t}}</span>
                </div>
              </div>
              <div v-if="eventsResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                <div v-for="media in eventsResponse?.data?.data?.[0]?.media" class="">
                  <div v-if="media?.ref_code=='event_content'&&getHtml(media?.path)" v-html="html??''">

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
