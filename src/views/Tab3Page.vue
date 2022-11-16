<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
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
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <SettingContainer name="Settings" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import SettingContainer from '@/components/SettingContainer.vue';

export default defineComponent({
  name: 'Tab3Page',
  components: { SettingContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
});
</script>
