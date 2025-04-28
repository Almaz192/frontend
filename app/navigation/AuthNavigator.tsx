// navigation/AuthNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { AuthStackParamList } from "./types";

const Stack = createStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
    setIsLoggedIn: (value: boolean) => void;
}

export default function AuthNavigator({ setIsLoggedIn }: AuthNavigatorProps) {
    return (
        <Stack.Navigator
            initialRouteName="LoginScreen"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="LoginScreen">
                {(props) => (
                    <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
            </Stack.Screen>
            <Stack.Screen name="SignUpScreen">
                {(props) => (
                    <SignUpScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
