import { QueryResult } from '@upstash/vector'
import { Product as TProduct } from '@/db'

import { ProductState } from '@/lib/validators/product-validator'

import axios from 'axios'

export const fetchProducts = async (filter: ProductState) => {
  try {
    const { data } = await axios.post<QueryResult<TProduct>[]>('/api/products', {
      filter: {
        sort: filter.sort,
        color: filter.color,
        price: filter.price.range,
        size: filter.size,
      },
    })

    return data
  } catch (error) {
    console.error("Error fetching products")
  }
}
