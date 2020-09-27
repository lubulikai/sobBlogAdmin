<template>
  <div>
    <div class="content-title-box">{{$route.name}}</div>
    <div class="content-container-box">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style>
.content-container-box {
  padding: 10px;
}
.content-title-box {
  line-height: 46px;
  padding: 5px;
  border-bottom: solid 1px #e6e6e6;
}
</style>