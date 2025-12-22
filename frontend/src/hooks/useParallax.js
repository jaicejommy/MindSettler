import { useEffect, useRef, useState } from 'react'

export function useParallax(offset = 0.5) {
  const ref = useRef(null)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const scrollY = window.scrollY
      const elementTop = ref.current.offsetTop
      const distance = scrollY - elementTop
      setPosition(distance * offset)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return [ref, position]
}
