import EditContentPageClient from '@/components/admin/edit-content-page'
import React from 'react'
export const dynamic = 'force-dynamic'

const EditContentPage = async () => {
 const res =  await fetch('http:localhost:3000/api/cms')
 const data = await res.json()
 console.log("This is the response from fetching the content data: ", data)
  return (
    <EditContentPageClient />
  )
}

export default EditContentPage