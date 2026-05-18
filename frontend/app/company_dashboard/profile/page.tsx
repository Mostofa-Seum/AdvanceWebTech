'use client'

import { useEffect, useState } from "react";
import api from "../../services/api";
import { getUser, Profile, SecureUserSession } from "@/app/utils/auth";

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uiStatus, setUiStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);
    function loadFallbackProfile(user: SecureUserSession) {
        const fallback: Profile = {
            companyName: user.companyName,
            description: user.description || "",
            website: user.website || ""
        };
        setProfile(fallback);
        setDescription(fallback.description);
        setWebsite(fallback.website);
    }

    async function loadProfile() {
        try {
            const user = getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const activeCompanyName = user.companyName;

            const res = await api.get(
                `/company/profile?companyName=${encodeURIComponent(activeCompanyName)}`
            );

            if (res.data) {
                setProfile(res.data);
                setDescription(res.data.description || "");
                setWebsite(res.data.website || "");
            } else {
                loadFallbackProfile(user);
            }
        }
        catch (err) {
            console.error("Profile load failed:", err);
            const user = getUser();
            if (user) {
                loadFallbackProfile(user);
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile() {
        if (!profile) return;
        setUiStatus(null);
        setSaving(true);

        try {
            await api.put("/company/profile/edit", {
                companyName: profile.companyName,
                description,
                website
            });

            const savedUser = getUser();
            if (savedUser) {
                localStorage.setItem("user", JSON.stringify({
                    ...savedUser,
                    companyName: profile.companyName,
                    description,
                    website
                }));
            }

            setUiStatus({ type: 'success', text: 'Profile updated' });
        }
        catch (err) {
            console.error("Profile update failed:", err);
            setUiStatus({ type: 'error', text: 'Failed to save changes' });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-6 text-gray-500 font-medium dark:text-gray-400">Loading profile...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-5 text-gray-900 dark:text-black">Profile Settings</h1>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                {uiStatus && (
                    <div className={`p-3 rounded text-sm font-medium ${uiStatus.type === 'success'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}>
                        {uiStatus.text}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Website URL</label>
                    <input
                        type="url"
                        disabled={saving}
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full border p-2 rounded dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:border-indigo-500 disabled:opacity-50"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Company Description</label>
                    <textarea
                        rows={4}
                        disabled={saving}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your corporate mission..."
                        className="w-full border p-2 rounded dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:border-indigo-500 resize-none disabled:opacity-50"
                    />
                </div>

                <button
                    onClick={updateProfile}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}