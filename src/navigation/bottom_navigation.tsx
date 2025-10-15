import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Svgs } from '../constants/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import HomeScreen from '../screens/home_screen/home_screen';
import JournalScreen from '../screens/journal_screen/journal_screen';
import InsightsScreen from '../screens/insights_screen/insights_screen';
import ProfileScreen from '../screens/profile_screen/profile_screen';
import { useMutation } from '@tanstack/react-query';
import { SELF_ME_GET } from '../services/api_endpoint';
import { useDispatch } from 'react-redux';
import { storeUserDetails } from '../services/slices/user.slice';
import { CustomToast } from '../utils/toast';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    useEffect(() => {
        ProfileMutation.mutate();
    }, []);

    const ProfileMutation = useMutation({
        mutationFn: async () => {
            const { data } = await SELF_ME_GET();
            return data;
        },
        onSuccess: (data) => {
            dispatch(storeUserDetails(data));
        },
        onError: (error: any) => {
            CustomToast({ text: error?.message, toastType: 'error' });
        },
    });

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: Colors.primaryColor,
                tabBarInactiveTintColor: Colors.placHolder,
                tabBarLabelStyle: {
                    fontWeight: '600',
                    marginTop: 8,
                    fontSize: 12,
                },
                tabBarStyle: {
                    backgroundColor: Colors.bottomTabColor,
                    borderTopWidth: 1,
                    borderTopColor: Colors.buttonGrey,
                    height: insets.bottom + 66,
                    paddingTop: 6,
                },
                tabBarIcon: ({ focused }) => {
                    // Define icons for each route
                    switch (route.name) {
                        case 'Home':
                            return focused ? <Svgs.homeActive /> : <Svgs.homeInactive />;
                        case 'Journal':
                            return focused ? <Svgs.journalAactive /> : <Svgs.journalInAactive />;
                        case 'Insights':
                            return focused ? <Svgs.insightsAactive /> : <Svgs.insightsInAactive />;
                        case 'Profile':
                            return focused ? <Svgs.profileAactive /> : <Svgs.profileInAactive />;
                        default:
                            return null;
                    }
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Journal" component={JournalScreen} />
            <Tab.Screen name="Insights" component={InsightsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
