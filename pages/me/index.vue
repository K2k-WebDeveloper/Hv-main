<script setup lang="ts">
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
const loadingLogOut = ref(false);

function logout() {
  loadingLogOut.value = true;
  $fetch<ApiResponse>(endpoints.user.logout, {
    method: "post",
    headers: pitLib.util.headers(),
  }).then((d) => {
    if (d.status) {
      pitLib.auth.clear();
      navigateTo("/login");
    } else {
      pitLib.swal({
        title: d.message,
        icon: "warning",
        position: "top-right",
        timer: 2500,
      });
    }
    loadingLogOut.value = false;
  });
}

function deleteAccount() {
  // loadingLogOut.value = true;
  $fetch<ApiResponse>(endpoints.user.logout, {
    method: "post",
    headers: pitLib.util.headers(),
  }).then((d) => {
    if (d.status) {
      pitLib.auth.clear();
      navigateTo("/login");
    } else {
      pitLib.swal({
        title: d.message,
        icon: "warning",
        position: "top-right",
        timer: 2500,
      });
    }
    // loadingLogOut.value = false;
  });
}
</script>

<template>
  <!-- main content -->
  <div class="main-content bg-lightblue theme-dark-bg right-chat-active">
    <div class="middle-sidebar-bottom">
      <div class="middle-sidebar-left">
        <div class="middle-wrap">
          <div class="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
            <div class="card-body p-lg-5 p-4 w-100 border-0">
              <div class="row">
                <div class="col-lg-12">
                  <h4
                    class="mb-4 font-xxl fw-700 mont-font mb-lg-5 mb-4 font-md-xs"
                  >
                    Settings
                  </h4>
                  <div class="nav-caption fw-600 font-xssss text-grey-500 mb-2">
                    Genaral
                  </div>
                  <ul class="list-inline mb-4">
                    <li class="list-inline-item d-block border-bottom me-0">
                      <NuxtLink
                        to="/me/account"
                        class="pt-2 pb-2 d-flex align-items-center"
                      >
                        <i
                          class="btn-round-md bg-gold-gradiant text-white fa-solid fa-address-card font-md me-3"
                        ></i>
                        <h4 class="fw-600 font-xsss mb-0 mt-0">Account</h4>
                        <i
                          class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"
                        ></i>
                      </NuxtLink>
                    </li>
                    <li class="list-inline-item d-block border-bottom me-0">
                      <NuxtLink
                        to="/me/friends"
                        class="pt-2 pb-2 d-flex align-items-center"
                        ><i
                          class="btn-round-md bg-gold-gradiant text-white fa-solid fa-user-group font-md me-3"
                        ></i>
                        <h4 class="fw-600 font-xsss mb-0 mt-0">Friends</h4>
                        <i
                          class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"
                        ></i
                      ></NuxtLink>
                    </li>
                  </ul>

                  <div class="nav-caption fw-600 font-xsss text-grey-500 mb-2">
                    Acount
                  </div>
                  <ul class="list-inline mb-4">
                    <li class="list-inline-item d-block border-bottom me-0">
                      <a
                        href="payment.html"
                        class="pt-2 pb-2 d-flex align-items-center"
                        ><i
                          class="btn-round-md bg-mini-gradiant text-white feather-credit-card font-md me-3"
                        ></i>
                        <h4 class="fw-600 font-xsss mb-0 mt-0">My Cards</h4>
                        <i
                          class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"
                        ></i
                      ></a>
                    </li>
                  </ul>

                  <div class="nav-caption fw-600 font-xsss text-grey-500 mb-2">
                    Other
                  </div>
                  <ul class="list-inline">
                    <li class="list-inline-item d-block me-0">
                      <a
                        role="button"
                        @click="logout()"
                        class="pt-2 pb-2 d-flex align-items-center"
                        ><i
                          class="btn-round-md bg-red-gradiant text-white feather-lock font-md me-3"
                        ></i>
                        <h4 class="fw-600 font-xsss mb-0 mt-0">
                          <span
                            v-if="loadingLogOut"
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span v-if="!loadingLogOut">Logout</span>
                        </h4>
                        <i
                          class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"
                        ></i
                      ></a>
                    </li>

                    <li class="list-inline-item d-block me-0">
                      <a
                        role="button"
                        @click="deleteAccount()"
                        class="pt-2 pb-2 d-flex align-items-center"
                        ><i
                          class="btn-round-md bg-red-gradiant text-white feather-lock font-md me-3"
                        ></i>
                        <h4 class="fw-600 font-xsss mb-0 mt-0">
                          <span
                            v-if="loadingLogOut"
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span>Delete My Account</span>
                        </h4>
                        <i
                          class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"
                        ></i
                      ></a>
                    </li>
                  </ul>
                </div>
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


