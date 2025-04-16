import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProtectedeRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const _ud = await AsyncStorage.getItem('user_data');
      setIsAuthenticated(!!_ud);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still loading
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(tabs1)" />;
  }

  return children;
};

export default ProtectedeRoute;