<script setup lang="ts">
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import moment from "moment";
import {env} from "~/helpers/env";
import {Vue3Lottie} from "vue3-lottie";
import type {ApiResponse} from "~/types";

definePageMeta({
  layout:"default",
  middleware:"ensure-login"
})
const page=ref(1)
const restaurants=ref<Array<any>>([])
const {data:restaurantsResponse,loading:loadingVlogsResponse,refresh:restaurantsRefetch} =useFetch(endpoints.restaurant.index,{
  method:"post",
  body:{
    // status:"approved"
  },
  headers:{
    Authorization: "Bearer "+pitLib.auth.get()?.token,
  },
  query:{page:page,},
  server:false
})
watch(restaurantsResponse,(vr:any)=>{
  if (vr.data?.data){
    restaurants.value.push(...vr?.data?.data)
  }
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


            <div v-for="v in restaurants" class="card data-card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
              <div class="card-body p-0 d-flex">
                <figure class="avatar me-3"><img src="/tpl1/images/user-8.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-1">
                  <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{{moment(v?.created_at).fromNow()}}
                    <br>
                    <strong class="text-secondary">{{v?.created_by?.[0]?.name}}</strong>
                  </span>
                </h4>
                <a class="ms-auto" id="dropdownMenu5" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i></a>
                <div class="dropdown-menu dropdown-menu-start p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu5">
                  <ul>
                    <li><i class="fa-solid fa-check me-2"></i> Save Link</li>
                  </ul>
                </div>
              </div>
              <h5>{{v?.title}}</h5>
              <h6 v-if="v?.discount"><span class="badge badge-warning">{{v?.discount}}% Discount</span> </h6>
              <div v-if="v?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                <NuxtLink :to="'/recommendation/restaurants/'+v?.slug">
                  <div v-for="media in v?.media" class="img-container">
                    <img v-if="media?.ref_code=='restaurant_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid card-img mb-2">
                  </div>
                </NuxtLink>
              </div>
              <div class="card-body p-0 me-lg-5">
                <p v-html="v?.content"></p>
              </div>
              <div class="card-body d-flex p-0">
                <div class="emoji-wrap">
                  <ul class="emojis list-inline mb-0">
                    <li class="emoji list-inline-item"><i class="fa-regular fa-face-angry"></i></li>
                    <li class="emoji list-inline-item"><i class="fa-regular fa-face-surprise"></i></li>
                  </ul>
                </div>
                <a href="#" class="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"><i class="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"></i><span class="d-none-xss">{{v?.comments?.[0]?.total??0}} Comment</span></a>
                <a href="#" id="dropdownMenu21" data-bs-toggle="dropdown" aria-expanded="false" class="ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"><i class="feather-share-2 text-grey-900 text-dark btn-round-sm font-lg"></i><span class="d-none-xs">Share</span></a>
                <div class="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu21">
                  <h4 class="fw-700 font-xss text-grey-900 d-flex align-items-center">Share <i class="feather-x ms-auto font-xssss btn-round-xs bg-greylight text-grey-900 me-2"></i></h4>
                  <div class="card-body p-0 d-flex">
                    <ul class="d-flex align-items-center justify-content-between mt-2">
                      <li class="me-1"><a href="#" class="btn-round-lg bg-facebook"><i class="font-xs ti-facebook text-white"></i></a></li>
                      <li class="me-1"><a href="#" class="btn-round-lg bg-twiiter"><i class="font-xs ti-twitter-alt text-white"></i></a></li>
                      <li class="me-1"><a href="#" class="btn-round-lg bg-linkedin"><i class="font-xs ti-linkedin text-white"></i></a></li>
                      <li class="me-1"><a href="#" class="btn-round-lg bg-instagram"><i class="font-xs ti-instagram text-white"></i></a></li>
                      <li><a href="#" class="btn-round-lg bg-pinterest"><i class="font-xs ti-pinterest text-white"></i></a></li>
                    </ul>
                  </div>
                  <div class="card-body p-0 d-flex">
                    <ul class="d-flex align-items-center justify-content-between mt-2">
                      <li class="me-1"><a href="#" class="btn-round-lg bg-tumblr"><i class="font-xs ti-tumblr text-white"></i></a></li>
                      <li class="me-1"><a href="#" class="btn-round-lg bg-youtube"><i class="font-xs ti-youtube text-white"></i></a></li>
                      <li class="me-1"><a href="#" class="btn-round-lg bg-flicker"><i class="font-xs ti-flickr text-white"></i></a></li>
                      <li class="me-1"><a href="#" class="btn-round-lg bg-black"><i class="font-xs ti-vimeo-alt text-white"></i></a></li>
                      <li><a href="#" class="btn-round-lg bg-whatsup"><i class="font-xs feather-phone text-white"></i></a></li>
                    </ul>
                  </div>
                  <h4 class="fw-700 font-xssss mt-4 text-grey-500 d-flex align-items-center mb-3">Copy Link</h4>
                  <i class="feather-copy position-absolute right-35 mt-3 font-xs text-grey-500"></i>
                  <input type="text" value="https://socia.be/1rGxjoJKVF0" class="bg-grey text-grey-500 font-xssss border-0 lh-32 p-2 font-xssss fw-600 rounded-3 w-100 theme-dark-bg">
                </div>
              </div>
              <Comment class="mt-2" target="restaurant" :target_id="v._id"> </Comment>
            </div>
            <div v-if="restaurantsResponse?.data?.pages>page" class="row mt-2">
              <div class="col text-center">
                <button @click="page++;restaurantsRefetch()" v-if="!loadingVlogsResponse" class="btn btn-primary btn-lg text-white rounded shadow-lg">
                  Load More
                  <i class="fa-solid fa-angle-down ms-2"></i>
                </button>
                <client-only>
                  <Vue3Lottie
                      v-if="loadingVlogsResponse"
                      animationLink="/json/loading_2.json"
                      :height="200"
                      :width="200"
                  />
                </client-only>
              </div>
            </div>

          </div>
          <div class="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
            <FriendRequestCard></FriendRequestCard>

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
