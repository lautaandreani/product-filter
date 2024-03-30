import type { Product as TProduct } from '@/db'
import Image from 'next/image'

const Product = ({ product }: { product: TProduct }) => {
  return (
    <div className='group relative'>
      <div className='aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80'>
        <Image
          src={`/${product.imageId}`}
          alt={product.name}
          height={1200}
          width={1200}
          className='object-cover object-center'
        />
      </div>

      <footer className='mt-4 flex justify-between'>
        <div>
          <h3 className='text-sm text-gray-700'>{product.name}</h3>
          <p className='mt-1 text-sm text-gray-500'>
            Size {product.size.toUpperCase()}, {product.color}
          </p>
        </div>

        <p className='text-sm font-medium text-gray-900'>{product.price}</p>
      </footer>
    </div>
  )
}

export default Product
