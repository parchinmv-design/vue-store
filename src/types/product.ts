export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type SortOrder = 'default' | 'asc' | 'desc'
