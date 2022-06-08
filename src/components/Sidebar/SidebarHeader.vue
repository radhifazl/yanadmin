<template>
    <div class="sidebar-header">
        <div class="sidebar-logo d-flex flex-column gap-1">
            <img src="@/assets/images/logo/logo-alt.svg" alt="YAN Admin Logo">
            <img src="@/assets/images/logo/admin-logo.svg" alt="YAN Admin Logo">
        </div>
    </div>
</template>

<script>
export default {
    name: 'SidebarHeader',
}
</script>

<style>
.sidebar-header {
    width: 100%;
    padding-top: 1rem;
    background: var(--sidebar-bg);
}

.sidebar-logo img {
    width: 150px;
    margin: auto;
}

@media screen and (max-width: 768px) {
    .sidebar-header {
        padding-bottom: 1rem;
    }

    .sidebar-logo img {
        width: 100px;
    }
}
</style>