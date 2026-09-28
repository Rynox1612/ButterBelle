import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

function unwrap(request) {
  return request.then((response) => response.data)
}

export const productsApi = {
  list: () => unwrap(api.get('/products')),
  get: (id) => unwrap(api.get(`/products/${id}`)),
  create: (product) => unwrap(api.post('/products', product)),
  update: (id, product) => unwrap(api.put(`/products/${id}`, product)),
  remove: (id) => unwrap(api.delete(`/products/${id}`)),
}

export const customersApi = {
  list: () => unwrap(api.get('/customers')),
  get: (id) => unwrap(api.get(`/customers/${id}`)),
  create: (customer) => unwrap(api.post('/customers', customer)),
  update: (id, customer) => unwrap(api.put(`/customers/${id}`, customer)),
  remove: (id) => unwrap(api.delete(`/customers/${id}`)),
}

export function getErrorMessage(error) {
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond.'
  if (!error.response) return 'Could not reach the ButterBell API. Is the backend running?'
  if (error.response.status === 404) return 'This record could not be found.'
  return 'Something went wrong. Please try again.'
}
