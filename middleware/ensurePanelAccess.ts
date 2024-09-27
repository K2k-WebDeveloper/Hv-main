import type {ApiResponse} from "~/types";
import {endpoints} from "~/helpers/endpoints";
import {pitLib} from "~/helpers/pitLib";

export default defineNuxtRouteMiddleware((to, from) => {
    if (!process.client) return
    let u=pitLib.auth.get()
    if (!u||pitLib.auth.get()?.role?.code!='admin'){
        return '/login'
    }
})
