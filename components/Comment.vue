<script setup lang="ts">
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";
import type {ApiResponse, PaginatedApiResponse} from "~/types";
import UiPanel from "~/components/parts/ui-panel.vue";
import {env} from "~/helpers/env";

const props=defineProps(['target','target_id'])
const fd=reactive({
  comment:'',target:props?.target,target_id:props?.target_id
})
const loadingPost=ref(false)
const loadingComments=ref(false)
let createResp=ref<ApiResponse|null>()
let commentResp=ref<PaginatedApiResponse>()
let commentPage=ref<number>(1)
function postComment() {
  createResp.value=null
  loadingPost.value=true
  $fetch<ApiResponse>(endpoints.comment.create,{
    method:"post",
    headers:pitLib.util.headers(),
    body:fd
  }).then((d)=>{
    loadingPost.value=false
    createResp.value=d
  })
}
function loadComments() {
  loadingComments.value=true
  $fetch<ApiResponse>(endpoints.comment.index,{
    method:"post",
    headers:pitLib.util.headers(),
    body:{
      target:props?.target,target_id:props?.target_id
    },
    query:{page:commentPage.value}
  }).then((d)=>{
    loadingComments.value=false
    commentResp.value=d
  })
}
</script>

<template>
  <form @submit.prevent="postComment()">
    <div class="row">
      <ui-panel class="mt-2" ref="divResp" :type="createResp?.status?'success':'warning'" :content="createResp?.message" @show="createResp=$event" v-if="createResp?.message"></ui-panel>
      <div class="col-12">
        <textarea @click="createResp=null" v-model="fd.comment" class="form-control mb-0 p-3 h100 bg-greylight lh-16" rows="5" placeholder="Write your comment..." spellcheck="false"></textarea>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <button :id="'load_comment_btn_'+props.target_id" @click="loadComments()" :disabled="loadingComments" type="button" class="btn btn-primary rounded-pill text-white">
          <i v-if="!loadingComments" class="fa-solid fa-chevron-down"></i>
          <i v-if="loadingComments" class="fas fa-spinner fa-spin"></i>
        </button>
      </div>
      <div class="col text-right">
        <button type="submit" :disabled="loadingPost"  class="btn btn-primary btn-md text-white">
          <span v-if="loadingPost" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="!loadingPost">Post</span>
        </button>
      </div>
      <div class="row">
        <div class="col">
          <div class="position-relative" v-if="commentResp">
            <div class="_chat-wrapper pt-0 w-100 position-relative scroll-bar bg-white theme-dark-bg">
              <div class="chat-body p-3 ">
                <div class="messages-content pb-5">
                  <div class="message-item" v-for="c in commentResp?.data?.data">
                    <div class="message-user">
                      <figure class="avatar">
                        <img height="35" width="35" :src="env.NO_IMG" alt="image">
                      </figure>
                      <div>
                        <h5>{{c?.created_by?.[0]?.name}}</h5>
                        <div class="time">{{pitLib.dt.fromNow(c?.created_at)}}</div>
                      </div>
                    </div>
                    <div class="message-wrap">{{c?.comment}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentResp" class="row mt-2">
        <div class="col">
          <nav aria-label="...">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{'disabled':commentPage==1}">
                <a role="button" class="page-link" @click="commentPage=Number(commentPage)-1;loadComments()">Previous</a>
              </li>
              <li v-for="p in commentResp.data.pages" :key="p" class="page-item" :class="{ active: commentPage==Number(p) }">
                <a role="button" class="page-link" @click="commentPage=Number(p);loadComments()">{{p}}</a>
              </li>
              <li class="page-item" :class="{'disabled':commentResp.data.page==commentPage}">
                <a role="button" class="page-link" @click="commentPage=Number(commentPage)+1;loadComments()">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <q-linear-progress v-if="loadingComments" indeterminate color="primary" class="q-mt-sm mt-3" />
    </div>
  </form>
</template>

<style scoped></style>
