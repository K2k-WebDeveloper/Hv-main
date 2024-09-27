import nuxtStorage from "nuxt-storage/nuxt-storage";
import Swal from "sweetalert2";
import {env} from "./env";
import moment from "moment";
import {endpoints} from "~/helpers/endpoints";

export const pitLib={
    auth:{
        get:function () {
            return nuxtStorage.localStorage.getData(env.KEYWORDS.USER_SESSION_KEY)
        },
        set:function (data:any) {
            return nuxtStorage.localStorage.setData(env.KEYWORDS.USER_SESSION_KEY,data,env.SES_LOGIN_EXPIRY_DAYS,'d')
        },
        clear:function () {
            return nuxtStorage.localStorage.removeItem(env.KEYWORDS.USER_SESSION_KEY)
        },
        is:function () {
            return !!nuxtStorage.localStorage.getData(env.KEYWORDS.USER_SESSION_KEY)
        },
    },
    response:{
        send:function (status:boolean|null=null,message:string|null=null,data:any=null) {
            if (!status){
                status =false;
                if (!message){
                    message ='Unable to perform this action'
                }
            } else {
                status =true;
                if (!message){
                    message ='Action performed successfully'
                }
            }
            return {status:status,message:message,data:data}
        },
    },
    swal:async function (title:null|string|undefined,icon:'info'|'success'|'error'|'warning'|'question'|null,position:null|'bottom-right'|'top-right',timer:null|number) {
        if(!position){
            position='bottom-right'
        }
        if(!title&&icon){
            if (['warning','error'].includes(icon)){
                title=Env.MESSAGE.NEGATIVE
            }
            if (['info','success'].includes(icon)){
                title=Env.MESSAGE.POSITIVE
            }
        }
        timer=timer??5000
        return await Swal.fire({
            position: position,
            icon: icon,
            title: title,
            showConfirmButton:false,
            timerProgressBar:true,
            timer: timer,
        })
    },
    util:{
        test:function (){
            alert("ok")
        },
        headers:function () {
            return {
                Authorization: "Bearer "+pitLib.auth.get()?.token,
            }
        },
        url:function (uri:string):string {
            return env.FRONTEND+uri
        }
    },
    media:{
        getBase64: file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        })
    },
    dt:{
        fromNow: function (v:any) {
            return moment(v).fromNow()
        }
    },
    notify: async function (title:string,content:string,target_user:string) {
        return $fetch(endpoints.notification.create,{
            method:"post",
            body:{
                title:title,content:content,target_user:target_user
            },
            headers:pitLib.util.headers(),
        })
    }
}