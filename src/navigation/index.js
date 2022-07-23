import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ChatScreen, AuthScreen } from '../screens';
import { NAVIGATION_ROUTES } from '../utils/constants';

const MainStack = createStackNavigator();
export const AppNavigation = () => (
  <NavigationContainer>
    <MainStack.Navigator initialRouteName={NAVIGATION_ROUTES.HOME_SCREEN}>
      <MainStack.Screen name={NAVIGATION_ROUTES.AUTH_SCREEN} component={AuthScreen} />
      <MainStack.Screen name={NAVIGATION_ROUTES.CHAT_SCREEN} component={ChatScreen} />
    </MainStack.Navigator>
  </NavigationContainer>
);
