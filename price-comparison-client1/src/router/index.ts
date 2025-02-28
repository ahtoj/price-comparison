import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/identity/Login.vue'
import Register from '@/views/identity/Register.vue'
import CustomerIndex from '@/views/customer/CustomerIndex.vue'
import CustomerCreate from '@/views/customer/CustomerCreate.vue'
import CustomerDelete from '@/views/customer/CustomerDelete.vue'
import CustomerEdit from '@/views/customer/CustomerEdit.vue'
import CustomerDetails from '@/views/customer/CustomerDetails.vue'
import CategoryIndex from '@/views/category/CategoryIndex.vue'
import CategoryCreate from '@/views/category/CategoryCreate.vue'
import CategoryDelete from '@/views/category/CategoryDelete.vue'
import CategoryEdit from '@/views/category/CategoryEdit.vue'
import CategoryDetails from '@/views/category/CategoryDetails.vue'
import ProductIndex from '@/views/product/ProductIndex.vue'
import ProductEdit from '@/views/product/ProductEdit.vue'
import ProductCreate from '@/views/product/ProductCreate.vue'
import ProductDelete from '@/views/product/ProductDelete.vue'
import ProductDetails from '@/views/product/ProductDetails.vue'
import AlarmCreate from '@/views/alarm/AlarmCreate.vue'
import AlarmIndex from '@/views/alarm/AlarmIndex.vue'
import AlarmEdit from '@/views/alarm/AlarmEdit.vue'
import AlarmDelete from '@/views/alarm/AlarmDelete.vue'
import AlarmDetails from '@/views/alarm/AlarmDetails.vue'
import AccountIndex from '@/views/account/AccountIndex.vue'
import AccountCreate from '@/views/account/AccountCreate.vue'
import AccountEdit from '@/views/account/AccountEdit.vue'
import AccountDelete from '@/views/account/AccountDelete.vue'
import AccountDetails from '@/views/account/AccountDetails.vue'
import FeatureDetails from '@/views/feature/FeatureDetails.vue'
import FeatureDelete from '@/views/feature/FeatureDelete.vue'
import FeatureEdit from '@/views/feature/FeatureEdit.vue'
import FeatureCreate from '@/views/feature/FeatureCreate.vue'
import FeatureIndex from '@/views/feature/FeatureIndex.vue'
import MetricIndex from '@/views/metric/MetricIndex.vue'
import MetricCreate from '@/views/metric/MetricCreate.vue'
import MetricEdit from '@/views/metric/MetricEdit.vue'
import MetricDelete from '@/views/metric/MetricDelete.vue'
import MetricDetails from '@/views/metric/MetricDetails.vue'
import OfferIndex from '@/views/offer/OfferIndex.vue'
import OfferCreate from '@/views/offer/OfferCreate.vue'
import OfferEdit from '@/views/offer/OfferEdit.vue'
import OfferDelete from '@/views/offer/OfferDelete.vue'
import OfferDetails from '@/views/offer/OfferDetails.vue'
import PriceIndex from '@/views/price/PriceIndex.vue'
import PriceCreate from '@/views/price/PriceCreate.vue'
import PriceEdit from '@/views/price/PriceEdit.vue'
import PriceDelete from '@/views/price/PriceDelete.vue'
import PriceDetails from '@/views/price/PriceDetails.vue'
import ReviewIndex from '@/views/review/ReviewIndex.vue'
import ReviewCreate from '@/views/review/ReviewCreate.vue'
import ReviewEdit from '@/views/review/ReviewEdit.vue'
import ReviewDelete from '@/views/review/ReviewDelete.vue'
import ReviewDetails from '@/views/review/ReviewDetails.vue'
import RoleIndex from '@/views/role/RoleIndex.vue'
import RoleCreate from '@/views/role/RoleCreate.vue'
import RoleEdit from '@/views/role/RoleEdit.vue'
import RoleDelete from '@/views/role/RoleDelete.vue'
import RoleDetails from '@/views/role/RoleDetails.vue'
import ShopIndex from '@/views/shop/ShopIndex.vue'
import ShopCreate from '@/views/shop/ShopCreate.vue'
import ShopEdit from '@/views/shop/ShopEdit.vue'
import ShopDelete from '@/views/shop/ShopDelete.vue'
import ShopDetails from '@/views/shop/ShopDetails.vue'
import WatchlistIndex from '@/views/watchlist/WatchlistIndex.vue'
import WatchlistCreate from '@/views/watchlist/WatchlistCreate.vue'
import WatchlistEdit from '@/views/watchlist/WatchlistEdit.vue'
import WatchlistDelete from '@/views/watchlist/WatchlistDelete.vue'
import WatchlistDetails from '@/views/watchlist/WatchlistDetails.vue'
import ProductImport from '@/views/product/ProductImport.vue'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        props: true,
    },
    {
        path: '/identity/login',
        name: 'identity-login',
        component: Login,
    },
    {
        path: '/identity/register',
        name: 'identity-register',
        component: Register,
    },

    {
        path: '/account',
        name: 'account',
        component: AccountIndex
    },
    {
        path: '/account/create',
        name: 'account-create',
        component: AccountCreate
    },
    {
        path: '/account/edit/:id',
        name: 'account-edit',
        component: AccountEdit,
        props: true
    },
    {
        path: '/account/delete/:id',
        name: 'account-delete',
        component: AccountDelete,
        props: true
    },
    {
        path: '/account/details/:id',
        name: 'account-details',
        component: AccountDetails,
        props: true
    },

    {
        path: '/alarm',
        name: 'alarm',
        component: AlarmIndex
    },
    {
        path: '/alarm/create/:id',
        name: 'alarm-create',
        component: AlarmCreate,
        props: true,
    },
    {
        path: '/alarm/edit/:id',
        name: 'alarm-edit',
        component: AlarmEdit,
        props: true
    },
    {
        path: '/alarm/delete/:id',
        name: 'alarm-delete',
        component: AlarmDelete,
        props: true
    },
    {
        path: '/alarm/details/:id',
        name: 'alarm-details',
        component: AlarmDetails,
        props: true
    },

    {
        path: '/category',
        name: 'category',
        component: CategoryIndex
    },
    {
        path: '/category/create',
        name: 'category-create',
        component: CategoryCreate
    },
    {
        path: '/category/edit/:id',
        name: 'category-edit',
        component: CategoryEdit,
        props: true
    },
    {
        path: '/category/delete/:id',
        name: 'category-delete',
        component: CategoryDelete,
        props: true
    },
    {
        path: '/category/details/:id',
        name: 'category-details',
        component: CategoryDetails,
        props: true
    },

    {
        path: '/customer',
        name: 'customer',
        component: CustomerIndex
    },
    {
        path: '/customer/create',
        name: 'customer-create',
        component: CustomerCreate
    },
    {
        path: '/customer/edit/:id',
        name: 'customer-edit',
        component: CustomerEdit,
        props: true
    },
    {
        path: '/customer/delete/:id',
        name: 'customer-delete',
        component: CustomerDelete,
        props: true
    },
    {
        path: '/customer/details/:id',
        name: 'customer-details',
        component: CustomerDetails,
        props: true
    },

    {
        path: '/feature',
        name: 'feature',
        component: FeatureIndex
    },
    {
        path: '/feature/create',
        name: 'feature-create',
        component: FeatureCreate
    },
    {
        path: '/feature/edit/:id',
        name: 'feature-edit',
        component: FeatureEdit,
        props: true
    },
    {
        path: '/feature/delete/:id',
        name: 'feature-delete',
        component: FeatureDelete,
        props: true
    },
    {
        path: '/feature/details/:id',
        name: 'feature-details',
        component: FeatureDetails,
        props: true
    },

    {
        path: '/metric',
        name: 'metric',
        component: MetricIndex
    },
    {
        path: '/metric/create',
        name: 'metric-create',
        component: MetricCreate
    },
    {
        path: '/metric/edit/:id',
        name: 'metric-edit',
        component: MetricEdit,
        props: true
    },
    {
        path: '/metric/delete/:id',
        name: 'metric-delete',
        component: MetricDelete,
        props: true
    },
    {
        path: '/metric/details/:id',
        name: 'metric-details',
        component: MetricDetails,
        props: true
    },

    {
        path: '/offer',
        name: 'offer',
        component: OfferIndex
    },
    {
        path: '/offer/:id',
        name: 'offer-category',
        component: OfferIndex
    },
    {
        path: '/offer/create',
        name: 'offer-create',
        component: OfferCreate
    },
    {
        path: '/offer/create/:id',
        name: 'offer-create-with-product',
        component: OfferCreate,
        props: true,
    },
    {
        path: '/offer/edit/:id',
        name: 'offer-edit',
        component: OfferEdit,
        props: true
    },
    {
        path: '/offer/delete/:id',
        name: 'offer-delete',
        component: OfferDelete,
        props: true
    },
    {
        path: '/offer/details/:id',
        name: 'offer-details',
        component: OfferDetails,
        props: true
    },

    {
        path: '/price',
        name: 'price',
        component: PriceIndex
    },
    {
        path: '/price/:id',
        name: 'price-category',
        component: PriceIndex
    },
    {
        path: '/price/create',
        name: 'price-create',
        component: PriceCreate
    },
    {
        path: '/price/edit/:id',
        name: 'price-edit',
        component: PriceEdit,
        props: true
    },
    {
        path: '/price/delete/:id',
        name: 'price-delete',
        component: PriceDelete,
        props: true
    },
    {
        path: '/price/details/:id',
        name: 'price-details',
        component: PriceDetails,
        props: true
    },

    {
        path: '/product',
        name: 'product',
        component: ProductIndex,
        props: true
    },
    {
        path: '/product/scan/:barcode',
        name: 'product-scan',
        component: ProductIndex,
        props: true
    },
    {
        path: '/product/create',
        name: 'product-create',
        component: ProductCreate
    },
    {
        path: '/product/import',
        name: 'product-import',
        component: ProductImport
    },
    {
        path: '/product/edit/:id',
        name: 'product-edit',
        component: ProductEdit,
        props: true
    },
    {
        path: '/product/delete/:id',
        name: 'product-delete',
        component: ProductDelete,
        props: true
    },
    {
        path: '/product/details/:id',
        name: 'product-details',
        component: ProductDetails,
        props: true
    },
    {
        path: '/review',
        name: 'review',
        component: ReviewIndex
    },
    {
        path: '/review/create',
        name: 'review-create',
        component: ReviewCreate,
    },
    {
        path: '/review/create/:id',
        name: 'review-create-with-product',
        component: ReviewCreate,
        props: true,
    },
    {
        path: '/review/edit/:id',
        name: 'review-edit',
        component: ReviewEdit,
        props: true
    },
    {
        path: '/review/delete/:id',
        name: 'review-delete',
        component: ReviewDelete,
        props: true
    },
    {
        path: '/review/details/:id',
        name: 'review-details',
        component: ReviewDetails,
        props: true
    },

    {
        path: '/role',
        name: 'role',
        component: RoleIndex
    },
    {
        path: '/role/create/:id',
        name: 'role-create',
        component: RoleCreate,
        props: true
    },
    {
        path: '/role/edit/:id',
        name: 'role-edit',
        component: RoleEdit,
        props: true
    },
    {
        path: '/role/delete/:id',
        name: 'role-delete',
        component: RoleDelete,
        props: true
    },
    {
        path: '/role/details/:id',
        name: 'role-details',
        component: RoleDetails,
        props: true
    },

    {
        path: '/shop',
        name: 'shop',
        component: ShopIndex
    },
    {
        path: '/shop/create',
        name: 'shop-create',
        component: ShopCreate
    },
    {
        path: '/shop/edit/:id',
        name: 'shop-edit',
        component: ShopEdit,
        props: true
    },
    {
        path: '/shop/delete/:id',
        name: 'shop-delete',
        component: ShopDelete,
        props: true
    },
    {
        path: '/shop/details/:id',
        name: 'shop-details',
        component: ShopDetails,
        props: true
    },

    {
        path: '/user',
        name: 'user',
        component: ShopIndex
    },
    {
        path: '/user/create',
        name: 'user-create',
        component: ShopCreate
    },
    {
        path: '/user/edit/:id',
        name: 'user-edit',
        component: ShopEdit,
        props: true
    },
    {
        path: '/user/delete/:id',
        name: 'user-delete',
        component: ShopDelete,
        props: true
    },
    {
        path: '/user/details/:id',
        name: 'user-details',
        component: ShopDetails,
        props: true
    },

    {
        path: '/watchlist',
        name: 'watchlist',
        component: WatchlistIndex
    },
    {
        path: '/watchlist/create',
        name: 'watchlist-create',
        component: WatchlistCreate
    },
    {
        path: '/watchlist/edit/:id',
        name: 'watchlist-edit',
        component: WatchlistEdit,
        props: true
    },
    {
        path: '/watchlist/delete/:id',
        name: 'watchlist-delete',
        component: WatchlistDelete,
        props: true
    },
    {
        path: '/watchlist/details/:id',
        name: 'watchlist-details',
        component: WatchlistDetails,
        props: true
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
