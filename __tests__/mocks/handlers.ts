import { http, HttpResponse, delay } from 'msw'

const API_BASE = '/api'

export const handlers = [
  http.get(`${API_BASE}/orders`, async ({ request }) => {
    await delay(100)

    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    const mockOrders = [
      {
        id: 'order-001',
        roomId: 'room-001',
        customerId: 'member-001',
        status: 'confirmed',
        paymentStatus: 'unpaid',
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'order-002',
        roomId: 'room-002',
        customerId: 'member-002',
        status: 'preparing',
        paymentStatus: 'paid',
        items: [
          { id: 'item-001', name: '青岛啤酒', quantity: 5, price: 25 },
        ],
        subtotal: 125,
        discount: 0,
        total: 125,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    let filteredOrders = mockOrders
    if (status) {
      filteredOrders = mockOrders.filter((order) => order.status === status)
    }

    const start = (page - 1) * pageSize
    const paginatedOrders = filteredOrders.slice(start, start + pageSize)

    return HttpResponse.json({
      data: paginatedOrders,
      total: filteredOrders.length,
      page,
      pageSize,
    })
  }),

  http.post(`${API_BASE}/orders`, async ({ request }) => {
    await delay(150)

    const body = (await request.json()) as Record<string, any>
    const newOrder = {
      id: `order-${Date.now()}`,
      ...body,
      status: 'confirmed',
      paymentStatus: 'unpaid' as const,
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(newOrder, { status: 201 })
  }),

  http.put(`${API_BASE}/orders/:id`, async ({ params, request }) => {
    await delay(100)

    const { id } = params

    if (!id || id === '') {
      return HttpResponse.json(
        { error: '订单ID不能为空', code: 'INVALID_ORDER_ID' },
        { status: 400 }
      )
    }

    const body = (await request.json()) as Record<string, any>

    if (id === 'nonexistent-order') {
      return HttpResponse.json(
        { error: '订单不存在', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      )
    }

    const updatedOrder = {
      id,
      roomId: 'room-updated',
      customerId: 'member-001',
      status: 'confirmed',
      paymentStatus: 'partial_paid' as const,
      items: [
        { id: 'item-001', name: '青岛啤酒', quantity: 5, price: 25 },
      ],
      subtotal: 125,
      discount: body.discount || 0,
      total: 125 - (body.discount || 0),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      ...body,
    } as Record<string, any>

    return HttpResponse.json(updatedOrder)
  }),

  http.post(`${API_BASE}/orders/:id/items`, async ({ params, request }) => {
    await delay(80)

    const { id } = params
    const body = (await request.json()) as Record<string, any>

    const newItem = {
      id: `item-${Date.now()}`,
      orderId: id,
      ...body,
      createdAt: new Date().toISOString(),
    }

    return HttpResponse.json(newItem, { status: 201 })
  }),

  http.get(`${API_BASE}/rooms`, async () => {
    await delay(100)

    return HttpResponse.json({
      data: [
        {
          id: 'room-001',
          number: '101',
          type: 'standard',
          capacity: 6,
          status: 'available',
          floor: 1,
          building: 'A',
        },
        {
          id: 'room-002',
          number: '201',
          type: 'vip',
          capacity: 12,
          status: 'occupied',
          floor: 2,
          building: 'A',
        },
      ],
      total: 2,
    })
  }),

  http.get(`${API_BASE}/auth/me`, async () => {
    await delay(50)

    return HttpResponse.json({
      user: {
        id: 'user-001',
        username: 'test_user',
        email: 'test@example.com',
        role: 'admin',
      },
      token: 'mock-jwt-token-' + Date.now(),
    })
  }),

  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(200)

    const body = (await request.json()) as Record<string, any>

    if (!body.username || !body.password) {
      return HttpResponse.json(
        { error: '用户名和密码不能为空', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      user: {
        id: 'user-001',
        username: body.username,
        email: `${body.username}@example.com`,
        role: 'admin',
      },
      token: 'mock-jwt-token-' + Date.now(),
    })
  }),

  http.get(`${API_BASE}/inventory`, async ({ request }) => {
    await delay(120)

    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')

    let inventoryItems = [
      {
        id: 'inv-001',
        name: '青岛啤酒',
        category: 'drinks',
        quantity: 50,
        price: 25,
        lowStockThreshold: 10,
        status: 'normal',
      },
      {
        id: 'inv-002',
        name: '红酒',
        category: 'drinks',
        quantity: 3,
        price: 180,
        lowStockThreshold: 5,
        status: 'low_stock',
      },
    ]

    if (category) {
      inventoryItems = inventoryItems.filter(
        (item) => item.category === category
      )
    }

    if (search) {
      inventoryItems = inventoryItems.filter((item) =>
        item.name.includes(search)
      )
    }

    return HttpResponse.json({
      data: inventoryItems,
      total: inventoryItems.length,
    })
  }),
]
