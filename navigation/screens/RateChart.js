import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { API_KEY_RATECHART } from '@env';

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 4,
  color: (opacity = 10) => `rgba(0, 0, 0, ${opacity})`, // Adjust the RGB values for a darker shade

  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
    strokeWidth: 0.2, // Adjust the thickness of the background lines
  },

  propsForDots: {
    r: "0",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const RateChart = () => {
  const [data, setData] = useState([]);
  const [exchangeRates, setExchangeRates] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchData();
  }, [fromCurrency, toCurrency]);

  const API_KEY = API_KEY_RATECHART;
  // Define the start and end dates for fetching exchange rate data
  const startDate = "2023-01-01";
  const endDate = "2023-01-31";

  // Fetch the list of available currencies
  const fetchCurrencies = async () => {
    const response = await fetch(
      `https://api.apilayer.com/exchangerates_data/symbols?apikey=${API_KEY}`
    );
    const result = await response.json();
    const currencyNames = Object.keys(result.symbols);
    setCurrencies(currencyNames);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Fetch the exchange rate data based on the selected currencies and dates
  const fetchData = async () => {
    const response = await fetch(
      `https://api.apilayer.com/exchangerates_data/timeseries?start_date=${startDate}&end_date=${endDate}&base=${fromCurrency}&symbols=${toCurrency}&apikey=${API_KEY}`
    );

    const result = await response.json();
    setExchangeRates(result.rates);
  };

  // Calculate the exchange rates for the chart data
  const calculateExchangeRates = () => {
    const data = [];

    for (const [date, rates] of Object.entries(exchangeRates)) {
      const rate = rates[toCurrency];
      const convertedRate = 1 / rate;

      data.push({ date, rate: convertedRate });
    }

    return data;
  };

  // Show loading indicator while fetching exchange rates
  if (!exchangeRates) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const chartData = calculateExchangeRates();

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {/* Currency selection pickers */}
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

      {/* Line chart displaying exchange rate data */}
      <LineChart
        data={{
          datasets: [
            {
              data: chartData.map((data) => data.rate),
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={300}
        chartConfig={chartConfig}
      />

      <View style={styles.descriptionContainer}>
        <View style={styles.descriptionBorder} />
        <Text style={styles.description}>
          The graph shows the value of {fromCurrency} with respect to{" "}
          {toCurrency} in the last month
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dff0e6",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 75,
  },
  picker: {
    flex: 1,
    height: 50,
    marginHorizontal: 10,
  },
  descriptionContainer: {
    alignItems: "center",
    margin: 50,
  },
  descriptionBorder: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

export default RateChart;
