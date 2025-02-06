import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GameScreenProps {
  players: string[];
}

interface SeriesRecord {
  wins1: number;
  wins2: number;
  total: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ players = [] }) => {
  // Array of cue ball numbers (1 to 15)
  const cueBalls = Array.from({ length: 15 }, (_, index) => index + 1);

  const [isTableOpen, setIsTableOpen] = useState<boolean>(true);
  const [teams, setTeams] = useState<Record<string, string>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [ballsMade, setBallsMade] = useState<Record<string, number[]>>({});
  const [foulBalls, setFoulBalls] = useState<number[]>([]);
  const [clickedBalls, setClickedBalls] = useState<Record<number, boolean>>({});
  const [playersTurn, setPlayersTurn] = useState<string>(players[0]);
  const [seriesRecord, setSeriesRecord] = useState<SeriesRecord | null>(null);

  // --- Helper function to compute head-to-head record ---
  const getPlayerSeries = async (
    player1: string,
    player2: string
  ): Promise<SeriesRecord> => {
    try {
      const existingMatches = await AsyncStorage.getItem("matchHistory");
      const matchHistory = existingMatches ? JSON.parse(existingMatches) : [];
      // Filter matches that include both players
      const headToHeadMatches = matchHistory.filter((match: any) => {
        return (
          match.players.includes(player1) && match.players.includes(player2)
        );
      });
      const wins1 = headToHeadMatches.filter(
        (match: any) => match.winner === player1
      ).length;
      const wins2 = headToHeadMatches.filter(
        (match: any) => match.winner === player2
      ).length;
      return { wins1, wins2, total: headToHeadMatches.length };
    } catch (error) {
      console.error("Error getting player series", error);
      return { wins1: 0, wins2: 0, total: 0 };
    }
  };

  // Update the series record whenever the players change or after a game is finished (i.e. winner is set)
  useEffect(() => {
    if (players.length === 2) {
      getPlayerSeries(players[0], players[1]).then(setSeriesRecord);
    }
  }, [players, winner]);

  const handleBallClick = (ballNumber: number) => {
    if (clickedBalls[ballNumber]) return;

    setClickedBalls((prev) => ({ ...prev, [ballNumber]: true }));
    const currentPlayerTeam = teams[playersTurn];
    let isValidBall = false;

    if (isTableOpen) {
      isValidBall = ballNumber !== 8;
    } else {
      isValidBall =
        (currentPlayerTeam === "red" && ballNumber <= 7) ||
        (currentPlayerTeam === "blue" && ballNumber >= 9) ||
        ballNumber === 8;
    }

    if (isValidBall) {
      setBallsMade((prev) => {
        const playerBalls = prev[playersTurn] || [];
        const newPlayerBalls = [...playerBalls, ballNumber];

        if (isTableOpen && ballNumber !== 8) {
          const newTeams = { ...teams };
          const assignedTeam = ballNumber <= 7 ? "red" : "blue";
          newTeams[playersTurn] = assignedTeam;
          newTeams[players.find((p) => p !== playersTurn)!] =
            assignedTeam === "red" ? "blue" : "red";
          setTeams(newTeams);
          setIsTableOpen(false);
        }

        if (ballNumber === 8) {
          const allBallsPocketed = checkAllBallsPocketed(
            newPlayerBalls,
            playersTurn,
            foulBalls
          );

          if (allBallsPocketed) {
            setWinner(playersTurn);
          } else {
            const opponent = players.find((p) => p !== playersTurn);
            if (opponent) {
              setWinner(opponent);
            }
          }
          return prev; // Stop further execution
        }

        return { ...prev, [playersTurn]: newPlayerBalls };
      });
    } else {
      setFoulBalls((prev) => [...prev, ballNumber]);
      switchTurn();
    }
  };

  const checkAllBallsPocketed = (
    playerBalls: number[],
    player: string,
    foulBalls: number[]
  ) => {
    const team = teams[player];
    const requiredBalls =
      team === "red" ? [1, 2, 3, 4, 5, 6, 7] : [9, 10, 11, 12, 13, 14, 15];

    const totalBallsPocketed = [...playerBalls, ...foulBalls];
    return requiredBalls.every((ball) => totalBallsPocketed.includes(ball));
  };

  const switchTurn = () => {
    const currentIndex = players.indexOf(playersTurn);
    const nextIndex = (currentIndex + 1) % players.length;
    setPlayersTurn(players[nextIndex]);
  };

  const renderBallsMade = (player: string) => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {ballsMade[player]?.map((ballNumber, index) => (
          <View key={index} style={getMiniCueBallStyle(ballNumber)}>
            <Text style={{ fontSize: 8, color: "white" }}>{ballNumber}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderFoulBalls = () => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {foulBalls.map((ballNumber, index) => (
          <View key={index} style={getMiniCueBallStyle(ballNumber)}>
            <Text style={{ fontSize: 8, color: "white" }}>{ballNumber}</Text>
          </View>
        ))}
      </View>
    );
  };

  const getCueBallStyle = (ballNumber: number) => {
    const baseStyle = {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center" as "center",
      alignItems: "center" as "center",
      margin: 5,
    };

    const solidColors = [
      "#FFD700",
      "#0000FF",
      "#FF0000",
      "#800080",
      "#FFA500",
      "#008000",
      "#800000",
    ];

    const stripedColors = [
      "#FFD700",
      "#0000FF",
      "#FF0000",
      "#800080",
      "#FFA500",
      "#008000",
      "#800000",
    ];

    if (clickedBalls[ballNumber]) {
      return {
        ...baseStyle,
        backgroundColor: "#808080",
      };
    }

    if (ballNumber <= 7) {
      return {
        ...baseStyle,
        backgroundColor: solidColors[ballNumber - 1],
      };
    } else if (ballNumber === 8) {
      return {
        ...baseStyle,
        backgroundColor: "#000000",
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: stripedColors[ballNumber - 9],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      };
    }
  };

  const getMiniCueBallStyle = (ballNumber: number) => {
    const baseStyle = {
      width: 20,
      height: 20,
      borderRadius: 20,
      justifyContent: "center" as "center",
      alignItems: "center" as "center",
      margin: 5,
    };

    const solidColors = [
      "#FFD700",
      "#0000FF",
      "#FF0000",
      "#800080",
      "#FFA500",
      "#008000",
      "#800000",
    ];

    const stripedColors = [
      "#FFD700",
      "#0000FF",
      "#FF0000",
      "#800080",
      "#FFA500",
      "#008000",
      "#800000",
    ];

    if (ballNumber <= 7) {
      return {
        ...baseStyle,
        backgroundColor: solidColors[ballNumber - 1],
      };
    } else if (ballNumber === 8) {
      return {
        ...baseStyle,
        backgroundColor: "#000000",
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: stripedColors[ballNumber - 9],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      };
    }
  };

  const resetGame = () => {
    setWinner(null);
    setBallsMade({});
    setFoulBalls([]);
    setClickedBalls({});
    setIsTableOpen(true);
    setTeams({});
  };

  const startNewGame = () => {
    resetGame();
    setPlayersTurn(players[0]);
  };

  const saveMatchResult = async (
    winner: string,
    loser: string,
    score: string,
    players: string[]
  ) => {
    try {
      const newMatch = {
        id: Date.now().toString(),
        players,
        winner,
        loser,
        score,
        timestamp: new Date().toISOString(),
      };

      const existingMatches = await AsyncStorage.getItem("matchHistory");
      const matchHistory = existingMatches ? JSON.parse(existingMatches) : [];
      matchHistory.push(newMatch);
      await AsyncStorage.setItem("matchHistory", JSON.stringify(matchHistory));
      console.log("Match saved!", newMatch);
    } catch (error) {
      console.error("Error saving match:", error);
    }
  };

  // Save match result when a winner is set.
  useEffect(() => {
    if (winner) {
      const loser = players.find((p) => p !== winner);
      if (loser) {
        saveMatchResult(winner, loser, "N/A", players);
      }
    }
  }, [winner]);

  return (
    <View style={styles.container}>
      {/* Cue Balls Row */}
      <View style={styles.cueBallsRow}>
        {cueBalls.map((ballNumber) => (
          <TouchableOpacity
            key={ballNumber}
            onPress={() => handleBallClick(ballNumber)}
          >
            <View style={getCueBallStyle(ballNumber)}>
              <Text style={styles.cueBallText}>{ballNumber}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Players List */}
      <View style={styles.playersContainer}>
        {players.map((player, index) => {
          const isCurrentPlayer = player === playersTurn;
          const playerColor = teams[player];
          return (
            <View
              key={index}
              style={[
                styles.playerItem,
                {
                  borderColor: isCurrentPlayer ? playerColor : "transparent",
                  opacity: 1,
                  shadowColor: isCurrentPlayer ? playerColor : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isCurrentPlayer ? 0.8 : 0,
                  shadowRadius: isCurrentPlayer ? 4 : 0,
                  elevation: isCurrentPlayer ? 5 : 0,
                },
              ]}
            >
              <Text style={styles.playerName}>{player}</Text>
              {renderBallsMade(player)}
            </View>
          );
        })}
      </View>

      {/* Foul Balls Section */}
      <View style={styles.foulBallsContainer}>
        <Text style={styles.foulBallsTitle}>Foul Balls:</Text>
        {renderFoulBalls()}
      </View>

      {/* Next Turn Button */}
      <View>
        <TouchableOpacity onPress={switchTurn} style={styles.button}>
          <Text style={styles.buttonText}>Next Turn</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Winner */}
      <View style={winner ? { pointerEvents: "none", opacity: 0.3 } : {}}>
        {winner && (
          <Modal animationType="slide" transparent={true} visible={true}>
            <View style={styles.modalContainer}>
              <ConfettiCannon
                count={200}
                origin={{ x: 200, y: 0 }}
                fadeOut={true}
              />
              <View style={styles.modalContent}>
                <Text style={styles.winnerText}>Winner: {winner} 🎉</Text>
                <TouchableOpacity style={styles.button} onPress={resetGame}>
                  <Text style={styles.buttonText}>Rematch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={startNewGame}>
                  <Text style={styles.buttonText}>New Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
      {seriesRecord && players.length === 2 && (
        <View style={styles.seriesRecordContainer}>
          <Text style={styles.seriesRecordText}>
            {players[0]} {seriesRecord.wins1} - {seriesRecord.wins2}{" "}
            {players[1]}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignContent: "center",
  },
  cueBallsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  seriesRecordContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  seriesRecordText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  cueBallText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  playersContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 20,
    borderBottomWidth: 0,
    borderRadius: 5,
    gap: 40,
  },
  playerName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  foulBallsContainer: {
    marginTop: 20,
  },
  foulBallsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  winnerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginTop: 20,
  },
  recordText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
  },
});

export default GameScreen;
