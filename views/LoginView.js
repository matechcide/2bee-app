import React from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView,  TextInput, Text, TouchableHighlight } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import MyButton from "../components/MyButton"
import BackButton from "../components/BackButton"
import MyRequest from "../components/MyRequest"
import MySocket from "../components/MySocket"

export default function LoginView({ route, navigation }){
    
    const [email, onEmailChange] = React.useState('')
    const [pwd, onPwdChange] = React.useState('')
    const [info, onInfoChange] = React.useState(this.error)

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {

            let temp = true

            this.tempFunction = async (email, pwd, onInfoChange) => {
                if(email.length < 1 || pwd.length < 1){onInfoChange("Veuillez remplir tous les champs."); return;}
                if(pwd.length < 7){onInfoChange("Les mot de passe contienne\nau moins 8 caractères."); return;}
                if(temp == false){onInfoChange("Attendez une réponse du serveur."); return;}
                temp = false
                this.token = ""
                onInfoChange("En attente d'une réponse.")
                const rep = await MyRequest("ConnectAccount", "POST", {"email": email, "pwd": pwd})
                if(rep.statut == "error"){onInfoChange(rep.info); temp = true; return;}
                if(rep.statut == "successful"){
                    this.socketId = await MySocket(navigation)
                    this.id = rep.id
                    this.socket.emit('login', rep.token)
                    this.token = rep.token
                    this.ticket = [this.token, this.deviceID, this.socketId, this.id]
                    this.listUsers = {}
                    this.conversation = rep.conv
                    navigation.push('HomeView')
                    for (const item of this.conversation){
                        this.listUsers[item] = {
                            "messages": [],
                            "lastMessage": "",
                            "pseudo": "",
                            "infoConv": {}
                        }
                    }
                    await SecureStore.setItemAsync("log", `${email} |!| ${pwd}`);
                    setTimeout(() => {
                        temp = true;
                    }, 500);
                }
            }

            if(route.params && route.params.log && route.params.log != ' |!| '){
                let split = route.params.log.split(' |!| ')
                onEmailChange(split[0])
                onPwdChange(split[1])
                if(this.error == ""){
                    this.tempFunction(split[0], split[1], onInfoChange)
                }
                this.error = ""
            }

        });
        return unsubscribe;
    }, [navigation])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}>
            <BackButton navigation={navigation} />
            <TextInput
                style={styles.email}
                maxLength={50}
                placeholder="Email"
                onChangeText={text => onEmailChange(text)}
            >
                {email}
            </TextInput>
            <TextInput
                style={styles.password}
                secureTextEntry={true}
                maxLength={30}
                placeholder="Mot de passe"
                onChangeText={text => onPwdChange(text)}
            >
                {pwd}
            </TextInput>
            <MyButton
                title="Se connecter"
                preSet="blue"
                fontSize={15}
                padding={7}
                onPress={() => {
                    this.tempFunction(email, pwd, onInfoChange)
                }}
            />
            <Text style={styles.info}>{info}</Text>
            <TouchableHighlight
                style={styles.tmdpo}
                pressColor="#2c3e50"
                activeOpacity={1}
                onPress={()=> navigation.push('ForgetPasswordView') }
                
            >
                <Text style={styles.textmdpo}>
                    Mot de passe oublié ?
                </Text>
            </TouchableHighlight>
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
    password:{
        padding: 5,
        borderRadius: 20,
        marginBottom: 90,
        width: 300,
        textAlign: "center",
        backgroundColor: "#fff"
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
    tmdpo:{
        marginTop: 10,
        color: '#2c3e50'
    },
    textmdpo:{
        color: "#25b6d2"
    }
  });