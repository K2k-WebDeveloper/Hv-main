<script setup lang="ts">
const props=defineProps(["rows","columns"])
</script>

<template>
  <tr v-for="r in props.rows" :key="r">
    <td v-for="c in props.columns" :key="c" class="text-left">
      <q-skeleton animation="blink" type="text"  />
    </td>
  </tr>
</template>

<style scoped></style>
