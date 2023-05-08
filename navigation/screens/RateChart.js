import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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
};

const RateChart = () => {
    const [data, setData] = useState([]);
    const [exchangeRates, setExchangeRates] = useState(null);


  useEffect(() => {
    fetchData();
  }, []);

  const API_KEY = "sijS33zhah9vw0qputVWlcI75afUF1Q7";
  const baseCurrency = "USD";
  const targetCurrency = "EUR";
  const startDate = "2022-01-01";
  const endDate = "2022-01-31";

    const fetchData = async () => {
      //https://api.apilayer.com/fixer/timeseries?start_date=2022-01-01&end_date=2022-01-10&base=EUR&symbols=USD&apikey=sijS33zhah9vw0qputVWlcI75afUF1Q7
      const response = await fetch(
        `https://api.apilayer.com/fixer/timeseries?start_date=${startDate}&end_date=${endDate}&base=${baseCurrency}&symbols=${targetCurrency}&apikey=${API_KEY}`
      );

      const result = await response.json();
      console.log(result.rates);
      setExchangeRates(result.rates);
    };
    
    const calculateExchangeRates = () => {
    const data = [];

    for (const [date, rates] of Object.entries(exchangeRates)) {
      const rate = rates[targetCurrency];
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
      <LineChart
        data={{
          labels: chartData.map((data) => data.date),
          datasets: [
            {
              data: chartData.map((data) => data.rate),
            },
          ],
        }}
        width={400}
        height={400}
        chartConfig={chartConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default RateChart;
