import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [cookies] = useCookies(['userName', 'userEmail']);
  const [user, setUser] = useState({
    name: cookies.userName || 'Пользователь',
    email: cookies.userEmail || 'email@mail.ru',
    avatar: 'https://static.vecteezy.com/system/resources/previews/036/280/654/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg',
  });


  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      name: cookies.userName || prev.name,
      email: cookies.userEmail || prev.email,
    }));
  }, [cookies.userName, cookies.userEmail]);

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}