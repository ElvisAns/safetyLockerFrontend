<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">Cancel</ion-button>
      </ion-buttons>
      <ion-title>Advanced settings</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="confirm">Confirm</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
        <ion-label position="floating" color="secondary">Your name</ion-label>
        <ion-input placeholder="Enter text" v-model="username"></ion-input>
    </ion-item>

    
    <ion-item>
        <ion-label position="floating" color="secondary">Your telephone number</ion-label>
        <ion-input placeholder="Enter text" type="tel" v-model="telephone"></ion-input>
    </ion-item>

    <ion-item>
        <ion-label position="floating" color="secondary">The current locking pin</ion-label>
        <ion-input placeholder="Enter text"  v-model="lockingPin"></ion-input>
    </ion-item>

    <ion-item style="margin-top:20px;">
        <ion-label color="secondary">Want to put system to maintance?</ion-label>
        <ion-toggle color="secondary" slot="end" id="maintanceMode" v-model="stateMaintance" :enable-on-off-labels="true"></ion-toggle>
    </ion-item>

    <ion-button @click="request_new_pass" color="primary" shape="round" fill="outline" size="small" style="position:relative;top:60px; left:20px;">Lost the last locking pin?</ion-button>
  </ion-content>
</template>

<script lang="js">
  import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    modalController,
    alertController,
    IonToggle
  } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import { useUserStore } from '@/stores/UserStore';
  import { buildOutline } from 'ionicons/icons';
  import axios from 'axios';

  export default defineComponent({
    name: 'ModalPage',
    components: {IonToggle,IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonItem, IonLabel, IonInput },
    setup(){
        const userStore = useUserStore()
        let username = userStore.current_user_name;
        let telephone = userStore.current_phone;
        let lockingPin = userStore.get_current_saved_pin 
        return {
            buildOutline,
            userStore,
            username,
            lockingPin,
            telephone,
        }
    },
    data(){
        return {
            stateMaintance : true,
            backend : require("@/utils/server.json"),
        }
    },
    methods: {
      request_new_pass(){
        const presentAlert = async message => {
          const alert = await alertController.create({
            header: 'Notification',
            subHeader: 'Important feedback',
            message: message,
            buttons: ['Got it!'],
          });
          await alert.present();
        }; 
        const {base_url} = this.backend;
        axios.get(`${base_url}api/auth/password/forgotten`).then(function process(res){
            presentAlert(res.data.message);
        })
      },
      cancel() {
        return modalController.dismiss(null, 'cancel');
      },
      confirm() {
        this.userStore.save_user_data({
           username : this.username,
           telephone : this.telephone,
           lockingPin : this.lockingPin
        })
        
        const presentAlert = async message => {
          const alert = await alertController.create({
            header: 'Notification',
            subHeader: 'Important feedback',
            message: message,
            buttons: ['Got it!'],
          });
          await alert.present();
        };

                
        if(!this.username || !this.telephone || !this.lockingPin)
        {
            presentAlert("Please make sure you supply correct datas.");
            return;
        }
        
        if(this.username.length<4 || this.telephone.length<10 || this.lockingPin.length<2)
        {
            presentAlert("Please make sure you supply correct datas.");
            return;
        }
        const {base_url} = this.backend;
        const stateMaintance = this.stateMaintance;
        const lockingPin = this.lockingPin;
        const userStore = useUserStore();
        axios.post(`${base_url}api/lines/maintenance/${this.stateMaintance?"on":"off"}`,{
            "security_code":this.lockingPin,
            "name":this.username,
            "telephone":this.telephone
        }).then(function process(res){
            if(!stateMaintance){
                //get new pin from /api/auth/password/get_new and echo it then save it to the user store!
                axios.post(`${base_url}api/auth/password/get_new`,{
                    "security_code":lockingPin
                }).then(function process(resx){
                    if("error" in resx.data){
                        presentAlert(resx.data.message);
                    }
                    else{
                        userStore.$patch({
                            lockingPin : resx.data.message
                        })
                        localStorage.setItem("lockingPin",resx.data.message)
                        presentAlert("The system has been successfully put into running mode. Next time use " + resx.data.message + " as the code to start maintance")
                    }
                })
            }
            else{
              presentAlert(res.data.message)
            }
        })
        return modalController.dismiss(this.name, 'confirm');
      },
    },
  });
</script>