
<template>
    <div class="sidebar-menu">
        <nav>
            <ul>
                <li><i class="pi pi-home"></i>
                    <NuxtLink to="/">Home</NuxtLink>
                </li>
                <li><i class="pi pi-calendar"></i>
                    <NuxtLink to="/calendar">Kalender</NuxtLink>
                </li>
                <li><i class="pi pi-users"></i>
                    <NuxtLink to="/employees">Mitarbeiter</NuxtLink>
                </li>
                <li><i class="pi pi-cog"></i>
                    <NuxtLink to="/settings">Einstellungen</NuxtLink>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.router-link-active .router-link-exact-active {
    color: orange;
}

.sidebar-menu {
    background-color: #303030;
    padding: 20px;
    width: 250px
}

.sidebar-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;

    i {
        color: white;
        margin-right: 10px;
    }
}

.sidebar-menu li {
    margin: 10px 0;
}

.sidebar-menu li a {
    color: #ffffff;
    text-decoration: none;
}
</style>