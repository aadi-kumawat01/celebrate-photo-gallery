import { useCallback, useMemo, useState } from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'
import useFavourites from './hooks/useFavourites'

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#77736D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-4" role="status">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-[#E9E5DE] border-t-[#9F3048] motion-reduce:animate-none" />
      <span className="text-sm tracking-wide text-[#77736D]">Curating the collection</span>
      <span className="sr-only">Loading photos</span>
    </div>
  )
}

function App() {
  const { photos, loading, error } = useFetchPhotos()
  const { favouriteIds, addFavourite, removeFavourite } = useFavourites()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return photos
    }

    return photos.filter((photo) => photo.author.toLowerCase().includes(query))
  }, [photos, searchQuery])

  function toggleFavourite(photoId) {
    if (favouriteIds.includes(photoId)) {
      removeFavourite(photoId)
      return
    }

    addFavourite(photoId)
  }

  const photoCountLabel = `${filteredPhotos.length} ${filteredPhotos.length === 1 ? 'photograph' : 'photographs'}`

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-5 py-14 text-[#242321] sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 border-b border-[#E9E5DE] pb-10 sm:mb-14 sm:pb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9F3048]">Celebrate</p>
          <div className="mt-5 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-serif text-5xl font-bold tracking-[-0.045em] text-[#242321] sm:text-6xl">Photo Gallery.</h1>
              <p className="mt-4 text-base leading-7 text-[#77736D]">A collection of moments, captured beautifully.</p>
            </div>
            <p aria-live="polite" className="text-sm font-medium tracking-wide text-[#77736D]">
              {loading ? 'Loading collection' : photoCountLabel}
            </p>
          </div>
          <div className="relative mt-9 max-w-xl">
            <SearchIcon />
            <label className="sr-only" htmlFor="photo-search">Search photos by author</label>
            <input
              className="w-full rounded-xl border border-[#E9E5DE] bg-white py-3.5 pr-4 pl-12 text-[15px] text-[#242321] shadow-[0_2px_10px_rgba(36,35,33,0.03)] outline-none placeholder:text-[#9D9992] focus:border-[#9F3048] focus:ring-4 focus:ring-[#9F3048]/10"
              id="photo-search"
              onChange={handleSearchChange}
              placeholder="Search by photographer"
              type="search"
              value={searchQuery}
            />
          </div>
        </header>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="mx-auto max-w-2xl border border-[#DDBAC2] bg-[#FFF9F9] px-6 py-5 text-[#6F2333]" role="alert">
            <p className="font-serif text-xl font-semibold">The collection could not be loaded.</p>
            <p className="mt-2 text-sm leading-6 text-[#80505A]">{error.message || 'Please check your connection and try again.'}</p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="border border-dashed border-[#D9D4CB] bg-white px-6 py-20 text-center">
            <p className="font-serif text-2xl font-semibold text-[#242321]">No photographs found</p>
            <p className="mt-3 text-sm leading-6 text-[#77736D]">Try searching for a different photographer.</p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <section aria-label="Photo gallery" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => {
              const isFavourite = favouriteIds.includes(photo.id)

              return (
                <article className="group overflow-hidden rounded-xl border border-[#E9E5DE] bg-white shadow-[0_4px_18px_rgba(36,35,33,0.045)]" key={photo.id}>
                  <div className="overflow-hidden bg-[#E9E5DE]">
                    <img
                      alt={`Photograph by ${photo.author}`}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      loading="lazy"
                      src={`https://picsum.photos/id/${photo.id}/640/480`}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-4">
                    <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-[#242321]">{photo.author}</p>
                    <button
                      aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9F3048]/15 motion-reduce:transition-none ${isFavourite ? 'border-[#9F3048] bg-[#9F3048] text-white hover:bg-[#86283D]' : 'border-[#E9E5DE] bg-white text-[#77736D] hover:border-[#CDA7AF] hover:text-[#9F3048]'}`}
                      onClick={() => toggleFavourite(photo.id)}
                      type="button"
                    >
                      <HeartIcon filled={isFavourite} />
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}

export default App
