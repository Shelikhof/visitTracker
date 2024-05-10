import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ISummaryParamsState {
  month: string | null;
  year: string | null;
  setSummaryParams: (month: string, year: string) => void;
}

const useSummaryParamsStore = create<ISummaryParamsState>()(
  devtools((set) => ({
    month: null,
    year: null,
    setSummaryParams: (month, year) => set(() => ({ month, year })),
  }))
);

export default useSummaryParamsStore;
