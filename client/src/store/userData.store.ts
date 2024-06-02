import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Roles } from "../variables/menu";
import { IGroupItem } from "../interfaces/index.interface";
import { IAuthResponse } from "../api/interfaces/IAuthService.interface";

export interface IUserData {
  fullName: string;
  username: string;
  role: Roles;
  groups: IGroupItem[];
}

interface IUserDataState {
  userData: IAuthResponse | null;
  setUserData: (userData: IAuthResponse | null) => void;
}

const useUserDataStore = create<IUserDataState>()(
  devtools((set) => ({
    userData: null,
    setUserData: (userData) =>
      set(() => ({
        userData: {
          role: userData?.role || "none",
          username: userData?.username || "username",
          fullName: userData?.fullName || "",
          groups: userData?.groups || [],
        },
      })),
  }))
);

export default useUserDataStore;
