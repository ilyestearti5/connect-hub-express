import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Biqpod } from "@biqpod/app/ui/types";
import { snapBuyAPI } from "@/lib/api";

interface AuthState {
  user: Biqpod.Snapbuy.Customer | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN"; payload: { user: Biqpod.Snapbuy.Customer; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: Biqpod.Snapbuy.Customer };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN":
      localStorage.setItem("auth_token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("auth_token");
      return { ...state, user: null, token: null, isLoading: false };
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (username: string, password: string) => Promise<void>;
  createAccount: (data: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    email?: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
} | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (username: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await snapBuyAPI.login({ username, password });
      const user = await snapBuyAPI.getMe(response.token);
      dispatch({ type: "LOGIN", payload: { user, token: response.token } });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const createAccount = async (data: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    email?: string;
  }) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await snapBuyAPI.createAccount(data);
      const user = await snapBuyAPI.getMe(response.token);
      dispatch({ type: "LOGIN", payload: { user, token: response.token } });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const user = await snapBuyAPI.getMe(token);
        dispatch({ type: "LOGIN", payload: { user, token } });
      } catch (error) {
        localStorage.removeItem("auth_token");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!state.token) {
      throw new Error("Not authenticated");
    }
    await snapBuyAPI.changePassword({ oldPassword, newPassword }, state.token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        createAccount,
        logout,
        checkAuth,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
