import React from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView, TouchableHighlight, Text, View, Platform } from 'react-native';

import BackButton from "../components/BackButton"
import MyRequest from "../components/MyRequest"

export default function ForgetPasswordView({ navigation }){
    
    const [email, onEmailChange] = React.useState('')
    const [info, onInfoChange] = React.useState("")

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {

            let temp = true

            this.tempFunction = async (email) => {
                if(email.length < 1){onInfoChange("Veuillez remplir tous les champs."); return;}
                if(temp == false){onInfoChange("Attendez une réponse du serveur."); return;}
                temp = false
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
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}
        >
            <BackButton navigation={navigation} />
            <TextInput
                style={styles.email}
                maxLength={50}
                placeholder="Email"
                onChangeText={text => onEmailChange(text)}
            >
                {email}
            </TextInput>
            <TouchableHighlight
                style={styles.tutch}
                onPress={()=> this.tempFunction(email)}
                pressColor='#2c3e50'
                activeOpacity={0.7}
            >
                <View style={styles.button}>
                    <Text style={styles.textbutton}>Réinitialiser le mot de passe</Text>
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
    email:{
        padding: 5,
        borderRadius: 20,
        marginBottom: 40,
        width: 300,
        textAlign: "center",
        backgroundColor: "#fff"
    },
    info:{
        color: 'red',
        marginTop: 10,
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