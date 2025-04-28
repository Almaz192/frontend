// app/components/BottomMenu.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    Platform,
    InteractionManager,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY, NEUTRAL, TRANSPARENT, SPECIAL } from "../../constants";
import CustomAlert from "./CustomAlert";

const { width } = Dimensions.get("window");

// Create AnimatedIcon component once
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

// Define Ionicons names as specific literal types
type IoniconsName = keyof typeof Ionicons.glyphMap;

// Icons configuration with type safety - pairs of outline/filled icons
const ICONS = [
    {
        name: "home",
        iconOutline: "home-outline" as IoniconsName,
        iconFilled: "home" as IoniconsName,
    },
    {
        name: "lop",
        iconOutline: "search-outline" as IoniconsName,
        iconFilled: "search" as IoniconsName,
    },
    {
        name: "settings",
        iconOutline: "settings-outline" as IoniconsName,
        iconFilled: "settings" as IoniconsName,
    },
    {
        name: "subscription",
        iconOutline: "star-outline" as IoniconsName,
        iconFilled: "star" as IoniconsName,
    },
];

interface BottomMenuProps {
    onScreenChange: (screenName: string) => void;
    activeScreen: string;
}

export default function BottomMenu({
    onScreenChange,
    activeScreen,
}: BottomMenuProps) {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const isFocused = useIsFocused();
    const [isReady, setIsReady] = useState(false);
    const isMounted = useRef(true);
    const [showAlert, setShowAlert] = useState(false);
    const [activeIndex, setActiveIndex] = useState(() => {
        const index = ICONS.findIndex((icon) => icon.name === activeScreen);
        return index >= 0 ? index : 0;
    });

    // Single animation value for the active icon
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isFocused) {
            InteractionManager.runAfterInteractions(() => {
                if (isMounted.current) {
                    setIsReady(true);
                }
            });
        }
        return () => {
            isMounted.current = false;
            setIsReady(false);
            // Reset animation
            scaleAnim.setValue(1);
        };
    }, [isFocused]);

    useEffect(() => {
        if (!isReady || !isMounted.current) return;

        const newIndex = ICONS.findIndex((icon) => icon.name === activeScreen);
        if (newIndex >= 0 && newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    }, [activeScreen, isReady]);

    const handlePress = useCallback(
        (index: number) => {
            if (!isReady || !isMounted.current) return;

            const iconName = ICONS[index].name;

            if (iconName === "settings") {
                setShowAlert(true);
                return;
            }

            setActiveIndex(index);
            onScreenChange(iconName);

            // Navigate based on icon name
            switch (iconName) {
                case "home":
                    navigation.navigate("Home");
                    break;
                case "lop":
                    navigation.navigate("TopicList");
                    break;
                case "subscription":
                    navigation.navigate("Subscription");
                    break;
            }

            // Simple scale animation
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        },
        [isReady, onScreenChange, scaleAnim, navigation]
    );

    if (!isReady) {
        return <View style={styles.container} />;
    }

    return (
        <>
            <CustomAlert
                visible={showAlert}
                title="Уведомление"
                message="Эта страница будет добавлена в следующем обновлении"
                primaryButtonText="ОК"
                onPrimaryPress={() => setShowAlert(false)}
            />
            <View style={styles.container}>
                {ICONS.map((icon, i) => {
                    const isActive = i === activeIndex;
                    const isSubscription = i === 3;

                    return (
                        <TouchableWithoutFeedback
                            key={icon.name}
                            onPress={() => handlePress(i)}
                        >
                            <View style={styles.item}>
                                <View
                                    style={[
                                        styles.activeBackground,
                                        {
                                            opacity: isActive ? 1 : 0,
                                            backgroundColor: isSubscription
                                                ? "rgba(212, 175, 55, 0.3)"
                                                : "rgba(255, 255, 255, 0.2)",
                                            borderColor: isSubscription
                                                ? SPECIAL.GOLD
                                                : "rgba(255, 255, 255, 0.4)",
                                        },
                                    ]}
                                />
                                <Animated.View
                                    style={{
                                        transform: [
                                            { scale: isActive ? scaleAnim : 1 },
                                        ],
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            isActive
                                                ? icon.iconFilled
                                                : icon.iconOutline
                                        }
                                        size={isActive ? 32 : 28}
                                        color={
                                            isSubscription && isActive
                                                ? SPECIAL.GOLD
                                                : NEUTRAL.WHITE
                                        }
                                    />
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: PRIMARY.BROWN,
        height: Platform.OS === "ios" ? 84 : 60,
        alignItems: "center",
        justifyContent: "space-around",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        borderTopWidth: 0,
        shadowColor: NEUTRAL.BLACK,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        paddingBottom: Platform.OS === "ios" ? 20 : 0,
    },
    item: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        paddingVertical: 12,
    },
    activeBackground: {
        position: "absolute",
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: (width * 0.15) / 2,
        borderWidth: 1.5,
        shadowColor: NEUTRAL.WHITE,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 2,
    },
});
