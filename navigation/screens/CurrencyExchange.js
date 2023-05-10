import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import { getData, storeData } from "./store";
import AsyncStorage from '@react-native-async-storage/async-storage';


const CurrencyExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [backuplist,setbackuplist] = useState([]);


    const toggleBookmark = async () => {
    if (isBookmarked) {
      try {
        const storedCurrencies = await AsyncStorage.getItem('watchlist');
        const currenciesArray = JSON.parse(storedCurrencies);
        const updatedCurrencies = currenciesArray.filter(
          (currency) => currency.fromCurrency !== fromCurrency || currency.toCurrency !== toCurrency
        );
        await AsyncStorage.setItem('watchlist', JSON.stringify(updatedCurrencies));
        setIsBookmarked(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const storedCurrencies = await AsyncStorage.getItem('watchlist');
        const currenciesArray = JSON.parse(storedCurrencies) || [];
        currenciesArray.push({ fromCurrency, toCurrency, exchangeRate });
        await AsyncStorage.setItem('watchlist', JSON.stringify(currenciesArray));
        setIsBookmarked(false);
      } catch (error) {
        console.log(error);
      }
    }
      loadWatchlist();
  };

  const loadWatchlist = async () => {
    try {
      const storedCurrencies = await AsyncStorage.getItem('watchlist');
      const currenciesArray = JSON.parse(storedCurrencies) || [];
      const bookmarked = currenciesArray.find(
        (currency) => currency.fromCurrency === fromCurrency && currency.toCurrency === toCurrency
      );
      if (bookmarked) {
        setIsBookmarked(true);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const convertCurrency = () => {
    loadWatchlist();
    let rate = backuplist[toCurrency]/backuplist[fromCurrency]
    let result = (amount * rate).toFixed(2);
    return result;
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/89cc9cc4efde77f6f4a8dadc/latest/USD`
        );
        const data = await response.json();
        setCurrencies(Object.keys(data.conversion_rates));
        setExchangeRate(data.conversion_rates[toCurrency]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrencies();
  }, [toCurrency]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsBookmarked(false);
      try {
        const converter = await fetch(
          `https://v6.exchangerate-api.com/v6/89cc9cc4efde77f6f4a8dadc/latest/USD`
        );
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/89cc9cc4efde77f6f4a8dadc/latest/${fromCurrency}`
        );
        const data = await response.json();
        const templist = await converter.json();
        setbackuplist(templist.conversion_rates);
        setExchangeRate(data.conversion_rates[toCurrency]);
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

  return (
    <View style={styles.container}>
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
        <Picker
          style={styles.picker}
          selectedValue={fromCurrency}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}
        >
          {currencies.map((currency, index) => (
            <Picker.Item key={index} label={currency} value={currency} />
          ))}
        </Picker>

        <Picker
          style={styles.picker}
          selectedValue={toCurrency}
          onValueChange={(itemValue) => setToCurrency(itemValue)}
        >
          {currencies.map((currency, index) => (
            <Picker.Item key={index} label={currency} value={currency} />
          ))}
        </Picker>
        <View style={styles.bookmarkContainer}>
      <TouchableOpacity onPress={toggleBookmark}>
        <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={30} color="black" />
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
    marginTop: 200,
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
