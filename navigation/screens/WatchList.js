import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getData, removeData } from "./store";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [tempFromCurrency, setTempFromCurrency] = useState("USD");
  const [tempToCurrency, setTempToCurrency] = useState("EUR");


  const toggleBookmark = async () => {
      try {
        const storedCurrencies = await AsyncStorage.getItem('watchlist');
        const currenciesArray = JSON.parse(storedCurrencies);
        const updatedCurrencies = currenciesArray.filter(
          (currency) => currency.fromCurrency !== tempFromCurrency || currency.toCurrency !== tempToCurrency
        );
        await AsyncStorage.setItem('watchlist', JSON.stringify(updatedCurrencies));
      } catch (error) {
        console.log(error);
      }
  };



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
    setTempFromCurrency(fromCurrency);
    setTempToCurrency(toCurrency);
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{`From: ${fromCurrency}`}</Text>
        <Text style={styles.itemText}>{`To: ${toCurrency}`}</Text>
        <Text style={styles.itemText}>{`Exchange rate: ${exchangeRate}`}</Text>
        <View style={styles.bookmarkContainer}>
          <TouchableOpacity onPress={toggleBookmark}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
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
  bookmarkContainer: {
    paddingRight: 10,
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
