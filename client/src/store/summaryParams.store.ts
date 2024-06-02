import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ISummaryParamsState {
  month: string | null;
  year: string | null;
  type: string | null;
  groupId: string | null;
  setSummaryParams: (month: string, year: string, type: string, groupId: string) => void;
}

const useSummaryParamsStore = create<ISummaryParamsState>()(
  devtools((set) => ({
    month: null,
    year: null,
    type: null,
    groupId: null,
    setSummaryParams: (month, year, type, groupId) => set(() => ({ month, year, type, groupId })),
  }))
);

export default useSummaryParamsStore;
