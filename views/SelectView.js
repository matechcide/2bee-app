import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MyButton from "../components/MyButton"
import MyRequest from "../components/MyRequest"

export default function SelectView({ route, navigation }){
    const [info, onInfoChange] = React.useState(this.error)
    const [sq, sqChange] = React.useState("")
    const [sc, scChange] = React.useState("")
    const token = this.token

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {e.preventDefault();})
        const unsubscribe = navigation.addListener('focus', async () => {
            this.currentScreen = "SelectView"
            if(this.error == ""){
                onInfoChange("")
            }
            this.error = ""
            let rep = await MyRequest("Queue", "GET")
            if(rep.statut == "error"){
                this.error = rep.info
                navigation.push('FirstView')
                return
            }
            sqChange(rep.info.sr)
            scChange(rep.info.sq)
        });
        return unsubscribe;
    }, [navigation])
    
    return(
        <View style={styles.container}>
            <MyButton
                title="Poser une question"
                preSet="blue"
                onPress={() => {
                  navigation.push('QuestionView')
                }}
            />
            <Text style={styles.label}>{sq}</Text>

            <MyButton
                title="Répondre a une question"
                preSet="blue"
                marginTop={100}
                onPress={() => {
                    this.socket.emit('searchQuestions', this.ticket)
                    this.tempFunction = () => {
                        this.socket.emit("quitWaiting", this.ticket)
                        navigation.push('HomeView')
                    }
                    navigation.push('WaitingView', {
                        "info": "Recherche d'une question."
                    })
                }}
            />
            <Text style={styles.label}>{sc}</Text>
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
    info:{
        color: 'red',
        marginTop: 10,
        textAlign: "center"
    },
    label:{
        marginTop: 10,
        color: "#fff",
        marginTop: 10,
        textAlign: "center"
    }
});