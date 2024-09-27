<script setup lang="ts">
import {pitLib} from "../helpers/pitLib";

const route=useRoute()
</script>

<template>
  <div id="layoutSidenav_nav">
    <nav class="sidenav shadow-right sidenav-light">
      <div class="sidenav-menu">
        <div class="nav accordion" id="accordionSidenav">
          <!-- Sidenav Menu Heading (Account)-->
          <!-- * * Note: * * Visible only on and above the sm breakpoint-->
          <div class="sidenav-menu-heading d-sm-none">Account</div>
          <!-- Sidenav Link (Alerts)-->
          <!-- * * Note: * * Visible only on and above the sm breakpoint-->
          <a class="nav-link d-sm-none" href="#!">
            <div class="nav-link-icon"><i class="fa-solid fa-lg fa-bell"></i></div>
            Alerts
            <span class="badge bg-warning-soft text-warning ms-auto">4 New!</span>
          </a>
          <!-- Sidenav Link (Messages)-->
          <!-- * * Note: * * Visible only on and above the sm breakpoint-->
          <a class="nav-link d-sm-none" href="#!">
            <div class="nav-link-icon"><i class="fa-solid fa-lg fa-envelope"></i></div>
            Messages
            <span class="badge bg-success-soft text-success ms-auto">2 New!</span>
          </a>
<!--          &lt;!&ndash; Sidenav Menu Heading (Core)&ndash;&gt;-->
<!--          <div class="sidenav-menu-heading">Core</div>-->
<!--          &lt;!&ndash; Sidenav Accordion (Dashboard)&ndash;&gt;-->
<!--          <a class="nav-link" :class="{'collapsed':!route.path.includes('approval')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseDashboards" aria-expanded="false" aria-controls="collapseDashboards">-->
<!--            <div class="nav-link-icon"><i class="fa-solid fa-lg fa-chart-line"></i></div>-->
<!--            Approvals-->
<!--            <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>-->
<!--          </a>-->
<!--          <div class="collapse" :class="{'show':route.path.includes('approval')}" id="collapseDashboards" data-bs-parent="#accordionSidenav">-->
<!--            <nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPages">-->
<!--              <NuxtLink class="nav-link" :class="{'active':route.path.includes('approval/veganlog')}" to="/panel/approval/veganlog">-->
<!--                Vegan Log-->
<!--                <span class="badge bg-primary-soft text-primary ms-auto">Updated</span>-->
<!--              </NuxtLink>-->
<!--              <NuxtLink class="nav-link" :class="{'active':route.path.includes('approval/blog')}" to="/panel/approval/blog">-->
<!--                Blog-->
<!--              </NuxtLink>-->
<!--            </nav>-->
<!--          </div>-->
<!--          &lt;!&ndash; Sidenav Heading (Custom)&ndash;&gt;-->
          <div class="sidenav-menu-heading">Modules</div>
          <!-- Sidenav Accordion (Pages)-->
          <a class="nav-link" :class="{'collapsed':!route.path.includes('panel/blog/')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
            <div class="nav-link-icon"><i class="fa-regular fa-file-lines"></i></div>
            Blogs
            <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
          </a>
          <div class="collapse" :class="{'show':route.path.includes('panel/blog/category')}" id="collapsePages" data-bs-parent="#accordionSidenav">
            <nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu">
              <!-- Nested Sidenav Accordion (Pages -> Account)-->
              <a class="nav-link" :class="{'collapsed':!route.path.includes('panel/blog/')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#pagesCollapseAccount" aria-expanded="false" aria-controls="pagesCollapseAccount">
                Categories
                <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
              </a>
              <div class="collapse" :class="{'show':route.path.includes('panel/blog/category')}" id="pagesCollapseAccount" data-bs-parent="#accordionSidenavPagesMenu">
                <nav class="sidenav-menu-nested nav">
                  <NuxtLink :class="{'active':route.path.endsWith('/blog/category')}" class="nav-link" to="/panel/blog/category">List</NuxtLink>
                  <NuxtLink :class="{'active':route.path.endsWith('/blog/category/create')}" class="nav-link" to="/panel/blog/category/create">Create</NuxtLink>
                </nav>
              </div>

              <NuxtLink class="nav-link" :class="{'active':route.path.endsWith('panel/blog')}" to="/panel/blog">List</NuxtLink>
            </nav>
          </div>


          <a class="nav-link" :class="{'collapsed':!route.path.includes('panel/recipe/')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseRecipe" aria-expanded="false" aria-controls="collapseRecipe">
            <div class="nav-link-icon"><i class="fa-regular fa-burger"></i></div>
            Recipe
            <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
          </a>
          <div class="collapse" :class="{'show':route.path.includes('panel/recipe/category')}" id="collapseRecipe" data-bs-parent="#accordionSidenav">
            <nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu">
              <!-- Nested Sidenav Accordion (Pages -> Account)-->
              <a class="nav-link" :class="{'collapsed':!route.path.includes('panel/recipe/')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#pagesCollapseAccount" aria-expanded="false" aria-controls="pagesCollapseAccount">
                Categories
                <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
              </a>
              <div class="collapse" :class="{'show':route.path.includes('panel/recipe/category')}" id="pagesCollapseAccount" data-bs-parent="#accordionSidenavPagesMenu">
                <nav class="sidenav-menu-nested nav">
                  <NuxtLink :class="{'active':route.path.endsWith('/recipe/category')}" class="nav-link" to="/panel/recipe/category">List</NuxtLink>
                  <NuxtLink :class="{'active':route.path.endsWith('/recipe/category/create')}" class="nav-link" to="/panel/recipe/category/create">Create</NuxtLink>
                </nav>
              </div>

              <NuxtLink class="nav-link" :class="{'active':route.path.endsWith('panel/recipe')}" to="/panel/recipe">List</NuxtLink>
            </nav>
          </div>


          <!-- Sidenav Link (Tables)-->
          <NuxtLink class="nav-link" :class="{'active':route.path.endsWith('panel/veganlog')}" to="/panel/veganlog">
            <div class="nav-link-icon"><i class="fa-solid fa-lg fa-outdent"></i></div>
            Veganlog
          </NuxtLink>

          <a class="nav-link" :class="{'collapsed':!route.path.includes('panel/news/')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseNews" aria-expanded="false" aria-controls="collapseNews">
            <div class="nav-link-icon"><i class="fa-regular fa-file-lines"></i></div>
            News
            <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
          </a>
          <div class="collapse" :class="{'show':route.path.includes('panel/news')}" id="collapseNews" data-bs-parent="#accordionSidenav">
            <nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu">
              <a class="nav-link" :class="{'collapsed':!route.path.includes('news/category')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#newsCategoryCollapse" aria-expanded="false" aria-controls="newsCategoryCollapse">
                Categories
                <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
              </a>
              <div class="collapse" :class="{'show':route.path.includes('panel/news/category')}" id="newsCategoryCollapse" data-bs-parent="#accordionSidenavPagesMenu">
                <nav class="sidenav-menu-nested nav">
                  <NuxtLink :class="{'active':route.path.endsWith('/news/category/')}" class="nav-link" to="/panel/news/category/">List</NuxtLink>
                  <NuxtLink :class="{'active':route.path.endsWith('/news/category/create')}" class="nav-link" to="/panel/news/category/create">Create</NuxtLink>
                </nav>
              </div>
              <NuxtLink :class="{'active':route.path.endsWith('/panel/news')}" class="nav-link" to="/panel/news">List</NuxtLink>
              <NuxtLink :class="{'active':route.path.includes('/panel/news/create')}" class="nav-link" to="/panel/news/create">Create</NuxtLink>
            </nav>
          </div>

          <a class="nav-link" :class="{'collapsed':!route.path.includes('panel/event/')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseEvent" aria-expanded="false" aria-controls="collapseEvent">
            <div class="nav-link-icon"><i class="fa-regular fa-calendar-days"></i></div>
            Event
            <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
          </a>
          <div class="collapse" :class="{'show':route.path.includes('panel/event')}" id="collapseEvent" data-bs-parent="#accordionSidenav">
            <nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu">
              <a class="nav-link" :class="{'collapsed':!route.path.includes('event/category')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#eventCategoryCollapse" aria-expanded="false" aria-controls="eventCategoryCollapse">
                Categories
                <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
              </a>
              <div class="collapse" :class="{'show':route.path.includes('panel/event/category')}" id="eventCategoryCollapse" data-bs-parent="#accordionSidenavPagesMenu">
                <nav class="sidenav-menu-nested nav">
                  <NuxtLink :class="{'active':route.path.endsWith('/event/category/')}" class="nav-link" to="/panel/event/category/">List</NuxtLink>
                  <NuxtLink :class="{'active':route.path.endsWith('/event/category/create')}" class="nav-link" to="/panel/event/category/create">Create</NuxtLink>
                </nav>
              </div>
              <NuxtLink :class="{'active':route.path.endsWith('/panel/event')}" class="nav-link" to="/panel/event">List</NuxtLink>
