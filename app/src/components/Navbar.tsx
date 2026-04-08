import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="flex gap-4 text-sm">
      <Link href="/">Home</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  )
}
