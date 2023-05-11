import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getData } from "./store";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    // Fetch watchlist data from AsyncStorage
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

    getWatchlist(); // Call getWatchlist on component mount
  }, [watchlist]);

  const renderWatchlistItem = ({ item }) => {
    const { toCurrency, fromCurrency, exchangeRate } = item;

    const toggleBookmark = async () => {
      try {
        // Retrieve stored currencies from AsyncStorage
        const storedCurrencies = await AsyncStorage.getItem("watchlist");
        const currenciesArray = JSON.parse(storedCurrencies);

        // Filter out the clicked currency from the stored currencies
        const updatedCurrencies = currenciesArray.filter(
          (currency) =>
            currency.fromCurrency !== fromCurrency ||
            currency.toCurrency !== toCurrency
        );

        // Update the watchlist in AsyncStorage
        await AsyncStorage.setItem(
          "watchlist",
          JSON.stringify(updatedCurrencies)
        );
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{`From: ${fromCurrency}`}</Text>
          <Text style={styles.itemText}>{`To: ${toCurrency}`}</Text>
          <Text style={styles.itemText}>{`Exchange rate: ${exchangeRate}`}</Text>
        </View>
        <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkContainer}>
          <Ionicons name="bookmark" size={30} color="darkgreen" />
        </TouchableOpacity>
      </TouchableOpacity>
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
    backgroundColor: "#dff0e6",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  textContainer: {
    flex: 1,
  },
  bookmarkContainer: {
    paddingLeft: 10,
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
  itemText: {
    fontSize: 16,
    color: "#444",
  },
});

export default WatchList;