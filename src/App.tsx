import { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AllContent from "./components/functionalComponents/pages/AllContent";
import Movies from "./components/functionalComponents/pages/Movies";
import TvSeries from "./components/functionalComponents/pages/TvSeries";
import Bookmarks from "./components/functionalComponents/pages/Bookmarks";
import GlobalStyle from "./GlobalStyles";
import Login from "./components/functionalComponents/pages/Login";
import SignUp from "./components/functionalComponents/pages/SignUp";
import Home from "./components/functionalComponents/pages/Home";
import Preloader from "./components/functionalComponents/Preloader";

function App() {
  const [load, setLoad] = useState(true);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="allContent" element={<AllContent />} />
        <Route path="movies" element={<Movies />} />
        <Route path="tvSeries" element={<TvSeries />} />
        <Route path="bookmarks" element={<Bookmarks />} />
      </Route>
    )
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Preloader load={load} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