<!--              <NuxtLink :class="{'active':route.path.includes('/panel/event/create')}" class="nav-link" to="/panel/event/create">Create</NuxtLink>-->
            </nav>
          </div>

          <a class="nav-link" :class="{'collapsed':!route.path.includes('panel/restaurant/')}" href="javascript:void(0);" data-bs-toggle="collapse" data-bs-target="#collapseRestaurant" aria-expanded="false" aria-controls="collapseRestaurant">
            <div class="nav-link-icon"><i class="fa-solid fa-utensils"></i></div>
            Restaurant
            <div class="sidenav-collapse-arrow"><i class="fa-solid fa-angle-down"></i></div>
          </a>
          <div class="collapse" :class="{'show':route.path.includes('panel/restaurant')}" id="collapseRestaurant" data-bs-parent="#accordionSidenav">
            <nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPagesMenu">
              <NuxtLink :class="{'active':route.path.endsWith('/panel/restaurant/category')}" class="nav-link" to="/panel/restaurant/category">Category</NuxtLink>
              <NuxtLink :class="{'active':route.path.endsWith('/panel/restaurant')}" class="nav-link" to="/panel/restaurant">List</NuxtLink>
              <NuxtLink :class="{'active':route.path.includes('/panel/restaurant/create')}" class="nav-link" to="/panel/restaurant/create">Create</NuxtLink>
            </nav>
          </div>
        </div>
      </div>
      <!-- Sidenav Footer-->
      <div class="sidenav-footer">
        <div class="sidenav-footer-content">
          <div class="sidenav-footer-subtitle">Logged in as:</div>
          <div class="sidenav-footer-title">{{pitLib.auth.get()?.name}}</div>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped></style>
