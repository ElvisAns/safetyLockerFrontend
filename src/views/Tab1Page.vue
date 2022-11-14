<template>
  <ion-page>
    
    <ion-header>
      <ion-toolbar>
        <ion-title>Action</ion-title>
        <!--ion-buttons slot="end">
          <ion-button>
            <img :src="require('/public/assets/icon/favicon.png')" style="height:32px;">
          </ion-button>
        </ion-buttons-->
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Actions</ion-title>
        </ion-toolbar>
      </ion-header>
    
      <ActionContainer name="Tab 1 page" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ActionContainer from '@/components/ActionContainer.vue';

export default  defineComponent({
  name: 'Tab1Page',
  components: { ActionContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
});
</script>
