import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Animated,
} from "react-native";
import axios from "axios";
import ProgressBarWithDetails from "../components/ProgressBarWithDetails";
import HeartIndicator from "../components/HeartIndicator";
import AnimatedPopup from "../components/AnimatedPopup";
import { StackScreenProps } from "@react-navigation/stack";
import LoadingSpinner from "../components/LoadingSpinner";
import { CommonActions } from "@react-navigation/native";
import CustomAlert from "../components/CustomAlert";
import { RootStackParamList } from "../navigation/AppNavigator";

interface GameImageWordProps
    extends StackScreenProps<RootStackParamList, "GameImageWord"> {}

interface Letter {
    char: string;
    id: number;
}

interface WordData {
    id: number;
    ky: string;
    img: string;
    combined: string;
    letters: string[];
}

const GameImageWord: React.FC<GameImageWordProps> = ({ route, navigation }) => {
    const { topicId } = route.params;
    const [words, setWords] = useState<WordData[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedLetters, setSelectedLetters] = useState<(Letter | null)[]>(
        []
    );
    const [availableLetters, setAvailableLetters] = useState<Letter[]>([]);
    const [health, setHealth] = useState(3);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState<"check" | "cross">("check");
    const [gameContentOpacity] = useState(new Animated.Value(1));
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isCompletionAlertShown, setIsCompletionAlertShown] = useState(false);
    const [customAlert, setCustomAlert] = useState<{
        visible: boolean;
        title: string;
        message: string;
        primaryButtonText: string;
        secondaryButtonText?: string;
        onPrimaryPress: () => void;
        onSecondaryPress?: () => void;
    }>({
        visible: false,
        title: "",
        message: "",
        primaryButtonText: "",
        onPrimaryPress: () => {},
    });

    useEffect(() => {
        fetchWords();
    }, [topicId]);

    const fetchWords = async () => {
        try {
            const response = await axios.get(
                `https://enetyl-back.duckdns.org/topic/${topicId}`
            );
            const raw = response.data.words || [];
            const filteredWords = raw
                .filter((arr: any[]) => arr[5])
                .map((arr: any[], index: number) => ({
                    id: index + 1,
                    ky: arr[3],
                    img: arr[5],
                    combined: `${arr[1]} / ${arr[2]}`,
                    letters: arr[3].split(""),
                }));

            const shuffledWords = shuffleArray(filteredWords) as WordData[];
            setWords(shuffledWords);

            if (shuffledWords.length > 0) {
                initializeGame(shuffledWords[0].letters);
            }
        } catch (err) {
            Alert.alert("Error", "Failed to load words");
        }
    };

    const initializeGame = (letters: string[]) => {
        const letterObjects = letters.map((char, idx) => ({
            char,
            id: idx + Math.random(),
        }));
        setAvailableLetters(shuffleArray([...letterObjects]));
        setSelectedLetters(new Array(letters.length).fill(null));
    };

    const handleSelectLetter = (letter: Letter) => {
        const emptyIndex = selectedLetters.findIndex((slot) => slot === null);
        if (emptyIndex !== -1) {
            const newSelected = [...selectedLetters];
            newSelected[emptyIndex] = letter;
            setSelectedLetters(newSelected);

            setAvailableLetters((prev) =>
                prev.filter((l) => l.id !== letter.id)
            );

            if (!newSelected.includes(null)) {
                checkAnswer(newSelected);
            }
        }
    };

    const handleRemoveLetter = (index: number) => {
        const letterToReturn = selectedLetters[index];
        if (letterToReturn) {
            const newSelected = [...selectedLetters];
            newSelected[index] = null;
            setSelectedLetters(newSelected);

            setAvailableLetters((prev) => [...prev, letterToReturn]);
        }
    };

    const handleContentVisibility = (
        visible: boolean,
        callback?: () => void
    ) => {
        setIsTransitioning(true);
        Animated.timing(gameContentOpacity, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsTransitioning(false);
            if (callback) callback();
        });
    };

    const handleGameCompletion = () => {
        if (isCompletionAlertShown) return;

        setIsCompletionAlertShown(true);

        setCustomAlert({
            visible: true,
            title: "Поздравляем!",
            message: "Вы успешно завершили все уровни!",
            primaryButtonText: "OK",
            onPrimaryPress: () => {
                setCustomAlert((prev) => ({
                    ...prev,
                    visible: false,
                }));
                navigation.dispatch(
                    CommonActions.navigate({
                        name: "Home",
                        params: {
                            completedTopicId: Number(topicId),
                            updateProgress: true,
                        },
                    })
                );
            },
        });
    };

    const handleGameOver = () => {
        setCustomAlert({
            visible: true,
            title: "Игра окончена",
            message: "У вас закончились все жизни!",
            primaryButtonText: "OK",
            onPrimaryPress: () => {
                setCustomAlert((prev) => ({
                    ...prev,
                    visible: false,
                }));
                navigation.dispatch(
                    CommonActions.navigate({
                        name: "Home",
                    })
                );
            },
        });
    };

    const moveToNextWord = () => {
        if (currentWordIndex < words.length - 1) {
            handleContentVisibility(false, () => {
                setCurrentWordIndex((prev) => prev + 1);
                initializeGame(words[currentWordIndex + 1].letters);
                handleContentVisibility(true);
            });
        } else {
            handleGameCompletion();
        }
    };

    const checkAnswer = (assembledLetters: (Letter | null)[]) => {
        if (isTransitioning) return;

        const guessedWord = assembledLetters
            .map((letter) => letter?.char || "")
            .join("");
        const currentWord = words[currentWordIndex];

        if (guessedWord === currentWord.ky) {
            setPopupType("check");
            setShowPopup(true);

            setTimeout(() => {
                setShowPopup(false);

                if (currentWordIndex < words.length - 1) {
                    moveToNextWord();
                } else {
                    handleGameCompletion();
                }
            }, 2000);
        } else {
            setPopupType("cross");
            setShowPopup(true);
            setHealth((prev) => prev - 1);

            if (health <= 1) {
                setTimeout(() => {
                    setShowPopup(false);
                    handleGameOver();
                }, 1500);
            } else {
                setTimeout(() => {
                    setShowPopup(false);
                    handleContentVisibility(false, () => {
                        initializeGame(currentWord.letters);
                        handleContentVisibility(true);
                    });
                }, 2000);
            }
        }
    };

    const handleExit = () => {
        setCustomAlert({
            visible: true,
            title: "Внимание",
            message: "Если вы выйдете из игры, ответы не сохранятся.",
            primaryButtonText: "Выход",
            secondaryButtonText: "Продолжить",
            onPrimaryPress: () => {
                setCustomAlert((prev) => ({ ...prev, visible: false }));
                navigation.dispatch(
                    CommonActions.navigate({
                        name: "Home",
                    })
                );
            },
            onSecondaryPress: () => {
                setCustomAlert((prev) => ({ ...prev, visible: false }));
            },
        });
    };

    const currentWord = words[currentWordIndex];

    if (!currentWord) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <LoadingSpinner size={70} color="#FFFFFF" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <ProgressBarWithDetails
                    currentExercise={currentWordIndex + 1}
                    totalExercises={words.length}
                    progress={(currentWordIndex + 1) / words.length}
                    onExit={handleExit}
                />

                <Animated.View
                    style={[
                        styles.gameContainer,
                        {
                            opacity: gameContentOpacity,
                            transform: [
                                {
                                    scale: gameContentOpacity.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.95, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                    pointerEvents={isTransitioning ? "none" : "auto"}
                >
                    <Image
                        source={{
                            uri: `https://enetyl-back.duckdns.org${currentWord.img}`,
                        }}
                        style={styles.wordImage}
                    />

                    <View style={styles.word}>
                        {selectedLetters.map((letter, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.letterBox}
                                onPress={() => handleRemoveLetter(index)}
                            >
                                <Text style={styles.letter}>
                                    {letter?.char || ""}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.lettersContainer}>
                        {availableLetters.map((letter) => (
                            <TouchableOpacity
                                key={letter.id}
                                style={styles.letterButton}
                                onPress={() => handleSelectLetter(letter)}
                            >
                                <Text style={styles.letter}>{letter.char}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.bottomSpacing} />
                </Animated.View>

                <HeartIndicator lives={health} />
                <AnimatedPopup
                    visible={showPopup}
                    type={popupType}
                    onAnimationEnd={() => {
                        setShowPopup(false);
                    }}
                />
                <CustomAlert
                    visible={customAlert.visible}
                    title={customAlert.title}
                    message={customAlert.message}
                    primaryButtonText={customAlert.primaryButtonText}
                    secondaryButtonText={customAlert.secondaryButtonText}
                    onPrimaryPress={customAlert.onPrimaryPress}
                    onSecondaryPress={customAlert.onSecondaryPress}
                />
            </View>
        </SafeAreaView>
    );
};

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e63234",
        overflow: "hidden",
    },
    mainContent: {
        flex: 1,
        position: "relative",
    },
    gameContainer: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        width: "100%",
        overflow: "hidden",
        paddingTop: 20,
    },
    bottomSpacing: {
        height: 40,
    },
    wordImage: {
        width: 350,
        height: 150,
        backgroundColor: "transparent",
        resizeMode: "contain",
        marginTop: 100,
    },
    word: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
        backgroundColor: "transparent",
    },
    letterBox: {
        width: 40,
        height: 40,
        margin: 5,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#fff",
        marginHorizontal: 5,
    },
    letter: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
    },
    lettersContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginVertical: 10,
        backgroundColor: "transparent",
        padding: 10,
    },
    letterButton: {
        width: 50,
        height: 50,
        backgroundColor: "transparent",
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default GameImageWord;
