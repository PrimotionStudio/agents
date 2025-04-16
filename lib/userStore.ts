import { create } from "zustand";

interface User {
	_id: string;
	fullName: string;
	phoneNumber: string;
	role: "buyer" | "agent";
}

interface UserState {
	user: User | null;
	setUser: (user: User) => void;
	clearUser: () => void;
	loadUserFromCookie: () => Promise<void>;
	logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
	loadUserFromCookie: async () => {
		try {
			const res = await fetch("/api/me");
			if (res.ok) {
				const data = await res.json();
				set({ user: data.user });
			} else {
				set({ user: null });
			}
		} catch (error) {
			console.error("Failed to load user:", error);
			set({ user: null });
		}
	},
	logout: async () => set({ user: null }),
}));
