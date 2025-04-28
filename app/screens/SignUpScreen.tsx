import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

interface SignUpScreenProps {
    // We pass setIsLoggedIn from AuthNavigator
    setIsLoggedIn: (value: boolean) => void;
}

export default function SignUpScreen({ setIsLoggedIn }: SignUpScreenProps) {
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // For focus styling
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    const handleRegister = async () => {
        // Email validation to check for @ and domain
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage(
                "Пожалуйста, введите корректный адрес электронной почты"
            );
            return;
        }

        // 1) Check length
        if (password.length < 6) {
            setErrorMessage("Пароль должен быть минимум 6 символов.");
            return;
        }
        // 2) Check uppercase
        if (!/[A-Z]/.test(password)) {
            setErrorMessage(
                "Пароль должен содержать хотя бы 1 заглавную букву."
            );
            return;
        }
        // 3) Check confirm
        if (password !== confirmPassword) {
            setErrorMessage("Пароли не совпадают.");
            return;
        }

        // If all checks pass, proceed
        try {
            const response = await axios.post(
                "https://enetyl-back.duckdns.org/register/email",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            // On success, set isLoggedIn(true) to switch to the main app
            setIsLoggedIn(true);
        } catch (error: any) {
            // Если сервер возвращает объект, попробуем взять поле msg (или detail)
            const serverData = error.response?.data;
            let errorMsg = "Что-то пошло не так";
            if (serverData && typeof serverData === "object") {
                // Попробуем взять поле msg, если оно есть
                if (serverData.msg && typeof serverData.msg === "string") {
                    errorMsg = serverData.msg;
                } else if (
                    serverData.detail &&
                    typeof serverData.detail === "string"
                ) {
                    errorMsg = serverData.detail;
                } else {
                    // Если не нашли нужное поле, превращаем весь объект в строку
                    errorMsg = JSON.stringify(serverData);
                }
            }
            setErrorMessage(errorMsg);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Logo */}
                <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.logo}
                />

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.input,
                            emailFocused && styles.inputFocused,
                        ]}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                    />

                    <TextInput
                        style={[
                            styles.input,
                            passwordFocused && styles.inputFocused,
                        ]}
                        placeholder="Пароль"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                    />

                    <TextInput
                        style={[
                            styles.input,
                            confirmPasswordFocused && styles.inputFocused,
                        ]}
                        placeholder="Подтвердите пароль"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setConfirmPasswordFocused(true)}
                        onBlur={() => setConfirmPasswordFocused(false)}
                    />
                </View>

                {/* Error Message */}
                {errorMessage && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.signUpText}>Зарегистрироваться</Text>
                </TouchableOpacity>

                {/* Already Registered? */}
                <Text style={styles.footer}>
                    Уже зарегистрированы?{" "}
                    <Text
                        style={styles.link}
                        onPress={() => navigation.navigate("LoginScreen")}
                    >
                        Войти
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF", // White background
    },
    container: {
        flex: 1,
        paddingHorizontal: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 150, // Bigger logo
        height: 150,
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
        borderColor: "#6C873A", // Focus color
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        fontSize: 14,
    },
    signUpButton: {
        backgroundColor: "#6C873A", // Button color
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8,
        width: "100%",
        marginBottom: 15,
    },
    signUpText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    footer: {
        fontSize: 16,
        color: "#000",
        marginTop: 10,
    },
    link: {
        fontSize: 16,
        color: "#6C873A", // Link color
        textDecorationLine: "underline",
    },
});
