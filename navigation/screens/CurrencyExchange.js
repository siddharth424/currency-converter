import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { getData, storeData } from "./store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { API_KEY_EXCHANGE } from '@env';

const CurrencyExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("USD"); // State for the selected "from" currency
  const [toCurrency, setToCurrency] = useState("EUR"); // State for the selected "to" currency
  const [exchangeRate, setExchangeRate] = useState(0); // State for the exchange rate
  const [amount, setAmount] = useState(1); // State for the amount to convert
  const [currencies, setCurrencies] = useState([]); // State for the available currencies
  const [isBookmarked, setIsBookmarked] = useState(false); // State to track if the currency pair is bookmarked
  const [backuplist, setbackuplist] = useState([]); // State for the backup currency rates
  const [isOnline, setIsOnline] = useState(true); // State to track online/offline status

  // Function to toggle bookmark for the currency pair
  const toggleBookmark = async () => {
    if (isBookmarked) {
      // Remove the currency pair from the watchlist
      try {
        const storedCurrencies = await AsyncStorage.getItem("watchlist");
        const currenciesArray = JSON.parse(storedCurrencies);
        const updatedCurrencies = currenciesArray.filter(
          (currency) =>
            currency.fromCurrency !== fromCurrency ||
            currency.toCurrency !== toCurrency
        );
        await AsyncStorage.setItem(
          "watchlist",
          JSON.stringify(updatedCurrencies)
        );
        setIsBookmarked(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Add the currency pair to the watchlist
      try {
        const storedCurrencies = await AsyncStorage.getItem("watchlist");
        const currenciesArray = JSON.parse(storedCurrencies) || [];
        currenciesArray.push({ fromCurrency, toCurrency, exchangeRate });
        await AsyncStorage.setItem(
          "watchlist",
          JSON.stringify(currenciesArray)
        );
        setIsBookmarked(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to load the watchlist and check if the currency pair is bookmarked
  const loadWatchlist = async () => {
    try {
      const storedCurrencies = await AsyncStorage.getItem("watchlist");
      const currenciesArray = JSON.parse(storedCurrencies) || [];
      const bookmarked = currenciesArray.find(
        (currency) =>
          currency.fromCurrency === fromCurrency &&
          currency.toCurrency === toCurrency
      );
      if (bookmarked) {
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to convert the currency based on the selected currencies and amount
  const convertCurrency = () => {
    let rate = backuplist[toCurrency] / backuplist[fromCurrency];
    if (isNaN(amount)) {

      let result = (rate).toFixed(4);
      return result;
    }
    if (isNaN(rate))
    {
      rate = 1;
      return "Loading...";
    }
    let result = (amount * rate).toFixed(4);
    return result;
  };

  // Fetch the list of available currencies and the exchange rate on component mount or when the "to" currency changes
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // Check the network connection status
        const isConnected = await NetInfo.fetch().then(
          (state) => state.isConnected
        );
        setIsOnline(isConnected);

        // Fetch the exchange rate data for USD
        const response = await fetch(
          
          `https://v6.exchangerate-api.com/v6/${API_KEY_EXCHANGE}/latest/USD`
        );
        const data = await response.json();

        // Set the available currencies and the exchange rate for the selected "to" currency
        setCurrencies(Object.keys(data.conversion_rates));
        setExchangeRate(data.conversion_rates[toCurrency]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrencies();
  }, [toCurrency]);

  //Fetch exchange rates of from currency
  useEffect(() => {
    const fetchExchangeRate = async () => {
      // Load watchlist and check if the currency pair is bookmarked
      loadWatchlist();

      try {
        const converter = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY_EXCHANGE}/latest/USD`
        );

        // Fetch the exchange rate for the selected "from" currency
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY_EXCHANGE}/latest/${fromCurrency}`
        );
        const data = await response.json();
        const templist = await converter.json();
        setbackuplist(templist.conversion_rates);
        setExchangeRate(data.conversion_rates[toCurrency]);

        // Retrieve the existing history data or initialize an empty array
        const history = (await getData("history")) || [];

        // Append the current conversion data to the history array
        history.push({ fromCurrency, toCurrency, exchangeRate });

        // Save the updated history array back to AsyncStorage
        storeData("history", history);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  //Check for online or offline
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={isOnline ? styles.onlineText : styles.offlineText}>
          {isOnline ? "Online" : "Offline"}
        </Text>
      </View>
      <Image source={require("../images/money.png")} style={styles.image} />

      <Text style={styles.title}>Currency Converter</Text>
      <TextInput
        style={styles.input}
        defaultValue="1"
        value={amount}
        onChangeText={(text) => setAmount(parseFloat(text))}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        {/* From Currency Picker */}
        <Picker
          style={styles.picker}
          selectedValue={fromCurrency}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}
        >
          {currencies.map((currency, index) => (
            <Picker.Item key={index} label={currency} value={currency} />
          ))}
        </Picker>

        {/* To Currency Picker */}
        <Picker
          style={styles.picker}
          selectedValue={toCurrency}
          onValueChange={(itemValue) => setToCurrency(itemValue)}
        >
          {currencies.map((currency, index) => (
            <Picker.Item key={index} label={currency} value={currency} />
          ))}
        </Picker>

        {/* Bookmark Button */}
        <View style={styles.bookmarkContainer}>
          <TouchableOpacity onPress={toggleBookmark}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={30}
              color="darkgreen"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.result}>
        {amount} {fromCurrency} = {convertCurrency()} {toCurrency}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dff0e6",
  },
  statusContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  onlineText: {
    color: "#008000",
    fontWeight: "bold",
  },
  offlineText: {
    color: "#ff0000",
    fontWeight: "bold",
  },
  bookmarkContainer: {
    paddingRight: 10,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "80%",
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 150,
  },
  picker: {
    flex: 1,
    height: 50,
    marginHorizontal: 10,
  },
  result: {
    fontSize: 25,
    marginTop: 0,
    fontWeight: "bold",
    color: "#1d3627",
  },
  image: {
    width: 100,
    height: 100,
  },
  favoriteButton: {
    backgroundColor: "#1d3627",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  favoriteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  favorite: {
    backgroundColor: "gold",
  },
});

export default CurrencyExchange;
