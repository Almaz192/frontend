import "react-native-gesture-handler";
import "react-native-reanimated";
// App.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, LogBox } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Ignore specific warnings that might be related to the animation issues
LogBox.ignoreLogs([
    "Animated: `useNativeDriver` was not specified",
    "ViewPropTypes will be removed from React Native",
]);

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    const [fontsLoaded] = useFonts({
        SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        // Hide splash screen once fonts are loaded
        const hideSplash = async () => {
            if (fontsLoaded) {
                await SplashScreen.hideAsync();
            }
        };
        hideSplash();
    }, [fontsLoaded]);

    useEffect(() => {
        // Check authentication status
        const checkAuth = async () => {
            try {
                // Add your auth check logic here
                // For now, we'll just set it to false after a delay
                setTimeout(() => {
                    setIsLoggedIn(false);
                }, 1000);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, []);

    if (!fontsLoaded || isLoggedIn === null) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator size="large" color="#6C873A" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <AppNavigator />
            ) : (
                <AuthNavigator setIsLoggedIn={setIsLoggedIn} />
            )}
        </NavigationContainer>
    );
}
