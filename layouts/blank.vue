<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: ['color-theme-blue','mont-font'].join(" "),
  },
  script: [
    {src: 'tpl1/js/plugin.js', body: true},
    {src: 'tpl1/js/lightbox.js', body: true},
    {src: 'tpl1/js/scripts.js', body: true},
  ]
});
</script>

<template>
  <slot />
</template>

<style scoped></style>
