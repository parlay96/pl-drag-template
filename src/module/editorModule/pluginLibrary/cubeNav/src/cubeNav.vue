<template>
  <div class="magic-square-container">
    <div class="magic-style-one column-1">
      <div class="nav-icon" v-for="(item, index) in navData" :key="index">
        <a>
          <div class="nav-icon-bg">
            <span class="iconfont iconzhanghaoxinxi"/>
          </div>
          <div class="nav-icon-text">{{ item.name }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  // 魔方导航
  export default {
    name: 'CubeNav',
    data () {
      return {
        navData: [
          {
            name: '超市便利1'
          },
          {
            name: '超市便利2'
          },
          {
            name: '超市便利3'
          },
          {
            name: '超市便利4'
          },
          {
            name: '超市便利5'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">
 .magic-square-container {
   .magic-style-one.column-1 .nav-icon {
     width: 25%;
   }
   .magic-style-one.column-0 .nav-icon {
     width: 20%;
   }
   .magic-style-one {
     padding: 15px;
     text-align: left;
     .nav-icon {
       display: inline-block;
       text-align: center;
       position: relative;
       vertical-align: top;
       .nav-icon-bg {
         background: -webkit-gradient(linear,left top,left bottom,from(#8bd3fb),to(#4e98f8));
         background: linear-gradient(top,#8bd3fb,#4e98f8);
         width: 45px;
         height: 45px;
         text-align: center;
         margin: 0 auto;
         margin-top: 5px;
         margin-bottom: 10px;
         border-radius: 50%;
         position: relative;
       }
       .nav-icon-text {
         font-size: 12px;
         color: #595959;
         margin-bottom: 5px;
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 4;
         -webkit-box-orient: vertical;
         word-break: break-all;
       }
     }
   }
 }
</style>
