import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	StatusBar as SB,
	ScrollView,
	Alert,
	TextInput,
	GestureResponderEvent,
	KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ChevronLeft, Star } from "lucide-react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";

interface Property {
	category: string;
	houseDescription: string;
	houseName: string;
	location: string;
	mainImage: string;
	startingPricePerYear: number;
}

interface User {
	_id: string;
	fullName: string;
	phoneNumber: string;
	role: "buyer" | "agent";
}

export default function createProperty() {
	const [image, setImage] = useState(null);
	const [currentUser, setCurrentUser] = React.useState<User>();
	const [property, setProperty] = useState<Property>({
		category: "",
		houseDescription: "",
		houseName: "",
		location: "",
		mainImage: "",
		startingPricePerYear: 0,
	});
	const [uploading, setUploading] = useState(false);
	const router = useRouter();
	const [jwtToken, setJwtToken] = useState<string>("");

	useEffect(() => {
		(async () => {
			setJwtToken(await SecureStore.getItemAsync("jwtToken"));
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (!jwtToken) return;
			const res = await fetch("http://192.168.232.139:9999/api/user/me", {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			});
			const data = await res.json();
			if (!res.ok) {
				return;
			}
			setCurrentUser(data.user);
		})();
	}, [jwtToken]);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			// aspect: [4, 4],
			quality: 1,
		});
		if (!result.canceled) {
			setProperty({
				...property,
				mainImage: result.assets[0].uri,
			});
			uploadImage(result.assets[0].uri);
		}
	};

	const uploadImage = async (uri: string) => {
		setUploading(true);

		try {
			const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

			// Generate unique filename
			const filename = `image_${Date.now()}.jpg`;

			// Create FormData
			const formData = new FormData();
			formData.append("file", {
				uri,
				name: filename,
				type: "image/jpeg",
			} as any);

			// Critical unsigned upload requirement
			formData.append("upload_preset", process.env.UPLOAD_PRESET);

			const response = await fetch(cloudinaryUrl, {
				method: "POST",
				body: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			const cloudinaryData = await response.json();

			if (!response.ok) {
				throw new Error(cloudinaryData.error?.message || "Upload failed");
			}
			setProperty({
				...property,
				mainImage: cloudinaryData.secure_url,
			});

			// await saveToDatabase(cloudinaryData.secure_url);

			// Alert.alert("Success", "Image uploaded successfully");
		} catch (error) {
			Alert.alert("Error", error.message);
			console.error("Upload error:", error);
		} finally {
			setUploading(false);
		}
	};

	async function saveProperty(event: GestureResponderEvent) {
		event.preventDefault();
		if (!jwtToken || !currentUser) {
			return;
		}
		try {
			const res = await fetch(
				`http://192.168.232.139:9999/api/property/create`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: jwtToken && `Bearer ${jwtToken}`,
					},
					body: JSON.stringify({ ...property, agent: currentUser._id }),
				}
			);
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || "Failed to save property");
			}
			Alert.alert("Success", data.message);
			router.back();
			router.push(`/property/${data.property._id}`);
		} catch (error) {
			Alert.alert("Error", (error as Error).message);
		}
	}

	return (
		<View className="flex">
			{/* Top Main Image and Carousel of Houses */}
			<KeyboardAvoidingView>
				<View className="w-full h-1/2 border bg-red-500">
					<TouchableOpacity onLongPress={pickImage}>
						<Image
							source={
								property.mainImage
									? { uri: property.mainImage }
									: { uri: "https://picsum.photos/500/500" }
							}
							alt="Property Image"
							style={{ width: "100%", height: "100%" }}
							className="w-full h-full"
						/>
					</TouchableOpacity>
					<Text className="text-xs mt-1 text-center">
						Press and Hold to Change Image
					</Text>

					<SafeAreaView
						className="absolute px-3 flex-row justify-between items-center w-full"
						style={{ marginTop: SB.currentHeight }}
					>
						<TouchableOpacity
							onPress={() => router.back()}
							className="flex flex-row gap-2 bg-white rounded-full p-2"
						>
							<ChevronLeft color={"black"} size={30} />
						</TouchableOpacity>
					</SafeAreaView>
				</View>
				<ScrollView className="p-5">
					<Text className="text-2xl font-bold">
						List a Property up for sales or rent
					</Text>
					<View className="flex gap-y-4 items-center mt-4">
						<TextInput
							placeholder="Property Name"
							value={property.houseName}
							onChange={(e) =>
								setProperty({ ...property, houseName: e.nativeEvent.text })
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Property Description"
							value={property.houseDescription}
							onChange={(e) =>
								setProperty({
									...property,
									houseDescription: e.nativeEvent.text,
								})
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Location"
							value={property.location}
							onChange={(e) =>
								setProperty({ ...property, location: e.nativeEvent.text })
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<Text className="text-muted-foreground text-start">
							Starting Price Per year approx: ₦
							{(property.startingPricePerYear * 1000).toLocaleString()}
						</Text>
						<TextInput
							keyboardType="numeric"
							placeholder="Starting Price Per Year"
							value={property.startingPricePerYear.toString()}
							onChange={(e) =>
								setProperty({
									...property,
									startingPricePerYear: parseInt(e.nativeEvent.text),
								})
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Category"
							value={property.category}
							onChange={(e) =>
								setProperty({ ...property, category: e.nativeEvent.text })
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
					</View>

					<View className="bg-white hover:bg-gray-200 p-3 mt-[2em] mx-[1em] rounded-2xl flex flex-row items-center justify-center border">
						<TouchableOpacity onPress={saveProperty}>
							<Text className="text-2xl">Save</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
