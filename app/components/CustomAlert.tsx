import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from "react-native";
import { PRIMARY, NEUTRAL, TRANSPARENT } from "../../constants";

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    primaryButtonText: string;
    secondaryButtonText?: string;
    onPrimaryPress: () => void;
    onSecondaryPress?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
}) => {
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={onPrimaryPress}
                        >
                            <Text style={styles.primaryButtonText}>
                                {primaryButtonText}
                            </Text>
                        </TouchableOpacity>

                        {secondaryButtonText && onSecondaryPress && (
                            <TouchableOpacity
                                style={[styles.button, styles.secondaryButton]}
                                onPress={onSecondaryPress}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    {secondaryButtonText}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: TRANSPARENT.BLACK_50,
        justifyContent: "center",
        alignItems: "center",
    },
    alertContainer: {
        width: Dimensions.get("window").width * 0.85,
        backgroundColor: PRIMARY.GREEN,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: NEUTRAL.WHITE,
        marginBottom: 10,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: NEUTRAL.WHITE,
        textAlign: "center",
        marginBottom: 20,
    },
    buttonContainer: {
        width: "100%",
        gap: 10,
    },
    button: {
        width: "100%",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    primaryButton: {
        backgroundColor: PRIMARY.RED,
    },
    secondaryButton: {
        backgroundColor: PRIMARY.BROWN,
    },
    primaryButtonText: {
        color: NEUTRAL.WHITE,
        fontSize: 16,
        fontWeight: "bold",
    },
    secondaryButtonText: {
        color: NEUTRAL.WHITE,
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CustomAlert;
