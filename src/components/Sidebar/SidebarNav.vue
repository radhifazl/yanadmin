<template>
  <div class="sidebar-nav">
      <ul class="nav-list">
          <li class="nav-item">
              <router-link to="/home" class="nav-link">
                  <i class="bx-fw bx bxs-dashboard"></i> <span class="nav-text">Dashboard</span>
              </router-link>
          </li>

          <li class="nav-item separator-list" @click="expandNav" :class="{ expanded: isExpanded }">
              <i class='bx-fw bx bxs-chevron-right'></i> 
              <span>YAN Invitation Pages</span>
          </li>

          <li class="nav-item nav-expand" :class="{ expanded: isExpanded }">
            <div class="nav-routes" v-for="nav in navLinks" :key="nav.text">
                <router-link :to="nav.path" class="nav-link mb-3">
                    <i :class="'bx-fw bx '+nav.icon"></i> <span class="nav-text">{{ nav.text }}</span>
                </router-link>
            </div>
          </li>
          
          <li class="nav-item logout-btn" @click="logout">
              <span class="nav-link">
                <i class='bx-fw bx bxs-log-out-circle'></i> Logout
              </span>
          </li>
      </ul>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
    name: 'SidebarNav',
    data() {
        return {
            navLinks: [
                {
                    path: '/yan-pages/home',
                    icon: 'bxs-home',
                    text: 'Home'
                },
                {
                    path: '/yan-pages/about',
                    icon: 'bxs-group',
                    text: 'About'
                },
                {
                    path: '/yan-pages/features',
                    icon: 'bx-list-check',
                    text: 'Features'
                },
                {
                    path: '/yan-pages/themes',
                    icon: 'bxs-layout',
                    text: 'Theme'
                },
                {
                    path: '/yan-pages/prices',
                    icon: 'bxs-purchase-tag',
                    text: 'Prices'
                },
                {
                    path: '/yan-pages/contact',
                    icon: 'bxs-contact',
                    text: 'Contact'
                },
            ],
        }
    },
    setup () {
        const isExpanded = ref(true);
        const store = useStore();

        const expandNav = () => {
            if(isExpanded.value) {
                isExpanded.value = false;
            } else {
                isExpanded.value = true;
            }
        }

        const logout = () => {
            store.dispatch('logout');
        }

        return {
            isExpanded,
            expandNav,
            logout
        }
    }
}
</script>

<style>
.sidebar-nav {
    width: 100%;
    height: 100vh;
    background: var(--sidebar-bg);
    padding: 1rem 0.1rem;
    padding-bottom: 5rem;
}

.nav-list {
    padding: 0;
}

.separator-list {
    padding: 1rem;
    color: #888;
    cursor: pointer;
    transition: 0.35s ease-in-out;
}

.separator-list.expanded {
    color: #D1D1D1;
}

.bxs-chevron-right {
    transition: 0.35s ease-in-out;
}

.separator-list.expanded .bxs-chevron-right {
    transform: translateY(20%) rotate(90deg);
}

.separator-list:hover {
    color: #D1D1D1;
}

.nav-routes {
    transform: translateY(-10rem) translateX(15px);
    transition: 0.35s ease-in-out;
}

.nav-expand {
    width: 100%;
    height: 0;
    overflow: hidden;
    opacity: 0;
    visibility: visible;
    transition: all 0.35s ease-in-out;
}

.nav-expand.expanded {
    height: 100%;
    opacity: 1;
    visibility: visible;
}

.nav-expand.expanded .nav-routes {
    transform: translateY(0) translateX(15px);
}

.nav-item .nav-link {
    color: #D1D1D1;
}

.nav-item .nav-link.router-link-exact-active {
    color: #FFFFFF;
    background: #6357EB;
}

.nav-item .nav-link.router-link-exact-active:hover{
    color: #FFFFFF;
}

.nav-item .nav-link:hover {
    color: #FFFFFF;
    background: #6357EB;
}

.logout-btn .nav-link {
    color: #d65151;
    cursor: pointer;
    transition: 0.35s ease-in-out;
}

.logout-btn .nav-link:hover {
    background: transparent;
    color: #e03c3c;
}

@media screen and (max-width: 991px) {
    .sidebar-nav {
        overflow-y: auto;
    }
}
</style>