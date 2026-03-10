import { useState, createContext, useContext } from 'react'

const BrandContext = createContext(null)

const defaultBrand = {
  name: '',
  logoPath: null,
  primaryColor: '#7C3AED',
  secondaryColor: '#4F46E5',
  accentColor: '#F5F5F5',
  backgroundColor: '#0F0F0F',
  fontFamily: 'Inter',
  colors: ['#7C3AED', '#4F46E5', '#F5F5F5', '#0F0F0F'],
}

export const BrandProvider = ({ children }) => {
  const [brand, setBrand] = useState(() => {
    try {
      const saved = localStorage.getItem('acces-brand-kit')
      return saved ? JSON.parse(saved) : defaultBrand
    } catch {
      return defaultBrand
    }
  })

  const updateBrand = (updates) => {
    const updated = { ...brand, ...updates }
    setBrand(updated)
    try {
      localStorage.setItem('acces-brand-kit', JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to save brand kit:', err)
    }
  }

  const resetBrand = () => {
    setBrand(defaultBrand)
    localStorage.removeItem('acces-brand-kit')
  }

  const applyBrandToProject = (project) => {
    return {
      ...project,
      brand: {
        primaryColor: brand.primaryColor,
        secondaryColor: brand.secondaryColor,
        fontFamily: brand.fontFamily,
        logoPath: brand.logoPath,
      },
    }
  }

  return (
    <BrandContext.Provider
      value={{
        brand,
        updateBrand,
        resetBrand,
        applyBrandToProject,
      }}
    >
      {children}
    </BrandContext.Provider>
  )
}

export const useBrandStore = () => {
  const context = useContext(BrandContext)
  if (!context) throw new Error('useBrandStore must be used inside BrandProvider')
  return context
}

export default BrandContext