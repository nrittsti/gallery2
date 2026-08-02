import Navigation from "./components/Navigation.tsx";
import Gallery from "./components/Gallery.tsx";
import Footer from "./components/Footer.tsx";
import {useState} from "react";

import './App.css'
import {FilterContext, LightboxContext} from "./context/GalleryContext.tsx";
import Lightbox from "./components/Lightbox.tsx";
import {DEFAULT_YEAR} from "./constants.ts";


function App() {
  const [selectedYear, setSelectedYear] = useState<number | null>(DEFAULT_YEAR);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <FilterContext value={{year: selectedYear, setYear: setSelectedYear}}>
          <header>
            <Navigation/>
          </header>
          <main className="flex-grow-1">
            <LightboxContext value={{
              show: showLightbox,
              setShow: setShowLightbox,
              index: selectedPhotoIndex,
              setIndex: setSelectedPhotoIndex
            }}>
              <Gallery/>
              <Lightbox/>
            </LightboxContext>
          </main>
          <footer>
            <Footer/>
          </footer>
        </FilterContext>
      </div>
    </>
  );
}

export default App
