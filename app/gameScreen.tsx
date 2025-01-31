import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";

interface GameScreenProps {
  players: string[];
  teams: {};
}

const GameScreen: React.FC<GameScreenProps> = ({ players }) => {
  // Array of cue ball numbers (1 to 15)
  const cueBalls = Array.from({ length: 15 }, (_, index) => index + 1);

  // State to track which balls have been clicked
  const [clickedBalls, setClickedBalls] = useState<Record<number, boolean>>({});

  // State to track whose turn it is
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // State to track balls made by each player
  const [ballsMade, setBallsMade] = useState<Record<string, number[]>>(
    players.reduce((acc, player) => ({ ...acc, [player]: [] }), {})
  );

  // State to track each player's type (solids or stripes)
  const [playerTypes, setPlayerTypes] = useState<
    Record<string, "solids" | "stripes" | null>
  >(players.reduce((acc, player) => ({ ...acc, [player]: null }), {}));

  // State to track if the game is over
  const [gameOver, setGameOver] = useState(false);

  // Function to handle ball clicks
  const handleBallClick = (ballNumber: number) => {
    if (gameOver) return; // Do nothing if the game is over

    const currentPlayer = players[currentPlayerIndex];
    const currentPlayerType = playerTypes[currentPlayer];

    // Determine if the ball is a solid or stripe
    const isSolid = ballNumber >= 1 && ballNumber <= 7;
    const isStripe = ballNumber >= 9 && ballNumber <= 15;
    const is8Ball = ballNumber === 8;

    // Assign player type if they don't have one yet
    if (!currentPlayerType) {
      let newPlayerTypes = { ...playerTypes };

      if (isSolid) {
        newPlayerTypes[currentPlayer] = "solids";
      } else if (isStripe) {
        newPlayerTypes[currentPlayer] = "stripes";
      }

      // Assign the opposite type to the other player
      const otherPlayer = players.find((player) => player !== currentPlayer);
      if (otherPlayer) {
        newPlayerTypes[otherPlayer] =
          newPlayerTypes[currentPlayer] === "solids" ? "stripes" : "solids";
      }

      setPlayerTypes(newPlayerTypes);
    }

    // Check if the ball is valid for the player's type
    const isValidBall =
      !currentPlayerType || // Player hasn't been assigned a type yet
      (currentPlayerType === "solids" && isSolid) || // Player is solids and ball is solid
      (currentPlayerType === "stripes" && isStripe); // Player is stripes and ball is stripe

    if (!isValidBall && !is8Ball) {
      Alert.alert("Invalid Ball", `${currentPlayer} cannot make this ball.`);
      return;
    }

    // Add the ball to the current player's list
    setBallsMade((prev) => ({
      ...prev,
      [currentPlayer]: [...prev[currentPlayer], ballNumber],
    }));

    // Mark the ball as clicked
    setClickedBalls((prev) => ({
      ...prev,
      [ballNumber]: true,
    }));

    // Check if the game is over after this move
    checkGameOver(currentPlayer, ballNumber);
  };

  // Function to check if the game is over
  const checkGameOver = (player: string, ballNumber: number) => {
    const playerBalls = ballsMade[player];
    const playerType = playerTypes[player];
    const is8Ball = ballNumber === 8;

    // Determine the designated balls for the player (solids or stripes)
    const designatedBalls =
      playerType === "solids"
        ? [1, 2, 3, 4, 5, 6, 7]
        : [9, 10, 11, 12, 13, 14, 15];

    // Check if the player has made all their designated balls
    const hasMadeAllDesignatedBalls = designatedBalls.every((ball) =>
      playerBalls.includes(ball)
    );

    // Losing condition: Player made the 8-ball before making all designated balls
    if (is8Ball && !hasMadeAllDesignatedBalls) {
      setGameOver(true);
      Alert.alert(
        "Game Over",
        `${player} loses! They made the 8-ball too early.`
      );
      return;
    }

    // Winning condition: Player made the 8-ball after making all designated balls
    if (is8Ball && hasMadeAllDesignatedBalls) {
      setGameOver(true);
      Alert.alert(
        "Game Over",
        `${player} wins! They made the 8-ball after clearing their balls.`
      );
      return;
    }

    // Notify the player if they have cleared all their designated balls
    if (hasMadeAllDesignatedBalls) {
      Alert.alert(
        "Next Step",
        `${player} has cleared their balls. They must now make the 8-ball to win.`
      );
    }
  };

  // Function to end the current player's turn
  const endTurn = () => {
    if (gameOver) return; // Do nothing if the game is over
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  // Function to get the style for each cue ball
  const getCueBallStyle = (ballNumber: number) => {
    const baseStyle = {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center" as "center",
      alignItems: "center" as "center",
      margin: 5,
    };

    // Solid colors for balls 1–7
    const solidColors = [
      "#FFD700", // 1: Yellow
      "#0000FF", // 2: Blue
      "#FF0000", // 3: Red
      "#800080", // 4: Purple
      "#FFA500", // 5: Orange
      "#008000", // 6: Green
      "#800000", // 7: Maroon
    ];

    // Striped colors for balls 9–15
    const stripedColors = [
      "#FFD700", // 9: Yellow stripe
      "#0000FF", // 10: Blue stripe
      "#FF0000", // 11: Red stripe
      "#800080", // 12: Purple stripe
      "#FFA500", // 13: Orange stripe
      "#008000", // 14: Green stripe
      "#800000", // 15: Maroon stripe
    ];

    // If the ball has been clicked, return a gray style
    if (clickedBalls[ballNumber]) {
      return {
        ...baseStyle,
        backgroundColor: "#808080", // Gray color
      };
    }

    // Otherwise, return the normal style
    if (ballNumber <= 7) {
      return {
        ...baseStyle,
        backgroundColor: solidColors[ballNumber - 1],
      };
    } else if (ballNumber === 8) {
      return {
        ...baseStyle,
        backgroundColor: "#000000", // Black for the 8-ball
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: stripedColors[ballNumber - 9],
        borderWidth: 2,
        borderColor: "#FFFFFF", // White border for striped balls
      };
    }
  };

  return (
    <View style={styles.container}>
      {/* Cue Balls Row */}
      <View style={styles.cueBallsRow}>
        {cueBalls.map((ballNumber) => (
          <TouchableOpacity
            key={ballNumber}
            onPress={() => handleBallClick(ballNumber)}
            disabled={clickedBalls[ballNumber] || gameOver} // Disable clicked balls or if game is over
          >
            <View style={getCueBallStyle(ballNumber)}>
              <Text style={styles.cueBallText}>{ballNumber}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render players */}
      <View style={styles.playersContainer}>
        {players.map((player, index) => (
          <View key={player} style={styles.playerContainer}>
            {/* Player Name and Turn Indicator */}
            <View
              style={[
                styles.playerRow,
                index === currentPlayerIndex && styles.currentPlayer,
              ]}
            >
              <Text style={{ fontSize: 30 }}>
                {player} ({playerTypes[player] || "No Type"})
              </Text>
            </View>

            {/* Balls Made by the Player */}
            <View style={styles.ballsMadeContainer}>
              {ballsMade[player].map((ballNumber) => (
                <View key={ballNumber} style={styles.ballMade}>
                  <Text style={styles.ballMadeText}>{ballNumber}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* End Turn Button */}
      <Button
        title="End Turn"
        onPress={endTurn}
        disabled={players.length === 0 || gameOver} // Disable if no players or game is over
      />

      {/* Game Over Message */}
      {gameOver && <Text style={styles.gameOverText}>Game Over!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    padding: 20, // Add some padding for better spacing
  },
  cueBallsRow: {
    flexDirection: "row", // Align circles horizontally
    flexWrap: "wrap", // Wrap to the next row if there's not enough space
    justifyContent: "center", // Center the circles horizontally
    marginBottom: 20, // Add spacing below the cue balls
  },
  cueBallText: {
    fontSize: 16, // Text size inside the circle
    fontWeight: "bold", // Bold text
    color: "#FFFFFF", // White text for better contrast
  },
  playersContainer: {
    flexDirection: "row", // Align player names horizontally
    flexWrap: "wrap", // Wrap to the next row if there's not enough space
    justifyContent: "center", // Center the player names horizontally
    alignItems: "center", // Vertically center the player names
    marginBottom: 20, // Add spacing below the player names
  },
  playerContainer: {
    alignItems: "center", // Center the player name and balls made
    marginRight: 20, // Add spacing between player containers
  },
  playerRow: {
    flexDirection: "row", // Align player name and team color in a row
    alignItems: "center", // Vertically center the text
  },
  currentPlayer: {
    borderBottomWidth: 2, // Add a border to indicate the current player
    borderBottomColor: "black", // Border color
  },
  ballsMadeContainer: {
    flexDirection: "row", // Align balls made horizontally
    flexWrap: "wrap", // Wrap to the next row if there's not enough space
    justifyContent: "center", // Center the balls made horizontally
    marginTop: 10, // Add spacing above the balls made
  },
  ballMade: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#808080", // Gray color for made balls
    justifyContent: "center",
    alignItems: "center",
    margin: 5, // Add spacing between balls made
  },
  ballMadeText: {
    fontSize: 14, // Text size inside the made ball
    fontWeight: "bold", // Bold text
    color: "#FFFFFF", // White text for better contrast
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default GameScreen;
