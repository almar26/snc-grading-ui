<template>
  <div>
    <h1>Deans Page</h1>
    <v-btn @click="logout()">Logout</v-btn>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
const router = useRouter();
const { logUserOut } = useMyAuthStore();
const { authenticated } = storeToRefs(useMyAuthStore());
const { userInfo } = storeToRefs(useMyAuthStore());
definePageMeta({
	layout: "dean",
});

const logout = () => {
  logUserOut();
  router.push("/auth/signin");
};
</script>

<style>

</style>