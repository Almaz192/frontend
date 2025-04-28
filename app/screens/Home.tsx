import React, { useEffect, useState, useCallback } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Alert,
    Dimensions,
    InteractionManager,
} from "react-native";
import BottomMenu from "../components/BottomMenu";
import {
    useNavigation,
    useRoute,
    RouteProp,
    useFocusEffect,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LoadingSpinner from "../components/LoadingSpinner";
import SubscriptionScreen from "./SubscriptionScreen";
import TopicList from "./TopicList";
import RoadButton from "../components/RoadButton";
import axios from "axios";
import { RootStackParamList } from "../navigation/AppNavigator";
import CustomAlert from "../components/CustomAlert";
import { PRIMARY, NEUTRAL, TRANSPARENT } from "../../constants";

// Get device dimensions
const { width, height } = Dimensions.get("window");

// Define the type for a level button
interface LevelButton {
    id: number;
    x: number; // percentage across screen width
    y: number; // percentage down screen height
    completed: boolean;
    unlocked: boolean;
    topicId: number;
}

type HomeNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type HomeRouteProp = RouteProp<RootStackParamList, "Home">;

export default function Home() {
    const navigation = useNavigation<HomeNavigationProp>();
    const route = useRoute<HomeRouteProp>();
    const [activeScreen, setActiveScreen] = useState("home");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [levelButtons, setLevelButtons] = useState<LevelButton[]>([]);
    const [topicTitles, setTopicTitles] = useState<Record<number, string>>({});
    const [userProgress, setUserProgress] = useState(3);
    const [isTransitionComplete, setIsTransitionComplete] = useState(false);

    // Settings alert state
    const [settingsAlert, setSettingsAlert] = useState({
        visible: false,
        title: "Настройки",
        message: "Функция настроек будет добавлена в следующем обновлении.",
        primaryButtonText: "OK",
        onPrimaryPress: () =>
            setSettingsAlert((prev) => ({ ...prev, visible: false })),
    });

    // Reset active screen when Home comes into focus
    useFocusEffect(
        useCallback(() => {
            setActiveScreen("home");
        }, [])
    );

    // Handle navigation transition
    useEffect(() => {
        const transitionComplete = InteractionManager.runAfterInteractions(
            () => {
                setIsTransitionComplete(true);
            }
        );

        return () => {
            transitionComplete.cancel();
            setIsTransitionComplete(false);
        };
    }, []);

    // Initialize level buttons
    const initializeLevelButtons = useCallback(() => {
        // These positions are approximate and should be adjusted to match the design
        const buttons: LevelButton[] = [
            {
                id: 1,
                x: 42,
                y: 85,
                completed: true,
                unlocked: true,
                topicId: 1,
            },
            {
                id: 2,
                x: 28,
                y: 76,
                completed: true,
                unlocked: true,
                topicId: 2,
            },
            {
                id: 3,
                x: 45,
                y: 68,
                completed: true,
                unlocked: true,
                topicId: 3,
            },
            {
                id: 4,
                x: 60,
                y: 67,
                completed: false,
                unlocked: true,
                topicId: 4,
            },
            {
                id: 5,
                x: 73,
                y: 60,
                completed: false,
                unlocked: false,
                topicId: 5,
            },
            {
                id: 6,
                x: 55,
                y: 55,
                completed: false,
                unlocked: false,
                topicId: 6,
            },
            {
                id: 7,
                x: 45,
                y: 48,
                completed: false,
                unlocked: false,
                topicId: 7,
            },
            {
                id: 8,
                x: 30,
                y: 46,
                completed: false,
                unlocked: false,
                topicId: 8,
            },
            {
                id: 9,
                x: 18,
                y: 40,
                completed: false,
                unlocked: false,
                topicId: 9,
            },
            {
                id: 10,
                x: 27,
                y: 35,
                completed: false,
                unlocked: false,
                topicId: 10,
            },
            {
                id: 11,
                x: 31,
                y: 25,
                completed: false,
                unlocked: false,
                topicId: 11,
            },
            {
                id: 12,
                x: 36,
                y: 15,
                completed: false,
                unlocked: false,
                topicId: 12,
            },
            {
                id: 13,
                x: 47,
                y: 10,
                completed: false,
                unlocked: false,
                topicId: 13,
            },
            {
                id: 14,
                x: 24,
                y: 8,
                completed: false,
                unlocked: false,
                topicId: 14,
            },
            {
                id: 15,
                x: 12,
                y: 6,
                completed: false,
                unlocked: false,
                topicId: 15,
            },
        ];

        // Update completion and unlock status based on user progress
        const updatedButtons = buttons.map((button) => ({
            ...button,
            completed: button.id <= userProgress,
            unlocked: button.id <= userProgress + 1,
        }));

        setLevelButtons(updatedButtons);
    }, [userProgress]);

    useEffect(() => {
        if (isTransitionComplete) {
            initializeLevelButtons();
            setLoading(false);
        }
        return () => {
            setLevelButtons([]);
            setLoading(true);
        };
    }, [isTransitionComplete, initializeLevelButtons]);

    // Check if we have completed a topic and need to update progress
    useEffect(() => {
        if (!isTransitionComplete) return;

        if (route.params?.updateProgress && route.params?.completedTopicId) {
            const completedTopicId = route.params.completedTopicId;

            const completedLevel = levelButtons.find(
                (button) => button.topicId === completedTopicId
            );

            if (completedLevel) {
                if (completedLevel.id > userProgress) {
                    setUserProgress(completedLevel.id);
                    Alert.alert(
                        "Уровень пройден!",
                        `Вы успешно завершили уровень ${completedLevel.id} и разблокировали следующий уровень!`
                    );
                }
            }

            navigation.setParams({
                updateProgress: undefined,
                completedTopicId: undefined,
            });
        }
    }, [
        route.params,
        levelButtons,
        userProgress,
        navigation,
        isTransitionComplete,
    ]);

    // Fetch topic titles from API
    useEffect(() => {
        axios
            .get("https://enetyl-back.duckdns.org/topics")
            .then((response) => {
                const raw = response.data.topics || [];
                const titleMap: Record<number, string> = {};

                raw.forEach((arr: any[]) => {
                    titleMap[arr[0]] = arr[1];
                });

                setTopicTitles(titleMap);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load topics");
                setLoading(false);
            });
    }, []);

    const handleLevelPress = (button: LevelButton) => {
        if (!button.unlocked) {
            Alert.alert(
                "Уровень заблокирован",
                "Сначала завершите предыдущие уровни, чтобы разблокировать этот."
            );
            return;
        }

        // Navigate to the appropriate topic
        const topicTitle =
            topicTitles[button.topicId] || `Тема ${button.topicId}`;
        navigation.navigate("TopicDetail", {
            topicId: button.topicId,
            topicTitle,
        });
    };

    const changeScreen = (screenName: string) => {
        if (screenName === "lop") {
            setActiveScreen(screenName); // Set active screen before navigation
            navigation.navigate("TopicList");
            return;
        }

        if (screenName === "settings") {
            setSettingsAlert((prev) => ({ ...prev, visible: true }));
            return;
        }

        setActiveScreen(screenName);
    };

    const renderMainContent = () => {
        if (activeScreen === "subscription") {
            return <SubscriptionScreen />;
        }

        // Home screen with journey map
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require("../../assets/images/bg-first.png")}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    {loading ? (
                        <View style={styles.loaderContainer}>
                            <LoadingSpinner size={70} />
                        </View>
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        // Render road buttons using the RoadButton component
                        levelButtons.map((button) => (
                            <RoadButton
                                key={button.id}
                                id={button.id}
                                position={{ x: button.x, y: button.y }}
                                completed={button.completed}
                                unlocked={button.unlocked}
                                onPress={() => handleLevelPress(button)}
                            />
                        ))
                    )}
                </ImageBackground>
            </View>
        );
    };

    if (!isTransitionComplete || loading) {
        return (
            <View style={styles.loadingContainer}>
                <LoadingSpinner />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mainContentContainer}>
                {renderMainContent()}
            </View>

            {/* Bottom menu - always visible */}
            <BottomMenu
                onScreenChange={changeScreen}
                activeScreen={activeScreen}
            />

            {/* Settings alert */}
            <CustomAlert
                visible={settingsAlert.visible}
                title={settingsAlert.title}
                message={settingsAlert.message}
                primaryButtonText={settingsAlert.primaryButtonText}
                onPrimaryPress={settingsAlert.onPrimaryPress}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: PRIMARY.GREEN,
    },
    mainContentContainer: {
        flex: 1,
        marginBottom: 0, // Remove space between content and menu
    },
    container: {
        flex: 1,
        backgroundColor: PRIMARY.GREEN,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: NEUTRAL.WHITE,
        marginTop: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: PRIMARY.RED,
        textAlign: "center",
        marginTop: 20,
        backgroundColor: TRANSPARENT.WHITE_80,
        padding: 10,
        borderRadius: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
});
