import { defineStore } from "pinia";

export const useUserStore = defineStore('user_infos',{
    state : ()=>{
        return {
            hasPassed_onboarding : localStorage.getItem('onboarding')||false,
            username : localStorage.getItem("username"),
            telephone : localStorage.getItem("telephone"),
        }
    }
})