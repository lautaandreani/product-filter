'use client'
import { useCallback, useEffect, useState } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Slider } from '@/components/ui/slider'
import Products from '@/components/products/products'

import { cn } from '@/lib/utils'
import { ProductState } from '@/lib/validators/product-validator'
import debounce from 'lodash.debounce'
import { fetchProducts } from '@/services/products.services'

const SORT_OPTIONS = [
  { name: 'None', value: 'none' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
] as const

const SUBCATEGORIES = [
  { name: 'T-Shirts', selected: true, href: '#' },
  { name: 'Hoodies', selected: false, href: '#' },
  { name: 'Sweatshirts', selected: false, href: '#' },
  { name: 'Accessories', selected: false, href: '#' },
] as const

const COLOR_FILTER = {
  id: 'color',
  name: 'Color',
  options: [
    { value: 'white', label: 'White' },
    { value: 'beige', label: 'Beige' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
  ] as const,
}

const SIZE_FILTERS = {
  id: 'size',
  name: 'size',
  options: [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
  ] as const,
}

const PRICE_FILTERS = {
  id: 'price',
  name: 'Price',
  options: [
    { value: [0, 100], label: 'Any price' },
    { value: [0, 20], label: 'Under 20$' },
    { value: [0, 40], label: 'Under 40$' },
  ],
} as const

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number]

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    sort: 'none',
    color: ['beige', 'blue', 'green', 'purple', 'white'],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ['L', 'M', 'S'],
  })

  const applyArrayFilters = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, 'price' | 'sort'>
    value: string
  }) => {
    const isFilterApplied = filter[category].includes(value as never)

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }))
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }))
    }
  }

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1])
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1])

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(filter),
  })

  useEffect(() => {
    _debouncedSubmit()
  }, [filter])

  const onSubmit = () => refetch()

  const debouncedSubmit = debounce(onSubmit, 400)
  const _debouncedSubmit = useCallback(debouncedSubmit, [])

  return (
    <main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24'>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900'>High-quality cotton selection</h1>

        <div className='flex items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger className='group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
              Sort
              <ChevronDown className='-mr-1 ml-1 size-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {SORT_OPTIONS.map(({ name, value }) => {
                return (
                  <button
                    key={value}
                    className={cn('text-left w-full block px-4 py-2 text-sm', {
                      'text-gray-900 bg-gray-100': value === filter.sort,
                      'text-gray-500': value !== filter.sort,
                    })}
                    onClick={() => {
                      setFilter((prev) => ({ ...prev, sort: value }))
                    }}
                  >
                    {name}
                  </button>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className='-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden'>
            <Filter className='size-5' />
          </button>
        </div>
      </div>

      <section className='pb-24 pt-6'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 relative'>
          <div className='hidden lg:block sticky top-0'>
            <ul className='space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900'>
              {SUBCATEGORIES.map(({ name, selected }) => (
                <li key={name}>
                  <button className='disabled:cursor-not-allowed disabled:opacity-60' disabled={!selected}>
                    {name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Filters */}
            <Accordion type='single' className='animate-none' collapsible>
              {/* Color filter */}
              <AccordionItem value='color'>
                <AccordionTrigger className='py-3 text-sm text-gray-400 hover:text-gray-500 hover:no-underline'>
                  <span className='font-medium text-gray-900'>Color</span>
                </AccordionTrigger>
                <AccordionContent className='animate-none'>
                  <ul className='space-y-4'>
                    {COLOR_FILTER.options.map(({ value, label }, optionIdx) => (
                      <li key={value} className='flex items-center'>
                        <input
                          type='checkbox'
                          id={`color-${optionIdx}`}
                          checked={filter.color.includes(value)}
                          onChange={() => applyArrayFilters({ category: 'color', value })}
                          className='size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600'
                        />
                        <label htmlFor={`color-${optionIdx}`} className='ml-3 text-sm text-gray-600'>
                          {label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* Size filter */}
              <AccordionItem value='size'>
                <AccordionTrigger className='py-3 text-sm text-gray-400 hover:text-gray-500 hover:no-underline'>
                  <span className='font-medium text-gray-900'>Size</span>
                </AccordionTrigger>
                <AccordionContent className='animate-none'>
                  <ul className='space-y-4'>
                    {SIZE_FILTERS.options.map(({ value, label }, optionIdx) => (
                      <li key={value} className='flex items-center'>
                        <input
                          type='checkbox'
                          id={`size-${optionIdx}`}
                          checked={filter.size.includes(value)}
                          onChange={() => applyArrayFilters({ category: 'size', value })}
                          className='size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600'
                        />
                        <label htmlFor={`size-${optionIdx}`} className='ml-3 text-sm text-gray-600'>
                          {label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* Price filter */}
              <AccordionItem value='price'>
                <AccordionTrigger className='py-3 text-sm text-gray-400 hover:text-gray-500 hover:no-underline'>
                  <span className='font-medium text-gray-900'>Price</span>
                </AccordionTrigger>
                <AccordionContent className='animate-none'>
                  <ul className='space-y-4'>
                    {PRICE_FILTERS.options.map(({ value, label }, optionIdx) => (
                      <li key={label} className='flex items-center'>
                        <input
                          type='radio'
                          id={`price-${optionIdx}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...value],
                              },
                            }))
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === value[0] &&
                            filter.price.range[1] === value[1]
                          }
                          className='size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600'
                        />
                        <label htmlFor={`price-${optionIdx}`} className='ml-3 text-sm text-gray-600'>
                          {label}
                        </label>
                      </li>
                    ))}

                    <li className='flex justify-center flex-col gap-2'>
                      <div>
                        <input
                          type='radio'
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100],
                              },
                            }))
                          }}
                          checked={filter.price.isCustom}
                          className='size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600'
                        />
                        <label htmlFor={`price-${PRICE_FILTERS.options.length}`} className='ml-3 text-sm text-gray-600'>
                          Custom
                        </label>
                      </div>

                      <div className='flex justify-between'>
                        <p className='font-medium'> Price </p>
                        <div>
                          {filter.price.isCustom ? minPrice.toFixed(0) : filter.price.range[0].toFixed(0)}$ -{' '}
                          {filter.price.isCustom ? maxPrice.toFixed(0) : filter.price.range[1].toFixed(0)}$
                        </div>
                      </div>

                      <Slider
                        className={cn({
                          'opacity-50': !filter.price.isCustom,
                        })}
                        disabled={!filter.price.isCustom}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range

                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }))
                        }}
                        value={filter.price.isCustom ? filter.price.range : DEFAULT_CUSTOM_PRICE}
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Products Grid */}
          <ul className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
            <Products products={products} />
          </ul>
        </div>
      </section>
    </main>
  )
}
