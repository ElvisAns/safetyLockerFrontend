import { defineStore } from "pinia";

export const useUserStore = defineStore('user_infos',{
    state : ()=>({
            hasPassed_onboarding : localStorage.getItem('onboarding')||false,
            username : localStorage.getItem("username"),
            telephone : localStorage.getItem("telephone"),
            lockingPin : localStorage.getItem("lockingPin")
    }),
    getters:{
        current_user_name:(state)=>state.username,
        current_phone: (state)=>state.telephone,
        user_has_onboard: (state)=>state.hasPassed_onboarding,
        get_current_saved_pin : (state)=>state.lockingPin
    },
    actions:{
        save_user_data(payload){
            this.username = payload.username !== null?payload.username:"";
            this.telephone =  payload.telephone !== null?payload.telephone:"";
            this.lockingPin = payload.lockingPin !== null?payload.lockingPin:"";
            localStorage.setItem("username",this.username)
            localStorage.setItem("telephone",this.telephone)
            localStorage.setItem("lockingPin",this.lockingPin)
        }
    }
})