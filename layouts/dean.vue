<template>
  <v-app>
    <v-app-bar  color="green-darken-2" prominent scroll-behavior="elevate">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>SNC Grading System</v-toolbar-title>

      <v-spacer></v-spacer>
      <div class="mr-2">
        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="brown" size="large">
                <v-img
                  alt="John"
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                ></v-img>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="brown">
                  <v-img
                    alt="John"
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                  ></v-img>
                </v-avatar>
                <h3 class="mt-2">{{ userData.username}}</h3>
                <p class="text-caption mt-1">{{ userData.email}}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn prepend-icon="mdi-pencil" variant="text" rounded> Edit Account </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn prepend-icon="mdi-logout" variant="text" rounded> Logout </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-navigation-drawer
     theme="dark"
      v-model="drawer"
      elevation="0"
      :rail="rail"
      rail-width="120"
      id="main-sidebar"
    
    >
      <div class="image-container">
        <v-img
          src="/SNC-Logo.png"
          alt="Centered Image"
          class="rounded-image"
        ></v-img>
      </div>

      <v-divider></v-divider>
      <v-list nav>
        <v-list-item-group>
          <v-list-item v-for="(item, i) in items" :key="i" active-class="border" class="logout-border" :to="item.route">
            <v-list-item-content>
              <v-icon>{{ item.icon  }}</v-icon>
              <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <v-list density="compact" nav>
          <v-list-item-group>
            <v-list-item class="logout-border" @click="logout()">
              <v-list-item-content>
                <v-icon>mdi-logout</v-icon>
                <v-list-item-subtitle>
                  Logout
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-navigation-drawer>
    
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";

const router = useRouter();
const { logUserOut } = useMyAuthStore();
const { authenticated } = storeToRefs(useMyAuthStore());
const { userInfo } = storeToRefs(useMyAuthStore());

//@ts-ignore
const userData = ref(userInfo?.value.user);
const cookie = useCookie("token");
const drawer = ref(true);
const rail = ref(true);
const items = ref([
  { title: "Dashboard", route: "/", icon: "mdi-view-dashboard" },
  { title: "Class", route: "/class", icon: "mdi-account" },
  { title: "Teachers", route: "/teachers", icon: "mdi-account-supervisor" },
  // { title: "Courses", route: "/courses", icon: "mdi-book" },
  // { title: "Curriculum", route: "/curriculum", icon: "mdi-card-text" },
]);

const logout = () => {
  logUserOut();
  router.push("/auth/signin");
};
</script>

<style scoped lang="scss">
.v-application--is-ltr
  .v-list--dense.v-list--nav
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding: 0 0 9px 8px;
  color: #fff;
}

#main-sidebar {
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  .v-navigation-drawer__border {
    display: none;
  }
 
}
.border {
  margin: 5px 8px 5px 8px;
  border-radius: 10px;
  border-bottom: 2px solid #4CAF50 !important;
  text-decoration: none;
  //color: #4CAF50 ;
}

.logout-border {
  margin: 5px 8px 5px 8px;
  border-radius: 10px;
  text-decoration: none;
}

.image-container {
  width: 50%;
  margin: 15px auto;
  
}
.rounded-image {
  border-radius: 50%;
}
</style>
