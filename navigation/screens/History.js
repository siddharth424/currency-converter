import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getData, removeData } from "./store";

const History = () => {
  const [history, setHistory] = useState([]);

  // Function to retrieve history data from AsyncStorage
  const getHistory = async () => {
    try {
      const storedHistory = await getData("history");
      if (storedHistory) {
        // Filter out items with exchangeRate = 0
        const filteredHistory = storedHistory.filter((item) => item.exchangeRate !== 0);
        setHistory(filteredHistory);
      }
    } catch (error) {
      console.log("Error getting history:", error);
    }
  };

  useEffect(() => {
    // Call getHistory function every 100 milliseconds
    const interval = setInterval(getHistory, 100);

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  // Function to clear the history data
  const clearHistory = async () => {
    try {
      await removeData("history");
      console.log("History data removed");
      setHistory([]); // Clear the history state
      console.log("History state updated");
    } catch (error) {
      console.log("Error clearing history:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={clearHistory} style={{ alignItems: "flex-end" }}>
        <Text>Clear History</Text>
      </TouchableOpacity>

      {history.length === 0 ? (
        // Render a message when no history is available
        <Text style={styles.message}>No history available</Text>
      ) : (
        <FlatList
          data={history.reverse()} // Reverse the history array to display latest items first
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{`From: ${item.fromCurrency}`}</Text>
              <Text style={styles.itemText}>{`To: ${item.toCurrency}`}</Text>
              <Text style={styles.itemText}>{`Exchange rate: ${item.exchangeRate}`}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#dff0e6",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontStyle: "italic",
    marginTop: 16,
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    color: "#444",
  },
});

export default History;
