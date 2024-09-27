<script setup lang="ts">
import { endpoints } from "~/helpers/endpoints";
import type { ApiResponse, PaginatedApiResponse } from "~/types";
import { pitLib } from "~/helpers/pitLib";
import { env } from "~/helpers/env";
import { useSocket } from "~/composables/socket";
const friendsPage = ref<number>(1);
const peerId = ref<string>("");

const loadingUserChat = ref<true | false>(false);
const userChatResponse = ref<PaginatedApiResponse>();

const loadingSendMessage = ref<true | false>(false);
const sendMessageResponse = ref<ApiResponse>();

const userChatPage = ref<Number>(1);
const targetUser = ref();
const swal = useSwal();
const endOfMessages = ref();
const chatFormData = reactive({
  to: "",
  content: "",
});
const notifStore=useState(env.SOCKET_NOTIFICATION_RECEIVE)
const SOCKET_VIDEO_CALL_REC=useState(env.SOCKET_VIDEO_CALL_REC)
const router=useRouter()

const {
  data: friends,
  loading: loadingFriends,
  refresh: refetchFriends,
} = useFetch<PaginatedApiResponse>(endpoints.friend.index.my, {
  method: "post",
  headers: pitLib.util.headers(),
  server: false,
  query: { page: friendsPage },
});
watch(targetUser, (u) => {
  chatFormData.to = u?._id;
});
onMounted(() => {
  var peer = new Peer();
  // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  //
  // });
  peer.on("open", function (id: string) {
    peerId.value = id;
  });

  if (pitLib.auth.is()) {
    const socket = useSocket();
    socket.on("connect", () => {
      socket.on(env.SOCKET_MSG_RECEIVE, (msg: any) => {
        userChatResponse.value?.data?.data.push(JSON.parse(msg));
      });
      socket.on(env.SOCKET_NOTIFICATION_RECEIVE, (msg: any) => {
        notifStore.value=JSON.parse(msg);
      });
      socket.on(env.SOCKET_VIDEO_CALL_REC, (msg: any) => {
        const d=JSON.parse(msg);
        swal
            .fire({
              title: "Please pickup the call!",
              text: "Pickup or drop the call",
              icon: "error",
              showCancelButton: true,
              confirmButtonText: "Receive",
            })
            .then((result) => {
              if (result.isConfirmed) {
                router.push('/videocall/'+d._id)
              }
            });
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("error", (error: any) => {
      console.log(error);
    });

    socket.on("ping", () => {
      // ...
    });
  }
});

function getUserChat() {
  loadingUserChat.value = true;
  $fetch<PaginatedApiResponse>(endpoints.chat.index, {
    method: "post",
    headers: pitLib.util.headers(),
    body: {
      to: targetUser.value._id,
    },
    query: { page: userChatPage.value },
  }).then((d) => {
    userChatResponse.value = d;
    loadingUserChat.value = false;
    endOfMessages.value.scrollIntoView({ behavior: "smooth" });
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
      userChatResponse.value?.data?.data.push(d?.data);
      endOfMessages.value.scrollIntoView({ behavior: "smooth" });
      chatFormData.content = "";
    }
  });
}
function initiateCall(u:any) {
  $fetch<ApiResponse>(endpoints.videocall.create,{
    method:"post",
    headers:pitLib.util.headers(),
    body:{
      target_id:u._id
    }
  }).then((d)=>{
    if(d.status) {
      router.push("/videocall/"+d.data._id)
    }
  })
}
</script>

<template>
  <div class="right-chat nav-wrap mt-2 right-scroll-bar">
    <div
      class="middle-sidebar-right-content bg-white shadow-xss rounded-xxl h-100"
    >
      <div class="section full pe-3 ps-4 pt-4 position-relative feed-body">
        <h4 class="font-xsssss text-grey-500 text-uppercase fw-700 ls-3">
          Friends
        </h4>
        <ul
          class="list-group list-group-flush"
          v-if="friends?.data?.data.length"
        >
          <li
            v-for="u in friends?.data?.data"
            class="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center"
          >
            <figure class="avatar float-left mb-0 me-2">
              <img
                :src="
                  u?.media.length
                    ? env.BASEPOINT + u?.media?.[0].path
                    : env.NO_IMG_USER
                "
                alt="image"
                class="w35"
              />
            </figure>
            <NuxtLink
              v-if="peerId"
              class="btn btn-link text-primary"
              @click.prevent="initiateCall(u)"
            >
              <i class="fa-solid fa-video"></i>
            </NuxtLink>

            <h3 class="fw-700 mb-0 mt-0">
              <a
                role="button"
                @click="
                  targetUser = u;
                  getUserChat();
                "
                class="font-xssss text-grey-600 d-block text-dark model-popup-chat"
                >{{ u?.name }}</a
              >
            </h3>
            <!--            <span class="badge badge-primary text-white badge-pill fw-500 mt-0">2</span>-->
          </li>
          <!--          <li class="bg-transparent list-group-item no-icon pe-0 ps-0 pt-2 pb-2 border-0 d-flex align-items-center">-->
          <!--            <figure class="avatar float-left mb-0 me-2">-->
          <!--              <img src="/tpl1/images/user-7.png" alt="image" class="w35">-->
          <!--            </figure>-->
          <!--            <h3 class="fw-700 mb-0 mt-0">-->
          <!--              <a class="font-xssss text-grey-600 d-block text-dark model-popup-chat" href="#">Victor Exrixon</a>-->
          <!--            </h3>-->
          <!--            <span class="bg-success ms-auto btn-round-xss"></span>-->
          <!--          </li>-->
        </ul>
        <div v-if="friends?.data?.data.length" class="row mt-2">
          <div class="col">
            <nav aria-label="...">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: friendsPage == 1 }">
                  <a
                    role="button"
                    class="page-link"
                    @click="
                      friendsPage = Number(friendsPage) - 1;
                      refetchFriends();
                    "
                    >Previous</a
                  >
                </li>
                <li
                  v-for="p in friends.data.pages"
                  :key="p"
                  class="page-item"
                  :class="{ active: friendsPage == Number(p) }"
                >
                  <a
                    role="button"
                    class="page-link"
                    @click="
                      friendsPage = Number(p);
                      refetchFriends();
                    "
                    >{{ p }}</a
                  >
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: friends.data.page == friendsPage }"
                >
                  <a
                    role="button"
                    class="page-link"
                    @click="
                      friendsPage = Number(friendsPage) + 1;
                      refetchFriends();
                    "
                    >Next</a
                  >
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="text-center" v-if="!friends?.data?.data.length">
          <div class="row">
            <div class="col"></div>
            <div class="col">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6207/6207570.png"
                class="img-fluid"
              />
            </div>
            <div class="col"></div>
          </div>
          <h3 class="text-info">Its alone here.</h3>
          <NuxtLink to="/me/friends" class="btn btn-link"
            >Get Some Friends</NuxtLink
          >
        </div>
      </div>
    </div>
  </div>
  <div class="modal-popup-chat" :class="{ 'd-block': targetUser }">
    <div class="modal-popup-wrap bg-white p-0 shadow-lg rounded-3">
      <div class="modal-popup-header w-100 border-bottom">
        <div class="card p-3 d-block border-0 d-block">
          <figure class="avatar mb-0 float-left me-2">
            <img
              :src="
                targetUser?.media.length
                  ? env.BASEPOINT + targetUser?.media?.[0].path
                  : env.NO_IMG_USER
              "
              alt="image"
              class="w35 me-1"
            />
          </figure>
          <h5 class="fw-700 text-primary font-xssss mt-1 mb-1">
            {{ targetUser?.name }}
          </h5>
          <!--          <h4 class="text-grey-500 font-xsssss mt-0 mb-0"><span class="d-inline-block bg-success btn-round-xss m-0"></span> Available</h4>-->
          <a
            role="button"
            @click="targetUser = null"
            class="font-xssss position-absolute right-0 top-0 mt-3 me-4"
            ><i class="ti-close text-grey-900 mt-2 d-inline-block"></i
          ></a>
        </div>
      </div>
      <div class="box shimmer" v-if="loadingUserChat">
        <div class="lines">
          <div class="lines s_shimmer"></div>
        </div>
      </div>
      <div
        style="max-height: 200px !important"
        class="modal-popup-body w-100 p-3 scroll-x"
        v-if="!loadingUserChat && userChatResponse"
      >
        <div v-for="m in userChatResponse?.data?.data">
          <div v-if="m?.created_by?.[0]?._id !== pitLib.auth.get()?._id">
            <div class="message">
              <div class="message-content font-xssss lh-24 fw-500">
                {{ m?.content }}
              </div>
            </div>
            <div
              class="date-break font-xsssss lh-24 fw-500 text-grey-500 mt-2 mb-2 text-left"
            >
              {{ pitLib.dt.fromNow(m?.created_at) }}
            </div>
          </div>
          <div v-if="m?.created_by?.[0]?._id === pitLib.auth.get()?._id">
            <div class="message self text-right mt-2">
              <div class="message-content font-xssss lh-24 fw-500">
                {{ m?.content }}
              </div>
            </div>
            <div
              class="date-break font-xsssss lh-24 fw-500 text-grey-500 mt-2 mb-2 text-right"
            >
              {{ pitLib.dt.fromNow(m?.created_at) }}
            </div>
          </div>
        </div>
        <div ref="endOfMessages"></div>
        <div class="clearfix"></div>
      </div>
      <div class="modal-popup-footer w-100 border-top">
        <div class="card p-3 d-block border-0 d-block">
          <div class="form-group icon-right-input style1-input mb-0">
            <input
              v-on:keyup.enter="send()"
              v-model="chatFormData.content"
              type="text"
              placeholder="Start typing.."
              class="form-control rounded-xl bg-greylight border-0 font-xssss fw-500 ps-3"
            />
            <i
              @click="send()"
              v-if="!loadingSendMessage"
              role="button"
              class="fa-regular fa-paper-plane text-grey-500 font-md"
            ></i>
            <i
              v-if="loadingSendMessage"
              class="fa-solid fa-spinner fa-spin-pulse"
              role="status"
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
