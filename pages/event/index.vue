<script setup lang="ts">
import { env } from "~/helpers/env";
import moment from "moment/moment";
import UiPanel from "~/components/parts/ui-panel.vue";
import type { PaginatedApiResponse } from "~/types";
import { endpoints } from "~/helpers/endpoints";
import { pitLib } from "~/helpers/pitLib";
import { Vue3Lottie } from "vue3-lottie";

definePageMeta({
  layout: "default",
  middleware: "ensure-login",
});
const page = ref(1);
const events = ref<Array<any>>([]);
const {
  data: eventsResponse,
  loading: loadingEventsResponse,
  refresh: eventsRefetch,
} = useFetch<PaginatedApiResponse>(endpoints.event.index, {
  method: "post",
  body: {
    status: "active",
  },
  headers: pitLib.util.headers(),
  query: { page: page },
  server: false,
});
watch(eventsResponse, (vr: any) => {
  if (vr.data?.data) {
    events.value.push(...vr?.data?.data);
  }
});

function likeToggle(v: any) {
  const item = events.value.find((item: any) => item._id === v._id);
  $fetch(endpoints.like.toggle, {
    method: "post",
    body: {
      target: "event",
      target_id: v._id,
    },
    headers: pitLib.util.headers(),
  }).then((d: any) => {
    if (d.status) {
      item.like = d?.data.deletedCount ? [] : [d.data];
      pitLib.notify(
        pitLib.auth.get()?.name + (item.like.length ? +" Liked" : " Unliked"),
        v?.title,
        v?.created_by[0]._id
      );

      if (item.likes.length > 0 && item.likes[0].total) {
        // If item.likes is not empty and total exists, update total
        item.likes[0].total = d?.data.deletedCount
          ? parseInt(item.likes[0].total) - 1
          : parseInt(item.likes[0].total) + 1;
      } else {
        // If item.likes is empty, handle accordingly, perhaps initializing the likes array and total
        item.likes = [{ total: d?.data.deletedCount ? -1 : 1 }];
      }
    }
  });
}
function loadComments(v: any) {
  if ($("#load_comment_btn_" + v._id).length) {
    $("#load_comment_btn_" + v._id).click();
  }
}

