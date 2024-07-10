import { IGroupItem } from "@/6_shared/interfaces/index.interface";
import { Roles } from "@/6_shared/variables/menu";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IAuthResponse } from "../auth/IAuthService.interface";

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
