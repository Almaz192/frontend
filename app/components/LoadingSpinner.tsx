import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { NEUTRAL } from "../../constants";

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 70,
    color = NEUTRAL.WHITE,
}) => {
    const spinValue = new Animated.Value(0);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        animation.start();

        return () => {
            animation.stop();
            spinValue.setValue(0);
        };
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.spinner,
                    {
                        width: size,
                        height: size,
                        borderColor: color,
                        transform: [{ rotate: spin }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 1000,
    },
    spinner: {
        borderWidth: 4,
        borderRadius: 50,
        borderColor: NEUTRAL.WHITE,
        borderTopColor: "transparent",
    },
});

export default LoadingSpinner;
