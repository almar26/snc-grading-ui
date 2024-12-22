<template>
  <div>
    <BaseBreadcrumb
      :title="page.title"
      :icon="page.icon"
      :breadcrumbs="breadcrumbs"
    ></BaseBreadcrumb>

    <div class="d-flex align-center justify-center" style="height: 65vh">
      <v-card class="elevation-0 text-center py-16" color="transparent">
        <!-- <v-icon size="80" color="warning">mdi-alert-outline</v-icon> -->
        <v-img src="/public/maintenance.png" class="mx-auto" :width="150"></v-img>
        <!-- <div class="service-notif mt-5">Under Maintenance</div> -->
        <div class="service-notif mt-5">Service Unavailable</div>
      </v-card>
    </div>
    
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
import { useToast } from "vue-toastification";
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);
useHead({
  title: "Reports",
});
const page = ref({
  title: "Generate Reports",
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "Reports",
    disabled: true,
  },
]);
const toast = useToast();
</script>

<style>

</style>