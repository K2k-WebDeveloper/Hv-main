<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: ['app-default'].join(" "),
    id:'kt_app_body'
  },
  link: [
    { rel: 'stylesheet', href: '/tpl1/css/themify-icons.css' },
    { rel: 'stylesheet', href: '/tpl1/css/feather.css' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css' },
    { rel: 'stylesheet', href: '/tpl1/css/style.css' },
    { rel: 'stylesheet', href: '/tpl1/css/emoji.css' },
    { rel: 'stylesheet', href: '/tpl1/css/lightbox.css' },
    { rel: 'stylesheet', href: '/tpl1/css/custom.css' },
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.css' },
  ],
  script: [
    {src: '/tpl1/js/plugin.js', body: true},
    {src: '/tpl1/js/lightbox.js', body: true},
    {src: '/tpl1/js/scripts.js', body: true},
    {src: 'https://cdn.jsdelivr.net/npm/@yaireo/tagify', body: true},
    {src: 'https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.polyfills.min.js', body: true},
    {src: 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js', body: true},
    {src: 'https://cdn.ckeditor.com/4.21.0/standard/ckeditor.js', defer: true, body: true},
    // {src: 'https://cdn.socket.io/4.0.0/socket.io.min.js', body: true},
  ]
});

</script>

<template>


  <div class="main-wrapper">

    <UserTopNav></UserTopNav>

    <UserSideNav></UserSideNav>
    <slot></slot>

    <!-- right chat -->
      <RightChatPanel></RightChatPanel>
    <!-- right chat -->

    <div class="app-footer border-0 shadow-lg bg-primary-gradiant">
      <a href="default.html" class="nav-content-bttn nav-center"><i class="feather-home"></i></a>
      <a href="default-video.html" class="nav-content-bttn"><i class="feather-package"></i></a>
      <a href="default-live-stream.html" class="nav-content-bttn" data-tab="chats"><i class="feather-layout"></i></a>
      <a href="shop-2.html" class="nav-content-bttn"><i class="feather-layers"></i></a>
      <NuxtLink to="/me" class="nav-content-bttn"><img src="/tpl1/images/female-profile.png" alt="user" class="w30 shadow-xss"></NuxtLink>
    </div>

    <div class="app-header-search">
      <form class="search-form">
        <div class="form-group searchbox mb-0 border-0 p-1">
          <input type="text" class="form-control border-0" placeholder="Search...">
          <i class="input-icon">
            <ion-icon name="search-outline" role="img" class="md hydrated" aria-label="search outline"></ion-icon>
          </i>
          <a href="#" class="ms-1 mt-1 d-inline-block close searchbox-close">
            <i class="ti-close font-xs"></i>
          </a>
        </div>
      </form>
    </div>

  </div>

  <div class="modal bottom side fade" id="Modalstory" tabindex="-1" role="dialog" style=" overflow-y: auto;">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content border-0 bg-transparent">
        <button type="button" class="close mt-0 position-absolute top--30 right--10" data-dismiss="modal" aria-label="Close"><i class="ti-close text-grey-900 font-xssss"></i></button>
        <div class="modal-body p-0">
          <div class="card w-100 border-0 rounded-3 overflow-hidden bg-gradiant-bottom bg-gradiant-top">
            <div class="owl-carousel owl-theme dot-style3 story-slider owl-dot-nav nav-none">
              <div class="item"><img src="/tpl1/images/story-5.jpg" alt="image"></div>
              <div class="item"><img src="/tpl1/images/story-6.jpg" alt="image"></div>
              <div class="item"><img src="/tpl1/images/story-7.jpg" alt="image"></div>
              <div class="item"><img src="/tpl1/images/story-8.jpg" alt="image"></div>

            </div>
          </div>
          <div class="form-group mt-3 mb-0 p-3 position-absolute bottom-0 z-index-1 w-100">
            <input type="text" class="style2-input w-100 bg-transparent border-light-md p-3 pe-5 font-xssss fw-500 text-white" value="Write Comments">
            <span class="feather-send text-white font-md text-white position-absolute" style="bottom: 35px;right:30px;"></span>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped></style>
