import React, { useRef, useState, useEffect } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

interface DraggableImageProps {
    imageSource: string;
    onRelease: (gesture: { moveX: number; moveY: number }) => void;
    disabled?: boolean;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
    imageSource,
    onRelease,
    disabled = false,
}) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [isDragging, setIsDragging] = useState(false);

    // Basic panResponder implementation - simplified for reliability
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: () => {
            pan.setValue({ x: 0, y: 0 });
            pan.extractOffset();
            setIsDragging(true);
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gesture) => {
            if (!disabled) {
                onRelease(gesture);
            }
            setIsDragging(false);

            // Return to initial position
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
                friction: 5,
            }).start();
        },
        onPanResponderTerminate: () => {
            setIsDragging(false);

            // Return to initial position
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
                friction: 5,
            }).start();
        },
    });

    // Reset position when disabled changes
    useEffect(() => {
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 5,
        }).start();

        setIsDragging(false);
    }, [disabled, imageSource]);

    return (
        <Animated.View
            style={[
                styles.draggable,
                {
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                },
                disabled ? styles.disabled : styles.enabled,
                isDragging ? styles.dragging : null,
            ]}
            {...panResponder.panHandlers}
        >
            <Animated.Image
                source={{ uri: imageSource }}
                style={styles.image}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    draggable: {
        width: 140,
        height: 140,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    disabled: {
        opacity: 0.7,
    },
    enabled: {
        opacity: 1,
    },
    dragging: {
        zIndex: 999,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});

export default DraggableImage;
