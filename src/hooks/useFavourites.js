import { useEffect, useReducer } from 'react'
import { favouriteActions, favouritesReducer } from '../reducers/favouritesReducer'

const FAVOURITES_STORAGE_KEY = 'celebrate-favourite-photo-ids'

function getSavedFavouriteIds() {
  try {
    const savedFavourites = localStorage.getItem(FAVOURITES_STORAGE_KEY)

    if (!savedFavourites) {
      return []
    }

    const favouriteIds = JSON.parse(savedFavourites)

    if (!Array.isArray(favouriteIds)) {
      return []
    }

    return [...new Set(favouriteIds.filter((id) => typeof id === 'string'))]
  } catch {
    return []
  }
}

function useFavourites() {
  const [favouriteIds, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    getSavedFavouriteIds,
  )

  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favouriteIds))
    } catch {
      // The gallery remains usable if browser storage is unavailable.
    }
  }, [favouriteIds])

  function addFavourite(photoId) {
    dispatch({ type: favouriteActions.add, photoId })
  }

  function removeFavourite(photoId) {
    dispatch({ type: favouriteActions.remove, photoId })
  }

  return { favouriteIds, addFavourite, removeFavourite }
}

export default useFavourites
