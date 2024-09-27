<script setup lang="ts">
const props=defineProps([
    'title','description','icon'
])
</script>

<template>
  <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
    <div class="container-xl px-4">
      <div class="page-header-content pt-4">
        <div class="row align-items-center justify-content-between">
          <div class="col-auto mt-4">
            <h1 class="page-header-title">
              <div class="page-header-icon"><i :class="['fa-solid','fa-lg','fa-'+props.icon]"></i></div>
              {{props.title}}
            </h1>
            <div class="page-header-subtitle">{{props.description}}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
