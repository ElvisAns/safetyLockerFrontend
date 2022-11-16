<template>
  <div id="container">
    <img :src="require('/public/assets/icon/icon.png')">
    <strong>Welcome to your safety guard!</strong>
    <ion-item lines="none"  v-if="loaded">
      <ion-label>The system is currently</ion-label>
      <ion-badge color="secondary">{{system_status}}</ion-badge>
    </ion-item>
    <ion-list  v-if="loaded">
      <ion-list-header>
        <ion-label><span :style="{fontSize:'15px'}">Activities</span></ion-label>
      </ion-list-header>
      <div v-for="(item,index) in logs" :key="index" class="list-container">
        <ion-item :class="{odd_item:index%2&&true}">
          <ion-label>
            <h3 v-html="get_item_data(item,'type')" color="secondary"></h3>
            <p v-html="get_item_data(item,'info')"></p>
            <p v-html="get_item_data(item,'date')"></p>
          </ion-label>
          <ion-icon :icon="get_item_data(item,'icon')" slot="start" color="secondary"></ion-icon>
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
import { IonList,IonIcon,IonLabel,IonItem,IonListHeader,IonBadge,IonButton,IonSkeletonText,IonThumbnail} from '@ionic/vue';
import { alertCircleOutline, reloadCircle, cog} from 'ionicons/icons';
import { defineComponent,ref} from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ExploreContainer',
  components : IonList,IonIcon,IonLabel,IonItem,IonListHeader,IonBadge,IonButton,IonSkeletonText,IonThumbnail,
  props: {
    name: String
  },
  setup() {
      const loaded = ref(false);
      const setLoaded = (state) => loaded.value = state;
      return {
        loaded,
        setLoaded
      }
  },
  data(){
    return{
      logs : [],
      backend : require("@/utils/server.json"),
      system_status : "",
      listReady:false,
      statusReady:false
    }
  },
  watch:{
    logs(newList){
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
      axios.get(`${base_url}api/lines/logs/list`).then((res)=>{
        const response = res.data.data;
        if(JSON.stringify(response) !== JSON.stringify(this.logs)){
          this.logs = res.data.data;
        }
      })
      axios.get(`${base_url}api/current_status`).then((res)=>{
        this.system_status = res.data.message!==this.system_status?res.data.message:this.system_status;
      })
    },5000);
  },
  beforeMount(){
    setTimeout(()=>{
      const {base_url} = this.backend;
      axios.get(`${base_url}api/lines/logs/list`).then((res)=>{
        this.logs = res.data.data;
      })
      axios.get(`${base_url}api/current_status`).then((res)=>{
        this.system_status = res.data.message;
      })
    },4000);
  },
  methods:{
    get_item_data(message,what){
      const copy = {...message};
      const icon = copy.type == "user info"?alertCircleOutline:(copy.type=="System maintance"?cog:reloadCircle);
      const event_type = copy.type.toUpperCase();
      const event_info_arr = copy.info.split("<!>");
      event_info_arr[1] = "<strong color='primary'>"+event_info_arr[1]+"</strong>";
      const event_info = event_info_arr.join("<br>by");
      const event_date = new Date(copy.created_at).toDateString();
      if(what == "type") return event_type;
      if(what == "info") return event_info;
      if(what == "date") return event_date;
      if(what == "icon") return icon;
      return ""
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
