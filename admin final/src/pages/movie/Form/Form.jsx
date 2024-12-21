import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Form.css";

const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    popularity: "",
    releaseDate: "",
    voteAverage: "",
    isFeatured: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [castAndCrew, setCastAndCrew] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  

  let { movieId } = useParams();
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    setError("");
    if (!query) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setSearchedMovieList([]);

    axios({
      method: "get",
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE", 
      },
    })
      .then((response) => {
        if (response.data.results.length === 0) {
          setError("No movies found matching your search");
        } else {
          setSearchedMovieList(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      })
      .catch(() => {
        setError("Unable to search movies at this time. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, currentPage]);

  useEffect(() => {
    if (currentPage > 1) {
      handleSearch();
    }
  }, [currentPage, handleSearch]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      isFeatured: false,
    });
    setError("");

    
    fetchMovieDetails(movie.id);
  };

  const fetchMovieDetails = (movieId) => {
    setIsLoading(true);

   
    axios
    .get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
      headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE" },
    })
    .then((response) => {
    
      setCastAndCrew(response.data.cast);
    })
    .catch((error) => console.error("Error fetching cast and crew", error));
  
  

    
    axios
    .get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
      headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE" },
    })
    .then((response) => {
    
      setPhotos(response.data.backdrops);
    })
    .catch((error) => console.error("Error fetching photos", error));
  
    
      axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE" }, 
      })
      .then((response) => {
        const limitedVideos = response.data.results.slice(0, 3);
        setVideos(limitedVideos);
      })
      .catch((error) => console.error("Error fetching videos", error))
      .finally(() => setIsLoading(false));
    
  };

  useEffect(() => {
    if (!movieId) return;
  
    setIsLoading(true);
    setError("");
  
    axios
      .get(`/movies/${movieId}`)
      .then(({ data }) => {
        setMovie(data);
        setSelectedMovie({
          id: data.tmdbId,
          original_title: data.title,
          overview: data.overview,
          popularity: data.popularity,
          poster_path: data.posterPath.replace(
            "https://image.tmdb.org/t/p/original/",
            ""
          ),
          release_date: data.releaseDate,
          vote_average: data.voteAverage,
        });
        setFormData({
          title: data.title,
          overview: data.overview,
          popularity: data.popularity,
          releaseDate: data.releaseDate,
          voteAverage: data.voteAverage,
        });
        fetchMovieDetails(data.tmdbId);
      })
      .catch(() => setError("Unable to load movie details. Please try again later."))
      .finally(() => setIsLoading(false));
  }, [movieId]);
  

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, 
    }));
  };
  const handleCastChange = (index, field, value) => {
    const updatedCast = [...castAndCrew];
    if (updatedCast[index]) {
      updatedCast[index][field] = value;
      setCastAndCrew(updatedCast);
    }
  };
  
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1);
      handleSearch();
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title) errors.push("Title is required");
    if (!formData.overview) errors.push("Overview is required");
    if (!formData.releaseDate) errors.push("Release date is required");
    if (!formData.popularity) errors.push("Popularity is required");
    if (!formData.voteAverage) errors.push("Vote average is required");
    if (!selectedMovie) errors.push("Please select a movie from search results");
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setIsLoading(true);
    setError("");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You must be logged in to perform this action");
      setIsLoading(false);
      return;
    }

    const data = {
      tmdbId: selectedMovie.id,
      title: formData.title,
      overview: formData.overview,
      popularity: parseFloat(formData.popularity),
      releaseDate: formData.releaseDate,
      voteAverage: parseFloat(formData.voteAverage),
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: formData.isFeatured,
    };

    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const savedMovieId = response.data.id;
      await saveVideos(savedMovieId, videos);
      await savePhotos(savedMovieId, photos);
     

      navigate("/main/movies");
    } catch (error) {
      console.error("Error saving movie:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVideos = async (movieId, videos) => {
    if (!videos || videos.length === 0) {
      console.log("No videos to save.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const userId = 1; 

    try {
      const videoPromises = videos.map((video) => {
        const videoData = {
          userId: userId,
          movieId: movieId,
          url: `https://www.youtube.com/embed/${video.key}`,
          name: video.name || "Video Title",
          site: "YouTube",
          videoKey: video.key,
          videoType: video.type || "Clip",
          official: 0,
        };

        return axios.post("/admin/videos", videoData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
      });

     
      await Promise.all(videoPromises);
      console.log("Videos saved successfully");
    } catch (error) {
      console.error(
        "Error saving videos:",
        error.response?.data || error.message
      );
      setError("Failed to save videos. Please try again.");
    }
  };

  const savePhotos = async (movieId, photos, userId) => {
    if (!photos || photos.length === 0) {
      console.log("No photos to save.");
      return;
    }
  
    const accessToken = localStorage.getItem("accessToken");
  
    try {
      const photoPromises = photos.map((photo) => {
        const photoData = {
          userId: userId,
          movieId: movieId,
          url: `https://image.tmdb.org/t/p/original${photo.file_path}`,
          description: photo.description || "Photo description",
        };
  
        return axios.post("/admin/photos", photoData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      });
  
      await Promise.all(photoPromises);
      console.log("Photos saved successfully");
    } catch (error) {
      console.error(
        "Error saving photos:",
        error.response?.data || error.message
      );
      setError("Failed to save photos. Please try again.");
    }
  };
  const saveCast = async (movieId, cast) => {
    if (!cast || cast.length === 0) {
      console.log("No cast to save.");
      return;
    }
  
    const accessToken = localStorage.getItem("accessToken");
    const userId = 1; // Assuming a hardcoded user ID, update as necessary.
  
    try {
      const castPromises = cast.map((member) => {
        const castData = {
          userId: userId,
          movieId: movieId,
          name: member.name,
          character: member.character,
          profilePath: member.profile_path
            ? `https://image.tmdb.org/t/p/original${member.profile_path}`
            : null,
          castId: member.cast_id,
          order: member.order,
        };
  
        return axios.post("/admin/cast", castData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      });
  
      await Promise.all(castPromises);
      console.log("Cast saved successfully");
    } catch (error) {
      console.error("Error saving cast:", error.response?.data || error.message);
      setError("Failed to save cast. Please try again.");
    }
  };
  
  
  const handleUpdate = handleSave;

  useEffect(() => {
    if (movieId) {
      setIsLoading(true);
      setError("");

      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          const movieData = response.data;
          setSelectedMovie({
            id: movieData.tmdbId,
            original_title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            poster_path: movieData.posterPath.replace("https://image.tmdb.org/t/p/original/", ""),
            release_date: movieData.releaseDate,
            vote_average: movieData.voteAverage,
          });
          setFormData({
            title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            releaseDate: movieData.releaseDate,
            voteAverage: movieData.voteAverage,
            videos: movieData.videos || [],
            cast: movieData.cast || [],
            isFeatured: movieData.isFeatured || false,
          });
        })
        .catch(() => {
          setError("Unable to load movie details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieId]);

  

  return (
    <>
      <h1>{movieId !== undefined ? "Edit" : "Create"} Movie</h1>

      {error && <div className="error-message">{error}</div>}
  {isLoading && <div className="loading-message">Loading...</div>}

  {movieId === undefined && (
    <>
      <div className="search-container">
        Search Movie:{" "}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");<div className="search-container">
  <label htmlFor="movie-search" className="search-label">Search Movie:</label>
  <div className="search-input-container">
    <input
      id="movie-search"
      type="text"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setError("");
      }}
      onKeyPress={handleKeyPress}
      placeholder="Enter movie title..."
      disabled={isLoading}
      className="search-input"
    />
    <button
      className="search-button"
      type="button"
      onClick={() => {
        setCurrentPage(1);
        handleSearch();
      }}
      disabled={isLoading || !query.trim()}
    >
      {isLoading ? "Searching..." : "Search"}
    </button>
  </div>
</div>
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter movie title..."
              disabled={isLoading}
            />
            <button className="search"
              type="button"
              onClick={() => {
                setCurrentPage(1);
                handleSearch();
              }}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
            <div className="searched-movie">
              {searchedMovieList.map((movie) => (
                <p
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className={selectedMovie?.id === movie.id ? "selected" : ""}
                >
                  {movie.original_title}
                </p>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <hr />
        </>
      )}

<div className="container">
    <form onSubmit={(e) => e.preventDefault()}>
      {selectedMovie && (
        <div className="movie-details">
          <div className="form-fields">
          <img
            className="poster-image"
            src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
            alt={formData.title}
          />
            <div className="field">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="overview">Overview:</label>
              <textarea
                className="overview"
                rows={10}
                name="overview"
                id="overview"
                value={formData.overview}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="popularity">Popularity:</label>
              <input
                type="number"
                name="popularity"
                id="popularity"
                value={formData.popularity}
                onChange={handleInputChange}
                disabled={isLoading}
                step="0.1"
              />
            </div>
            <div className="field">
              <label htmlFor="releaseDate">Release Date:</label>
              <input
                type="date"
                name="releaseDate"
                id="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="voteAverage">Vote Average:</label>
              <input
                type="number"
                name="voteAverage"
                id="voteAverage"
                value={formData.voteAverage}
                onChange={handleInputChange}
                disabled={isLoading}
                step="0.1"
              />
            </div>
          </div>
        </div>
      )}
      {selectedMovie && (
<>
    <h2>Videos:</h2>
    <div className="videos">
        {videos.length > 0 ? (
            videos.map(video => (
                <div key={video.id} className="video-item">
                    <h3>{video.name}</h3>
                    <iframe
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            ))
        ) : (
            <p>No videos available.</p>
        )}
    </div>
 
    <div className="photo-gallery">
  <h2>Photos:</h2>
  <div className="photo-grid">
    {photos.slice(0, 12).map((photo) => (
      <img
        key={photo.file_path}
        src={`https://image.tmdb.org/t/p/original${photo.file_path}`}
        alt="Movie Photo"
        className="photo-item"
      />
    ))}
  </div>
</div>

    
{castAndCrew.length > 0 && (
            <div className="cast-crew">
            <h2>Cast & Crew</h2>
            <div className="cast-grid">
              {castAndCrew.slice(0, 12).map((castMember, index) => (
                <div key={castMember.cast_id} className="cast-item">
                  {castMember.profile_path && (
                    <div className="cast-photo-container">
                      <img
                        src={`https://image.tmdb.org/t/p/original${castMember.profile_path}`}
                        alt={castMember.name}
                        className="cast-photo"
                      />
                      <div className="cast-overlay">
                        <span>{castMember.name}</span>
                      </div>
                    </div>
                  )}
                  <input
                    className="inp"
                    type="text"
                    value={castMember.name}
                    onChange={(e) =>
                      handleCastChange(index, "name", e.target.value)
                    }
                    placeholder="Name"
                  />
                  <input
                    className="inp"
                    type="text"
                    value={castMember.character}
                    onChange={(e) =>
                      handleCastChange(index, "character", e.target.value)
                    }
                    placeholder="Character"
                  />
                </div>
              ))}
              </div>
            </div>
          )}

</>
      )}
          <div className="button-container">
            <button className="btn-save btn-primary"
              type="button"
              onClick={movieId ? handleUpdate : handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button className="cancel"
              type="button"
              onClick={() => navigate("/main/movies")}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </ form>
      </div>
    </>
  );
};

export default Form;