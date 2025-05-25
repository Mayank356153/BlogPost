'use client'

import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-white p-6 fixed top-0 left-0">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/" className="hover:bg-gray-700 p-2 rounded">Home</Link>
        <Link href="/blog" className="hover:bg-gray-700 p-2 rounded">Blog</Link>
        <Link href="/about" className="hover:bg-gray-700 p-2 rounded">About</Link>
        <Link href="/contact" className="hover:bg-gray-700 p-2 rounded">Contact</Link>
      </nav>
    </aside>
  )
}
