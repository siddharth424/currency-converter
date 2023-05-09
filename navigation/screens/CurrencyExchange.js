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
import { getData, storeData } from "./store";

const CurrencyExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(1);
  const [currencies, setCurrencies] = useState([]);
  // const [isFavorite, setIsFavorite] = useState(false);

  const convertCurrency = () => {
    let result = (amount * exchangeRate).toFixed(2);
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
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/89cc9cc4efde77f6f4a8dadc/latest/${fromCurrency}`
        );
        const data = await response.json();
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

  //   useEffect(() => {
  //     const getFavorites = async () => {
  //       try {
  //         const jsonValue = await AsyncStorage.getItem("@favorites");
  //         const favorites = jsonValue != null ? JSON.parse(jsonValue) : [];
  //         setIsFavorite(favorites.some((fav) => fav.from === fromCurrency && fav.to === toCurrency));
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getFavorites();
  //   }, [fromCurrency, toCurrency]);

  //   const addToFavorites = async () => {
  //     try {
  //       const jsonValue = await AsyncStorage.getItem("@favorites");
  //       const favorites = jsonValue != null ? JSON.parse(jsonValue) : [];
  //       favorites.push({ from: fromCurrency, to: toCurrency });
  //       await AsyncStorage.setItem("@favorites", JSON.stringify(favorites));
  //       setIsFavorite(true);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const toggleFavorite = async () => {
  //   try {
  //     const favorites = await AsyncStorage.getItem('favorites');
  //     let newFavorites;
  //     if (favorites) {
  //       // if favorites exist, parse the JSON and update it
  //       const parsedFavorites = JSON.parse(favorites);
  //       const fromToPair = `${fromCurrency}-${toCurrency}`;
  //       if (parsedFavorites[fromToPair]) {
  //         delete parsedFavorites[fromToPair]; // remove from favorites
  //       } else {
  //         parsedFavorites[fromToPair] = { from: fromCurrency, to: toCurrency };
  //       }
  //       newFavorites = parsedFavorites;
  //     } else {
  //       // if favorites do not exist, create a new object with the current pair
  //       newFavorites = { [`${fromCurrency}-${toCurrency}`]: { from: fromCurrency, to: toCurrency } };
  //     }
  //     await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  //     setIsFavorite(!isFavorite);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
      </View>
      <Text style={styles.result}>
        {amount} {fromCurrency} = {convertCurrency()} {toCurrency}
      </Text>
      {/* <TouchableOpacity
      onPress={toggleFavorite}
      style={[
        styles.favoriteButton,
        isFavorite && styles.favoriteButtonActive,
      ]}
    >
      <Text style={styles.favoriteButtonText}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </Text>
    </TouchableOpacity> */}
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
