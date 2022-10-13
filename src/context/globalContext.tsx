import React, {
  createContext,
  memo,
  useContext,
  useState,
  useEffect,
} from "react";

interface GlobalContextType {
  connectedUser: string;
  connectUser: (userId: string) => void;
  disconnectUser: () => void;
}

const useProviderGlobalContext = () => {
  const [connectedUser, setConnectedUser] = useState("");

  function connectUser(userId: string) {
    console.log(userId);
    setConnectedUser(userId);
  }
  const disconnectUser = () => {
    setConnectedUser("");
  };

  return {
    connectedUser,
    connectUser,
    disconnectUser,
  };
};

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobal = () => useContext(GlobalContext);

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const context = useProviderGlobalContext();

  return (
    <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>
  );
}

export default GlobalContextProvider;
