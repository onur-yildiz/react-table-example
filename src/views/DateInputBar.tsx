import { format } from "date-fns";
import { useContext, useState } from "react";
import DateInput from "../components/DateInput";
import StatsContext from "../store/statsContext";

const DateInputBar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { fetchStats, isLoading } = useContext(StatsContext);

  const handleSubmit = () => {
    fetchStats(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd"));
  };

  return (
    <div className="input-bar">
      <DateInput
        onChange={(e) => setStartDate(new Date(Date.parse(e.target.value)))}
        value={startDate}
      />
      <DateInput
        onChange={(e) => setEndDate(new Date(Date.parse(e.target.value)))}
        value={endDate}
      />
      <button className="input--button" type="submit" onClick={handleSubmit}>
        {isLoading ? (
          <div className="loading-indicator" />
        ) : (
          <span>Göster</span>
        )}
      </button>
    </div>
  );
};

export default DateInputBar;
