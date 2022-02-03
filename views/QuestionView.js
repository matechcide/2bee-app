import React from 'react';
import { StyleSheet, KeyboardAvoidingView, TextInput } from 'react-native';

import MyButton from "../components/MyButton"
import BackButton from "../components/BackButton"

export default function QuestionView({ route, navigation }){
    
    const [question, changeQuestion] = React.useState("")
    const token = this.token

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            this.currentScreen = "QuestionView"
        });
        return unsubscribe;
    }, [navigation])

    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : null}
            >
            <BackButton navigation={navigation} />
            <TextInput
                style={styles.question}
                maxLength={144}
                placeholder="Pourquoi le ciel est bleu ?"
                onChangeText={text => changeQuestion(text)}
            >

            </TextInput>
            <MyButton
                title="Poser la question"
                preSet="blue"
                onPress={async () => {
                    if(question.length < 1) return
                    this.socket.emit('putQuestion', this.ticket, question)
                    this.tempFunction = () => {
                        this.socket.emit("quitWaiting", this.ticket)
                        navigation.push('HomeView')
                    }
                    navigation.push('WaitingView', {
                        "info": "Recherche d'un répondeur."
                    })
                }}
            />
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
    question:{
        padding: 5,
        borderRadius: 20,
        marginBottom: 40,
        width: 300,
        textAlign: "center",
        backgroundColor: "#fff"
    }
});