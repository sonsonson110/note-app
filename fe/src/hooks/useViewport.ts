import { useState, useEffect } from "react"

export const useViewport = () => {
    const [width, setWidth] = useState(window.innerWidth)
    const isMobile = width < 768
  
    useEffect(() => {
      const handleWindowResize = () => setWidth(window.innerWidth)
      window.addEventListener('resize', handleWindowResize)
      return () => window.removeEventListener('resize', handleWindowResize)
    }, [])
  
    return { width, isMobile }
  }