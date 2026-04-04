'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function useMobileMenuState() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)

  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname
    if (isOpen) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isOpen, setIsOpen }
}
