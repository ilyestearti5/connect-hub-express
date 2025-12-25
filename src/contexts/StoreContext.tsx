import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Biqpod } from "@biqpod/app/ui/types";
import { snapBuyAPI } from "@/lib/api";

interface StoreState {
  store: Biqpod.Snapbuy.Store | null;
  isLoading: boolean;
}

type StoreAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STORE"; payload: Biqpod.Snapbuy.Store };

const initialState: StoreState = {
  store: null,
  isLoading: false,
};

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_STORE":
      return { ...state, store: action.payload, isLoading: false };
    default:
      return state;
  }
};

const StoreContext = createContext<{
  state: StoreState;
  fetchStore: () => Promise<void>;
} | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const fetchStore = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const store = await snapBuyAPI.getStore();
      dispatch({ type: "SET_STORE", payload: store });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        state,
        fetchStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
