import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions, TouchableHighlight } from 'react-native';

import MyRequest from "../components/MyRequest"

export default function ProfileView({ route, navigation }){
    
    const [info, cinfo] = React.useState([])
    const [editButton, ceditButton] = React.useState([...["Edite"]])

    const token = this.token

    let count = 0

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {e.preventDefault();})
        const unsubscribe = navigation.addListener('focus', () => {
            this.currentScreen = "ProfileView"
            async function update(){
                const rep = await MyRequest("Profile", "GET", {})
                if(rep.statut == "error"){
                    this.error = rep.info
                    navigation.push('FirstView')
                }
                cinfo([])
                count = 0
                cinfo([...rep.info])
            }
            update()
            this.linkPhoto = "https://2bee.gq/Image?token=" + token + "&random=" + `${Date.now()}` + Math.random(0).toString(36).substr(2)
            navigation.addListener('beforeRemove', (e) => {e.preventDefault();}) 
        });
      
        return unsubscribe;
        
    }, [navigation])

    return(
        <View style={{position: "absolute", width: "100%", height: "100%"}}>
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
                <View style={styles.imageView}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.pdp}
                            source={{uri: this.linkPhoto}}
                        />
                    </View>
                </View>
                {info.map((item) => {
                    count++
                    return(
                        <View key={count} style={styles.infoView}>
                            <Text style={styles.titleInfo}>{item.title} :</Text>
                            <Text style={styles.info}>{item.text}</Text>
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
                            onPress={()=>{
                                navigation.push('EditProfileView', {"list": info})
                            }} 
                            underlayColor='#2c3e50'
                            activeOpacity={0.7}
                        >
                            <View style={{}}>
                                <Text style={{color: '#fff', fontSize: 20}}>
                                    Edite
                                </Text>
                            </View>
                        </TouchableHighlight>
                    )
                }
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        position: "absolute",
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
        overflow: "hidden"
    },
    pdp:{
        height: "100%",
        width: "100%"
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
        fontSize: 20
    },
    info:{
        fontSize: 15,
        color: "#fff"
    }
});