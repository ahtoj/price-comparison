declare module 'vue-router'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $route: any
        $router: any
    }
}
