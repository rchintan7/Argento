import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash_screen/splash_screen';
import Colors from '../constants/colors';
import InformationCorousel from '../screens/information_corousel/information_corousel';
import WelcomeScreen from '../screens/welcome_screen/welcome_screen';
import ActivateExperience from '../screens/activate_experience/activate_experience';
import SecureEliteAccess from '../screens/secure_elite_access/secure_elite_access';
import BottomTabs from './bottom_navigation';


const Stack = createNativeStackNavigator();

function MainRoute() {
    return (
        <Stack.Navigator
            initialRouteName={'SplashScreen'}
            screenOptions={{
                presentation: 'card',
                animationTypeForReplace: 'push',
                headerShown: false,
                statusBarBackgroundColor: Colors.secondryColor,
                statusBarStyle: 'light',
            }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="InformationCorousel" component={InformationCorousel} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="ActivateExperience" component={ActivateExperience} />
            <Stack.Screen name="SecureEliteAccess" component={SecureEliteAccess} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
        </Stack.Navigator>
    )
}

export default MainRoute