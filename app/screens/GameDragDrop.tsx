import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    PanResponder,
    Animated,
    Alert,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import axios from "axios";
import AnimatedPopup from "../components/AnimatedPopup";
import ProgressBarWithDetails from "../components/ProgressBarWithDetails";
import DraggableImage from "../components/DraggableImage";
import HeartIndicator from "../components/HeartIndicator";
import LoadingSpinner from "../components/LoadingSpinner";
import CustomAlert from "../components/CustomAlert";

// Define data structure types
interface WordEntry {
    id: number;
    kyrgyzWord: string; // The word displayed in the center
    imageBase64: string; // The correct image for the word
    combined: string; // Additional info if needed
}

interface GameRound {
    targetWord: WordEntry;
    imageOptions: {
        imageUrl: string;
        isCorrect: boolean;
        position: number;
    }[];
    correctPosition: number;
}

// Route parameters type
type GameRouteParams = {
    topicId: number;
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const GameDragDrop = () => {
    // Get route parameters and navigation
    const route =
        useRoute<RouteProp<Record<string, GameRouteParams>, string>>();
    const navigation = useNavigation();
    const topicId = route.params?.topicId;

    // Get screen dimensions for calculations
    const { width: screenWidth, height: screenHeight } =
        Dimensions.get("window");

    // Game state
    const [allWords, setAllWords] = useState<WordEntry[]>([]);
    const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(true);

    // UI state
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState<"check" | "cross">("check");
    const [isProcessingDrop, setIsProcessingDrop] = useState(false);
    const [fadeOpacity] = useState(new Animated.Value(1));
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Alert state
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: "",
        message: "",
        primaryButtonText: "",
        secondaryButtonText: "",
        onPrimaryPress: () => {},
        onSecondaryPress: () => {},
    });

    // Get the current round data
    const currentRound = useMemo(() => {
        return gameRounds[currentRoundIndex] || null;
    }, [gameRounds, currentRoundIndex]);

    // Initialize game by loading data
    useEffect(() => {
        fetchWordData();
    }, [topicId]);

    // Prepare game rounds whenever allWords changes
    useEffect(() => {
        if (allWords.length >= 3) {
            prepareGameRounds();
        }
    }, [allWords]);

    // Fetch word data from API
    const fetchWordData = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `https://enetyl-back.duckdns.org/topic/${topicId}`
            );

            const rawWords = response.data.words || [];

            // Transform the raw data into our structured format
            const transformedWords = rawWords
                .filter((entry: any[]) => entry[5]) // Must have an image
                .map((entry: any[], index: number) => ({
                    id: index,
                    kyrgyzWord: entry[3],
                    imageBase64: `https://enetyl-back.duckdns.org${entry[5]}`,
                    combined: `${entry[1]} / ${entry[2]}`,
                }));

            if (transformedWords.length < 3) {
                Alert.alert(
                    "Error",
                    "This topic doesn't have enough words with images (minimum 3 required)."
                );
                navigation.goBack();
                return;
            }

            // Ensure all words have unique IDs
            const uniqueTransformedWords = transformedWords.filter(
                (word: WordEntry, index: number, self: WordEntry[]) =>
                    index ===
                    self.findIndex(
                        (w: WordEntry) => w.kyrgyzWord === word.kyrgyzWord
                    )
            );

            // Use only unique words
            if (uniqueTransformedWords.length < 3) {
                Alert.alert(
                    "Error",
                    "This topic doesn't have enough unique words (minimum 3 required)."
                );
                navigation.goBack();
                return;
            }

            setAllWords(uniqueTransformedWords);
        } catch (error) {
            Alert.alert("Error", "Failed to load words. Please try again.");
            navigation.goBack();
        }
    };

    // Generate an ordered set of game rounds using the available words
    const prepareGameRounds = () => {
        // Shuffle all words for randomness
        const shuffledWords = shuffleArray([...allWords]);

        // Limit to 20 words max for reasonable game length
        const wordsToUse = shuffledWords.slice(
            0,
            Math.min(20, shuffledWords.length)
        );

        // For each word, get distractors and create a round
        const rounds = wordsToUse
            .map((word: WordEntry, wordIndex: number) => {
                // Find other words to use as distractors
                const distractors = wordsToUse.filter(
                    (w: WordEntry) => w.kyrgyzWord !== word.kyrgyzWord
                );

                // Ensure we have enough distractors
                if (distractors.length < 2) {
                    return null;
                }

                const distractorsToUse = shuffleArray(distractors).slice(0, 2);

                // Create array with correct option and distractors
                const allOptions = [
                    { imageUrl: word.imageBase64, isCorrect: true },
                    ...distractorsToUse.map((word) => ({
                        imageUrl: word.imageBase64,
                        isCorrect: false,
                    })),
                ];

                // Shuffle options for random positioning
                const shuffledOptions = shuffleArray(allOptions);

                // Find where the correct option landed
                const correctPosition =
                    shuffledOptions.findIndex((option) => option.isCorrect) + 1;

                // Return completed round configuration
                return {
                    targetWord: word,
                    imageOptions: shuffledOptions.map((option, index) => ({
                        ...option,
                        position: index + 1, // 1-based position
                    })),
                    correctPosition,
                };
            })
            .filter((round) => round !== null) as GameRound[];

        setGameRounds(rounds);
        setCurrentRoundIndex(0);
        setLives(3);
        setIsLoading(false);
    };

    // Handle content transition animation
    const fadeContent = useCallback(
        (visible: boolean, callback?: () => void) => {
            setIsTransitioning(true);
            Animated.timing(fadeOpacity, {
                toValue: visible ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setIsTransitioning(false);
                if (callback) callback();
            });
        },
        [fadeOpacity]
    );

    // Move to the next round with animation
    const goToNextRound = useCallback(() => {
        if (currentRoundIndex < gameRounds.length - 1) {
            // First disable interactions during transition
            setIsProcessingDrop(true);

            // Start by fading out content
            fadeContent(false, () => {
                // Update round index
                const nextRoundIndex = currentRoundIndex + 1;
                setCurrentRoundIndex(nextRoundIndex);

                // Short delay before fading in new content
                setTimeout(() => {
                    // Fade in the new content
                    fadeContent(true, () => {
                        // Wait a moment before enabling interactions
                        setTimeout(() => {
                            setIsProcessingDrop(false);
                        }, 200);
                    });
                }, 200);
            });
        } else {
            // Game completed
            setAlertConfig({
                visible: true,
                title: "Поздравляем!",
                message: "Вы успешно завершили все уровни!",
                primaryButtonText: "Вернуться",
                secondaryButtonText: "",
                onPrimaryPress: () => {
                    setAlertConfig((prev) => ({ ...prev, visible: false }));
                    // Navigate to Home instead of going back
                    navigation.navigate("Home", {
                        completedTopicId: topicId,
                        updateProgress: true,
                    });
                },
                onSecondaryPress: () => {},
            });
            setIsProcessingDrop(false);
        }
    }, [currentRoundIndex, gameRounds.length, navigation, fadeContent]);

    // Handle image drop event
    const handleImageDrop = useCallback(
        (gesture: { moveX: number; moveY: number }, imagePosition: number) => {
            // Ignore drops if already processing or no current round
            if (isProcessingDrop || !currentRound) {
                return;
            }

            // Define the drop target zone (around the word)
            const dropZone = {
                x: screenWidth / 2,
                y: screenHeight / 2,
                width: screenWidth * 0.8,
                height: 300,
            };

            // Check if the drop location is within the drop zone
            const isDroppedInZone =
                gesture.moveX >= dropZone.x - dropZone.width / 2 &&
                gesture.moveX <= dropZone.x + dropZone.width / 2 &&
                gesture.moveY >= dropZone.y - dropZone.height / 2 &&
                gesture.moveY <= dropZone.y + dropZone.height / 2;

            if (isDroppedInZone) {
                // Lock interactions while processing
                setIsProcessingDrop(true);

                // Check if the dropped image is correct
                const isCorrect =
                    imagePosition === currentRound.correctPosition;

                // Show feedback
                setPopupType(isCorrect ? "check" : "cross");
                setShowPopup(true);

                // Process the result after allowing the animation to play
                if (isCorrect) {
                    // Show the checkmark for a moment, then move to next round
                    setTimeout(() => {
                        // Hide the popup exactly when starting the transition
                        setShowPopup(false);

                        // Immediately start the transition to next round
                        // without any delay that could cause a blackout
                        goToNextRound();
                    }, 1500);
                } else {
                    // For incorrect answers, show feedback and reduce lives
                    setTimeout(() => {
                        setShowPopup(false);

                        // Reduce lives
                        setLives((prev) => {
                            const newLives = prev - 1;

                            // Game over if no lives left
                            if (newLives <= 0) {
                                setAlertConfig({
                                    visible: true,
                                    title: "Игра окончена",
                                    message: "У вас закончились все жизни!",
                                    primaryButtonText: "OK",
                                    secondaryButtonText: "",
                                    onPrimaryPress: () => {
                                        setAlertConfig((prev) => ({
                                            ...prev,
                                            visible: false,
                                        }));
                                        navigation.goBack();
                                    },
                                    onSecondaryPress: () => {},
                                });
                            }
                            return newLives;
                        });

                        setIsProcessingDrop(false);
                    }, 2000);
                }
            }
        },
        [
            currentRound,
            currentRoundIndex,
            gameRounds.length,
            isProcessingDrop,
            goToNextRound,
            navigation,
            screenWidth,
            screenHeight,
        ]
    );

    // Handle the exit button press
    const handleExit = useCallback(() => {
        setAlertConfig({
            visible: true,
            title: "Внимание",
            message: "Если вы выйдете из игры, ответы не сохранятся.",
            primaryButtonText: "Выход",
            secondaryButtonText: "Продолжить",
            onPrimaryPress: () => {
                setAlertConfig((prev) => ({ ...prev, visible: false }));
                navigation.goBack();
            },
            onSecondaryPress: () => {
                setAlertConfig((prev) => ({ ...prev, visible: false }));
            },
        });
    }, []);

    // Show loading screen while preparing the game
    if (isLoading || !currentRound) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.loadingContainer}>
                    <LoadingSpinner size={70} color="#FFFFFF" />
                </View>
            </SafeAreaView>
        );
    }

    // Main game render
    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                {/* Progress bar - always visible */}
                <View style={styles.progressBarContainer}>
                    <ProgressBarWithDetails
                        currentExercise={currentRoundIndex + 1}
                        totalExercises={gameRounds.length}
                        progress={(currentRoundIndex + 1) / gameRounds.length}
                        onExit={handleExit}
                    />
                </View>

                {/* Main game content that fades in/out */}
                <Animated.View
                    style={[
                        styles.gameContent,
                        {
                            opacity: fadeOpacity,
                            transform: [
                                {
                                    scale: fadeOpacity.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.95, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                    pointerEvents={
                        isTransitioning || isProcessingDrop ? "none" : "auto"
                    }
                >
                    {/* Top row images */}
                    <View
                        style={styles.topImagesContainer}
                        key={`row-top-${currentRoundIndex}`}
                    >
                        <DraggableImage
                            key={`image-1-round-${currentRoundIndex}`}
                            imageSource={currentRound.imageOptions[0].imageUrl}
                            onRelease={(gesture) => handleImageDrop(gesture, 1)}
                            disabled={isProcessingDrop}
                        />
                        <DraggableImage
                            key={`image-2-round-${currentRoundIndex}`}
                            imageSource={currentRound.imageOptions[1].imageUrl}
                            onRelease={(gesture) => handleImageDrop(gesture, 2)}
                            disabled={isProcessingDrop}
                        />
                    </View>

                    {/* Target word in center */}
                    <Text style={styles.word} key={`word-${currentRoundIndex}`}>
                        {currentRound.targetWord.kyrgyzWord}
                    </Text>

                    {/* Bottom image */}
                    <View
                        style={styles.bottomImageContainer}
                        key={`row-bottom-${currentRoundIndex}`}
                    >
                        <DraggableImage
                            key={`image-3-round-${currentRoundIndex}`}
                            imageSource={currentRound.imageOptions[2].imageUrl}
                            onRelease={(gesture) => handleImageDrop(gesture, 3)}
                            disabled={isProcessingDrop}
                        />
                    </View>
                </Animated.View>

                {/* Lives indicator - always visible */}
                <View style={styles.heartsFixedContainer}>
                    <HeartIndicator lives={lives} />
                </View>

                {/* Feedback popup */}
                <AnimatedPopup
                    visible={showPopup}
                    type={popupType}
                    onAnimationEnd={() => {}}
                />
            </View>

            {/* Custom alert for game events */}
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                primaryButtonText={alertConfig.primaryButtonText}
                secondaryButtonText={alertConfig.secondaryButtonText}
                onPrimaryPress={alertConfig.onPrimaryPress}
                onSecondaryPress={alertConfig.onSecondaryPress}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#6C873A",
    },
    container: {
        flex: 1,
        position: "relative",
    },
    progressBarContainer: {
        paddingHorizontal: 0,
        paddingTop: 10,
        zIndex: 10,
    },
    gameContent: {
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 40,
    },
    topImagesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 40,
        marginTop: 40,
        zIndex: 2,
        elevation: 2,
    },
    word: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        padding: 20,
        zIndex: 1,
    },
    bottomImageContainer: {
        alignItems: "center",
        marginBottom: 60,
        zIndex: 2,
        elevation: 2,
    },
    option: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    optionImage: {
        width: 60,
        height: 60,
        resizeMode: "contain",
    },
    heartsContainer: {
        position: "absolute",
        bottom: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    heartsFixedContainer: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    heartIcon: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    resultContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
        justifyContent: "center",
        alignItems: "center",
    },
    resultIcon: {
        width: 100,
        height: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default GameDragDrop;
