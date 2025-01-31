import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

interface TeamSelectionScreenProps {
  players: string[];
  setTeams: (
    teams:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  onStartGame: () => void;
}

const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  players,
  setTeams,
  onStartGame,
}) => {
  const handleSelectTeam = (player: string, color: string) => {
    setTeams((prev: Record<string, string>) => ({ ...prev, [player]: color }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Teams</Text>
      {players.map((player, index) => (
        <View key={index} style={styles.playerBox}>
          <Text>{player}</Text>
          <TouchableOpacity onPress={() => handleSelectTeam(player, "red")}>
            <Text style={styles.teamButton}>Red</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelectTeam(player, "blue")}>
            <Text style={styles.teamButton}>Blue</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  playerBox: { flexDirection: "row", marginVertical: 10 },
  teamButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "lightgray",
  },
  startButton: {
    marginTop: 20,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  startButtonText: { fontSize: 18, color: "white" },
});

export default TeamSelectionScreen;
