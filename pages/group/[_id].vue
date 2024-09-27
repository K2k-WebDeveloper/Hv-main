<script setup lang="ts">
import type { ApiResponse, PaginatedApiResponse } from "~/types";
import { endpoints } from "~/helpers/endpoints";
import { pitLib } from "~/helpers/pitLib";
import { Vue3Lottie } from "vue3-lottie";
import { env } from "~/helpers/env";
import { useSocket } from "~/composables/socket";

definePageMeta({
  layout: "default",
  middleware: "ensure-login"
});
const page = ref(1);
const route = useRoute();
const loadingUserChat = ref<true | false>(false);
const userChatResponse = ref<PaginatedApiResponse>();
const userChatPage = ref<Number>(1);
const endOfMessages = ref();
const loadingSendMessage = ref<true | false>(false);
const sendMessageResponse = ref<ApiResponse>();
const chatFormData = reactive({
  to: route.params._id,
  content: '',
  type: 'g'
});

function getUserChat() {
  loadingUserChat.value = true;
  $fetch<PaginatedApiResponse>(endpoints.chat.index, {
    method: "post",
    headers: pitLib.util.headers(),
    body: {
      to: route.params._id
    },
    query: { page: userChatPage.value, group: 1 }
  }).then((d) => {
    userChatResponse.value = d;
    loadingUserChat.value = false;
    endOfMessages.value.scrollIntoView({ behavior: 'smooth' });
  });
}

function send() {
  if (!chatFormData.content) {
    return;
  }
  loadingSendMessage.value = true;
  $fetch<ApiResponse>(endpoints.chat.create, {
    method: "post",
    headers: pitLib.util.headers(),
    body: chatFormData,
  }).then((d) => {
    sendMessageResponse.value = d;
    loadingSendMessage.value = false;

    if (d.status) {
      // userChatResponse.value?.data?.data.push(d?.data)
      endOfMessages.value.scrollIntoView({ behavior: 'smooth' });
      chatFormData.content = '';
      console.log(userChatResponse.value?.data);
    }
  });
}

onMounted(() => {
  getUserChat();
  if (pitLib.auth.is()) {
    const socket = useSocket();
    socket.on('connect', () => {
      socket.on(env.SOCKET_MSG_RECEIVE + route.params._id, (msg: any) => {
        userChatResponse.value?.data?.data.push(JSON.parse(msg));
      });
    });
  }
});
</script>

<template>
  <div class="main-content right-chat-active w-75 " style="display: flex; justify-content: center; margin-left: 10%;">
    <div class="middle-sidebar-bottom w-100 bg-grey">
      <div class="middle-sidebar-left pe-0 ps-lg-3 ms-0 me-0 w-100" style="max-width: 100%;">
        <div class="row w-100">
          <div class="col-lg-12 position-relative w-100">
            <div class="chat-wrapper pt-0 w-100 position-relative scroll-bar bg-white theme-dark-bg">
              <div class="chat-body p-3 ">
                <div class="messages-content pb-5">
                  
                  <div v-for="m in userChatResponse?.data?.data" :key="m._id" class="w-100">
                    
                    <div v-if="m?.created_by?.[0]?._id !== pitLib.auth.get()?._id" class="message-item message-left flex-column">
                      <div class="message-user">
                        <figure class="avatar">
                          <img :src="m?.created_by?.[0]?.media.length ? env.BASEPOINT + m?.created_by?.[0]?.media?.[0].path : env.NO_IMG_USER" alt="image">
                        </figure>
                        <br>
                        <div>
                          <h5>{{ m?.created_by?.[0]?.name }}</h5>
                          <div class="time">{{ pitLib.dt.fromNow(m?.created_at) }}</div>
                        </div>
                        <br>
                      </div>
                      
                      <div class="message-wrap bg-blue" >{{ m?.content }}</div>
                    </div>


                    <div v-if="m?.created_by?.[0]?._id === pitLib.auth.get()?._id" class="message-item message-right ">
                      <div class=" flex-column-reverse">
                      
                      <div class="message-user">
                        
                        <div>
                          <h5>{{ m?.created_by?.[0]?.name }}</h5>
                          <div class="time">{{ pitLib.dt.fromNow(m?.created_at) }}</div>
                        </div>
                        <figure class="avatar">
                          <img :src="m?.created_by?.[0]?.media.length ? env.BASEPOINT + m?.created_by?.[0]?.media?.[0].path : env.NO_IMG_USER" alt="image">
                        </figure>
                      </div>
                      <div class="message-wrap bg-blue-100" >{{ m?.content }}</div>
                      
                    </div>
                  </div>
                  </div>

                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div class="card p-3 d-block border-0 d-block w-100 right-10">
              <div class="form-group icon-right-input style1-input mb-0">
                <input v-on:keyup.enter="send()" v-model="chatFormData.content" type="text" placeholder="Start typing.." class="form-control rounded-xl bg-greylight border-0 font-xssss fw-500 ps-3">
                <i @click="send()" v-if="!loadingSendMessage" role="button" class="fa-regular fa-paper-plane text-grey-500 font-md"></i>
                <i v-if="loadingSendMessage" class="fa-solid fa-spinner fa-spin-pulse" role="status" aria-hidden="true"></i>
              </div>
            </div>
            <div ref="endOfMessages"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  clear: both;
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

.message-left {
  justify-content: flex-start;
  margin-right: auto; /* Align left */
  display: flex;
  max-width: 60%;
}

.message-right {
  justify-content: flex-end;
  margin-left: auto; /* Align right */
  display: flex;
  max-width: 60%;
  text-align: right;
}

.message-wrap {
  margin: 5px 0;
  padding: 10px 15px;
  border-radius: 15px;
}

.message-left .message-wrap {
  background-color: #f1f1f1;
}

.message-right .message-wrap {
  background-color: #007bff;
  color: white;
}

.avatar {
  margin-right: 10px;
}

.message-left .avatar {
  margin-right: 10px;
}

.message-right .avatar {
  margin-left: 10px;
}

.message-user {
  display: flex;
  align-items: center;
}

.time {
  font-size: 0.8rem;
  color: gray;
}

.clearfix {
  clear: both;
}

.chat-wrapper {
  overflow-y: scroll;
  height: 80vh;
  padding: 10px;
}

</style>
