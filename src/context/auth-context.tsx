import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/src/lib/supabase";

type AuthContextValue = {
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<Session | null>;
    signUp: (email: string, password: string) => Promise<{ session: Session | null }>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (mounted) {
                setSession(data.session);
                setLoading(false);
            }
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.subscription.unsubscribe();
        };
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            session,
            loading,
            signIn: async (email: string, password: string) => {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    throw error;
                }

                return data.session;
            },
            signUp: async (email: string, password: string) => {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    throw error;
                }

                return { session: data.session };
            },
            signOut: async () => {
                const { error } = await supabase.auth.signOut();

                if (error) {
                    throw error;
                }
            },
        }),
        [loading, session],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }

    return context;
}