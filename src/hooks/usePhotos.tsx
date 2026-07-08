import {useContext, useMemo} from "react";
import type {PhotoProps} from "../types/PhotoProps";
import {FilterContext} from "../context/GalleryContext.tsx";
import {allPhotos, filterByYear, sortByFileDesc} from "../utils/photos.ts";

export function usePhotos(): PhotoProps[] {
  const {year} = useContext(FilterContext);

  return useMemo(() => {
    const filtered = filterByYear(allPhotos, year);
    return sortByFileDesc(filtered);
  }, [year]);
}
