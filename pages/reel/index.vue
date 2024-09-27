<script setup lang="ts">
import { endpoints } from "~/helpers/endpoints";
import { pitLib } from "~/helpers/pitLib";
import moment from "moment";
import { env } from "~/helpers/env";
import { Vue3Lottie } from "vue3-lottie";
import type { ApiResponse } from "~/types";

definePageMeta({
  layout: "default",
  middleware: "ensure-login",
});

const page = ref(1);
const vlogs = ref<Array<any>>([]);
const {
  data: vlogsResponse,
  loading: loadingVlogsResponse,
  refresh: vlogsRefetch,
} = useFetch(endpoints.veganlog.index, {
  method: "post",
  body: {
    status: "approved",
  },
  headers: {
    Authorization: "Bearer " + pitLib.auth.get()?.token,
  },
  query: { page: page },
  server: false,
});

watch(vlogsResponse, (vr: any) => {
  if (vr.data?.data) {
    vlogs.value.push(...vr?.data?.data);
  }
});

function likeToggle(v: any) {
  const item = vlogs.value.find((item: any) => item._id === v._id);
  $fetch(endpoints.like.toggle, {
    method: "post",
    body: {
      target: "veganlog",
      target_id: v._id,
    },
    headers: pitLib.util.headers(),
  }).then((d: any) => {
    if (d.status) {
      item.like = d?.data.deletedCount ? [] : [d.data];
      if (item.likes.length > 0 && item.likes[0].total) {
        item.likes[0].total = d?.data.deletedCount
          ? parseInt(item.likes[0].total) - 1
          : parseInt(item.likes[0].total) + 1;
      } else {
        item.likes = [{ total: d?.data.deletedCount ? -1 : 1 }];
      }
    }
  });
}

const searchQuery = ref("");
const filteredData = computed(() => {
  if (!searchQuery.value) {
    return vlogs.value.filter((vlog) =>
      vlog.media?.some((media) => media.ref_code === "vegan_log_video")
    );
  }
  return vlogs.value
    .filter((vlog) =>
      vlog.media?.some((media) => media.ref_code === "vegan_log_video")
    )
    .filter((vlog) =>
      vlog.created_by[0].name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
});

function handleSearch(query) {
  searchQuery.value = query;
}

function deletePost(vlogId: string) {
  if (confirm("Are you sure you want to delete this post?")) {
    vlogs.value = vlogs.value.filter((v) => v._id !== vlogId);
    alert("Post deleted successfully.");
  }
}

function reportPost(vlogId: string) {
  if (confirm("Are you sure you want to report this post?")) {
    reportCount++;
    vlogs.value = vlogs.value.filter((v) => v._id !== vlogId);
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
        <div class="row feed-body">
          <div class="col-xl-8 col-xxl-9 col-lg-8">
            <common-veganlog-create></common-veganlog-create>

            <div
              v-for="v in filteredData"
              :key="v._id"
              class="card data-card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3"
            >
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
                  class="ms-auto"
                  id="dropdownMenu5"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  ><i
                    class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"
                  ></i>
                </a>
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

              <div
                v-if="v?.media?.length"
                class="card-body p-0 mb-3 rounded-3 overflow-hidden"
              >
                <div v-for="media in v?.media" class="row">
                  <div
                    v-if="media?.ref_code == 'vegan_log_video'"
                    class="mb-2 rounded col-12"
                  >
                    <video controls class="float-right w-100">
                      <source
                        :src="env.BASEPOINT + media?.path"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>

              <div class="card-body p-0 me-lg-5">
                <p v-html="v?.content"></p>
              </div>

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
                  <strong class="ms-2">{{ v?.likes?.[0]?.total }} Likes</strong>
                </a>
                <a
                  href="#"
                  class="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
                >
                  <i
                    class="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"
                  ></i>
                  <span class="d-none-xss"
                    >{{ v?.comments?.[0]?.total ?? 0 }} Comment</span
                  >
                </a>

                <a
                  href="#"
                  id="dropdownMenu21"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  class="ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
                >
                  <i
                    class="feather-share-2 text-grey-900 text-dark btn-round-sm font-lg"
                  ></i>
                  <span class="d-none-xs">Share</span>
                </a>
              </div>

              <Comment
                class="mt-2"
                target="veganlog"
                :target_id="v._id"
              ></Comment>
            </div>

            <div v-if="vlogsResponse?.data?.pages > page" class="row mt-2">
              <div class="col text-center">
                <button
                  @click="
                    page++;
                    vlogsRefetch();
                  "
                  v-if="!loadingVlogsResponse"
                  class="btn btn-primary btn-lg text-white rounded shadow-lg"
                >
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
        </div>
      </div>
    </div>
  </div>
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
