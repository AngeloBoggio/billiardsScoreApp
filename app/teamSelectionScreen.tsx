import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

interface TeamSelectionScreenProps {
  players: string[];
  setTeams: (teams: Record<string, string>) => void;
  onStartGame: () => void;
}

const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  players,
  setTeams,
  onStartGame,
}) => {
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>(
    {}
  );

  const handleSelectTeam = (player: string, color: string) => {
    // Only update state if the selected team has changed
    if (selectedTeams[player] !== color) {
      setSelectedTeams((prev) => ({ ...prev, [player]: color }));
    }
  };

  const handleStartGame = () => {
    // Pass the final selected teams to the parent component
    setTeams(selectedTeams);
    // Call the onStartGame function
    onStartGame();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Teams</Text>
      {players.map((player, index) => (
        <View key={index} style={styles.playerBox}>
          <Text>{player}</Text>
          <TouchableOpacity
            style={[
              styles.teamButton,
              selectedTeams[player] === "red" && styles.colorR,
            ]}
            onPress={() => handleSelectTeam(player, "red")}
          >
            <Text>Red</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.teamButton,
              selectedTeams[player] === "blue" && styles.colorB,
            ]}
            onPress={() => handleSelectTeam(player, "blue")}
          >
            <Text>Blue</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 40, fontWeight: "bold" },
  playerBox: { flexDirection: "row", marginVertical: 10 },
  teamButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  startButton: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  startButtonText: { fontSize: 18, color: "white" },
  colorR: { backgroundColor: "red" }, // Style for Red team
  colorB: { backgroundColor: "blue" }, // Style for Blue team
});

export default TeamSelectionScreen;
