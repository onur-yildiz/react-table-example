import { createContext, useState } from "react";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://spcase-server.herokuapp.com"
    : "http://localhost:5234";

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

    try {
      const response = await fetch(
        `${API_URL}/intra-day-trade-history-summary?startDate=${startDate}&endDate=${endDate}`
      );
      const data = (await response.json()) as Stats[];
      console.table(data);
      setStats(data);
    } catch (error) {
      setStats([]);
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <StatsContext.Provider value={{ stats, fetchStats, isLoading }}>
      {props.children}
    </StatsContext.Provider>
  );
};

export default StatsContext;
