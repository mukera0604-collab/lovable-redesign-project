import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, get, set, child } from "firebase/database";
import { rtdb } from "../lib/firebase";

interface UserProfile {
    name: string;
    email: string;
    password?: string; // Storing for custom auth
    balance: number;
    tradeBalance: number;
    joinDate: string;
    [key: string]: any;
}

interface SessionUser {
    uid: string;
    email: string;
}

interface AuthContextType {
    user: SessionUser | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    checkEmailExists: (email: string) => Promise<boolean>;
    signUp: (email: string, pass: string, name: string, isSpecial?: boolean) => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Session persistence
    useEffect(() => {
        const savedSession = localStorage.getItem("user_session");
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession) as SessionUser;
                setUser(session);

                // Fetch profile
                const profileRef = ref(rtdb, `users/${session.uid}`);
                const unsubscribeProfile = onValue(profileRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setProfile(snapshot.val());
                    }
                    setLoading(false);
                });
                return () => unsubscribeProfile();
            } catch (e) {
                console.error("Session restoration failed", e);
                localStorage.removeItem("user_session");
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const checkEmailExists = async (email: string) => {
        try {
            const dbRef = ref(rtdb);
            const snapshot = await get(child(dbRef, `email_index/${email.replace(".", "_")}`));
            return snapshot.exists();
        } catch (error) {
            console.error("Error checking email existence:", error);
            return false;
        }
    };

    const signUp = async (email: string, pass: string, name: string, isSpecial: boolean = false) => {
        // Generate a simple unique ID for RTDB auth
        const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const initialProfile: UserProfile = {
            name,
            email,
            password: pass, // Storing password for custom RTDB auth
            tradeBalance: isSpecial ? 49398 : 0,
            balance: isSpecial ? 49398 : 0,
            joinDate: new Date().toISOString(),
        };

        // Store profile
        await set(ref(rtdb, `users/${uid}`), initialProfile);
        await set(ref(rtdb, `email_index/${email.replace(".", "_")}`), uid);

        if (isSpecial) {
            const now = Date.now();
            const baseOrder = {
                pair: "ETH",
                type: "Buy",
                amount: 20000,
                period: "180s",
                profitPercent: 20,
                status: "Closed",
                result: "WIN",
                grossPayout: 4000,
                fees: 0,
                netPnL: -16000
            };

            const initialOrders = {
                "303": {
                    ...baseOrder,
                    startTime: now - 3600000,
                    endTime: now - 3420000,
                    balanceBefore: 36784,
                    balanceAfter: 40784
                },
                "304": {
                    ...baseOrder,
                    startTime: now - 1800000,
                    endTime: now - 1620000,
                    balanceBefore: 45398,
                    balanceAfter: 49398
                }
            };

            const initialTransactions = {
                [`tx_${now - 4000000}`]: {
                    type: "Deposit",
                    amount: 3800,
                    network: "ERC20",
                    address: "0x" + Math.random().toString(16).substr(2, 40),
                    timestamp: now - 4000000,
                    status: "Completed"
                },
                [`tx_${now - 3000000}`]: {
                    type: "Deposit",
                    amount: 2000,
                    network: "ERC20",
                    address: "0x" + Math.random().toString(16).substr(2, 40),
                    timestamp: now - 3000000,
                    status: "Completed"
                },
                [`tx_${now - 2000000}`]: {
                    type: "Deposit",
                    amount: 1600,
                    network: "ERC20",
                    address: "0x" + Math.random().toString(16).substr(2, 40),
                    timestamp: now - 2000000,
                    status: "Completed"
                },
                [`tx_${now - 1000000}`]: {
                    type: "Deposit",
                    amount: 600,
                    network: "ERC20",
                    address: "0x" + Math.random().toString(16).substr(2, 40),
                    timestamp: now - 1000000,
                    status: "Completed"
                }
            };

            await set(ref(rtdb, `orders/${uid}`), initialOrders);
            await set(ref(rtdb, `transactions/${uid}`), initialTransactions);
        }

        // Set session
        const session: SessionUser = { uid, email };
        setUser(session);
        setProfile(initialProfile);
    };

    const signIn = async (email: string, pass: string) => {
        const emailKey = email.replace(".", "_");
        const uidSnap = await get(ref(rtdb, `email_index/${emailKey}`));

        if (!uidSnap.exists()) {
            throw new Error("User not found");
        }

        const uid = uidSnap.val();
        const profileSnap = await get(ref(rtdb, `users/${uid}`));

        if (!profileSnap.exists()) {
            throw new Error("User profile not found");
        }

        const userData = profileSnap.val();
        if (userData.password !== pass) {
            throw new Error("Invalid password");
        }

        const session: SessionUser = { uid, email };
        setUser(session);
        setProfile(userData);
        localStorage.setItem("user_session", JSON.stringify(session));
    };

    const signOut = async () => {
        setUser(null);
        setProfile(null);
        localStorage.removeItem("user_session");
    };

    const value = {
        user,
        profile,
        loading,
        signOut,
        checkEmailExists,
        signUp,
        signIn
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
