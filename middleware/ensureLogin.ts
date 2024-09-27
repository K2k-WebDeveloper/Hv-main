import {pitLib} from "~/helpers/pitLib";
import {endpoints} from "~/helpers/endpoints";
import type {ApiResponse} from "~/types";
export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!process.client) return
    let d:ApiResponse=await $fetch(endpoints.user.list, {
    method: 'POST', // GET/POST
    headers: {
        'Authorization': "Bearer "+pitLib.auth.get()?.token,
    },
    body: JSON.stringify({ _id:pitLib.auth.get()?._id??null}) // Uncomment this line for POST method
    })
    if (!d.status){
        return '/login'
    }
})
