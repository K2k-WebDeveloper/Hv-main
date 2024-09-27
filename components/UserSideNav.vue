<script setup lang="ts">
</script>

<template>
  <!-- navigation left -->
  <nav class="navigation scroll-bar">
    <div class="container ps-0 pe-0">
      <div class="nav-content">
        <div class="nav-wrap rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
          <div class="nav-caption fw-600 font-xssss text-grey-500"><span>New </span>Feeds</div>
          <ul class="mb-1 top-content">
            <li class="logo d-none d-xl-block d-lg-block"></li>
            <li><NuxtLink to="/veganlog" active-class="active" class="nav-content-bttn open-font"><img class="w40 rounded-circle" src="/images/vlog.jpeg"> <span class="ms-2">Vegan Log</span></NuxtLink></li>
            <li><NuxtLink to="/reel" active-class="active" class="nav-content-bttn open-font"><img class="w40 rounded-circle" src="/images/reel.jpg"><span class="ms-2">Reels</span></NuxtLink></li>
            <li><NuxtLink to="/blog" active-class="active" class="nav-content-bttn open-font"><img class="w40 rounded-circle" src="/images/blog.jpeg"><span class="ms-2">Blog</span></NuxtLink></li>
            <li><NuxtLink to="/news" active-class="active" class="nav-content-bttn open-font"><img class="w40 rounded-circle" src="/images/news.jpeg"><span class="ms-2">News</span></NuxtLink></li>
            <li><NuxtLink to="/event" active-class="active" class="nav-content-bttn open-font"><img class="w40 rounded-circle" src="/images/event.jpeg"><span class="ms-2">Event</span></NuxtLink></li>
            <li><NuxtLink to="/recipe" active-class="active" class="nav-content-bttn open-font"><img class="w40 rounded-circle" src="/images/recipe.jpeg"><span class="ms-2">Recipe</span></NuxtLink></li>
            
<!--            <li><NuxtLink to="/recipe" active-class="active" class="nav-content-bttn open-font"><i class="fa-solid fa-bowl-food btn-round-md bg-blue-gradiant me-3"></i><span>Recipe</span></NuxtLink></li>-->
          </ul>
        </div>

        <div class="nav-wrap rounded-xxl shadow-xss pt-3 pb-1 mb-2">
          <div class="nav-caption fw-600 font-xssss text-grey-500"><span>Recommendations</span></div>
          <ul class="mb-3">
<!--            <li><a href="default-email-box.html" class="nav-content-bttn open-font"><i class="font-xl text-current feather-inbox me-3"></i><span>Email Box</span><span class="circle-count bg-warning mt-1">584</span></a></li>-->
<li><NuxtLink to="/recommendation/restaurants" active-class="active" class="nav-content-bttn open-font"><img src="/tpl1/images/resturant.jpg" style="height: 40px; border-radius: 100%;" class=" font-xl text-current me-3"></img><span>Restaurants</span></NuxtLink></li>
            <li><NuxtLink to="https://vegan-vegan-club.com" active-class="active" class="nav-content-bttn open-font"><img src="/tpl1/images/vegan-club.jpg" style="height: 40px; border-radius: 100%;" class=" font-xl text-current me-3"></img><span>Join Our Club</span></NuxtLink></li>
            <li><NuxtLink to="https://vegan-dietitian.com" active-class="active" class="nav-content-bttn open-font"><img src="/tpl1/images/dietian.jpg" style="height:40px; border-radius: 100%; " class=" font-xl text-current me-3"></img><span>Plan Vegan Diet</span></NuxtLink></li>   
          </ul>
        </div>
        <div class="nav-wrap rounded-xxl shadow-xss pt-3 pb-1">
          <div class="nav-caption fw-600 font-xssss text-grey-500"><span></span> Account</div>
          <ul class="mb-1">
            <li class="logo d-none d-xl-block d-lg-block"></li>
            <li><NuxtLink to="/me/account" class="nav-content-bttn open-font h-auto pt-2 pb-2"><i class="font-sm feather-settings me-3 text-grey-500"></i><span>Account</span></NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <!-- navigation left -->
</template>

<style>

</style>
