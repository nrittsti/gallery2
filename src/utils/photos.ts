import photosData from "../assets/photos.json";
import type {PhotoProps} from "../types/PhotoProps.tsx";

export const allPhotos = photosData as PhotoProps[];

export function filterByYear(photos: PhotoProps[], year: number | null): PhotoProps[] {
  if (year === null) return [...photos];
  return photos.filter((p) => p.year === year);
}

export function sortByFileDesc(photos: PhotoProps[]): PhotoProps[] {
  return [...photos].sort((a, b) => b.file.localeCompare(a.file));
}

export function getAvailableYears(photos: PhotoProps[]): number[] {
  const years = new Set(photos.map((p) => p.year).filter((y) => y != null));
  return [...years].sort((a, b) => b - a);
}
