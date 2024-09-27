<script setup lang="ts">

import type {PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";
import {env} from "~/helpers/env";

definePageMeta({
  layout:"default",
  middleware:"ensure-login"
})
const page=ref(1)
const {data:groupResp,loading:loadingGroupsResp,refresh:refetchGroupsResp}=useFetch<PaginatedApiResponse>(endpoints.group.my,{
  method:"post",
  headers:pitLib.util.headers(),
  server:false,
  query:{page:page}
})
</script>

<template>
  <!-- main content -->
  <div class="main-content right-chat-active">

    <div class="middle-sidebar-bottom">
      <div class="middle-sidebar-left">
        <!-- loader wrapper -->
        <!-- loader wrapper -->
        <div class="row feed-body">
          <div class="col-xl-8 col-xxl-9 col-lg-8">
            <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
              <div class="card-body p-0">
                <NuxtLink to="/group/create" class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"><i class="btn-round-sm font-xs text-primary fa-solid fa-plus me-2 bg-greylight"></i>
                  Create New Group
                </NuxtLink>
              </div>
            </div>
            <div class="row ps-2 pe-1">
              <client-only>
                <Vue3Lottie
                    v-if="loadingGroupsResp"
                    animationLink="/json/loading_2.json"
                    :height="200"
                    :width="200"
                />
              </client-only>
              <div class="col-md-6 col-sm-6 pe-2 ps-2 color border-gray-200 shadow-sm" v-for="(g,i) in groupResp?.data.data" :key="i">
  <div class="card d-block m-10 border-0 shadow-xss rounded-3 overflow-hidden mb-3" style="border-radius: 20px; ">
    <div class="card-body position-relative h50 bg-image-cover bg-image-top" :style="{ backgroundImage: 'url(' + env.BASEPOINT+g?.media?.[0]?.path + ')' }"></div>
    <div class="card-body d-block w-10 pl-10 pe-4 pb-4 pt-0 text-left position-relative">
      <figure class="avatar position-absolute w75 z-index-1" style="top:-10px; left: 15px;">
        <img :src="g?.media.length ? env.BASEPOINT + g?.media[0].path : env.NO_IMG_USER" alt="image" class="float-right p-1 bg-white rounded-circle w-100">
      </figure>
      <div class="clearfix"></div>
      <h4 class="fw-700  font-xsss mt-3 mb-1" >{{ g?.title }}</h4>
      <p class="fw-500 font-xsssss text-grey-500 mt-0 mb-3"> 
        <span>Created By:-</span> {{ g?.created_by?.[0].name }}
      </p>
      <span class="position-absolute right-15 top-0 d-flex align-items-center">
        <NuxtLink :to="'/group/'+g._id" class="d-lg-block d-none">
          <i class="fa fa-solid fa-circle-right btn-round-md font-md bg-primary text-white"></i>
        </NuxtLink>
      </span>
    </div>
  </div>
</div>

            </div>
          </div>
          <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
            <FriendRequestCard></FriendRequestCard>




            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
              <div class="card-body d-flex align-items-center  p-4">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Event</h4>
                <a href="default-event.html" class="fw-600 ms-auto font-xssss text-primary">See all</a>
              </div>
              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-success me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">FEB</span>22</h4></div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Meeting with clients <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-warning me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">APR</span>30</h4></div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Developer Programe <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-primary me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">APR</span>23</h4></div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Aniversary Event <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  <!-- main content -->
</template>

<style>

</style>
