import * as React from 'react'
import { User } from '@/core/domain/User'
import { IUserRepository } from '@/core/infrastructure/repositories/userRepository'

export const ProductList: React.FC = () => {
  const [products, setProducts] = React.useState<User[]>([])

  React.useEffect(() => {
    IUserRepository.getProducts().then(setProducts)
  }, [])

  return (
    <div>
      <ul>
        {products.map((product) => <li key={product.email}>{product.gender}|{product.email}|{product.phone}</li>)}
      </ul>
    </div>
  )
}