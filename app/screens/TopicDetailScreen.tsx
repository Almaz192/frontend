import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import ExitButton from "../components/ExitButton";
import LoadingSpinner from "../components/LoadingSpinner";

interface WordItem {
    id: number; // индекс (1,2,3...)
    image: string; // ссылка на картинку (если есть)
    ky: string; // киргизское слово
    combined: string; // англ / рус
}

interface TopicData {
    id: number;
    title: string;
    ru: string;
    ky: string;
    image: string;
}

export default function TopicDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    // Из route.params берём topicId, topicTitle (пришли из Homepage)
    const { topicId, topicTitle } = route.params as {
        topicId: number;
        topicTitle: string;
    };

    const [words, setWords] = useState<WordItem[]>([]);
    const [topicData, setTopicData] = useState<TopicData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        axios
            .get(`https://enetyl-back.duckdns.org/topic/${topicId}`)
            .then((response: any) => {
                // Получаем данные о теме и словах
                const topicInfo = response.data.topic || null;
                const raw = response.data.words || [];

                // Debug information
                console.log(
                    "Topic API Response:",
                    JSON.stringify(response.data)
                );

                let debugStr = "";
                if (topicInfo) {
                    debugStr = `Topic ID: ${topicInfo[0]}, Image length: ${
                        topicInfo[4] ? topicInfo[4].length : 0
                    }`;
                }
                setDebugInfo(debugStr);

                // Обновленный формат ответа API
                if (topicInfo && Array.isArray(topicInfo)) {
                    setTopicData({
                        id: topicInfo[0],
                        title: topicInfo[1],
                        ru: topicInfo[2],
                        ky: topicInfo[3],
                        image: topicInfo[4] || "",
                    });
                }

                // Маппинг слов: [id, eng, rus, ky, image, ...]
                const mapped = raw.map((arr: any[], index: number) => ({
                    id: index + 1,
                    image: arr[4] || "",
                    ky: arr[3], // коштошуу
                    combined: `${arr[1]} / ${arr[2]}`, // goodbye / до свидания
                }));
                setWords(mapped);
            })
            .catch((err: any) => {
                console.error(err);
                setError("Не удалось загрузить слова для топика");
            })
            .finally(() => setLoading(false));
    }, [topicId]);

    const handlePlayPress = () => {
        navigation.navigate("ChooseGame", { topicId });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.exitButtonContainer}>
                <ExitButton />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Изображение темы */}
                {topicData && topicData.image ? (
                    <View>
                        <Image
                            source={{
                                uri: `https://enetyl-back.duckdns.org${topicData.image}`,
                            }}
                            style={styles.topImage}
                        />
                        {__DEV__ && debugInfo ? (
                            <Text style={{ color: "white", fontSize: 12 }}>
                                {debugInfo}
                            </Text>
                        ) : null}
                    </View>
                ) : (
                    <View style={styles.topImagePlaceholder}>
                        {__DEV__ && (
                            <Text style={{ color: "black", fontSize: 12 }}>
                                No image available. Debug: {debugInfo}
                            </Text>
                        )}
                    </View>
                )}

                {/* Название топика и уровень */}
                <Text style={styles.topicTitle}>{topicTitle}</Text>
                <Text style={styles.topicSubtitle}>
                    Базовый • Количество слов: {words.length}
                </Text>

                {/* Кнопка "Играть" */}
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePlayPress}
                >
                    <Text style={styles.playButtonText}>Играть</Text>
                </TouchableOpacity>

                {/* Список слов с загрузкой */}
                <View style={styles.wordsContainer}>
                    {loading ? (
                        <View style={styles.loaderContainer}>
                            <LoadingSpinner size={70} color="#FFFFFF" />
                        </View>
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        words.map((item) => (
                            <View key={item.id} style={styles.wordItem}>
                                <View style={styles.leftPart}>
                                    <Text style={styles.indexText}>
                                        {item.id}
                                    </Text>

                                    {/* Изображение или заглушка */}
                                    {item.image ? (
                                        <Image
                                            source={{
                                                uri: `https://enetyl-back.duckdns.org${item.image}`,
                                            }}
                                            style={styles.wordImage}
                                        />
                                    ) : (
                                        <View
                                            style={styles.wordImagePlaceholder}
                                        />
                                    )}

                                    <View style={styles.wordTexts}>
                                        <Text style={styles.kyText}>
                                            {item.ky}
                                        </Text>
                                        <Text style={styles.ruText}>
                                            {item.combined}
                                        </Text>
                                    </View>
                                </View>

                                {/* Стрелка справа */}
                                <Image
                                    source={require("../../assets/icons/arrow-right.png")}
                                    style={styles.arrowIcon}
                                />
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#6C873A",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 60,
    },

    // Контейнер под иконку выхода
    exitButtonContainer: {
        position: "absolute",
        top: 50,
        left: 10,
        zIndex: 1000,
    },

    topImagePlaceholder: {
        width: "100%",
        height: 200,
        backgroundColor: "#ddd",
        borderRadius: 12,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    topImage: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: "#fff",
    },

    topicTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    topicSubtitle: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },

    playButton: {
        backgroundColor: "#74533A",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 20,
    },
    playButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },

    wordsContainer: {
        minHeight: 200, // Add minimum height to contain loader
    },
    loaderContainer: {
        position: "relative",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    wordItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F7F9FB",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    leftPart: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    indexText: {
        width: 28,
        fontSize: 16,
        fontWeight: "bold",
        color: "#6C873A",
        marginRight: 8,
        textAlign: "center",
    },
    wordImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginRight: 10,
    },
    wordImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "#ddd",
        marginRight: 10,
    },
    wordTexts: {},
    kyText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    ruText: {
        fontSize: 14,
        color: "#666",
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: "#bbb",
    },
});
