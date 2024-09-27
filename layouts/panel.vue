<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: ['nav-fixed'].join(" "),
    // id:'kt_app_body'
  },
  link: [
    // { rel: 'stylesheet', href: '/panel/css/style.min.css' },
    { rel: 'stylesheet', href: '/panel/css/style.css' },
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.css' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css' },
  ],
  script: [
    {src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',body:true},
    {src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/js/all.min.js',},
    // {src: 'https://unpkg.com/feather-icons',},
    {src: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js',body:true},
    {src: '/panel/js/chart-area-demo.js',body:true},
    {src: '/panel/js/chart-pie-demo.js',body:true},
    {src: 'https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js',},
    {src: '/panel/js/datatables-simple-demo.js',},
    {src: '/panel/js/scripts.js',body:true},
    {src: 'https://cdn.ckeditor.com/4.21.0/standard/ckeditor.js', defer: true, body: true},
    {src: 'https://cdn.jsdelivr.net/npm/@yaireo/tagify', body: true},
    {src: 'https://cdn.jsdelivr.net/npm/@yaireo/tagify/dist/tagify.polyfills.min.js', body: true},
    {src: 'https://cdn.ckeditor.com/4.21.0/standard/ckeditor.js', defer: true, body: true},
  ],
});
</script>

<template>
  <PanelTopNav></PanelTopNav>
  <div id="layoutSidenav">
    <PanelSideNav></PanelSideNav>
    <div id="layoutSidenav_content">
      <main>
        <slot></slot>
      </main>
      <footer class="footer-admin mt-auto footer-light">
        <div class="container-xl px-4">
          <div class="row">
            <div class="col-md-6 small">Copyright © Your Website 2021</div>
            <div class="col-md-6 text-md-end small">
              <a href="#!">Privacy Policy</a>
              ·
              <a href="#!">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped></style>
