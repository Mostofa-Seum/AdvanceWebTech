export interface SecureUserSession {
    userId: string;
    email: string;
    role: string;
    companyName: string;
    description?: string;
    website?: string;
}

export interface Profile {
    companyName: string;
    description: string;
    website: string;
}

export function getUser(): SecureUserSession | null {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem("user");
    if (!data) return null;

    try {
        return JSON.parse(data) as SecureUserSession;
    } catch (err) {
        console.error("Failed to parse user session from localStorage:", err);
        return null;
    }
}