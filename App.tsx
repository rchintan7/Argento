import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useRef } from 'react';
import { LogBox } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavigationService from '../Argento/src/services/api/navigation_service';
import MainRoute from './src/navigation/main_route';
import { Provider } from 'react-redux';
import { persistor, store } from './src/services/redux/store';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  LogBox.ignoreAllLogs();

  // Update the type to include 'null'
  const navigationRef = useRef<NavigationContainerRef<ReactNavigation.RootParamList> | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            {/* <PersistGate loading={null} persistor={persistor}> */}
            <NavigationContainer
              ref={(navigator) => {
                navigationRef.current = navigator;
                // Ensure navigator is not null before setting it
                if (navigator) {
                  NavigationService.setNavigator(navigator);
                }
              }}
            >
              <MainRoute />
            </NavigationContainer>
            {/* </PersistGate> */}
          </Provider>
        </QueryClientProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;