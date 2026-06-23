"use client";

import { useAuth } from "@/context/AuthContext";
import { favoriteService, lessonService, userService } from "@/services";
import {
	Activity,
	BookOpen,
	Camera,
	Crown,
	Edit2,
	Heart,
	Laptop,
	Loader2,
	Mail,
	Save,
	Shield,
	Smartphone,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
	const { user, refreshUser } = useAuth();
	const [myLessons, setMyLessons] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);

	// Edit Mode state
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState("");
	const [photoURL, setPhotoURL] = useState("");
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);

	// Sessions state
	const [sessions, setSessions] = useState([]);
	const [sessionsLoading, setSessionsLoading] = useState(true);

	const fetchSessions = async () => {
		try {
			const res = await userService.getSessions();
			setSessions(res.sessions || []);
		} catch (e) {
			console.error("Failed to fetch sessions:", e);
		} finally {
			setSessionsLoading(false);
		}
	};

	const handleRevokeSession = async (sessionId) => {
		const toastId = toast.loading("Revoking session...");
		try {
			await userService.revokeSession(sessionId);
			toast.success("Session revoked successfully!", { id: toastId });
			fetchSessions();
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.error || "Failed to revoke session", {
				id: toastId,
			});
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [lessonsData, favsData] = await Promise.all([
					lessonService.getMyLessons(),
					favoriteService.getMyFavorites(),
				]);
				setMyLessons(lessonsData.lessons || []);
				setFavorites(favsData.favorites || []);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
		fetchSessions();
	}, []);

	// Initialize edit fields when edit mode is opened or user changes
	useEffect(() => {
		if (user) {
			setName(user.name || "");
			setPhotoURL(user.photoURL || "");
		}
	}, [user, isEditing]);

	const handleAvatarChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file");
			return;
		}

		// Validate size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size should be less than 5MB");
			return;
		}

		setUploading(true);
		const toastId = toast.loading("Uploading image...");
		try {
			const res = await userService.uploadAvatar(file);
			setPhotoURL(res.url);
			toast.success("Avatar uploaded successfully!", { id: toastId });
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.error || "Failed to upload image", {
				id: toastId,
			});
		} finally {
			setUploading(false);
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}

		setSaving(true);
		const toastId = toast.loading("Saving profile changes...");
		try {
			await userService.updateProfile(name, photoURL);
			await refreshUser();
			setIsEditing(false);
			toast.success("Profile updated successfully!", { id: toastId });
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.error || "Failed to update profile", {
				id: toastId,
			});
		} finally {
			setSaving(false);
		}
	};

	const publicLessons = myLessons.filter((l) => l.visibility === "public");

	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Profile Settings
				</h1>
				{!isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-sm">
						<Edit2 size={16} /> Edit Profile
					</button>
				)}
			</div>

			<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
				{/* Header banner */}
				<div className="bg-gradient-to-r from-violet-600 to-purple-700 p-8 relative">
					<div className="flex flex-col sm:flex-row items-center gap-6">
						<div className="relative group">
							{photoURL ?
								<img
									src={photoURL}
									alt={user?.name}
									className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
								/>
							:	<div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold text-white uppercase">
									{name?.[0] || user?.name?.[0]}
								</div>
							}
							{isEditing && (
								<label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
									<input
										type="file"
										accept="image/*"
										onChange={handleAvatarChange}
										className="hidden"
										disabled={uploading}
									/>
									{uploading ?
										<Loader2 className="w-6 h-6 text-white animate-spin" />
									:	<Camera className="w-6 h-6 text-white" />}
								</label>
							)}
						</div>

						<div className="text-center sm:text-left">
							<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
								<h2 className="text-2xl font-bold text-white">{user?.name}</h2>
								{user?.isPremium && (
									<span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-200 text-xs rounded-full">
										<Crown size={12} /> Premium
									</span>
								)}
								{user?.role === "admin" && (
									<span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-200 text-xs rounded-full">
										<Shield size={12} /> Admin
									</span>
								)}
							</div>
							<p className="text-white/70 mt-1">{user?.email}</p>
						</div>
					</div>
				</div>

				{/* Edit Form or Stats/Info */}
				{isEditing ?
					<form
						onSubmit={handleSave}
						className="p-6 space-y-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
									Full Name
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 outline-none transition-all"
									placeholder="Enter your name"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
									Avatar Photo URL
								</label>
								<div className="flex gap-2">
									<input
										type="url"
										value={photoURL}
										onChange={(e) => setPhotoURL(e.target.value)}
										className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 outline-none transition-all text-sm"
										placeholder="Enter image URL or upload above"
									/>
									<label className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-xl cursor-pointer transition-colors">
										<input
											type="file"
											accept="image/*"
											onChange={handleAvatarChange}
											className="hidden"
											disabled={uploading}
										/>
										Upload File
									</label>
								</div>
								<p className="text-xs text-gray-400 mt-1">
									You can upload a file directly or paste an external image
									link.
								</p>
							</div>
						</div>

						<div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all"
								disabled={saving || uploading}>
								<X size={16} /> Cancel
							</button>
							<button
								type="submit"
								className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-sm disabled:opacity-55"
								disabled={saving || uploading || !name.trim()}>
								{saving ?
									<>
										<Loader2
											size={16}
											className="animate-spin"
										/>{" "}
										Saving...
									</>
								:	<>
										<Save size={16} /> Save Changes
									</>
								}
							</button>
						</div>
					</form>
				:	<>
						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 p-6 bg-gray-50/50 dark:bg-gray-800/50">
							<div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700 shadow-sm">
								<BookOpen
									size={24}
									className="text-violet-500 dark:text-violet-500 mx-auto mb-2"
								/>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{myLessons.length}
								</p>
								<p className="text-sm text-gray-500">Total Lessons</p>
							</div>
							<div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700 shadow-sm">
								<Heart
									size={24}
									className="text-rose-600 dark:text-rose-600 mx-auto mb-2"
								/>
								<p className="text-2xl font-bold text-gray-900 dark:text-rose-600">
									{favorites.length}
								</p>
								<p className="text-sm text-gray-500">Total Favorites</p>
							</div>
							<div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700 shadow-sm">
								<Mail
									size={24}
									className="text-blue-500 dark:text-blue-500 mx-auto mb-2"
								/>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{publicLessons.length}
								</p>
								<p className="text-sm text-gray-500">Public Lessons</p>
							</div>
						</div>

						{/* Info */}
						<div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
							<div className="flex items-center gap-3">
								<Mail
									size={18}
									className="text-gray-400"
								/>
								<div>
									<p className="text-sm text-gray-500">Email</p>
									<p className="text-gray-900 dark:text-white font-medium">
										{user?.email}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Shield
									size={18}
									className="text-gray-400"
								/>
								<div>
									<p className="text-sm text-gray-500">Role</p>
									<p className="text-gray-900 dark:text-white capitalize font-medium">
										{user?.role}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Crown
									size={18}
									className="text-gray-400"
								/>
								<div>
									<p className="text-sm text-gray-500">Premium Status</p>
									<p className="text-gray-900 dark:text-white font-medium">
										{user?.isPremium ? "Active" : "Not Premium"}
									</p>
								</div>
							</div>
						</div>
					</>
				}
			</div>

			{/* Security & Active Sessions Section */}
			<div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6">
				<div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-150 dark:border-gray-750">
					<Activity
						className="text-violet-500"
						size={20}
					/>
					<div>
						<h3 className="text-lg font-bold text-gray-900 dark:text-white">
							Active Sessions &amp; Devices
						</h3>
						<p className="text-xs text-gray-450 dark:text-gray-400 mt-0.5">
							Manage your active account sessions and revoke access for other
							devices.
						</p>
					</div>
				</div>

				{sessionsLoading ?
					<div className="py-8 flex justify-center">
						<Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
					</div>
				: sessions.length > 0 ?
					<div className="divide-y divide-gray-100 dark:divide-gray-700/60">
						{sessions.map((s) => {
							const isMobile =
								s.userAgent?.toLowerCase().includes("mobi") ||
								s.userAgent?.toLowerCase().includes("android") ||
								s.userAgent?.toLowerCase().includes("iphone");
							return (
								<div
									key={s.id}
									className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-500 dark:text-gray-400">
											{isMobile ?
												<Smartphone size={20} />
											:	<Laptop size={20} />}
										</div>
										<div>
											<div className="flex items-center gap-2">
												<p className="text-sm font-semibold text-gray-900 dark:text-white">
													{s.deviceInfo}
												</p>
												{s.isCurrent && (
													<span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-full flex items-center gap-1">
														<span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{" "}
														This Device
													</span>
												)}
											</div>
											<p className="text-xs text-gray-450 mt-1">
												IP Address:{" "}
												<span className="font-mono text-gray-500 dark:text-gray-400">
													{s.ipAddress}
												</span>
											</p>
										</div>
									</div>

									{!s.isCurrent && (
										<button
											onClick={() => handleRevokeSession(s.id)}
											className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
											title="Log out device">
											<Trash2 size={16} />
										</button>
									)}
								</div>
							);
						})}
					</div>
				:	<p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
						No active sessions found.
					</p>
				}
			</div>
		</div>
	);
}
