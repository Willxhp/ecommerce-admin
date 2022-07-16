<template>
  <div>App根组件</div>
</template>

<script setup>
  import { postLoginAPI } from '@/api/index.js'
  const res = await postLoginAPI()
  console.log(res)
</script>

<style lang="less">
</style>