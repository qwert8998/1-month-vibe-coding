export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Customers
  CUSTOMER_LIST: '/customer',
  CUSTOMER_CREATE: '/customer/create',
  CUSTOMER_DETAIL_PATTERN: '/customer/:id',

  // Users
  USER_LIST: '/users',
  USER_CREATE: '/users/create',
  USER_DETAIL_PATTERN: '/users/:userId',

  // Orders
  ORDER_LIST: '/orders',
  ORDER_CREATE: '/orders/create',
  ORDER_DETAIL_PATTERN: '/orders/:orderId',
} as const;

export const routeBuilders = {
  customerDetail: (id: number | string) => `/customer/${id}`,
  userDetail: (id: number | string) => `/users/${id}`,
  orderDetail: (id: number | string) => `/orders/${id}`,
} as const;
