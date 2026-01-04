import {createContext} from 'react';
import type {FilterType} from "../types/FilterType.tsx";
import type {LightboxType} from "../types/LightboxType.tsx";

export const FilterContext = createContext<FilterType>({
  year: null,
  setYear: () => {},
});

export const LightboxContext = createContext<LightboxType>({
  show: false,
  setShow: () => {},
  index: 0,
  setIndex: () => {},
});
