import { Redirect } from "expo-router";

import { useAuth } from "@/src/context/auth-context";

export default function Index() {
    const { loading, session } = useAuth();

    if (loading) {
        return null;
    }

    return <Redirect href={session ? "/(tabs)" : "/(auth)/login"} />;
}