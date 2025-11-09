import { createContext, useContext, useMemo } from "react";

import { fetchSuggestion } from "./dataHandler";

interface DataContextValue {
  fetchSuggestion: typeof fetchSuggestion;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const DataContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<DataContextValue>(
    () => ({
      fetchSuggestion,
    }),
    []
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

const useDataContext = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return context;
};

export { DataContext, DataContextProvider, useDataContext };
