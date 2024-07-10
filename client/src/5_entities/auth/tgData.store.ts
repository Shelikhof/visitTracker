import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IAuthRequest, IUserData } from "../5_entities/api/interfaces/IAuthService.interface";

interface ITgDataState {
  tgData: IUserData | null;
  setTgData: (tgData: IAuthRequest) => void;
}

const useTgDataStore = create<ITgDataState>()(
  devtools((set) => ({
    tgData: null,
    setTgData: (tgData: IAuthRequest) => set(() => ({ tgData: tgData.userData })),
  }))
);

export default useTgDataStore;
