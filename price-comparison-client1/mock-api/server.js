const http = require('http')
const { URL } = require('url')

const port = Number(process.env.MOCK_API_PORT || 3001)

const initialData = () => {
    const categories = [
        { id: 1, name: 'Fruit', categoryTypeCode: 'fruit' },
        { id: 2, name: 'Dairy', categoryTypeCode: 'dairy' }
    ]

    const shops = [
        {
            id: 1,
            name: 'Mock Market',
            address: '1 Demo Street',
            url: 'mock-market.png',
            latitude: 59.436962,
            longitude: 24.753574
        },
        {
            id: 2,
            name: 'Sample Store',
            address: '2 Example Avenue',
            url: 'sample-store.png',
            latitude: 59.4375,
            longitude: 24.75
        }
    ]

    const products = [
        {
            id: 1,
            categoryId: 1,
            barcode: '474000100001',
            name: 'Mock Apple',
            description: 'Fresh mock data apple',
            minPrice: 0.79
        },
        {
            id: 2,
            categoryId: 2,
            barcode: '474000100002',
            name: 'Sample Milk',
            description: 'Simple mock milk',
            minPrice: 1.19
        }
    ]

    const offers = [
        {
            id: 1,
            productId: 1,
            shopId: 1,
            barcode: '474000100001',
            name: 'Mock Apple',
            description: 'Mock offer for apple',
            addedBy: 'mock.user@example.com',
            categoryId: 1,
            price: { id: 1, offerId: 1, amount: 0.79, currency: 'EUR' }
        },
        {
            id: 2,
            productId: 1,
            shopId: 2,
            barcode: '474000100001',
            name: 'Mock Apple',
            description: 'Discounted mock offer',
            addedBy: 'mock.user@example.com',
            categoryId: 1,
            price: { id: 2, offerId: 2, amount: 0.75, currency: 'EUR' }
        },
        {
            id: 3,
            productId: 2,
            shopId: 1,
            barcode: '474000100002',
            name: 'Sample Milk',
            description: 'Mock milk offer',
            addedBy: 'mock.user@example.com',
            categoryId: 2,
            price: { id: 3, offerId: 3, amount: 1.19, currency: 'EUR' }
        }
    ]

    return {
        account: [],
        alarm: [],
        category: categories,
        customer: [],
        feature: [],
        metric: [],
        offer: offers,
        price: offers.map((offer) => offer.price),
        product: products,
        review: [],
        role: [],
        shop: shops,
        stats: [],
        user: [],
        watchlist: []
    }
}

const collections = initialData()

const nextIds = Object.fromEntries(
    Object.entries(collections).map(([name, items]) => [
        name,
        items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
    ])
)

const authPayload = {
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    firstname: 'Mock',
    lastname: 'User',
    roles: 'user,admin'
}

const sendJson = (response, statusCode, payload) => {
    response.writeHead(statusCode, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    })
    response.end(JSON.stringify(payload))
}

const parseBody = async (request) => {
    const chunks = []

    for await (const chunk of request) {
        chunks.push(chunk)
    }

    if (chunks.length === 0) {
        return {}
    }

    const raw = Buffer.concat(chunks).toString('utf8')
    const contentType = request.headers['content-type'] || ''

    if (contentType.includes('application/json')) {
        return raw ? JSON.parse(raw) : {}
    }

    return { raw }
}

const withOfferRelations = (offer) => ({
    ...offer,
    shop: collections.shop.find((item) => item.id === offer.shopId) || null
})

const matchesSearch = (item, criteria) => {
    return Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return true
        }

        const itemValue = item[key]

        if (typeof value === 'string') {
            return String(itemValue || '').toLowerCase().includes(value.toLowerCase())
        }

        return itemValue === value
    })
}

const buildDetails = (resource, item) => {
    if (resource === 'offer') {
        if (Array.isArray(item)) {
            return item.map(withOfferRelations)
        }

        return withOfferRelations(item)
    }

    return item
}

const getCollection = (resource) => collections[resource]

const server = http.createServer(async (request, response) => {
    if (!request.url || !request.method) {
        sendJson(response, 400, { error: 'Bad request' })
        return
    }

    if (request.method === 'OPTIONS') {
        sendJson(response, 204, {})
        return
    }

    const url = new URL(request.url, `http://${request.headers.host}`)
    const pathSegments = url.pathname.split('/').filter(Boolean)

    if (url.pathname === '/v1/auth/login' || url.pathname === '/v1/auth/register' || url.pathname === '/v1/auth/refresh') {
        sendJson(response, 200, authPayload)
        return
    }

    if (url.pathname === '/v1/stats/public') {
        sendJson(response, 200, {
            details: {
                numOfProducts: collections.product.length,
                numOfPriceUpdates: collections.offer.length,
                numOfUsers: 1
            }
        })
        return
    }

    if (url.pathname === '/about') {
        const body = await parseBody(request)
        sendJson(response, 200, { details: body })
        return
    }

    if (url.pathname === '/preview-file') {
        sendJson(response, 200, { details: { preview: 'mock preview ready' } })
        return
    }

    if (url.pathname === '/v1/offer/upload') {
        sendJson(response, 200, { details: { uploaded: true } })
        return
    }

    if (url.pathname === '/v1/product/import') {
        const body = await parseBody(request)
        sendJson(response, 200, { details: body.products || [] })
        return
    }

    if (pathSegments[0] !== 'v1' || pathSegments.length < 2) {
        sendJson(response, 404, { error: 'Route not found' })
        return
    }

    const resource = pathSegments[1]
    const collection = getCollection(resource)

    if (!collection) {
        sendJson(response, 404, { error: `Unknown resource: ${resource}` })
        return
    }

    if (pathSegments[2] === 'search' && request.method === 'POST') {
        const body = await parseBody(request)
        const details = collection.filter((item) => matchesSearch(item, body))
        sendJson(response, 200, { details: buildDetails(resource, details) })
        return
    }

    if (resource === 'offer' && pathSegments[2] === 'product' && pathSegments[3] && request.method === 'GET') {
        const productId = Number(pathSegments[3])
        const details = collection.filter((item) => item.productId === productId)
        sendJson(response, 200, { details: buildDetails(resource, details) })
        return
    }

    if (pathSegments.length === 2) {
        if (request.method === 'GET') {
            sendJson(response, 200, { details: buildDetails(resource, collection) })
            return
        }

        if (request.method === 'POST') {
            const body = await parseBody(request)
            const newItem = { ...body, id: nextIds[resource]++ }
            collection.push(newItem)
            sendJson(response, 200, { details: buildDetails(resource, newItem) })
            return
        }
    }

    const id = Number(pathSegments[2])
    const itemIndex = collection.findIndex((item) => Number(item.id) === id)

    if (Number.isNaN(id) || itemIndex === -1) {
        sendJson(response, 404, { error: 'Item not found' })
        return
    }

    if (request.method === 'GET') {
        sendJson(response, 200, { details: buildDetails(resource, collection[itemIndex]) })
        return
    }

    if (request.method === 'PUT') {
        const body = await parseBody(request)
        collection[itemIndex] = { ...collection[itemIndex], ...body, id }
        sendJson(response, 200, { details: buildDetails(resource, collection[itemIndex]) })
        return
    }

    if (request.method === 'DELETE') {
        collection.splice(itemIndex, 1)
        sendJson(response, 200, { details: id })
        return
    }

    sendJson(response, 405, { error: 'Method not allowed' })
})

server.listen(port, () => {
    console.log(`Mock API server listening on http://localhost:${port}`)
})
