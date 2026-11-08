import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

/**
 * Custom hook for car listing, searching, filtering, and favorites
 */
export function useCars() {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedFuel, setSelectedFuel] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  // Active car for details modal
  const [selectedCar, setSelectedCar] = useState(null)

  const fetchCars = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.getCars()
      setCars(data)
    } catch (err) {
      setError(err.message || 'Не вдалося завантажити список автомобілів')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const toggleFavorite = useCallback(async (carId) => {
    let currentFav = false
    setCars((prev) =>
      prev.map((c) => {
        if (c.id === carId) {
          currentFav = c.favorite
          return { ...c, favorite: !c.favorite }
        }
        return c
      }),
    )

    setSelectedCar((prev) =>
      prev && prev.id === carId ? { ...prev, favorite: !prev.favorite } : prev,
    )

    try {
      await api.toggleFavorite(carId, currentFav)
    } catch {
      // Revert if API fails
      setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, favorite: currentFav } : c)))
    }
  }, [])

  const addCar = useCallback(async (newCarData) => {
    const created = await api.addCar(newCarData)
    setCars((prev) => [created, ...prev])
    return created
  }, [])

  const resetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedDept('')
    setSelectedFuel('')
    setMinYear('')
    setMaxYear('')
    setOnlyFavorites(false)
  }, [])

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim()
        const matchBrand = (car.brand || '').toLowerCase().includes(query)
        const matchModel = (car.model || '').toLowerCase().includes(query)
        const matchOwner = (car.owner || '').toLowerCase().includes(query)
        const matchFaculty = (car.faculty || '').toLowerCase().includes(query)
        if (!matchBrand && !matchModel && !matchOwner && !matchFaculty) {
          return false
        }
      }

      if (selectedDept && car.faculty !== selectedDept) {
        return false
      }

      if (selectedFuel && car.fuel !== selectedFuel) {
        return false
      }

      if (minYear && Number(car.year) < Number(minYear)) {
        return false
      }

      if (maxYear && Number(car.year) > Number(maxYear)) {
        return false
      }

      if (onlyFavorites && !car.favorite) {
        return false
      }

      return true
    })
  }, [cars, searchTerm, selectedDept, selectedFuel, minYear, maxYear, onlyFavorites])

  return {
    cars,
    filteredCars,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedFuel,
    setSelectedFuel,
    minYear,
    setMinYear,
    maxYear,
    setMaxYear,
    onlyFavorites,
    setOnlyFavorites,
    selectedCar,
    setSelectedCar,
    toggleFavorite,
    addCar,
    resetFilters,
    refetch: fetchCars,
  }
}
