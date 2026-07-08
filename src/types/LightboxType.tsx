import type { Dispatch, SetStateAction } from "react";

export interface LightboxType {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>;
  index: number
  setIndex: Dispatch<SetStateAction<number>>;
}
