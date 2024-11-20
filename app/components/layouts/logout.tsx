import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        console.log('Logged out successfully')
        router.push('/') // Redirect to home page after successful logout
        router.refresh() // Refresh the current page to update the UI
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return <button onClick={handleLogout}>Log out</button>
}