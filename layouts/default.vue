<template>
    <div :class="landingClass">
        <Navbar></Navbar>
        <div class="layout-wrapper">
            <div class="layout-sidebar">
                <!-- Sidebar -->
                <LeftSidebar></LeftSidebar>
            </div>
            <div class="layout-main">
                <div class="layout-topbar">
                    <!-- Top Navigation Bar -->
                </div>
                <div class="layout-content">
                    <!-- Main Content -->
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TopNavigation from '/components/TopNavigation.vue'
import LeftSidebar from '/components/LeftSidebar.vue'

export default {
    components: {
        TopNavigation,
        LeftSidebar
    },
    data() {
        return {
            landingClass: 'landing',
            labelType: 'Speichern'
        };
    },
    methods: {

    }
}
</script>
  
<style lang="scss" scoped>
.layout-wrapper {
    display: flex;
    flex-direction: row;
    height: 100vh;
}

.layout-sidebar {
    background-color: #303030;
    height: 100%;
    width: 250px;
}

.layout-main {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.layout-topbar {
    background-color: #fff;
}

.layout-content {
    flex: 1;
    padding: 20px;
    background: #eee;
}
</style>
  