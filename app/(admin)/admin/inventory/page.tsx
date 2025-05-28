import InventoryPage from '@/components/admin/inventory-page-client'
import { fetchCars } from '@/server actions/actions'
import React from 'react'

const InventoryServerPage = async  () => {
  const filters= { }
 const dummyCars = await fetchCars(filters);
  return (
    <InventoryPage dummyCars={dummyCars}/>
  )
}

export default InventoryServerPage