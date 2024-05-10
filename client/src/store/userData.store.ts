import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Roles } from "../variables/menu";
import { IAuthResponse } from "../api/interfaces/IAuthService.interface";

export interface IUserData {
  fullName: string;
  username: string;
  role: Roles;
}

interface IUserDataState {
  userData: IAuthResponse | null;
  setUserData: (userData: IAuthResponse) => void;
}

const useUserDataStore = create<IUserDataState>()(
  devtools((set) => ({
    userData: null,
    setUserData: (userData: IAuthResponse | null) =>
      set(() => ({
        userData: {
          role: userData?.role || "none",
          username: userData?.username || "username",
          fullName: userData?.fullName || "",
        },
      })),
  }))
);

export default useUserDataStore;
