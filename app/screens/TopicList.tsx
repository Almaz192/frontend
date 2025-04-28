import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    RefreshControl,
    Alert,
    Platform,
} from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LoadingSpinner from "../components/LoadingSpinner";
import { RootStackParamList } from "../navigation/AppNavigator";
import BottomMenu from "../components/BottomMenu";

// Configure axios with longer timeout for slow connections
axios.defaults.timeout = 30000; // Increase timeout to 30 seconds
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// API configuration
const API_BASE_URL = "https://enetyl-back.duckdns.org";

// Add axios retry configuration
const axiosRetry = async (url: string, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, {
                timeout: 30000,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            return response;
        } catch (error) {
            console.log(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
    }
    throw new Error("Failed after retries");
};

interface Topic {
    id: number;
    title: string;
    image: string;
    locked?: boolean;
    completed?: boolean;
}

type TopicListNavigationProp = StackNavigationProp<
    RootStackParamList,
    "TopicList"
>;

export default function TopicList() {
    const navigation = useNavigation<TopicListNavigationProp>();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTransitionComplete, setIsTransitionComplete] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeScreen, setActiveScreen] = useState("lop");

    const fetchTopics = useCallback(async (showLoadingSpinner = true) => {
        if (showLoadingSpinner) {
            setLoading(true);
        }
        try {
            const response = await axiosRetry(`${API_BASE_URL}/topics`);

            if (!response?.data) {
                throw new Error("Invalid response format");
            }

            const raw = response.data.topics || [];
            if (!Array.isArray(raw)) {
                throw new Error("Topics data is not an array");
            }

            const mapped = raw.map((arr: any[], index: number) => ({
                id: arr[0],
                title: arr[2] || arr[1], // Try Russian title first, fall back to English
                image: arr[4] || "",
                completed: index < 3,
                locked: index > 3,
            }));

            setTopics(mapped);
            setError(null);
        } catch (err: any) {
            console.error("API Error:", err);
            let errorMessage = "Не удалось загрузить топики. ";

            if (err.message.includes("timeout")) {
                errorMessage +=
                    "Время ожидания истекло. Проверьте подключение к интернету.";
            } else if (err.message.includes("Network Error")) {
                errorMessage +=
                    "Ошибка сети. Проверьте подключение к интернету и попробуйте снова.";
            } else if (err.response) {
                errorMessage += `Ошибка сервера: ${err.response.status}`;
            } else if (err.request) {
                errorMessage += "Сервер не отвечает. Попробуйте позже.";
            } else {
                errorMessage += "Произошла неизвестная ошибка.";
            }

            setError(errorMessage);

            if (!showLoadingSpinner) {
                Alert.alert("Ошибка загрузки", errorMessage, [
                    { text: "Повторить", onPress: () => fetchTopics(false) },
                    { text: "OK" },
                ]);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Handle screen transition
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

    // Fetch topics when screen is focused and transition is complete
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            if (isTransitionComplete && isActive) {
                fetchTopics();
            }

            return () => {
                isActive = false;
            };
        }, [isTransitionComplete, fetchTopics])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTopics(false);
    }, [fetchTopics]);

    const handleTopicPress = useCallback(
        (topicId: number, topicTitle: string, locked: boolean = false) => {
            if (locked) return;
            navigation.navigate("TopicDetail", { topicId, topicTitle });
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[
                    styles.scrollContentContainer,
                    loading && styles.loadingContainer,
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#FFFFFF"]}
                        tintColor="#FFFFFF"
                    />
                }
            >
                {loading ? (
                    <View style={styles.loaderWrapper}>
                        <LoadingSpinner size={70} color="#FFFFFF" />
                    </View>
                ) : (
                    <>
                        {/* Header section */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.mainTitle}>
                                Ваше путешествие
                            </Text>
                            <Image
                                source={require("../../assets/images/mountain-image.png")}
                                style={styles.mountainImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.description}>
                                ENE TYL проведет вас по пути знаний. Выбирайте
                                модули, учите слова и проходите чекпоинты, чтобы
                                разблокировать новые участки маршрута.
                            </Text>
                        </View>

                        {/* Topics section */}
                        <View style={styles.topicsContainer}>
                            <Text style={styles.topicsTitle}>Темы</Text>
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : (
                                <View style={styles.grid}>
                                    {topics.map((topic) => (
                                        <TouchableOpacity
                                            key={topic.id}
                                            style={[
                                                styles.topicCard,
                                                topic.locked &&
                                                    styles.lockedTopicCard,
                                                topic.completed &&
                                                    styles.completedTopicCard,
                                            ]}
                                            onPress={() =>
                                                handleTopicPress(
                                                    topic.id,
                                                    topic.title,
                                                    topic.locked
                                                )
                                            }
                                            disabled={topic.locked}
                                        >
                                            {/* Изображение темы */}
                                            {topic.image ? (
                                                <Image
                                                    source={{
                                                        uri: `${API_BASE_URL}${topic.image}`,
                                                    }}
                                                    style={styles.topicImage}
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <View
                                                    style={
                                                        styles.placeholderImage
                                                    }
                                                >
                                                    {topic.locked && (
                                                        <View
                                                            style={
                                                                styles.lockContainer
                                                            }
                                                        >
                                                            <Image
                                                                source={require("../../assets/icons/lock.png")}
                                                                style={
                                                                    styles.lockIcon
                                                                }
                                                            />
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                            {/* Название топика */}
                                            <Text
                                                style={[
                                                    styles.topicName,
                                                    topic.locked &&
                                                        styles.lockedText,
                                                ]}
                                            >
                                                {topic.title}
                                            </Text>
                                            {/* Условно пишем "Базовый" */}
                                            <Text
                                                style={[
                                                    styles.topicLevel,
                                                    topic.locked &&
                                                        styles.lockedText,
                                                ]}
                                            >
                                                Базовый
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
            <BottomMenu
                activeScreen={activeScreen}
                onScreenChange={(screenName) => {
                    if (screenName === "home") {
                        navigation.navigate("Home");
                    } else if (screenName === "settings") {
                        navigation.navigate("Settings");
                    } else if (screenName === "subscription") {
                        navigation.navigate("Subscription");
                    } else if (screenName === "lop") {
                        // We're already on TopicList, no need to navigate
                        return;
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#6C873A",
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: Platform.OS === "ios" ? 84 : 60, // Add padding for bottom menu
    },
    loadingContainer: {
        flexGrow: 1,
    },
    loaderWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400, // Ensure minimum height for loader
    },
    headerContainer: {
        marginTop: 20,
        alignItems: "center",
        paddingHorizontal: 16,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    mountainImage: {
        width: "100%",
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: "#fff",
        lineHeight: 22,
        textAlign: "center",
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    topicsContainer: {
        backgroundColor: "#9DB276",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginTop: 40, // чтоб блок начинался "ниже"
    },
    topicsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 16,
        textAlign: "left",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    topicCard: {
        width: "30%", // 3 столбца (с зазором между)
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 16,
        padding: 10,
    },
    lockedTopicCard: {
        backgroundColor: "rgba(200,200,200,0.3)",
        opacity: 0.7,
    },
    completedTopicCard: {
        backgroundColor: "rgba(120,200,120,0.5)",
    },
    placeholderImage: {
        width: 80,
        height: 80,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    lockContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    lockIcon: {
        width: 30,
        height: 30,
        tintColor: "rgba(100,100,100,0.7)",
    },
    topicName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 2,
        textAlign: "center",
    },
    topicLevel: {
        fontSize: 12,
        color: "#fff",
        textAlign: "center",
    },
    lockedText: {
        color: "rgba(255,255,255,0.6)",
    },
    topicImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginBottom: 8,
        backgroundColor: "#fff",
    },
});
