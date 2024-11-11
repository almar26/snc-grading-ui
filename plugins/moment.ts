import moment from "moment";

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {

            //@ts-ignore
            relative:(d) => moment().format('LL')
        }
    }
})
