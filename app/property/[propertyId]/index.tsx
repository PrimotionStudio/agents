// /app/property/[id]/page.tsx
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	TouchableNativeFeedback,
	SafeAreaView,
	ScrollView,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar as SB } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
// Assume you have some test data to simulate API response
import { testProps } from "../../../testProps";
import {
	ChevronDown,
	ChevronLeft,
	Router,
	Share,
	Star,
	User,
} from "lucide-react-native";

interface Property {
	agent: {
		fullName: string;
		phoneNumber: string;
	};
	category: string;
	houseDescription: string;
	houseName: string;
	location: string;
	mainImage: string;
	otherMedia: string[];
	rating: number;
	ratingNumber: number;
	startingPricePerYear: number;
}

const PropertyPage = () => {
	const router = useRouter();
	const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
	const [property, setProperty] = useState<Property | null>(null);
	const [showMoreDescription, setShowMoreDescription] = useState(false);
	const [location, setLocation] = useState(null);

	useEffect(() => {
		const found = testProps.find(
			(prop) => prop.houseName.toLowerCase() === propertyId.toLowerCase()
		);
		setProperty(found || null);
	}, [propertyId]);

	useEffect(() => {
		(async () => {
			if (!property) return;
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.error("Location permission not granted");
				return;
			}
			let locationCoordinates = await Location.geocodeAsync(property.location);
			if (locationCoordinates && locationCoordinates.length > 0) {
				const { latitude, longitude } = locationCoordinates[0];
				setLocation({
					latitude,
					longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				});
			} else {
				console.error("No results found for this address.");
			}
		})();
	}, [property]);

	if (!property) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Loading property...</Text>
			</View>
		);
	}

	return (
		<View className="flex-1">
			{/* Top Main Image and Carousel of Houses */}
			<View className="w-full h-2/6">
				<Image source={{ uri: property.mainImage }} className="w-full h-full" />
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

					<TouchableOpacity className="flex flex-row gap-2 bg-white rounded-full p-2">
						<Share color={"black"} size={30} />
					</TouchableOpacity>
				</SafeAreaView>
			</View>

			{/* Property Details */}
			<ScrollView className="p-5">
				<Text className="font-bold text-4xl">{property.houseName}</Text>
				<Text className="my-3 text-muted text-gray-600">
					{property.location}
				</Text>

				<View className="border border-grey-800 p-3 rounded-2xl my-3">
					<View className="flex flex-row justify-between items-center">
						<View className="flex flex-col items-center gap-1">
							<Text className="font-bold text-2xl">{property.rating}</Text>
							<View className="flex flex-row">
								<Star color={"black"} size={10} />
								<Star color={"black"} size={10} />
								<Star color={"black"} size={10} />
								<Star color={"black"} size={10} />
								<Star color={"black"} size={10} />
							</View>
						</View>

						<View className="h-4 w-px bg-gray-800 mx-2" />

						<View className="flex">
							<Text className="font-bold text-2xl">
								₦{property.startingPricePerYear}
							</Text>
							<Text className="text-sm">/ per year</Text>
						</View>
						<View className="h-4 w-px bg-gray-800 mx-2" />

						<View className="flex flex-col">
							<Text className="font-bold text-2xl">
								{property.ratingNumber.toLocaleString()}
							</Text>
							<Text>reviews</Text>
						</View>
					</View>
				</View>

				<TouchableWithoutFeedback
					onPress={() => setShowMoreDescription(!showMoreDescription)}
				>
					<View className="border-b p-3 rounded-2xl my-3">
						<Text className={!showMoreDescription && `line-clamp-3`}>
							{property.houseDescription}
						</Text>
					</View>
				</TouchableWithoutFeedback>

				<TouchableOpacity
					onPress={() => {
						router.push("/agent");
					}}
				>
					<View className="border border-grey-800 p-3 rounded-2xl my-3 flex flex-row items-center gap-x-5">
						<Image
							source={{ uri: "https://picsum.photos/50/50" }}
							className="h-[50] w-[50] rounded-full object-cover"
						/>
						<View className="">
							<Text className="text-sm">Agent Details</Text>
							<Text className="text-3xl">{property.agent.fullName}</Text>
							<Text className="text-lg">
								<Link href={`tel:${property.agent.phoneNumber}`}>
									{property.agent.phoneNumber}
								</Link>
							</Text>
						</View>
					</View>
				</TouchableOpacity>

				{location && (
					<TouchableWithoutFeedback>
						<MapView style={{ height: 300, width: "100%" }} region={location}>
							<Marker
								coordinate={{
									latitude: location.latitude,
									longitude: location.longitude,
								}}
								title={property.location}
								description="A location with house listings"
							/>
						</MapView>
					</TouchableWithoutFeedback>
				)}
				<Text style={{ marginTop: 8 }}>Location: {property.location}</Text>
			</ScrollView>
		</View>
	);
};

export default PropertyPage;
