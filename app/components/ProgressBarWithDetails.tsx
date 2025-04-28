import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface ProgressBarWithDetailsProps {
    currentExercise: number;
    totalExercises: number;
    progress: number; // Percentage progress (0 to 1)
    onExit: () => void;
}

const ProgressBarWithDetails: React.FC<ProgressBarWithDetailsProps> = ({
    currentExercise,
    totalExercises,
    progress,
    onExit,
}) => {
    return (
        <View style={styles.container}>
            {/* Exit Button */}
            <TouchableOpacity onPress={onExit} style={styles.exitButton}>
                <Image
                    source={require("../../assets/icons/exit-white.png")} // Replace with your cross image
                    style={styles.exitIcon}
                />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View
                    style={[
                        styles.progressBarFill,
                        { width: `${progress * 100}%` },
                    ]}
                />
            </View>

            {/* Exercise Details */}
            <Text style={styles.exerciseText}>
                {currentExercise}/{totalExercises}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: "transparent",
    },
    exitButton: {
        justifyContent: "center",
        alignItems: "center",
    },
    exitIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    progressBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: "#e5e5e5",
        borderRadius: 4,
        marginHorizontal: 10,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#ff3b30", // Red progress bar
    },
    exerciseText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default ProgressBarWithDetails;
