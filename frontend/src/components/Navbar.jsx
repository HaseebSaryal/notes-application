import React from 'react'
import { Link } from 'react-router'
import { LogOutIcon, PlusIcon, UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { clearAuthSession } from '../libs/auth'
import useAuthSession from '../libs/useAuthSession'

const Navbar = () => {
  const { user, token } = useAuthSession()

  const handleLogout = () => {
    clearAuthSession()
    toast.success('Logged out')
  }

  return (
    <header className='bg-base-300 border-b border-base-content/10'>
      <div className='mx-auto max-w-6xl px-4 py-3'>
        <div className='flex justify-between items-center gap-2'>

          {/* Logo */}
          <Link to='/' className='flex items-center gap-2 text-2xl sm:text-4xl font-mono tracking-tight font-bold text-primary shrink-0'>
            <img src='/notes.png' alt='Notes logo' className='h-8 w-8 sm:h-10 sm:w-10 object-contain' />
            <span> Smart Notes</span>
          </Link>

          {/* Right side */}
          <div className='flex items-center gap-2'>

            {/* New Note */}
            <Link to='/create' className='btn btn-primary btn-sm sm:btn-md'>
              <PlusIcon className='size-4' />
              <span className='hidden sm:inline'>New Note</span>
            </Link>

            {token ? (
              <>
                {/* Username — hidden on mobile */}
                <div className='hidden md:flex items-center gap-2 border border-base-content/10 bg-base-100/70 px-3 py-1.5 text-sm text-base-content/75'>
                  <UserIcon className='size-4 text-primary' />
                  <span>{user?.username || 'User'}</span>
                </div>

                {/* Logout */}
                <button
                  type='button'
                  onClick={handleLogout}
                  className='btn btn-ghost btn-outline btn-sm sm:btn-md'
                >
                  <LogOutIcon className='size-4' />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              </>
            ) : (
              <Link to='/login' className='btn btn-outline btn-primary btn-sm sm:btn-md'>
                Login
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar