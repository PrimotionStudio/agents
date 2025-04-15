import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	GestureResponderEvent,
} from "react-native";
import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

export default function Auth() {
	const [currentState, setCurrentState] = useState<"login" | "register">(
		"login"
	);
	const [selectedValue, setSelectedValue] = useState("buyer");

	const [loginData, setLoginData] = useState({
		phoneNumber: "",
		password: "",
	});

	const [registerData, setRegisterData] = useState({
		fullName: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
	});

	function handleLogin(event: GestureResponderEvent): void {
		throw new Error("Function not implemented.");
	}

	function handleRegister(event: GestureResponderEvent): void {
		throw new Error("Function not implemented.");
	}

	return (
		<View className="flex flex-col justify-center items-center h-full w-full">
			{/* Tab selector for Login/Registration */}
			{currentState === "login" ? (
				<View className="flex gap-y-2 w-4/5">
					<Text className="text-3xl text-center">Login</Text>

					{/* Inputs */}
					<View className="mt-3 flex gap-y-2 ">
						<TextInput
							placeholder="Phone Number"
							value={loginData.phoneNumber}
							onChange={(e) =>
								setLoginData({ ...loginData, phoneNumber: e.nativeEvent.text })
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Password"
							value={loginData.password}
							secureTextEntry={true}
							onChange={(e) =>
								setLoginData({ ...loginData, password: e.nativeEvent.text })
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
					</View>

					{/* Buttons */}
					<TouchableOpacity
						className="p-2 bg-blue-500 rounded-xl mt-3 w-1/2 mx-auto"
						onPress={handleLogin}
					>
						<Text className="text-2xl text-white text-center">Login</Text>
					</TouchableOpacity>

					<View className="mt-[5em] flex flex-row gap-y-2 justify-center">
						<Text className="text-muted">Dont have an account? </Text>
						<TouchableOpacity onPress={() => setCurrentState("register")}>
							<Text className="text-blue-500">Register</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<View className="flex gap-y-2 w-4/5">
					<Text className="text-3xl text-center">Register</Text>

					{/* Inputs */}
					<View className="mt-3 flex gap-y-2 ">
						<View>
							<Text>Choose an account type:</Text>
							<Picker
								className="p-2 text-xl border rounded-xl w-full"
								selectedValue={selectedValue}
								onValueChange={(itemValue, itemIndex) =>
									setSelectedValue(itemValue)
								}
							>
								<Picker.Item
									label="I want to buy/rent a property"
									value="buyer"
								/>
								<Picker.Item
									label="I have a property for listing"
									value="agent"
								/>
							</Picker>
						</View>

						<TextInput
							placeholder="Full Name"
							value={registerData.fullName}
							onChange={(e) =>
								setRegisterData({
									...registerData,
									fullName: e.nativeEvent.text,
								})
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Phone Number"
							value={registerData.phoneNumber}
							onChange={(e) =>
								setRegisterData({
									...registerData,
									phoneNumber: e.nativeEvent.text,
								})
							}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Password"
							value={registerData.password}
							onChange={(e) =>
								setRegisterData({
									...registerData,
									password: e.nativeEvent.text,
								})
							}
							secureTextEntry={true}
							className="p-2 text-xl border rounded-xl w-full"
						/>
						<TextInput
							placeholder="Confirm Password"
							value={registerData.confirmPassword}
							onChange={(e) =>
								setRegisterData({
									...registerData,
									confirmPassword: e.nativeEvent.text,
								})
							}
							secureTextEntry={true}
							className="p-2 text-xl border rounded-xl w-full"
						/>
					</View>

					{/* Buttons */}
					<TouchableOpacity
						className="p-2 bg-blue-500 rounded-xl mt-3 w-1/2 mx-auto"
						onPress={handleRegister}
					>
						<Text className="text-2xl text-white text-center">Register</Text>
					</TouchableOpacity>

					<View className="mt-[5em] flex flex-row gap-y-2 justify-center">
						<Text className="text-muted">Already have an account? </Text>
						<TouchableOpacity onPress={() => setCurrentState("login")}>
							<Text className="text-blue-500">Login</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
}
