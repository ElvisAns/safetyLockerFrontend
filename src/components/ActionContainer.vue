<template>
    <div id="container">
      <img :src="require('/public/assets/icon/icon.png')">
      <strong>Always make sure you start working being safer</strong>

      <ion-list  v-if="loaded" style="min-width:70vw;">
        <ion-list-header>
          <ion-label :style="{fontSize:'15px'}"><ion-icon :icon="settings"></ion-icon> Manage Lines state here</ion-label>
        </ion-list-header>
        <div v-for="(item,index) in lines" :key="index" class="list-container">
          <ion-item :class="{odd_item:index%2}">
            <ion-label>{{item.line_name}}</ion-label>
            <ion-toggle color="secondary" slot="end" :id="item.id"  @click="remoteChangePinState" :checked="item.state==1?true:false" :enable-on-off-labels="true"></ion-toggle>
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
  import { IonList,IonIcon,IonLabel,IonItem,IonListHeader,IonBadge,IonButton,IonSkeletonText,IonThumbnail,IonCheckbox,IonToggle,alertController } from '@ionic/vue';
  import {listCircle,settings} from 'ionicons/icons';
  import { defineComponent,ref} from 'vue';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'ExploreContainer',
    components : IonList,IonIcon,IonLabel,IonItem,IonListHeader,IonBadge,IonButton,IonSkeletonText,IonThumbnail,IonCheckbox,IonToggle,
    props: {
      name: String
    },
    setup() {
        const loaded = ref(false);
        const setLoaded = (state) => loaded.value = state;
        return {
          loaded,
          setLoaded,
          listCircle,
          settings
        }
    },
    data(){
      return{
        lines : [],
        backend : require("@/utils/server.json"),
        listReady:false,
        statusReady:true
      }
    },
    watch:{
      lines(newList){
        if(newList!==null){
          this.listReady=true;
          if(this.statusReady)
           this.loaded=true;
        }
      }
    },
    mounted(){
      setInterval(()=>{
        const {base_url} = this.backend;
        axios.get(`${base_url}api/lines`).then((res)=>{
          if(JSON.stringify(this.lines)!==JSON.stringify(res.data)){
            this.lines = res.data;
          }
        })
      },10000);
    },
    beforeMount(){
      const {base_url} = this.backend;
      axios.get(`${base_url}api/lines`).then((res)=>{
        this.lines = res.data;
      })
    },
    methods:{
      remoteChangePinState(event){
        const value = event.target.checked?false:true;//checked return false so we have to inverse
        const id = event.target.id;
        const {base_url} = this.backend;
        
        const presentAlert = async message => {
          const alert = await alertController.create({
            header: 'Notification',
            subHeader: 'Important feedback',
            message: message,
            buttons: ['OK'],
          });
          await alert.present();
        };

        axios.post(`${base_url}api/lines/state/set/${id}`,
        {
          "security_code":"R5YJS", //next time ask this
          "state":value,
          "name" : "Elvis ANSIMA",
          "telephone":"+243971774990"
        }
        ).then(function process(res){
          if("error" in res.data){
            event.target.checked = !value; //as there's an error, reset the state in the initial state
          }
          console.log(res.data);
          presentAlert(res.data.message)
        })
      }
    }
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
  
  </style>
  