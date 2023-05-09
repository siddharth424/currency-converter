import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getData, removeData } from "./store";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const getWatchlist = async () => {
      try {
        const storedWatchlist = await getData("watchlist");
        if (storedWatchlist) {
          setWatchlist(storedWatchlist);
        }
      } catch (error) {
        console.log("Error getting watchlist:", error);
      }
    };
    getWatchlist();
  }, [watchlist]);

  const renderWatchlistItem = ({ item }) => {
    const { toCurrency, fromCurrency, exchangeRate } = item;
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{`From: ${fromCurrency}`}</Text>
        <Text style={styles.itemText}>{`To: ${toCurrency}`}</Text>
        <Text style={styles.itemText}>{`Exchange rate: ${exchangeRate}`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {watchlist.length === 0 ? (
        <Text style={styles.message}>No currencies in watchlist</Text>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderWatchlistItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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

export default WatchList;
