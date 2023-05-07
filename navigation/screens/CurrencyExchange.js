import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

const CurrencyExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(1);
  const [currencies, setCurrencies] = useState([]);

  const convertCurrency = () => {
    let result = (amount / exchangeRate).toFixed(2);
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  return (
    <View style={styles.container}>
      <Image source={require('../images/money.png')} style={styles.image} />
      <Text styles={styles.title}>Currency Converter</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={(text) => setAmount(parseFloat(text))}
        keyboardType="numeric"
      />
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={fromCurrency}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}>
          {currencies.map((currency, index) => (
            <Picker.Item key={index} label={currency} value={currency} />
          ))}
        </Picker>

        <Picker
          style={styles.picker}
          selectedValue={toCurrency}
          onValueChange={(itemValue) => setToCurrency(itemValue)}>
          {currencies.map((currency, index) => (
            <Picker.Item key={index} label={currency} value={currency} />
          ))}
        </Picker>
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dff0e6',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '80%',
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: 'bold',
        color: '#1d3627',
    },
    image: {
        width: 100,
        height: 100,
    },

});

export default CurrencyExchange;
