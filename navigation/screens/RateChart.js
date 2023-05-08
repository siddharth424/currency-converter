import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator,Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 4,
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
  xAxisLabel: {
    fontSize: 2,
    marginVertical: 4,
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

  const API_KEY = "sijS33zhah9vw0qputVWlcI75afUF1Q7";
  const startDate = "2022-01-01";
  const endDate = "2022-01-31";

  const fetchCurrencies = async () => {
    const response = await fetch(
      `https://api.apilayer.com/fixer/symbols?apikey=${API_KEY}`
    );
    const result = await response.json();
    const currencyNames = Object.keys(result.symbols);
    setCurrencies(currencyNames);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchData = async () => {
    //https://api.apilayer.com/fixer/timeseries?start_date=2022-01-01&end_date=2022-01-10&base=EUR&symbols=USD&apikey=sijS33zhah9vw0qputVWlcI75afUF1Q7
    const response = await fetch(
      `https://api.apilayer.com/fixer/timeseries?start_date=${startDate}&end_date=${endDate}&base=${fromCurrency}&symbols=${toCurrency}&apikey=${API_KEY}`
    );

    const result = await response.json();
    setExchangeRates(result.rates);
  };

  const calculateExchangeRates = () => {
    const data = [];

    for (const [date, rates] of Object.entries(exchangeRates)) {
      const rate = rates[toCurrency];
      const convertedRate = 1 / rate;

      data.push({ date, rate: convertedRate });
    }

    return data;
  };

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
      <LineChart
        data={{
          labels: chartData.map((data) => data.date),
          datasets: [
            {
              data: chartData.map((data) => data.rate),
            },
          ],
        }}
        width={Dimensions.get("window").width - 40} 
        height={300}
        chartConfig={chartConfig}
        verticalLabelRotation={45}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
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
});

export default RateChart;
