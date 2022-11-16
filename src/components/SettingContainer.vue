<template>
    <div id="container">
        <ion-avatar>
            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        </ion-avatar>
      <p>You're in Dear <strong>{{username}}</strong></p>
      <p>{{telephone}}</p>
      <ion-item lines="none"  v-if="loaded">
        <ion-label>The system is currently</ion-label>
        <ion-badge color="secondary">{{system_status}}</ion-badge>
      </ion-item>
      <ion-list  v-if="loaded" style="min-width:70vw;">
        <ion-list-header>
          <ion-label><span :style="{fontSize:'15px'}">Pin Maps</span></ion-label>
        </ion-list-header>
        <div v-for="(item,index) in lines_pin_maps" :key="index" class="list-container">
          <ion-item>
            <ion-label>
              <h3 color="secondary">{{item.line_name}}</h3>
            </ion-label>
            <ion-badge color="secondary">Wired to pin {{item.connected_pin}}</ion-badge>
            <ion-icon :icon="cog" slot="start" color="secondary"></ion-icon>
          </ion-item>
        </div>
      </ion-list>
      <ion-list v-if="!loaded">
      <ion-list-header>
        <ion-skeleton-text :animated="true" style="width: 70vw"></ion-skeleton-text>
      </ion-list-header>
      <ion-item>
        <ion-label>
          <h3>
            <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
          </p>
          <p>
            <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
    </div>
  </template>
  
  <script lang="js">
  import { IonAvatar,IonList,IonIcon,IonLabel,IonItem,IonListHeader,IonBadge,IonButton,IonSkeletonText,IonThumbnail} from '@ionic/vue';
  import { alertCircleOutline, reloadCircle, cog} from 'ionicons/icons';
  import { defineComponent,ref} from 'vue';
  import axios from 'axios';
  import { useUserStore } from '@/stores/UserStore';
  
  export default defineComponent({
    name: 'SettingContainer',
    components : IonAvatar,IonList,IonIcon,IonLabel,IonItem,IonListHeader,IonBadge,IonButton,IonSkeletonText,IonThumbnail,
    props: {
      name: String
    },
    setup() {
        const loaded = ref(false);
        const setLoaded = (state) => loaded.value = state;
        const userStore = useUserStore();
        const username = userStore.current_user_name;
        const telephone = userStore.current_phone;
        return {
          loaded,
          setLoaded,
          userStore,
          telephone,
          username
        }
    },
    data(){
      return{
        lines_pin_maps : [],
        backend : require("@/utils/server.json"),
        system_status : "",
        listReady:false,
        statusReady:false
      }
    },
    watch:{
     lines_pin_maps(newList){
        if(newList!==null){
          this.listReady=true;
          if(this.statusReady)
           this.loaded=true;
        }
      },
      system_status(newStat){
        if(newStat){
          this.statusReady=true;
          if(this.listReady)
            this.loaded=true;
        }
      }
    },
    mounted(){
      setInterval(()=>{
        const {base_url} = this.backend;
        axios.get(`${base_url}api/current_status`).then((res)=>{
          this.system_status = res.data.message!==this.system_status?res.data.message:this.system_status;
        })
      },5000);
    },
    beforeMount(){
      const {base_url} = this.backend;
      axios.get(`${base_url}api/lines`).then((res)=>{
        this.lines_pin_maps = res.data;
      })
      axios.get(`${base_url}api/current_status`).then((res)=>{
        this.system_status = res.data.message;
      })
    },
  });
  </script>
  
  <style scoped>
  #container {
    display: grid;
    place-items: center;
  }
  
  #container strong {
    line-height: 26px;
  }
  
  #container p {
    line-height: 22px;
    color: #8c8c8c;
    margin: 0;
  }
  
  #container a {
    text-decoration: none;
  }
  #container img {
    display: block;
  }
  
  .list-container{
    max-width:100vw;
  }
  
  .odd_item{
    background: #b9b9b9;
  }  
  
  ion-avatar {
    --border-radius: 4px;
  }
  
  </style>
  