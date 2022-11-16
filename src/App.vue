<template>
  <ion-app>
    <div v-show="displaySplash" :class="animateClass" class="animate__animated splash">
      <p style="color:white; font-size: 13px; font-weight: bolder;">SAFETY LOCKER</p>
      <img :src="require('/public/assets/icon/icon.png')">
    </div>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="js">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import 'animate.css';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  data(){
    return{
      displaySplash:true,
      animateClass:""
    }
  },
  mounted(){
    setTimeout(()=>{
      this.animateClass = "animate__fadeOut"
    },2000);
    setTimeout(()=>{
      this.displaySplash=false
    },3000);
  }
});
</script>

<style scoped>
  .splash{
    background: #3dc2ff;
    width:100vw;
    height: 100vh;
    position:absolute;
    top:0;
    left:0;
    z-index: 900000;
    display: grid;
    place-items: center;
  }
</style>