import { createContext, useState } from "react";

interface Stats {
  conract: string;
  totalTransactionFee: number;
  totalTransactionAmount: number;
  weightedAveragePrice: number;
}

interface StatsContextProps {
  stats: Stats[];
  isLoading: boolean;
  fetchStats: (startDate: string, endDate: string) => Promise<void>;
}

const StatsContext = createContext<StatsContextProps>({
  stats: [],
  isLoading: false,
  fetchStats: async () => {},
});

export const StatsContextProvider = (props: any) => {
  const [stats, setStats] = useState<Stats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:5234/intra-day-trade-history-summary?startDate=${startDate}&endDate=${endDate}`
    );
    const data = (await response.json()) as Stats[];
    setStats(data);
    setIsLoading(false);
    console.log(stats);
  };

  return (
    <StatsContext.Provider value={{ stats, fetchStats, isLoading }}>
      {props.children}
    </StatsContext.Provider>
  );
};

export default StatsContext;
