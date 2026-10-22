import { useEffect, useState } from 'react'

const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=30'

function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        const response = await fetch(PHOTOS_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Unable to load photos (${response.status})`)
        }

        const data = await response.json()

        if (!controller.signal.aborted) {
          setPhotos(data)
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchPhotos()

    // Cancels the request if the component using this hook unmounts.
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}

export default useFetchPhotos
