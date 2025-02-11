<script setup lang="ts">
import {env} from "~/helpers/env";
import moment from "moment/moment";
import UiPanel from "~/components/parts/ui-panel.vue";
import type {PaginatedApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";

definePageMeta({
  layout:"default",
  middleware:"ensure-login"
})
const route=useRoute()
const html=ref<String>('')
const {data:restaurantsResponse,loading:loadingRestaurantsResponse,refresh:restaurantsRefetch} =useFetch<PaginatedApiResponse>(endpoints.restaurant.index,{
  method:"post",
  body:{
    slug:route.params.slug,
  },
  headers:pitLib.util.headers(),
  server:0
})
async function getHtml(path) {
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
            <client-only >
              <Vue3Lottie v-if="loadingRestaurantsResponse"
                          animationLink="/json/loading_2.json"
                          :height="200"
                          :width="200"
              />
            </client-only>
            <div v-if="restaurantsResponse?.status&&!loadingRestaurantsResponse" class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
              <div class="card-body p-0">
                <h5>{{restaurantsResponse?.data?.data?.[0]?.title}}</h5>
                <div v-if="restaurantsResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                  <div v-for="media in restaurantsResponse?.data?.data?.[0]?.media" class="">
                    <img v-if="media?.ref_code=='restaurant_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid mb-2">
                  </div>
                </div>
                <p>{{restaurantsResponse?.data?.data?.[0]?.content}}</p>
                <h5><i class="fa-regular fa-clock me-2"></i> Timing : <span class="text-cyan">{{moment(restaurantsResponse?.data?.data?.[0]?.open,"HH:mm").format('HH:mm A')}}</span> to <span class="text-cyan"> {{moment(restaurantsResponse?.data?.data?.[0]?.close,"HH:mm").format('HH:mm A')}}</span></h5>
                <h5><i class="fa-solid fa-phone me-2"></i> Contact : <span class="text-cyan">{{restaurantsResponse?.data?.data?.[0]?.contact}}</span></h5>
              </div>
              <Comment class="mt-2" target="restaurant" :target_id="restaurantsResponse?.data?.data?.[0]?._id"> </Comment>

            </div>

          </div>
          <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
              <div class="card-body d-flex align-items-center p-4">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Friend Request</h4>
                <a href="default-member.html" class="fw-600 ms-auto font-xssss text-primary">See all</a>
              </div>
              <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 border-top-xs bor-0">
                <figure class="avatar me-3"><img src="/tpl1/images/user-7.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-1">Anthony Daugloi <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
              </div>
              <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                <a href="#" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Confirm</a>
                <a href="#" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Delete</a>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-0">
                <figure class="avatar me-3"><img src="/tpl1/images/user-8.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-1">Mohannad Zitoun <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
              </div>
              <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                <a href="#" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Confirm</a>
                <a href="#" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Delete</a>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-0">
                <figure class="avatar me-3"><img src="/tpl1/images/user-12.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-1">Mohannad Zitoun <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
              </div>
              <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">
                <a href="#" class="p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">Confirm</a>
                <a href="#" class="p-2 lh-20 w100 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">Delete</a>
              </div>
            </div>

            <div class="card w-100 shadow-xss rounded-xxl border-0 p-0 ">
              <div class="card-body d-flex align-items-center p-4 mb-0">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Confirm Friend</h4>
                <a href="default-member.html" class="fw-600 ms-auto font-xssss text-primary">See all</a>
              </div>
              <div class="card-body bg-transparent-card d-flex p-3 bg-greylight ms-3 me-3 rounded-3">
                <figure class="avatar me-2 mb-0"><img src="/tpl1/images/user-7.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Anthony Daugloi <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
                <a href="#" class="btn-round-sm bg-white text-grey-900 feather-chevron-right font-xss ms-auto mt-2"></a>
              </div>
              <div class="card-body bg-transparent-card d-flex p-3 bg-greylight m-3 rounded-3" style="margin-bottom: 0 !important;">
                <figure class="avatar me-2 mb-0"><img src="/tpl1/images/user-8.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2"> David Agfree  <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
                <a href="#" class="btn-round-sm bg-white text-grey-900 feather-plus font-xss ms-auto mt-2"></a>
              </div>
              <div class="card-body bg-transparent-card d-flex p-3 bg-greylight m-3 rounded-3">
                <figure class="avatar me-2 mb-0"><img src="/tpl1/images/user-12.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">Hugury Daugloi <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">12 mutual friends</span></h4>
                <a href="#" class="btn-round-sm bg-white text-grey-900 feather-plus font-xss ms-auto mt-2"></a>
              </div>

            </div>

<!--            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3">-->
<!--              <div class="card-body d-flex align-items-center p-4">-->
<!--                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Suggest Group</h4>-->
<!--                <a href="default-group.html" class="fw-600 ms-auto font-xssss text-primary">See all</a>-->
<!--              </div>-->
<!--              <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 overflow-hidden border-top-xs bor-0">-->
<!--                <img src="/tpl1/images/e-2.jpg" alt="img" class="img-fluid rounded-xxl mb-2">-->
<!--              </div>-->
<!--              <div class="card-body dd-block pt-0 ps-4 pe-4 pb-4">-->
<!--                <ul class="memberlist mt-1 mb-2 ms-0 d-block">-->
<!--                  <li class="w20"><a href="#"><img src="/tpl1/images/user-6.png" alt="user" class="w35 d-inline-block" style="opacity: 1;"></a></li>-->
<!--                  <li class="w20"><a href="#"><img src="/tpl1/images/user-7.png" alt="user" class="w35 d-inline-block" style="opacity: 1;"></a></li>-->
<!--                  <li class="w20"><a href="#"><img src="/tpl1/images/user-8.png" alt="user" class="w35 d-inline-block" style="opacity: 1;"></a></li>-->
<!--                  <li class="w20"><a href="#"><img src="/tpl1/images/user-3.png" alt="user" class="w35 d-inline-block" style="opacity: 1;"></a></li>-->
<!--                  <li class="last-member"><a href="#" class="bg-greylight fw-600 text-grey-500 font-xssss w35 ls-3 text-center" style="height: 35px; line-height: 35px;">+2</a></li>-->
<!--                  <li class="ps-3 w-auto ms-1"><a href="#" class="fw-600 text-grey-500 font-xssss">Member apply</a></li>-->
<!--                </ul>-->
<!--              </div>-->



<!--            </div>-->

<!--            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">-->
<!--              <div class="card-body d-flex align-items-center p-4">-->
<!--                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Suggest Pages</h4>-->
<!--                <a href="default-group.html" class="fw-600 ms-auto font-xssss text-primary">See all</a>-->
<!--              </div>-->
<!--              <div class="card-body d-flex pt-4 ps-4 pe-4 pb-0 overflow-hidden border-top-xs bor-0">-->
<!--                <img src="/tpl1/images/g-2.jpg" alt="img" class="img-fluid rounded-xxl mb-2">-->
<!--              </div>-->
<!--              <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">-->
<!--                <a href="#" class="p-2 lh-28 w-100 bg-grey text-grey-800 text-center font-xssss fw-700 rounded-xl"><i class="feather-external-link font-xss me-2"></i> Like Page</a>-->
<!--              </div>-->

<!--              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-0 overflow-hidden">-->
<!--                <img src="/tpl1/images/g-3.jpg" alt="img" class="img-fluid rounded-xxl mb-2 bg-lightblue">-->
<!--              </div>-->
<!--              <div class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4">-->
<!--                <a href="#" class="p-2 lh-28 w-100 bg-grey text-grey-800 text-center font-xssss fw-700 rounded-xl"><i class="feather-external-link font-xss me-2"></i> Like Page</a>-->
<!--              </div>-->


<!--            </div>-->

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

<style scoped></style>
