<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { env } from "~/helpers/env";
import moment from "moment/moment";
import UiPanel from "~/components/parts/ui-panel.vue";
import type { ApiResponse, PaginatedApiResponse } from "~/types";
import { endpoints } from "~/helpers/endpoints";
import { pitLib } from "~/helpers/pitLib";
import { Vue3Lottie } from "vue3-lottie";

definePageMeta({
  layout: "default",
  middleware: "ensure-login",
});

const swal = useSwal();
const tab = ref<"new" | "friends" | "pending" | "requests">("new");
const page = ref<number>(1);
const loadingUserResponse = ref<boolean>(true);
const loadingTarget = ref();
const userResponse = ref();
let sourcedEndpoint = endpoints.friend.index.new;

const searchQuery = ref("");
const showDropdown = ref(false);

function getData() {
  loadingUserResponse.value = true;
  $fetch<PaginatedApiResponse>(sourcedEndpoint, {
    method: "post",
    headers: pitLib.util.headers(),
    query: { page: page.value },
    server: false,
  }).then((d) => {
    userResponse.value = d;
    loadingUserResponse.value = false;
  });
  console.log(userResponse);
}

onMounted(() => {
  getData();
});

watch(tab, (t) => {
  page.value = 1;
  if (t == "new") {
    sourcedEndpoint = endpoints.friend.index.new;
  }
  if (t == "friends") {
    sourcedEndpoint = endpoints.friend.index.my;
  }
  if (t == "pending") {
    sourcedEndpoint = endpoints.friend.index.pending;
  }
  if (t == "requests") {
    sourcedEndpoint = endpoints.friend.index.requests;
  }
  getData();
});

