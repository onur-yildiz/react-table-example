import { createContext, useState } from "react";

interface Stats {
  conract: string;
  totalTransactionFee: number;
  totalTransactionAmount: number;
  weightedAveragePrice: number;
}

interface StatsContextProps {
  stats: Stats[];
  fetchStats: (startDate: string, endDate: string) => Promise<void>;
}

const StatsContext = createContext<StatsContextProps>({
  stats: [],
  fetchStats: async () => {},
});

export const StatsContextProvider = (props: any) => {
  const [stats, setStats] = useState<Stats[]>([]);

  const fetchStats = async (startDate: string, endDate: string) => {
    const response = await fetch(
      `http://localhost:5234/intra-day-trade-history-summary?startDate=${startDate}&endDate=${endDate}`
    );
    const data = (await response.json()) as Stats[];
    setStats(data);
    console.log(stats);
  };

  return (
    <StatsContext.Provider value={{ stats, fetchStats }}>
      {props.children}
    </StatsContext.Provider>
  );
};

export default StatsContext;
