import { Text, View, Pressable } from "react-native";
import { Link } from "expo-router";

export default function WelcomePage() {
  return (
    <View
      style={{
        shadowColor: "#73726f",
        backgroundColor: "#faf9f5",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Billiards Score
      </Text>
      <Link href="/startgame" asChild>
        <Pressable>
          <Text
            style={{
              fontSize: 25,
              color: "red",
            }}
          >
            Start Game
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
