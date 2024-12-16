import { defineStore } from 'pinia'

export const useMySchoolYearStore = defineStore({
  id: 'mySchoolYearStore',
  state: () => ({ 
    schoolYear: {}
  }),
  actions: {
    async getActiveSchoolYear() {
      try {
        const baseUrl = useRuntimeConfig().public.baseURL;
        const { data, pending, error }: any = await useFetch(`${baseUrl}/api/auth/local`) 
      } catch (err) {
        console.log(err);
      }
    }
  }
})
