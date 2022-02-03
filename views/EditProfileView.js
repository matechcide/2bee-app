import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions, TextInput, TouchableHighlight, KeyboardAvoidingView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import MyRequest from "../components/MyRequest"

export default function EditProfileView({ route, navigation }){
    
    this.currentScreen = "EditProfileView"
    const [linkPhoto, clinkPhoto] = React.useState("https://2bee.gq/public/images/waiting.gif")
    const [info, cinfo] = React.useState([...route.params.list])
    const [editButton, ceditButton] = React.useState([...["Edite"]])

    let count = 0

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
            base64: true
        });
        if(!result.cancelled){
            if(result.type != "image"){
                Alert.alert(
                    "Mauvais format de fichier",
                    "Choisissez une image.",
                    [
                        { 
                            text: "OK",
                            onPress: () => {}
                        }
                    ]
                    
                )
                return
            }
            Alert.alert(
                "En cours d'envoi",
                "Cela peut prendre du temps.",
                [
                    { 
                        text: "OK",
                        onPress: () => {}
                    }
                ]
                
            )
            const rep = await MyRequest("Image", "POST", result)

            if(rep.statut == "error") {
                this.error = rep.info
                navigation.push('FirstView')
            }
        }
    }

    React.useEffect(() => {
        (async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if(status !== 'granted'){
                    navigation.push('HomeView')
                }
            }
        )();
    }, []);

    return(
        <KeyboardAvoidingView 
            style={{position: "absolute", width: "100%", height: "100%"}}
            behavior={Platform.OS === "ios" ? "padding" : null}
            >
            <ScrollView 
                style={styles.container} 
                onScroll={(e) => {
                    if(e.nativeEvent.contentOffset.y == 0){
                        ceditButton([...["Edite"]])
                    }
                    else if(editButton[0] != ""){
                        ceditButton([...[""]])
                    }
                }}
            >
                <TouchableHighlight style={styles.imageView} onPress={pickImage} underlayColor="#ffffff">
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.pdp}
                            source={{uri: linkPhoto}}
                        />
                    </View>
                </TouchableHighlight>
                {info.map((item) => {
                    let length = 144
                    let multiline = true
                    if(item.title == "Pseudo"){
                        length = 12
                        multiline = false
                    }
                    count++
                    let key = count
                    return(
                        <View key={key} style={styles.infoView}>
                            <Text style={styles.titleInfo}>{item.title} :</Text>
                            <TextInput 
                                style={styles.textBar} 
                                multiline={multiline} 
                                maxLength={length}
                                minL
                                onChangeText={(text) => {
                                    let temp = info
                                    temp[key-1] = {"title": item.title, "text":text}
                                    cinfo([...temp])
                                }}
                            >
                                {item.text}
                            </TextInput>
                        </View>
                    )
                })}
            </ScrollView>
            {editButton.map((item) => {
                if(item != ""){
                    return(
                        <TouchableHighlight
                            key="1" 
                            style={{
                                flex: 1, 
                                position: "absolute", 
                                left: 0, 
                                right: 0,
                                borderTopRightRadius: 20,
                                borderTopLeftRadius: 20,
                                backgroundColor: "#2ecc71",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 50,
                                bottom: 0
                            }}
                            onPress={async ()=>{
                                const rep = await MyRequest("Profile", "POST", info)
                                if(rep.statut == "error"){
                                    this.error = rep.info
                                    navigation.push('FirstView')
                                } 
                                navigation.goBack()
                            }} 
                            underlayColor="#ffffff"
                            activeOpacity={0.7}
                        >
                            <View style={{}}>
                                <Text style={{color: "#fff", fontSize: 20}}>
                                    sauvegarder
                                </Text>
                            </View>
                        </TouchableHighlight>
                    )
                }
            })}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: '#2c3e50',
    },
    imageView:{
        flex: 1,
        width: "100%",
        height: Dimensions.get("window").width,
        top: 0,
        backgroundColor: '#2c3e50',
        alignItems: "center",
        justifyContent: "center"
    },
    imageContainer:{
        height: "90%",
        width: "90%",
        borderRadius: 40,
        overflow: "hidden",
        borderWidth: 5,
        borderColor: 'gray'
    },
    pdp:{
        height: "100%",
        width: "100%",
        borderRadius: 20,
        borderWidth: 5,
        borderColor: 'gray'
    },
    infoView:{
        flex: 1,
        alignItems: "center",
        padding: 5,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    titleInfo:{
        backgroundColor: "#25b6d2", 
        color: "#fff", 
        padding: 5, 
        borderRadius: 10,
        fontSize: 20,
        marginBottom: 10
    },
    textBar:{
        borderRadius: 20,
        width: 300,
        height: 100,
        padding: 10,
        backgroundColor: "#fff"
    }
});