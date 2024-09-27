<script setup lang="ts">
import {env} from "~/helpers/env";
import moment from "moment/moment";
import UiPanel from "~/components/parts/ui-panel.vue";
import type {PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";
import LatestEventCard from "~/components/LatestEventCard.vue";

definePageMeta({
  layout:"default",
  middleware:"ensure-login"
})
const route=useRoute()
const html=ref<String>('')
const {data:blogsResponse,loading:loadingBlogsResponse,refresh:blogsRefetch} =useFetch<PaginatedApiResponse>(endpoints.blog.index,{
  method:"post",
  body:{
    slug:route.params.slug,
    status:"active"
  },
  headers:pitLib.util.headers(),
  server:false
})
async function getHtml(path:string) {
  html.value=await $fetch(env.BASEPOINT+ path)
}
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
                <NuxtLink to="/blog/create" class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"><i class="btn-round-sm font-xs text-primary fa-solid fa-plus me-2 bg-greylight"></i>
                  Add New Blog
                </NuxtLink>
              </div>

            </div>

            <div v-if="blogsResponse?.status&&!loadingBlogsResponse" class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
              <div class="card-body p-0">
                <h5>{{blogsResponse?.data?.data?.[0]?.title}}</h5>
                <div v-if="blogsResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                  <div v-for="media in blogsResponse?.data?.data?.[0]?.media" class="">
                    <img v-if="media?.ref_code=='blog_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid mb-2">
                    <div v-if="media?.ref_code=='blog_content'&&getHtml(media?.path)" v-html="html??''">

                    </div>
                    <client-only >
                      <Vue3Lottie v-if="!html"
                                  animationLink="/json/loading_2.json"
                                  :height="50"
                                  :width="200"
                      />
                    </client-only>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
            <FriendRequestCard></FriendRequestCard>
            <LatestEventCard></LatestEventCard>
          </div>

        </div>
      </div>

    </div>
  </div>
  <!-- main content -->
</template>

<style scoped></style>
