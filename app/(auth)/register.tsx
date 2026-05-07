import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/src/context/auth-context";

export default function RegisterScreen() {
    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];
    const router = useRouter();
    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const result = await signUp(email.trim(), password);

            if (result.session) {
                router.replace("/(tabs)");
                return;
            }

            setSuccess("Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
        } catch (currentError) {
            setError(currentError instanceof Error ? currentError.message : "No se pudo crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={[styles.orb, styles.orbTop, { backgroundColor: colors.tint }]} />
                    <View style={[styles.orb, styles.orbBottom, { backgroundColor: colors.icon }]} />

                    <View style={[styles.card, { backgroundColor: colorScheme === "dark" ? "#0F1720" : "#FFFFFF" }]}>
                        <Text style={[styles.kicker, { color: colors.tint }]}>Crear cuenta</Text>
                        <Text style={[styles.title, { color: colors.text }]}>Registro</Text>
                        <Text style={[styles.subtitle, { color: colors.icon }]}>Crea una cuenta nueva para acceder con Supabase Auth.</Text>

                        <View style={styles.form}>
                            <Text style={[styles.label, { color: colors.text }]}>Correo electrónico</Text>
                            <TextInput
                                autoCapitalize="none"
                                autoComplete="email"
                                keyboardType="email-address"
                                placeholder="correo@ejemplo.com"
                                placeholderTextColor={colors.icon}
                                style={[styles.input, { borderColor: colorScheme === "dark" ? "#24303A" : "#D7DEE3", color: colors.text }]}
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
                            <TextInput
                                autoComplete="password-new"
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor={colors.icon}
                                secureTextEntry
                                style={[styles.input, { borderColor: colorScheme === "dark" ? "#24303A" : "#D7DEE3", color: colors.text }]}
                                value={password}
                                onChangeText={setPassword}
                            />

                            {error ? <Text style={styles.error}>{error}</Text> : null}
                            {success ? <Text style={styles.success}>{success}</Text> : null}

                            <Pressable
                                style={({ pressed }) => [styles.button, { backgroundColor: colors.tint, opacity: pressed || loading ? 0.85 : 1 }]}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
                            </Pressable>
                        </View>

                        <Text style={[styles.footerText, { color: colors.icon }]}>
                            ¿Ya tienes cuenta? <Link href="/(auth)/login" style={{ color: colors.tint }}>Inicia sesión</Link>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    card: {
        borderRadius: 28,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.16,
        shadowRadius: 24,
        elevation: 6,
    },
    kicker: {
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 1.4,
        textTransform: "uppercase",
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    form: {
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    button: {
        marginTop: 8,
        minHeight: 52,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    footerText: {
        marginTop: 18,
        textAlign: "center",
        fontSize: 14,
    },
    error: {
        color: "#D92D20",
        fontSize: 14,
        fontWeight: "600",
    },
    success: {
        color: "#027A48",
        fontSize: 14,
        fontWeight: "600",
    },
    orb: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.14,
    },
    orbTop: {
        width: 180,
        height: 180,
        top: -30,
        right: -40,
    },
    orbBottom: {
        width: 220,
        height: 220,
        bottom: -40,
        left: -60,
    },
});