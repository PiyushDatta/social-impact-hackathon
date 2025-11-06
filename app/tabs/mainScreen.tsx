import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { styles } from "../../styles/mainScreenStyles";

export default function MainScreen() {
    const handleApiCall = async () => {
        try {
            console.log("Making API call to ElevenLabs...");
            const ELEVEN_LABS_API_KEY =
                process.env.EXPO_PUBLIC_ELEVEN_LABS_API_KEY;
            const PHONE_NUMBER = process.env.EXPO_PUBLIC_PHONE_NUMBER;
            const AGENT_ID = process.env.EXPO_PUBLIC_AGENT_ID;
            const AGENT_PHONE_NUMBER_ID =
                process.env.EXPO_PUBLIC_AGENT_PHONE_NUMBER_ID;

            if (
                !ELEVEN_LABS_API_KEY ||
                !PHONE_NUMBER ||
                !AGENT_ID ||
                !AGENT_PHONE_NUMBER_ID
            ) {
                throw new Error(
                    "Missing required environment variables. Check your .env file."
                );
            }
            const errorMessage = "Not implemented yet";
            if (Platform.OS === "web") {
                alert(`Error: ${errorMessage}`);
            } else {
                Alert.alert("Error", errorMessage);
            }
        } catch (error) {
            console.error("API call failed:", error);
            const errorMessage =
                error instanceof Error ? error.message : "API call failed";
            if (Platform.OS === "web") {
                alert(`Error: ${errorMessage}`);
            } else {
                Alert.alert("Error", errorMessage);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Main Screen</Text>
                <View style={styles.card}>
                    <Pressable
                        style={styles.cardButton}
                        onPress={handleApiCall}
                    >
                        <Text style={styles.cardButtonText}>CALL MYSELF</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
