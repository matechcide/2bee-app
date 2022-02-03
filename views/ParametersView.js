import React from 'react';
import { StyleSheet, KeyboardAvoidingView, TouchableHighlight, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import MyRequest from "../components/MyRequest"

export default function ParametersView({ navigation }){
    
    const [info, onInfoChange] = React.useState("")

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {

            this.currentScreen = "ParametersView"
            let temp = true

            this.tempFunction = async () => {
                if(temp == false){onInfoChange("Attendez une réponse du serveur."); return;}
                temp = false
                let email = await SecureStore.getItemAsync("log")
                email = email.split(" |!| ")[0]
                onInfoChange("En attente d'une réponse.")
                const rep = await MyRequest("Parameters", "POST", {"action": "forgetPassword", "email": email})
                onInfoChange(rep.info)
                temp = true
            }

        });
        return unsubscribe;
    }, [navigation])

    return(
        <KeyboardAvoidingView
            style={styles.container}
        >
             <TouchableHighlight
                style={styles.tutch}
                onPress={async ()=> {
                    this.tempFunction()
                }}
                pressColor='#2c3e50'
                activeOpacity={0.7}
            >
                <View style={styles.button}>
                    <Text style={styles.textbutton}>Changer votre mot de passe</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight
                style={[styles.tutch, {top: 20}]}
                onPress={async ()=> {
                    await SecureStore.setItemAsync("log", ` |!| `);
                    navigation.push('FirstView')
                    this.socket.removeAllListeners();
                    delete this.socket
                }}
                pressColor='#2c3e50'
                activeOpacity={0.7}
            >
                <View style={styles.button}>
                    <Text style={styles.textbutton}>Déconnexion</Text>
                </View>
            </TouchableHighlight>
            <Text style={styles.info}>{info}</Text>
        </KeyboardAvoidingView>
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
    info:{
        color: 'red',
        marginTop: 30,
        textAlign: "center"
    },
    tutch:{
        borderRadius: 15,
    },
    button:{
        backgroundColor:"#2ecc71",
        padding: 8,
        borderRadius: 15,
    }, 
    textbutton:{
        color: "#fff"
    }
})