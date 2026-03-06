import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { ref, onValue, get, set, child } from "firebase/database";
import { auth, rtdb } from "../lib/firebase";

interface UserProfile {
    name: string;
    email: string;
    balance: number;
    joinDate: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    checkEmailExists: (email: string) => Promise<boolean>;
    signUp: (email: string, pass: string, name: string) => Promise<void>;
    signIn: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const profileRef = ref(rtdb, `users/${firebaseUser.uid}`);
                const unsubscribeProfile = onValue(profileRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setProfile(snapshot.val());
                    }
                    setLoading(false);
                });
                return () => {
                    unsubscribeProfile();
                };
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const checkEmailExists = async (email: string) => {
        // Note: Firebase Auth doesn't provide a direct "checkEmailExists" for security.
        // However, we can check our RTDB if we map emails to UIDs, 
        // or just rely on the error from createUserWithEmailAndPassword.
        // Here we'll check the RTDB 'emails' index if we implement one, 
        // or just attempt and catch the specific error.
        // For simplicity and completeness as requested:
        try {
            const dbRef = ref(rtdb);
            const snapshot = await get(child(dbRef, `email_index/${email.replace(".", "_")}`));
            return snapshot.exists();
        } catch (error) {
            console.error("Error checking email existence:", error);
            return false;
        }
    };

    const signUp = async (email: string, pass: string, name: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const newUser = userCredential.user;

        const initialProfile: UserProfile = {
            name,
            email,
            balance: 1000, // Initial sign-up bonus or starting balance
            joinDate: new Date().toISOString(),
        };

        // Save profile to RTDB
        await set(ref(rtdb, `users/${newUser.uid}`), initialProfile);

        // Save email index for existence check
        await set(ref(rtdb, `email_index/${email.replace(".", "_")}`), newUser.uid);

        setProfile(initialProfile);
    };

    const signIn = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
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
