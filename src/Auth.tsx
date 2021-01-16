import React, {createContext, useContext, useState} from 'react';
import {Redirect, Route, RouteProps} from 'react-router-dom';

type Login = (email: string, password: string) => Promise<boolean>

type Logout = () => Promise<void>

type Auth = {
  user: null | string
  login: Login
  logout: Logout
}

const authContext = createContext<Auth | undefined>(undefined);

export const useAuth = (): Auth => {
  return useContext(authContext)!;
};

export const useToken = (): string => {
  const {user} = useAuth();

  return user!;
};

export const useProvideAuth = (): Auth => {
  const [user, setUser] = useState<string | null>(null);

  const login: Login = async (email, password) => {
    const response = await fetch(
      'https://academeez-login-ex.herokuapp.com/api/users/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (data.token) {
      setUser(data.token);
      return true;
    }

    return false;
  };

  const logout: Logout = async () => {
    setUser(null);
  };

  return {
    user,
    login,
    logout
  };
};

export const ProvideAuth: React.FunctionComponent<{ children: React.ReactNode }> = ({children}) => {
  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
};

export const ProtectedRoute: React.FunctionComponent<RouteProps> = ({children, ...rest}) => {
  let auth = useAuth();

  return (
    <Route
      {...rest}
      render={({location}) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location}
            }}
          />
        )
      }
    />
  );
};
