import React from 'react';
import { StyleSheet, View, TextInput, Text, Alert } from 'react-native';

import MyButton from "../components/MyButton"
import BackButton from "../components/BackButton"
import MyRequest from "../components/MyRequest"

export default function RegisterView({ navigation }){

    let temp = true;

    async function send(email, pwd, cpwd, onInfoChange) {
        if(email.length < 1 || pwd.length < 1 || cpwd.length < 1){onInfoChange("Veuillez remplir tous les champs."); return;}
        if(pwd.length < 7 || cpwd.length < 7){onInfoChange("Votre mot de passe doit contenir\nau moins 8 caractères."); return;}
        if(pwd.length !== cpwd.length ){onInfoChange("Vos mot de passe ne correspond pas."); return;}
        if(temp == false){onInfoChange("Attendez une réponse du serveur."); return;}
        temp = false
        const rep = await MyRequest("CreateAccount", "POST", {"email": email, "pwd": pwd}, "")
        temp = true
        if(rep.statut == "error"){onInfoChange(rep.info); return;}
        if(rep.statut == "successful"){
            Alert.alert(
                "Validation",
                rep.info,
                [
                    { 
                        text: "OK",
                        onPress: () => navigation.push('LoginView', {"log": email + " |!| " + pwd})
                    }
                ]
                
            )
        }
    }

    const [email, onEmailChange] = React.useState("")
    const [pwd, onPwdChange] = React.useState("")
    const [cpwd, onCpwdChange] = React.useState("")
    const [info, onInfoChange] = React.useState("")

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <TextInput
                style={styles.email}
                maxLength={50}
                placeholder="Email"
                onChangeText={text => onEmailChange(text)}
            >
                
            </TextInput>
            <TextInput
                style={styles.password}
                secureTextEntry={true}
                maxLength={30}
                placeholder="Mot de passe"
                onChangeText={text => onPwdChange(text)}
            >
                
            </TextInput>
            <TextInput
                style={styles.confirm}
                secureTextEntry={true}
                maxLength={30}
                placeholder="Confirmation"
                onChangeText={text => onCpwdChange(text)}
            >
                
            </TextInput>
            <MyButton
                title="Créer un compte"
                preSet="blue"
                fontSize={15}
                padding={7}
                onPress={() => {
                    send(email, pwd, cpwd, onInfoChange)
                }}
            />
            <Text style={styles.info}>{info}</Text>
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
    password:{
        padding: 5,
        borderRadius: 20,
        marginBottom: 20,
        width: 300,
        textAlign: "center",
        backgroundColor: "#fff"
    },
    confirm:{
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
        marginBottom: 50,
        width: 300,
        textAlign: "center",
        backgroundColor: "#fff"
    },
    info:{
        color: 'red',
        marginTop: 10,
        textAlign: "center"
    }
});