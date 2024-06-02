import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IGroupInfo {
  id: string;
  value: string;
}

interface ISelectedGroupInfoState {
  group: IGroupInfo | null;
  setGroup: (groups: IGroupInfo) => void;
}

const useSelectedGroupInfoStore = create<ISelectedGroupInfoState>()(
  devtools((set) => ({
    group: null,
    setGroup: (group) => set(() => ({ group })),
  }))
);

export default useSelectedGroupInfoStore;
