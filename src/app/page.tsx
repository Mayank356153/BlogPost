

import React,{useState} from 'react'
import Link from 'next/link'
export default function page() {
  
  
  return (
    <div className='flex justify-center items-center bg-gray-400 w-full h-screen text-2xl font-bold'>
    <Link href="/login">
    
     <h1>Login</h1>
    </Link>
    </div>
  )
}
