import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useRef } from 'react';
import { LogBox } from 'react-native';
// import NavigationService from '../MayRiverMedicare/src/services/api/navigation_service';
import MainRoute from './src/navigation/main_route';


function App(): React.JSX.Element {
  LogBox.ignoreAllLogs();

  // Update the type to include 'null'
  const navigationRef = useRef<NavigationContainerRef<ReactNavigation.RootParamList> | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={(navigator) => {
          navigationRef.current = navigator;
          // Ensure navigator is not null before setting it
          if (navigator) {
            // NavigationService.setNavigator(navigator);
          }
        }}
      >
        <MainRoute />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;