import * as React from 'react';
import { View, Text } from 'react-native';

export default function RateChart({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('CurrencyExchange')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Rate Chart</Text>
        </View>
    );
}