<script setup lang="ts">
const props=defineProps(['show','content','type'])
const show=ref<Boolean>(props.show)
const content=ref<String>(props.content)
const type=ref<String>(props.type)
const emits=defineEmits(['show'])
</script>

<template>
  <div class="alert alert-dismissible fade show" :class="['alert','alert-dismissible','fade','show','alert-'+type]" role="alert">
    <div class="" v-html="props.content">
    </div>
    <button type="button" @click="show=!show;$emit('show',false)" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>

<style scoped></style>
