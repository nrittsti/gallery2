import { getAvailableYears, allPhotos } from "./utils/photos.ts";

export const DEFAULT_YEAR = getAvailableYears(allPhotos)[0] ?? 2025;
