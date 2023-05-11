import * as React from "react";
import { StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import CurrencyExchange from "./screens/CurrencyExchange";
import RateChart from "./screens/RateChart";
import WatchList from "./screens/WatchList";
import History from "./screens/History";

// Screen names
const exchangeName = "Currency Exchange";
const chartName = "Rate Chart";
const history = "History";
const watchlistName = "Watchlist";

const Tab = createBottomTabNavigator();
console.disableYellowBox = true;

function MainContainer() {
  return (
    // Navigation container to wrap the tab navigator
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={exchangeName}
        // Configure options for each screen in the tab navigator
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

            // Determine the appropriate icon name based on the screen name and focus state
            if (rn === exchangeName) {
              iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
            } else if (rn === chartName) {
              iconName = focused ? "bar-chart" : "bar-chart-outline";
            } else if (rn === watchlistName) {
              iconName = focused ? "bookmark" : "bookmark-outline";
            } else if (rn === history) {
              iconName = focused ? "timer" : "timer-outline";
            }

            // Return the Ionicons component with the selected icon name and styling
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* Define the screens and their components */}
        <Tab.Screen name={exchangeName} component={CurrencyExchange} />
        <Tab.Screen name={chartName} component={RateChart} />
        <Tab.Screen name={watchlistName} component={WatchList} />
        <Tab.Screen name={history} component={History} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
