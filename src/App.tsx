import { StatsContextProvider } from "./store/statsContext";
import DataTable from "./views/DataTable";
import DateInputBar from "./views/DateInputBar";
import "./App.css";

function App() {
  return (
    <StatsContextProvider>
      <div>
        <DateInputBar />
        <DataTable />
      </div>
    </StatsContextProvider>
  );
}

export default App;
