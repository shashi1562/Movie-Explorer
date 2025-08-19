const BASE_URL = 'https://api.themoviedb.org/3'

export const useTmdbApi = () => {
  const config = useRuntimeConfig()
  const TOKEN = config.public.tmdbToken

  const fetchFromTmdb = async (endpoint, params = {}) => {
    const url = new URL(BASE_URL + endpoint)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value)
      }
    })

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(`TMDB API error (${res.status}): ${errorData.status_message || res.statusText}`)
    }

    return res.json()
  }

  const searchMovies = (query, year, genreId, page = 1) => {
    return fetchFromTmdb('/search/movie', {
      'query':query,
      'year':year,
      'with_genres': genreId,
      'page':page,
    })
  }

  const fetchMovieDetails = (movieId) => {
    return fetchFromTmdb(`/movie/${movieId}`)
  }

  const fetchGenres = () => {
    return fetchFromTmdb('/genre/movie/list')
  }

  return {
    searchMovies,
    fetchMovieDetails,
    fetchGenres
  }
}
