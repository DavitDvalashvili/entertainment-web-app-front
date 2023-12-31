import { useEffect, useState } from "react";
import axios from "axios";
import iconMovies from "../../assets/icon-category-movie.svg";
import iconTvseries from "../../assets/icon-category-tv.svg";
import TrendingStyle from "../styledComponents/TrendingStyle";
import { Swiper, SwiperSlide } from "swiper/react";
import play from "../../assets/icon-play.svg";
import useWindowWidth from "../../Hooks/useWindowWidth";
import { DataType } from "../../Types";

function MovieList() {
  const [movies, setMovies] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //use UseWindowWidth custom hook;
  const width = useWindowWidth();

  //create get request
  async function fetchData() {
    try {
      const response = await axios.get<DataType[]>(
        `${import.meta.env.VITE_API_URL}`
      );
      setMovies(response.data);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  //print loading... when data is loading
  if (loading) {
    return <p>Loading...</p>;
  }

  //print error if error occur while getting data
  if (error) {
    return <p>Error: {error}</p>;
  }

  const baseUrl = window.location.origin;

  const bookmarkToggle = async (movieID: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/movies/${movieID}`
      );

      //update movie info abd render new info
      const updatedMovies = movies.map((movie) => {
        if (movie.id === movieID) {
          return { ...movie, isBookmarked: response.data.isBookmarked };
        }
        return movie;
      });

      setMovies(updatedMovies);
    } catch (error) {
      console.log("Error toggling bookmark:", error);
    }
  };

  return (
    <TrendingStyle>
      <h2>Trending</h2>
      <div className="movieContainer">
        <Swiper spaceBetween={10} slidesPerView={"auto"}>
          {movies.map(
            (movie) =>
              movie.isTrending && (
                <SwiperSlide key={movie.id}>
                  <div className="movie">
                    <img
                      src={
                        width < 768
                          ? `${baseUrl}/${movie.thumbnail.trending.small}`
                          : `${baseUrl}/${movie.thumbnail.trending.large}`
                      }
                      alt="background"
                      className="bcImage"
                    />
                    <div className="textBox">
                      <div
                        className="imageBox"
                        onClick={() => bookmarkToggle(movie.id)}
                      >
                        {!movie.isBookmarked && (
                          <svg
                            className="bookmarkEmpty"
                            width="12"
                            height="14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="m10.518.75.399 12.214-5.084-4.24-4.535 4.426L.75 1.036l9.768-.285Z"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              fill="none"
                            />
                          </svg>
                        )}
                        {movie.isBookmarked && (
                          <svg
                            className="bookmarkFull"
                            width="12"
                            height="14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.61 0c.14 0 .273.028.4.083a1.03 1.03 0 0 1 .657.953v11.928a1.03 1.03 0 0 1-.656.953c-.116.05-.25.074-.402.074-.291 0-.543-.099-.756-.296L5.833 9.77l-4.02 3.924c-.218.203-.47.305-.756.305a.995.995 0 0 1-.4-.083A1.03 1.03 0 0 1 0 12.964V1.036A1.03 1.03 0 0 1 .656.083.995.995 0 0 1 1.057 0h9.552Z"
                              fill="#FFF"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="playBox">
                        <img src={play} alt="playIcon" />
                        <span>Play</span>
                      </div>
                      <div className="about">
                        <div className="info">
                          <span>{movie.year}</span>
                          <span className="bullet">&bull;</span>
                          {movie.category === "Movie" && (
                            <img src={iconMovies} alt="iconMovies" />
                          )}
                          {movie.category === "TV Series" && (
                            <img src={iconTvseries} alt="iconTvseries" />
                          )}
                          <span className="bullet">&bull;</span>
                          <span>{movie.category}</span>
                          <span className="bullet">&bull;</span>
                          <span className="rating">{movie.rating}</span>
                        </div>
                        <h5>{movie.title}</h5>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
      </div>
    </TrendingStyle>
  );
}

export default MovieList;
