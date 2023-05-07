import * as React from 'react';
import { View, Text } from 'react-native';

export default function WatchList({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('CurrencyExchange')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Watch List</Text>
        </View>
    );
}