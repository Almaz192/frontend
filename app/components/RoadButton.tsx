import React from "react";
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Image,
    StyleProp,
    ViewStyle,
} from "react-native";

interface RoadButtonProps {
    id: number;
    position: {
        x: number; // percentage across screen width
        y: number; // percentage down screen height
    };
    completed: boolean;
    unlocked: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}

const RoadButton: React.FC<RoadButtonProps> = ({
    id,
    position,
    completed,
    unlocked,
    onPress,
    style,
}) => {
    // Determine background color based on status
    const backgroundColor = completed
        ? "#8CC349"
        : unlocked
        ? "#BFBFBF"
        : "#919191";

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    backgroundColor,
                },
                !unlocked && styles.lockedButton,
                style,
            ]}
            onPress={onPress}
            activeOpacity={unlocked ? 0.7 : 1}
            disabled={!unlocked}
        >
            <Text style={styles.buttonText}>{id}</Text>

            {/* Lock icon for locked buttons */}
            {!unlocked && (
                <View style={styles.lockIconContainer}>
                    <Image
                        source={require("../../assets/icons/lock.png")}
                        style={styles.lockIcon}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    lockedButton: {
        opacity: 0.8,
    },
    lockIconContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 22,
    },
    lockIcon: {
        width: 16,
        height: 16,
        tintColor: "rgba(255,255,255,0.7)",
    },
});

export default RoadButton;
