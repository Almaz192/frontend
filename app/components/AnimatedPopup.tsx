import React, { useState, useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";

interface AnimatedPopupProps {
    visible: boolean;
    type: "check" | "cross";
    onAnimationEnd: () => void;
}

const AnimatedPopup: React.FC<AnimatedPopupProps> = ({
    visible,
    type,
    onAnimationEnd,
}) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const [isRenderVisible, setIsRenderVisible] = useState(false);
    const visibleRef = useRef(visible);
    const animationInProgressRef = useRef(false);

    useEffect(() => {
        // Only respond to visibility changes to prevent double animations
        if (visible === visibleRef.current) return;
        visibleRef.current = visible;

        if (visible && !animationInProgressRef.current) {
            // Starting the animation
            animationInProgressRef.current = true;

            // Reset animation values
            scale.setValue(0);
            opacity.setValue(0);
            setIsRenderVisible(true);

            // Animate the checkmark with a bounce effect
            Animated.spring(scale, {
                toValue: 1.5,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();

            // Show the checkmark with full opacity
            Animated.timing(opacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        } else if (!visible && animationInProgressRef.current) {
            // Hide the popup with a fade out animation
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 0,
                    duration: 100, // faster fade out
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 100, // faster fade out
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsRenderVisible(false);
                animationInProgressRef.current = false;
                if (onAnimationEnd) onAnimationEnd();
            });
        }
    }, [visible, scale, opacity, onAnimationEnd]);

    if (!isRenderVisible) return null;

    const source =
        type === "check"
            ? require("../../assets/images/Check.png")
            : require("../../assets/images/Cross.png");

    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.Image
                source={source}
                style={[
                    styles.image,
                    {
                        opacity,
                        transform: [{ scale }, { perspective: 1000 }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backgroundColor: "transparent",
        pointerEvents: "none", // Extra protection for touch events passing through
    },
    image: {
        width: 180,
        height: 180,
        resizeMode: "contain",
    },
});

export default AnimatedPopup;
