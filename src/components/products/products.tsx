import { QueryResult } from '@upstash/vector'

import { Product as TProduct } from '@/db'
import ProductSkeleton from './product-skeleton'
import Product from './product'

const Products = ({ products }: { products: QueryResult<TProduct>[] | undefined }) => {
  return (
    <>
      {products
        ? products?.map((product) => <Product product={product.metadata!} key={product.id} />)
        : Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
    </>
  )
}

export default Products
