import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface HeartIndicatorProps {
    lives: number; // Current number of lives remaining
    totalLives?: number; // Total lives available, default is 3
    size?: number; // Size of the hearts, default is 30
    spacing?: number; // Spacing between hearts, default is 5
}

const HeartIndicator: React.FC<HeartIndicatorProps> = ({
    lives,
    totalLives = 3,
    size = 30,
    spacing = 5,
}) => {
    return (
        <View style={[styles.container, { marginHorizontal: spacing }]}>
            {Array(totalLives)
                .fill(0)
                .map((_, index) => (
                    <Image
                        key={index}
                        source={require("../../assets/icons/heart-gray.png")}
                        style={[
                            styles.heartIcon,
                            {
                                width: size,
                                height: size,
                                marginHorizontal: spacing,
                                opacity: index < lives ? 1 : 0.3,
                            },
                        ]}
                    />
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    heartIcon: {
        resizeMode: "contain",
    },
});

export default HeartIndicator;
