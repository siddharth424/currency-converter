import * as React from "react";
import { StyleSheet,View} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import CurrencyExchange from "./screens/CurrencyExchange";
import RateChart from "./screens/RateChart";
import WatchList from "./screens/WatchList";

//Screen names
const exchangeName = "Currency Exchange";
const chartName = "Rate Chart";
const watchlistName = "Watchlist";

const Tab = createBottomTabNavigator();
console.disableYellowBox = true;


function MainContainer() {
  return (
    <NavigationContainer >
      <Tab.Navigator
        initialRouteName={exchangeName}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: {
            paddingBottom: 10,
            fontSize: 10,
          },
          tabBarStyle: [
            {
              display: "flex",
              height: 65,
            },
            null,
          ],
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === exchangeName) {
              iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
            } else if (rn === chartName) {
              iconName = focused ? "bar-chart" : "bar-chart-outline";
            } else if (rn === watchlistName) {
              iconName = focused ? "bookmark" : "bookmark-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name={exchangeName} component={CurrencyExchange} />
        <Tab.Screen name={chartName} component={RateChart} />
        <Tab.Screen name={watchlistName} component={WatchList} />
      </Tab.Navigator>
      </NavigationContainer>
  );
}

export default MainContainer;
