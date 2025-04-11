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
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { StatusBar as SB } from "react-native";
import { StatusBar } from "expo-status-bar";

// Assume you have some test data to simulate API response
import { testProps } from "../../../testProps";
import {
	ChevronDown,
	ChevronLeft,
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
	// Get the dynamic id parameter from URL
	const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
	const [property, setProperty] = useState<Property | null>(null);
	const [showMoreDescription, setShowMoreDescription] = useState(false);

	useEffect(() => {
		// You could use a real API call here using the id
		// For now, filter your test data to get the property with the matching id
		// For this example, let's assume "id" is the houseName or some unique field.
		const found = testProps.find(
			(prop) => prop.houseName.toLowerCase() === propertyId.toLowerCase()
		);
		setProperty(found || null);
	}, [propertyId]);

	if (!property) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Loading property...</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 border">
			<View className="w-full h-2/6">
				<Image
					source={{ uri: property.mainImage }}
					// style={{ width: "100%", height: 200, borderRadius: 8 }}
					className="w-full h-full"
				/>
				<SafeAreaView
					className="absolute px-3 flex-row justify-between items-center w-full"
					style={{ marginTop: SB.currentHeight }}
				>
					<TouchableNativeFeedback>
						<Link
							href="/home"
							className="flex flex-row gap-2 bg-white rounded-full p-2"
						>
							<ChevronLeft color={"black"} size={30} />
						</Link>
					</TouchableNativeFeedback>

					<TouchableNativeFeedback>
						<Link
							href="/"
							className="flex flex-row gap-2 bg-white rounded-full p-2"
						>
							<Share color={"black"} size={30} />
						</Link>
					</TouchableNativeFeedback>
				</SafeAreaView>
			</View>

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
								<Star color={"gold"} size={10} />
								<Star color={"gold"} size={10} />
								<Star color={"gold"} size={10} />
								<Star color={"gold"} size={10} />
								<Star color={"gold"} size={10} />
							</View>
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

				<View className="border-b p-3 rounded-2xl my-3">
					<TouchableWithoutFeedback
						onPress={() => setShowMoreDescription(!showMoreDescription)}
					>
						<Text className={!showMoreDescription && `line-clamp-3`}>
							{property.houseDescription}
						</Text>
					</TouchableWithoutFeedback>
				</View>

				<Text style={{ marginTop: 8 }}>
					Rating: {property.rating} ({property.ratingNumber.toLocaleString()})
				</Text>
				<Text style={{ marginTop: 8 }}>
					Price: ₦{property.startingPricePerYear}k / year
				</Text>
			</ScrollView>
		</View>
	);
};

export default PropertyPage;
