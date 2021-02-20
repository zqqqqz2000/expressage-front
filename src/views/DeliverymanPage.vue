<template>
  <div></div>
</template>

<script>
export default {
  name: "DeliverymanPage",
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.getLongitude = position.coords.longitude;
            this.getLatitude = position.coords.latitude;
            alert(this.getLongitude);
            alert(this.getLatitude);

          },
          //locationError  获取失败的话
          (error) => {
            var errorType = ['您拒绝共享位置信息', '获取不到位置信息', '获取位置信息超时'];
            alert(errorType[error.code - 1]);
          }
      );
    }
  },
}
</script>

<style scoped>

</style>