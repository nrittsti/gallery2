import {useContext, useMemo} from "react";
import photosData from "../assets/photos.json";
import type {PhotoProps} from "../types/PhotoProps";
import {FilterContext} from "../context/GalleryContext.tsx";

export function usePhotos(): PhotoProps[] {

  const {year} = useContext(FilterContext);
  const allPhotos = photosData as PhotoProps[];

  return useMemo(() => {
    console.log("recalculating filtered photos");
    const filteredPhotos = !year
      ? allPhotos
      : allPhotos.filter((p) => p.year === year);
    filteredPhotos.sort((a, b) => {
      return b.file.localeCompare(a.file);
    });
    return filteredPhotos;
  }, [allPhotos, year]);

}