const filteredFriends = computed(() => {
  if (!userResponse.value?.data?.data) return [];
  return userResponse.value.data.data.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function handleSearch() {
  showDropdown.value = searchQuery.value.length > 0;
}

// Function to select a friend from the dropdown
function selectFriend(friend) {
  searchQuery.value = friend.name;
  showDropdown.value = false;
  // You can add additional logic here, like scrolling to the selected friend in the list
}

function sendRequest(u:any) {
  loadingTarget.value=u._id
  $fetch<ApiResponse>(endpoints.friend.create,{
    method:"post",
    headers:pitLib.util.headers(),
    body:{to_id:u._id}
  }).then(d=>{
    pitLib.notify("Friend request",'<b>'+pitLib.auth.get()?.name+'</b>'+" Sent you friend request",u._id)

    swal.fire({
      title: d?.message,
      icon: d?.status ? "success" : "warning",
      showCancelButton: false,
      timer: 1500,
    });
    loadingTarget.value = null;
    getData();
  });
}

function confDel(u: any) {
  swal
    .fire({
      title: "Are you sure?",
      text: "You are about to unfriend!",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Delete",
    })
    .then((result) => {
      if (result.isConfirmed) {
        $fetch<ApiResponse>(endpoints.friend.unfriend, {
          method: "post",
          body: {
            user_id: u?._id,
          },
          headers: pitLib.util.headers(),
        }).then((d) => {
          swal.fire({
            title: d?.message,
            icon: d?.status ? "success" : "warning",
            showCancelButton: false,
            timer: 1500,
          });
          getData();
        });
      }
    });
}

function confAccept(u: any) {
  $fetch<ApiResponse>(endpoints.friend.respond, {
    method: "post",
    body: {
      user_id: u?._id,
      status: "confirmed",
    },
    headers: pitLib.util.headers(),
  }).then((d) => {
    swal.fire({
      title: d?.message,
      icon: d?.status ? "success" : "warning",
      showCancelButton: false,
      timer: 1500,
    });
    getData();
  });
}
</script>

<template>
  <!-- main content -->
  <div class="main-content bg-lightblue theme-dark-bg right-chat-active">
    <div class="middle-sidebar-bottom">
      <div class="middle-sidebar-left pe-0">
        <div class="row">
          <div class="col-xl-12">
            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
              <div class="card-body d-flex align-items-center p-0">
                <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Friends</h2>
                <div class="search-form-2 ms-auto">
                  <i class="ti-search font-xss"></i>
                  <input
                    v-model="searchQuery"
                    @input="handleSearch"
                    type="text"
                    class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0"
                    placeholder="Search here."
                  />
                  <!-- Dropdown for search results -->
                  <div v-if="showDropdown" class="search-dropdown">
                    <div
                      v-for="friend in filteredFriends"
                      :key="friend._id"
                      @click="selectFriend(friend)"
                      class="search-result-item"
                    >
                      {{ friend.name }} ({{ friend.email }})
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col"></div>
              <div class="col-12 col-lg-10 col-xl-8">
                <q-tabs v-model="tab" narrow-indicator dense align="justify">
                  <q-tab
                    class="text-purple"
                    name="new"
                    icon="fa fa-user-plus"
                    label="Find Friends"
                  />
                  <q-tab
                    class="text-green"
                    name="friends"
                    icon="fa fa-user-group"
                    label="My Friends"
                  />
                  <q-tab
                    class="text-orange"
                    name="pending"
                    icon="fa fa-user-clock"
                    label="Sent Request"
                  />
                  <q-tab
                    class="text-cyan"
                    name="requests"
                    icon="fa fa-hand"
                    label="Friend Requests"
                  />
                </q-tabs>
              </div>
              <div class="col"></div>
            </div>

            <q-linear-progress
              v-if="loadingUserResponse"
              indeterminate
              color="primary"
              class="q-mt-sm mt-3 mb-3"
            />

            <div class="row ps-2 pe-2" v-if="userResponse?.status">
              <div
                v-for="u in filteredFriends"
                class="col-md-3 col-sm-4 pe-2 ps-2"
              >
                <div
                  class="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3"
                >
                  <div
                    class="card-body d-block w-100 ps-3 pe-3 pb-4 text-center"
                  >
                    <div class="row">
                      <div class="col">
                        <figure
                          class="avatar ms-auto me-auto mb-0 position-relative w65"
                        >
                          <img
                            :src="
                              u?.media.length
                                ? env.BASEPOINT + u?.media?.[0].path
                                : env.NO_IMG_USER
                            "
                            alt="image"
                            class="float-right p-0 bg-white rounded-pill w-100 shadow-xss"
                          />
                        </figure>
                      </div>
                    </div>
                    <div class="clearfix"></div>
                    <h4 class="fw-700 font-xsss mt-3 mb-1">{{ u?.name }}</h4>
                    <p class="fw-500 font-xsssss text-grey-500 mt-0 mb-3">
                      {{ u?.email }}
                    </p>
                    <a
                      v-if="tab == 'new'"
                      :id="'btn_send_request_' + u._id"
                      :class="{ disabled: loadingTarget == u._id }"
                      role="button"
                      @click="sendRequest(u)"
                      class="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24 ms-1 ls-3 d-inline-block rounded-xl bg-success font-xsssss fw-700 ls-lg text-white"
                    >
                      <span v-if="loadingTarget !== u._id">ADD FRIEND</span>
                      <span
                        v-if="loadingTarget == u._id"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </a>
                    <a
                      v-if="tab == 'friends' || tab == 'pending'"
                      :id="'btn_remove_request_' + u._id"
                      :class="{ disabled: loadingTarget == u._id }"
                      role="button"
                      @click="confDel(u)"
                      class="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24 ms-1 ls-3 d-inline-block rounded-xl bg-danger font-xsssss fw-700 ls-lg text-white"
                    >
                      <span v-if="loadingTarget !== u._id">Remove</span>
                      <span
                        v-if="loadingTarget == u._id"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </a>
                    <a
                      v-if="tab == 'requests'"
                      :id="'btn_accept_request_' + u._id"
                      :class="{ disabled: loadingTarget == u._id }"
                      role="button"
                      @click="confAccept(u)"
                      class="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24 ms-1 ls-3 d-inline-block rounded-xl bg-info font-xsssss fw-700 ls-lg text-white"
                    >
                      <span v-if="loadingTarget !== u._id">Accept</span>
                      <span
                        v-if="loadingTarget == u._id"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="userResponse" class="row mt-2">
              <div class="col">
                <nav aria-label="...">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: page == 1 }">
                      <a
                        role="button"
                        class="page-link"
                        @click="
                          page = Number(page) - 1;
                          getData();
                        "
                        >Previous</a
                      >
                    </li>
                    <li
                      v-for="p in userResponse.data.pages"
                      :key="p"
                      class="page-item"
                      :class="{ active: page == Number(p) }"
                    >
                      <a
                        role="button"
                        class="page-link"
                        @click="
                          page = Number(p);
                          getData();
                        "
                        >{{ p }}</a
                      >
                    </li>
                    <li
                      class="page-item"
                      :class="{ disabled: userResponse.data.page == page }"
                    >
                      <a
                        role="button"
                        class="page-link"
                        @click="
                          page = Number(page) + 1;
                          getData();
                        "
                        >Next</a
                      >
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- main content -->
</template>

<style scoped>
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  padding: 10px;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: #f5f5f5;
}
</style>
