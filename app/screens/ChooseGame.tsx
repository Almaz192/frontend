import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    Pressable,
    StatusBar,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ExitButton from "../components/ExitButton";
import {
    PRIMARY,
    NEUTRAL,
    TRANSPARENT,
    SHADOW,
    TEXT_SHADOW,
} from "../../constants";

const { width, height } = Dimensions.get("window");

export default function ChooseGame({
    route,
}: {
    route: { params: { topicId: any } };
}) {
    const navigation = useNavigation<any>();
    const { topicId } = route.params;

    // Animation values for button press effects
    const [dragDropButtonScale] = useState(new Animated.Value(1));
    const [imageWordButtonScale] = useState(new Animated.Value(1));

    const handleGameSelect = (game: string) => {
        if (game === "DragDrop") {
            navigation.navigate("GameDragDrop", { topicId });
        } else if (game === "GameImageWord") {
            navigation.navigate("GameImageWord", { topicId });
        }
    };

    // Function to animate button press
    const animateButtonPress = (
        animatedValue: Animated.Value,
        isPressed: boolean
    ) => {
        Animated.spring(animatedValue, {
            toValue: isPressed ? 0.97 : 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={PRIMARY.GREEN}
            />
            <View style={styles.background}>
                <View style={styles.topGradient} />
                <View style={styles.bottomGradient} />
            </View>

            <View style={styles.exitButtonContainer}>
                <ExitButton />
            </View>

            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Выберите Игру</Text>
                    <View style={styles.titleUnderline} />
                </View>

                <View style={styles.gamesContainer}>
                    <Pressable
                        onPressIn={() =>
                            animateButtonPress(dragDropButtonScale, true)
                        }
                        onPressOut={() =>
                            animateButtonPress(dragDropButtonScale, false)
                        }
                        onPress={() => handleGameSelect("DragDrop")}
                        style={styles.buttonWrapper}
                    >
                        <Animated.View
                            style={[
                                styles.gameButton,
                                { transform: [{ scale: dragDropButtonScale }] },
                            ]}
                        >
                            <View style={styles.gameIcon}>
                                <View style={styles.dragDropIcon} />
                            </View>
                            <View style={styles.buttonContent}>
                                <Text style={styles.gameButtonText}>
                                    Перетаскивание
                                </Text>
                                <Text style={styles.gameButtonSubtext}>
                                    Соедините слова с их значениями
                                </Text>
                            </View>
                        </Animated.View>
                    </Pressable>

                    <Pressable
                        onPressIn={() =>
                            animateButtonPress(imageWordButtonScale, true)
                        }
                        onPressOut={() =>
                            animateButtonPress(imageWordButtonScale, false)
                        }
                        onPress={() => handleGameSelect("GameImageWord")}
                        style={styles.buttonWrapper}
                    >
                        <Animated.View
                            style={[
                                styles.gameButton,
                                {
                                    transform: [
                                        { scale: imageWordButtonScale },
                                    ],
                                },
                            ]}
                        >
                            <View style={styles.gameIcon}>
                                <View style={styles.imageWordIcon} />
                            </View>
                            <View style={styles.buttonContent}>
                                <Text style={styles.gameButtonText}>
                                    Картинка и Слово
                                </Text>
                                <Text style={styles.gameButtonSubtext}>
                                    Соотнесите изображения со словами
                                </Text>
                            </View>
                        </Animated.View>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: PRIMARY.GREEN,
    },
    background: {
        position: "absolute",
        width: width,
        height: height,
    },
    topGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height * 0.4,
        backgroundColor: TRANSPARENT.GREEN_30,
        borderBottomRightRadius: 300,
    },
    bottomGradient: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: width,
        height: height * 0.4,
        backgroundColor: TRANSPARENT.BROWN_20,
        borderTopLeftRadius: 300,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    exitButtonContainer: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 1000,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 60,
    },
    title: {
        fontSize: 36,
        fontWeight: "700",
        color: NEUTRAL.WHITE,
        textAlign: "center",
        letterSpacing: 0.5,
        ...TEXT_SHADOW.REGULAR,
    },
    titleUnderline: {
        width: 40,
        height: 3,
        backgroundColor: NEUTRAL.WHITE,
        marginTop: 10,
        borderRadius: 2,
    },
    gamesContainer: {
        width: "100%",
        alignItems: "center",
        gap: 24,
    },
    buttonWrapper: {
        width: "100%",
        maxWidth: 350,
    },
    gameButton: {
        backgroundColor: PRIMARY.BROWN,
        padding: 24,
        borderRadius: 16,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: TRANSPARENT.WHITE_20,
        ...SHADOW.REGULAR,
    },
    gameIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: TRANSPARENT.WHITE_20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    dragDropIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: PRIMARY.LIGHT_GREEN,
        borderWidth: 2,
        borderColor: TRANSPARENT.WHITE_80,
    },
    imageWordIcon: {
        width: 24,
        height: 24,
        backgroundColor: PRIMARY.LIGHT_GREEN,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: TRANSPARENT.WHITE_80,
    },
    buttonContent: {
        flex: 1,
    },
    gameButtonText: {
        color: NEUTRAL.WHITE,
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 6,
    },
    gameButtonSubtext: {
        color: TRANSPARENT.WHITE_80,
        fontSize: 14,
        fontWeight: "400",
    },
});
