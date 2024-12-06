<template>
  <div>
    <v-row class="page-breadcrumb">
      <v-col cols="12" sm="12" class="pa-0">
        <v-card class="" elevation="0">
          <v-card-text>
            <p class="breadcrumbs-title">{{ title }}</p>
            <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-breadcrumbs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  breadcrumbs: Array,
  icon: String
})
</script>

<style scoped>
.page-breadcrumb {
  margin: -15px -16px 20px -25px;
  
}
.breadcrumbs-title {
  margin-left: 12px;
  font-size: 24px;
  font-weight:600;
  text-transform: capitalize;
  color: rgb(78, 78, 78);
  /* color: #4CAF50; */
}
.breadcrumbs{
  padding: 0;
  margin-left: 10px;
  color: #4CAF50;
}
</style>