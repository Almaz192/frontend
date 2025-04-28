// screens/LoginScreen.tsx
import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

type RootStackParamList = {
    SignUpScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface LoginScreenProps {
    setIsLoggedIn: (value: boolean) => void;
}

export default function LoginScreen({ setIsLoggedIn }: LoginScreenProps) {
    const navigation = useNavigation<NavigationProp>();
    const isFocused = useIsFocused();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Cleanup effect
    useEffect(() => {
        return () => {
            setEmail("");
            setPassword("");
            setErrorMessage(null);
            setEmailFocused(false);
            setPasswordFocused(false);
        };
    }, []);

    // Reset focus states when screen loses focus
    useEffect(() => {
        if (!isFocused) {
            setEmailFocused(false);
            setPasswordFocused(false);
        }
    }, [isFocused]);

    const handleLoginEmail = async () => {
        try {
            setIsLoggedIn(true);
        } catch (error) {
            setErrorMessage("Login failed. Please try again.");
        }
    };

    const handleSocialLogin = async (provider: string) => {
        try {
            Alert.alert("Социальная авторизация", `Войти через ${provider}`);
            // При успешном входе вызвать: setIsLoggedIn(true)
        } catch (error) {
            setErrorMessage(`${provider} login failed. Please try again.`);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert("Notice", "This function will be added later!");
    };

    // Memoize the image sources
    const images = {
        logo: require("../../assets/images/logo.png"),
        facebook: require("../../assets/images/facebook.png"),
        apple: require("../../assets/images/apple.png"),
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Logo */}
                <Image
                    source={images.logo}
                    style={styles.logo}
                    defaultSource={images.logo}
                />

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            emailFocused && styles.inputFocused,
                        ]}
                        placeholder="Email или имя пользователя"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[
                            styles.input,
                            passwordFocused && styles.inputFocused,
                        ]}
                        placeholder="Пароль"
                        secureTextEntry
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        autoCapitalize="none"
                    />
                </View>

                {errorMessage && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLoginEmail}
                >
                    <Text style={styles.loginText}>Войти</Text>
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>Забыли пароль?</Text>
                </TouchableOpacity>

                {/* Social Login Buttons */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={[styles.socialButton, styles.googleButton]}
                        onPress={() => handleSocialLogin("Google")}
                    >
                        <AntDesign name="google" size={24} color="#DB4437" />
                        <Text
                            style={[styles.socialButtonText, styles.googleText]}
                        >
                            Войти через Google
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, styles.facebookButton]}
                        onPress={() => handleSocialLogin("Facebook")}
                    >
                        <Image
                            source={images.facebook}
                            style={styles.icon}
                            defaultSource={images.facebook}
                        />
                        <Text style={styles.socialButtonText}>
                            Войти через Facebook
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, styles.appleButton]}
                        onPress={() => handleSocialLogin("Apple")}
                    >
                        <Image
                            source={images.apple}
                            style={styles.icon}
                            defaultSource={images.apple}
                        />
                        <Text style={styles.socialButtonText}>
                            Войти через Apple
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Link to SignUpScreen */}
                <Text style={styles.footer}>
                    Не зарегистрированы?{" "}
                    <Text
                        style={styles.link}
                        onPress={() => navigation.navigate("SignUpScreen")}
                    >
                        Зарегистрироваться
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        paddingHorizontal: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        marginBottom: 40,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#F3F3F3",
        borderRadius: 8,
        paddingHorizontal: 15,
        color: "#000",
        marginBottom: 15,
        fontSize: 16,
    },
    inputFocused: {
        borderWidth: 1,
        borderColor: "#6C873A",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: "#6C873A",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8,
        width: "100%",
        marginBottom: 15,
    },
    loginText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    forgotPassword: {
        color: "#6C873A",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        textDecorationLine: "underline",
    },
    socialContainer: {
        marginTop: "auto",
        marginBottom: 20,
        width: "100%",
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    googleButton: {
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    facebookButton: {
        backgroundColor: "#4267B2",
    },
    appleButton: {
        backgroundColor: "#000000",
    },
    socialButtonText: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    googleText: {
        color: "#000000",
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
    footer: {
        color: "#000",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    link: {
        color: "#6C873A",
        textDecorationLine: "underline",
    },
});
