'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">MyApp</h1>
      <nav className="space-x-4">
        <Link href="/login/lk" className="hover:text-blue-400">Home</Link>
        <Link href="/blog" className="hover:text-blue-400">Blog</Link>
        <Link href="/about" className="hover:text-blue-400">About</Link>
      </nav>
    </header>
  )
}
