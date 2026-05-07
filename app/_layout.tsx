import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/src/context/auth-context";

const qc = new QueryClient();

export default function Layout() {
    return (
        <QueryClientProvider client={qc}>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </QueryClientProvider>
    )
};

function RootNavigator() {
    const { loading, session } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return;
        }

        const inAuthGroup = segments[0] === "(auth)";

        if (!session && !inAuthGroup) {
            router.replace("/(auth)/login");
            return;
        }

        if (session && inAuthGroup) {
            router.replace("/(tabs)");
        }
    }, [loading, router, segments, session]);

    if (loading) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal", headerShown: true }} />
        </Stack>
    );
}