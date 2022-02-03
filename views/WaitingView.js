import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import BackButton from "../components/BackButton"

export default function WaitingView({ route, navigation }){
    
    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {this.tempFunction();})
        const unsubscribe = navigation.addListener('focus', async () => {
            this.currentScreen = "WaitingView"
        });
        return unsubscribe;
    }, [navigation])

    return(
        <View style={styles.container}>
            <BackButton
                thisPage={this.tempFunction}
            />
            <Text style={{color: "#fff"}}>{route.params.info}</Text>
            <Image 
                source={{uri: "https://2bee.gq/public/images/waiting.gif"}}
                style={styles.image}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#2c3e50',
        alignItems: 'center',
        justifyContent: "center"
    },
    image: {
        marginTop: 80,
        width: 100,
        height: 100
    }
});