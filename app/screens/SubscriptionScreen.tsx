import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Pressable,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../components/CustomAlert";
import BottomMenu from "../components/BottomMenu";
import {
    PRIMARY,
    NEUTRAL,
    TRANSPARENT,
    SPECIAL,
    TEXT_SHADOW,
    SHADOW,
} from "../../constants";

const { width } = Dimensions.get("window");

export default function SubscriptionScreen() {
    // Animation value for button press effect
    const [monthlyButtonScale] = React.useState(new Animated.Value(1));
    const [annualButtonScale] = React.useState(new Animated.Value(1));
    const [activeScreen, setActiveScreen] = useState("subscription");

    // State for CustomAlert
    const [alertConfig, setAlertConfig] = React.useState({
        visible: false,
        title: "",
        message: "",
        primaryButtonText: "",
        secondaryButtonText: "",
        onPrimaryPress: () => {},
        onSecondaryPress: () => {},
    });

    const handleSubscribe = (plan: string) => {
        setAlertConfig({
            visible: true,
            title: "Уведомление",
            message:
                "Эта функция будет добавлена в следующем обновлении приложения.",
            primaryButtonText: "OK",
            secondaryButtonText: "",
            onPrimaryPress: () => {
                setAlertConfig((prev) => ({ ...prev, visible: false }));
            },
            onSecondaryPress: () => {},
        });
    };

    // Function to animate button press
    const animateButtonPress = (
        animatedValue: Animated.Value,
        isPressed: boolean
    ) => {
        Animated.spring(animatedValue, {
            toValue: isPressed ? 0.95 : 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    const handleScreenChange = (screenName: string) => {
        setActiveScreen(screenName);
    };

    return (
        <SafeAreaView style={styles.backgroundContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Премиум Доступ</Text>
                    <Text style={styles.subtitle}>
                        Откройте безграничные возможности обучения
                    </Text>
                </View>

                {/* Current Plan */}
                <View style={styles.currentPlanCard}>
                    <View style={styles.freePlanBadge}>
                        <Text style={styles.freePlanBadgeText}>
                            ТЕКУЩИЙ ПЛАН
                        </Text>
                    </View>
                    <Text style={styles.currentPlanTitle}>Бесплатный</Text>
                    <View style={styles.divider} />
                    <View style={styles.planFeatures}>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="time-outline"
                                size={18}
                                color={NEUTRAL.WHITE}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.currentPlanDescription}>
                                5 минут игрового времени каждые 24 часа
                            </Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={18}
                                color={NEUTRAL.WHITE}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.limitText}>
                                Ограниченный доступ к учебным материалам
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Monthly Plan */}
                <View style={styles.planCard}>
                    <View style={styles.planHeader}>
                        <View style={styles.planBadge}>
                            <Text style={styles.planBadgeText}>ПОПУЛЯРНЫЙ</Text>
                        </View>
                        <Text style={styles.planTitle}>Месячный Премиум</Text>
                        <Text style={styles.planPrice}>99 сом</Text>
                        <Text style={styles.planDuration}>в месяц</Text>
                    </View>

                    <View style={styles.planFeatures}>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={PRIMARY.LIGHT_GREEN}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.featureText}>
                                Неограниченный доступ
                            </Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={PRIMARY.LIGHT_GREEN}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.featureText}>
                                Все учебные материалы включены
                            </Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={PRIMARY.LIGHT_GREEN}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.featureText}>
                                Время обучения 24/7
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        onPressIn={() =>
                            animateButtonPress(monthlyButtonScale, true)
                        }
                        onPressOut={() =>
                            animateButtonPress(monthlyButtonScale, false)
                        }
                        onPress={() => handleSubscribe("Monthly")}
                    >
                        <Animated.View
                            style={[
                                styles.subscribeButton,
                                styles.enhancedButton,
                                { transform: [{ scale: monthlyButtonScale }] },
                            ]}
                        >
                            <Text style={styles.enhancedButtonText}>
                                Купить
                            </Text>
                        </Animated.View>
                    </Pressable>
                </View>

                {/* Annual Plan */}
                <View style={[styles.planCard, styles.annualCard]}>
                    <View style={styles.planHeader}>
                        <View style={[styles.planBadge, styles.bestValueBadge]}>
                            <Text style={styles.planBadgeText}>ВЫГОДНЫЙ</Text>
                        </View>
                        <Text style={styles.planTitle}>Годовой Премиум</Text>
                        <Text style={styles.planPrice}>699 сом</Text>
                        <Text style={styles.planDuration}>в год</Text>
                        <Text style={styles.savingsText}>
                            Экономия более 40%
                        </Text>
                    </View>

                    <View style={styles.planFeatures}>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={SPECIAL.GOLD}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.featureText}>
                                Неограниченный доступ
                            </Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={SPECIAL.GOLD}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.featureText}>
                                Все учебные материалы включены
                            </Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={SPECIAL.GOLD}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.featureText}>
                                Время обучения 24/7
                            </Text>
                        </View>
                        <View style={styles.featureRow}>
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={SPECIAL.GOLD}
                                style={styles.checkIcon}
                            />
                            <Text style={styles.featureText}>
                                Приоритетная поддержка
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        onPressIn={() =>
                            animateButtonPress(annualButtonScale, true)
                        }
                        onPressOut={() =>
                            animateButtonPress(annualButtonScale, false)
                        }
                        onPress={() => handleSubscribe("Annual")}
                    >
                        <Animated.View
                            style={[
                                styles.subscribeButton,
                                styles.enhancedButton,
                                styles.annualButton,
                                { transform: [{ scale: annualButtonScale }] },
                            ]}
                        >
                            <Text style={styles.enhancedButtonText}>
                                Купить
                            </Text>
                        </Animated.View>
                    </Pressable>
                </View>
            </ScrollView>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                primaryButtonText={alertConfig.primaryButtonText}
                secondaryButtonText={alertConfig.secondaryButtonText}
                onPrimaryPress={alertConfig.onPrimaryPress}
                onSecondaryPress={alertConfig.onSecondaryPress}
            />

            <BottomMenu
                onScreenChange={handleScreenChange}
                activeScreen={activeScreen}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        backgroundColor: PRIMARY.GREEN,
        padding: 0,
        margin: 0,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 80,
        paddingTop: 20,
        backgroundColor: PRIMARY.GREEN,
    },
    header: {
        marginBottom: 30,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: NEUTRAL.WHITE,
        textAlign: "center",
        ...TEXT_SHADOW.REGULAR,
    },
    subtitle: {
        fontSize: 18,
        color: NEUTRAL.WHITE,
        textAlign: "center",
        marginTop: 5,
    },
    currentPlanCard: {
        backgroundColor: PRIMARY.BROWN,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: TRANSPARENT.WHITE_30,
        position: "relative",
        paddingTop: 35,
        ...SHADOW.REGULAR,
    },
    freePlanBadge: {
        position: "absolute",
        top: -12,
        alignSelf: "center",
        backgroundColor: PRIMARY.GREEN,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: TRANSPARENT.WHITE_50,
        ...SHADOW.REGULAR,
    },
    freePlanBadgeText: {
        color: NEUTRAL.WHITE,
        fontWeight: "bold",
        fontSize: 12,
        ...TEXT_SHADOW.REGULAR,
    },
    currentPlanTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: NEUTRAL.WHITE,
        marginBottom: 5,
        textAlign: "center",
        ...TEXT_SHADOW.REGULAR,
    },
    divider: {
        height: 1,
        backgroundColor: TRANSPARENT.WHITE_50,
        marginVertical: 15,
    },
    planFeatures: {
        marginBottom: 5,
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
        paddingRight: 10,
    },
    checkIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    currentPlanDescription: {
        fontSize: 16,
        color: NEUTRAL.WHITE,
        marginBottom: 5,
        flex: 1,
        flexWrap: "wrap",
        ...TEXT_SHADOW.REGULAR,
    },
    limitText: {
        fontSize: 14,
        color: NEUTRAL.WHITE,
        fontStyle: "italic",
        flex: 1,
        flexWrap: "wrap",
        ...TEXT_SHADOW.REGULAR,
    },
    planCard: {
        backgroundColor: NEUTRAL.WHITE,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        ...SHADOW.ELEVATED,
    },
    annualCard: {
        backgroundColor: SPECIAL.PREMIUM_BG,
        borderWidth: 2,
        borderColor: SPECIAL.GOLD,
    },
    planHeader: {
        alignItems: "center",
        marginBottom: 15,
        position: "relative",
        paddingTop: 15,
    },
    planBadge: {
        position: "absolute",
        top: -12,
        backgroundColor: PRIMARY.LIGHT_GREEN,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    bestValueBadge: {
        backgroundColor: SPECIAL.GOLD,
    },
    planBadgeText: {
        color: NEUTRAL.WHITE,
        fontWeight: "bold",
        fontSize: 12,
    },
    planTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: PRIMARY.BROWN,
        marginTop: 10,
    },
    planPrice: {
        fontSize: 30,
        fontWeight: "bold",
        color: PRIMARY.BROWN,
        marginTop: 5,
    },
    planDuration: {
        fontSize: 16,
        color: PRIMARY.BROWN,
        marginBottom: 5,
    },
    savingsText: {
        fontSize: 14,
        color: SPECIAL.GOLD,
        fontWeight: "bold",
        marginTop: 5,
    },
    featureText: {
        fontSize: 16,
        color: PRIMARY.BROWN,
        flex: 1,
        flexWrap: "wrap",
    },
    subscribeButton: {
        backgroundColor: PRIMARY.LIGHT_GREEN,
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
    },
    annualButton: {
        backgroundColor: SPECIAL.GOLD,
    },
    enhancedButton: {
        paddingVertical: 16,
        shadowColor: NEUTRAL.BLACK,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 8,
        borderRadius: 12,
    },
    enhancedButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: NEUTRAL.WHITE,
        textShadowColor: TRANSPARENT.BLACK_30,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    termsText: {
        fontSize: 12,
        color: NEUTRAL.WHITE,
        textAlign: "center",
        marginTop: 20,
    },
});