const searchQuery = ref("");
const filteredData = computed(() => {
  if (!searchQuery.value) return events.value;
  return events.value.filter((ev) =>
    ev.created_by[0].name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

function handleSearch(query) {
  searchQuery.value = query;
}

let reportCount = 0;
function deletePost(Id: string) {
  if (confirm("Are you sure you want to delete this post?")) {
    events.value = events.value.filter((v) => v._id !== Id);
    alert("Post deleted successfully.");
  }
}

function reportPost(Id: string) {
  if (confirm("Are you sure you want to report this post?")) {
    reportCount++;
    events.value = events.value.filter((v) => v._id !== Id);
    alert(`Post reported successfully. Total reports: ${reportCount}`);
  }
}

function saveLink(post) {
  alert(`Post "${post.title}" saved!`);
}
</script>

<template>
  <!-- main content -->
  <UserTopNav @search="handleSearch" />
  <div class="main-content right-chat-active">
    <div class="middle-sidebar-bottom">
      <div class="middle-sidebar-left">
        <!-- loader wrapper -->
        <!-- loader wrapper -->
        <div class="row feed-body">
          <div class="col-xl-8 col-xxl-9 col-lg-8">
            <div
              class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3"
            >
              <div class="card-body p-0">
                <NuxtLink
                  to="/event/create"
                  class="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
                  ><i
                    class="btn-round-sm font-xs text-primary fa-solid fa-plus me-2 bg-greylight"
                  ></i>
                  Add New Event
                </NuxtLink>
              </div>
            </div>
            <div
              v-for="v in filteredData"
              class="card data-card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3"
            >
              <NuxtLink :to="'/event/' + v?.slug">
                <div class="card-body p-0 d-flex">
                  <figure class="avatar me-3">
                    <img
                      src="/tpl1/images/user-8.png"
                      alt="image"
                      class="shadow-sm rounded-circle w45"
                    />
                  </figure>
                  <h4 class="fw-700 text-grey-900 font-xssss mt-1">
                    <span
                      class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"
                    >
                      {{ moment(v?.created_at).fromNow() }}
                      <br />
                      <strong class="text-secondary">{{
                        v?.created_by?.[0]?.name
                      }}</strong>
                    </span>
                  </h4>
                  <a
                    href="#"
                    class="ms-auto"
                    id="dropdownMenu5"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    ><i
                      class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"
                    ></i
                  ></a>
                  <div
                    class="dropdown-menu dropdown-menu-start p-4 rounded-xxl border-0 shadow-lg"
                    aria-labelledby="dropdownMenu5"
                    style="z-index: 100"
                  >
                    <ul>
                      <li @click="reportPost(v)">
                        <i class="fa-solid fa-flag me-2"></i> Report
                      </li>
                      <li @click="saveLink(v)">
                        <i class="fa-solid fa-bookmark me-2"></i> Save Link
                      </li>
                      <li
                        v-if="
                          v?.created_by?.[0]?.id === pitLib.auth.get()?.userId
                        "
                        @click="deletePost(v._id)"
                      >
                        <i class="fa-solid fa-trash-alt me-2"></i> Delete
                      </li>
                    </ul>
                  </div>
                </div>
                <h5 class="text-primary-soft text-truncate">{{ v?.title }}</h5>
                <div
                  v-if="v?.media?.length"
                  class="card-body p-0 mb-3 rounded-3 overflow-hidden"
                >
                  <div v-for="media in v?.media">
                    <div
                      :class="{
                        'img-container': media?.ref_code == 'event_image',
                      }"
                    >
                      <img
                        v-if="media?.ref_code == 'event_image'"
                        :src="
                          media?.is_local
                            ? env.BASEPOINT + media?.path
                            : media?.path
                        "
                        class="img-fluid card-img mb-2"
                      />
                    </div>
                  </div>
                </div>
              </NuxtLink>
              <div class="card-body d-flex p-0">
                <a
                  :id="'ic_lk_' + v?._id"
                  @click="likeToggle(v)"
                  role="button"
                  class="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
                >
                  <i
                    :class="{
                      'fa-solid text-primary': v?.like.length,
                      'fa-regular': !v?.like.length,
                    }"
                    class="icon fa-thumbs-up fa-2x"
                  ></i>
                  <div class="spinner-border d-none loader" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                  <strong class="ms-2">{{ v?.likes?.[0]?.total }} Likes</strong>
                </a>
                <div class="emoji-wrap">
                  <ul class="emojis list-inline mb-0">
                    <li class="emoji list-inline-item">
                      <i class="fa-regular fa-face-angry"></i>
                    </li>
                    <li class="emoji list-inline-item">
                      <i class="fa-regular fa-face-surprise"></i>
                    </li>
                  </ul>
                </div>
                <a
                  role="button"
                  @click="loadComments(v)"
                  class="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
                  ><i
                    class="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"
                  ></i
                  ><span class="d-none-xss"
                    >{{ v?.comments?.[0]?.total ?? 0 }} Comment</span
                  ></a
                >
                <SharerCard
                  :title="v.title"
                  :url="pitLib.util.url('event/' + v.slug)"
                ></SharerCard>
              </div>
              <Comment class="mt-2" target="event" :target_id="v._id">
              </Comment>
            </div>

            <div v-if="eventsResponse?.data?.pages > page" class="row mt-2">
              <div class="col text-center">
                <button
                  @click="
                    page++;
                    eventsRefetch();
                  "
                  v-if="!loadingEventsResponse"
                  class="btn btn-primary btn-lg text-white rounded shadow-lg"
                >
                  Load More
                  <i class="fa-solid fa-angle-down ms-2"></i>
                </button>
                <client-only>
                  <Vue3Lottie
                    v-if="loadingEventsResponse"
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

            <div class="card w-100 shadow-xss rounded-xxl border-0 p-0">
              <div class="card-body d-flex align-items-center p-4 mb-0">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">
                  Confirm Friend
                </h4>
                <a
                  href="default-member.html"
                  class="fw-600 ms-auto font-xssss text-primary"
                  >See all</a
                >
              </div>
              <div
                class="card-body bg-transparent-card d-flex p-3 bg-greylight ms-3 me-3 rounded-3"
              >
                <figure class="avatar me-2 mb-0">
                  <img
                    src="/tpl1/images/user-7.png"
                    alt="image"
                    class="shadow-sm rounded-circle w45"
                  />
                </figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">
                  Anthony Daugloi
                  <span
                    class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"
                    >12 mutual friends</span
                  >
                </h4>
                <a
                  href="#"
                  class="btn-round-sm bg-white text-grey-900 feather-chevron-right font-xss ms-auto mt-2"
                ></a>
              </div>
              <div
                class="card-body bg-transparent-card d-flex p-3 bg-greylight m-3 rounded-3"
                style="margin-bottom: 0 !important"
              >
                <figure class="avatar me-2 mb-0">
                  <img
                    src="/tpl1/images/user-8.png"
                    alt="image"
                    class="shadow-sm rounded-circle w45"
                  />
                </figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">
                  David Agfree
                  <span
                    class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"
                    >12 mutual friends</span
                  >
                </h4>
                <a
                  href="#"
                  class="btn-round-sm bg-white text-grey-900 feather-plus font-xss ms-auto mt-2"
                ></a>
              </div>
              <div
                class="card-body bg-transparent-card d-flex p-3 bg-greylight m-3 rounded-3"
              >
                <figure class="avatar me-2 mb-0">
                  <img
                    src="/tpl1/images/user-12.png"
                    alt="image"
                    class="shadow-sm rounded-circle w45"
                  />
                </figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">
                  Hugury Daugloi
                  <span
                    class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"
                    >12 mutual friends</span
                  >
                </h4>
                <a
                  href="#"
                  class="btn-round-sm bg-white text-grey-900 feather-plus font-xss ms-auto mt-2"
                ></a>
              </div>
            </div>

            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3">
              <div class="card-body d-flex align-items-center p-4">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">
                  Suggest Group
                </h4>
                <a
                  href="default-group.html"
                  class="fw-600 ms-auto font-xssss text-primary"
                  >See all</a
                >
              </div>
              <div
                class="card-body d-flex pt-4 ps-4 pe-4 pb-0 overflow-hidden border-top-xs bor-0"
              >
                <img
                  src="/tpl1/images/e-2.jpg"
                  alt="img"
                  class="img-fluid rounded-xxl mb-2"
                />
              </div>
              <div class="card-body dd-block pt-0 ps-4 pe-4 pb-4">
                <ul class="memberlist mt-1 mb-2 ms-0 d-block">
                  <li class="w20">
                    <a href="#"
                      ><img
                        src="/tpl1/images/user-6.png"
                        alt="user"
                        class="w35 d-inline-block"
                        style="opacity: 1"
                    /></a>
                  </li>
                  <li class="w20">
                    <a href="#"
                      ><img
                        src="/tpl1/images/user-7.png"
                        alt="user"
                        class="w35 d-inline-block"
                        style="opacity: 1"
                    /></a>
                  </li>
                  <li class="w20">
                    <a href="#"
                      ><img
                        src="/tpl1/images/user-8.png"
                        alt="user"
                        class="w35 d-inline-block"
                        style="opacity: 1"
                    /></a>
                  </li>
                  <li class="w20">
                    <a href="#"
                      ><img
                        src="/tpl1/images/user-3.png"
                        alt="user"
                        class="w35 d-inline-block"
                        style="opacity: 1"
                    /></a>
                  </li>
                  <li class="last-member">
                    <a
                      href="#"
                      class="bg-greylight fw-600 text-grey-500 font-xssss w35 ls-3 text-center"
                      style="height: 35px; line-height: 35px"
                      >+2</a
                    >
                  </li>
                  <li class="ps-3 w-auto ms-1">
                    <a href="#" class="fw-600 text-grey-500 font-xssss"
                      >Member apply</a
                    >
                  </li>
                </ul>
              </div>
            </div>

            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
              <div class="card-body d-flex align-items-center p-4">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">
                  Suggest Pages
                </h4>
                <a
                  href="default-group.html"
                  class="fw-600 ms-auto font-xssss text-primary"
                  >See all</a
                >
              </div>
              <div
                class="card-body d-flex pt-4 ps-4 pe-4 pb-0 overflow-hidden border-top-xs bor-0"
              >
                <img
                  src="/tpl1/images/g-2.jpg"
                  alt="img"
                  class="img-fluid rounded-xxl mb-2"
                />
              </div>
              <div
                class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4"
              >
                <a
                  href="#"
                  class="p-2 lh-28 w-100 bg-grey text-grey-800 text-center font-xssss fw-700 rounded-xl"
                  ><i class="feather-external-link font-xss me-2"></i> Like
                  Page</a
                >
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-0 overflow-hidden">
                <img
                  src="/tpl1/images/g-3.jpg"
                  alt="img"
                  class="img-fluid rounded-xxl mb-2 bg-lightblue"
                />
              </div>
              <div
                class="card-body d-flex align-items-center pt-0 ps-4 pe-4 pb-4"
              >
                <a
                  href="#"
                  class="p-2 lh-28 w-100 bg-grey text-grey-800 text-center font-xssss fw-700 rounded-xl"
                  ><i class="feather-external-link font-xss me-2"></i> Like
                  Page</a
                >
              </div>
            </div>

            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
              <div class="card-body d-flex align-items-center p-4">
                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Event</h4>
                <a
                  href="default-event.html"
                  class="fw-600 ms-auto font-xssss text-primary"
                  >See all</a
                >
              </div>
              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-success me-2 p-3 rounded-xxl">
                  <h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0">
                    <span class="ls-1 d-block font-xsss text-white fw-600"
                      >FEB</span
                    >22
                  </h4>
                </div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">
                  Meeting with clients
                  <span
                    class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500"
                    >41 madison ave, floor 24 new work, NY 10010</span
                  >
                </h4>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-warning me-2 p-3 rounded-xxl">
                  <h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0">
                    <span class="ls-1 d-block font-xsss text-white fw-600"
                      >APR</span
                    >30
                  </h4>
                </div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">
                  Developer Programe
                  <span
                    class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500"
                    >41 madison ave, floor 24 new work, NY 10010</span
                  >
                </h4>
              </div>

              <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                <div class="bg-primary me-2 p-3 rounded-xxl">
                  <h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0">
                    <span class="ls-1 d-block font-xsss text-white fw-600"
                      >APR</span
                    >23
                  </h4>
                </div>
                <h4 class="fw-700 text-grey-900 font-xssss mt-2">
                  Aniversary Event
                  <span
                    class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500"
                    >41 madison ave, floor 24 new work, NY 10010</span
                  >
                </h4>
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
.dropdown-menu ul li {
  cursor: pointer;
  padding: 10px;
  transition: background-color 0.3s;
}

.dropdown-menu ul li:hover {
  background-color: #f0f0f0;
}
</style>
