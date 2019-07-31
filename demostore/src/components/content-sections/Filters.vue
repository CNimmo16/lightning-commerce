<template>
    <div class="filters">
        <v-select multiple :options="filters.categories" placeholder="Product type" v-model="requested.category" />
        <!--<v-select :options="['Canada', 'United States']" placeholder="Collection" />-->
    </div>
</template>

<script>
    export default {
        name: "filters",
        props: ["filters"],
        data() {
            return {
                requested: {
                    category: []
                }
            }
        },
        watch: {
            requested: {
                deep: true,
                handler: () => {
                    this.$emit("updated", this.requested)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

.filters {
    display: grid;
    grid-template-columns: 270px 270px;
}

.v-select {
    margin: 10px;
    max-width: 240px;
    background-color: #eee;
}

.vs__dropdown-toggle {
    border-radius: 0;
    padding: 10px 6px;
}

.vs__selected-options {
    input {
        margin: 0 !important;
        color: #777;
    }
    .vs__selected {
        &:nth-of-type(1) {
            margin: 0 !important;
        }
    }
}

.vs__dropdown-menu {
    /*top: calc(100% + 5px);*/
}
</style>