import React from "react";
import {
    createStackNavigator,
    TransitionPresets,
    StackNavigationOptions,
    CardStyleInterpolators,
} from "@react-navigation/stack";
import { InteractionManager } from "react-native";
import Home from "../screens/Home";
import TopicList from "../screens/TopicList";
import TopicDetailScreen from "../screens/TopicDetailScreen";
import ChooseGame from "../screens/ChooseGame";
import GameDragDrop from "../screens/GameDragDrop";
import GameImageWord from "../screens/GameImageWord";
import SubscriptionScreen from "../screens/SubscriptionScreen";

// Define the parameter list for all screens
export type RootStackParamList = {
    Home: undefined | { completedTopicId?: number; updateProgress?: boolean };
    TopicList: undefined;
    TopicDetail: { topicId: number; topicTitle: string };
    ChooseGame: { topicId: number };
    GameDragDrop: { topicId: number };
    GameImageWord: { topicId: number };
    Subscription: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Bottom menu screens that should have no transition animation
const BOTTOM_MENU_SCREENS = ["Home", "TopicList", "Settings", "Subscription"];

const defaultScreenOptions: StackNavigationOptions = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    gestureEnabled: true,
    cardStyle: { backgroundColor: "transparent" },
    cardOverlayEnabled: true,
    gestureDirection: "horizontal",
    transitionSpec: {
        open: {
            animation: "timing",
            config: {
                duration: 300,
            },
        },
        close: {
            animation: "timing",
            config: {
                duration: 300,
            },
        },
    },
};

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                ...defaultScreenOptions,
                animationEnabled: !BOTTOM_MENU_SCREENS.includes(route.name),
                cardStyleInterpolator: BOTTOM_MENU_SCREENS.includes(route.name)
                    ? () => ({
                          overlayStyle: {
                              opacity: 0,
                          },
                          cardStyle: {
                              opacity: 1,
                          },
                      })
                    : CardStyleInterpolators.forHorizontalIOS,
                detachInactiveScreens: false,
            })}
        >
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    cardStyleInterpolator: () => ({
                        overlayStyle: { opacity: 0 },
                        cardStyle: { opacity: 1 },
                    }),
                }}
            />
            <Stack.Screen
                name="TopicList"
                component={TopicList}
                options={{
                    cardStyleInterpolator: () => ({
                        overlayStyle: { opacity: 0 },
                        cardStyle: { opacity: 1 },
                    }),
                }}
            />
            <Stack.Screen
                name="TopicDetail"
                component={TopicDetailScreen}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="ChooseGame"
                component={ChooseGame}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="GameDragDrop"
                component={GameDragDrop}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="GameImageWord"
                component={GameImageWord}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="Subscription"
                component={SubscriptionScreen}
                options={{
                    cardStyleInterpolator: () => ({
                        overlayStyle: { opacity: 0 },
                        cardStyle: { opacity: 1 },
                    }),
                }}
            />
        </Stack.Navigator>
    );
}
