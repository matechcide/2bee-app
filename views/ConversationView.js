import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableHighlight, Alert, Image, DeviceEventEmitter } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import MyRequest from "../components/MyRequest"

export default function ConversationView({ route, navigation }){
    
    const [contact, ccontact] = React.useState([])

    React.useEffect(() => {

        navigation.addListener('beforeRemove', (e) => {e.preventDefault();})

        DeviceEventEmitter.addListener("refresh", async ()=> {
            if(this.currentScreen != "ConversationView"){
                return
            }
            let rep = await MyRequest("GetConv", "GET")
            if(rep.statut == "error"){
                this.error = rep.info
                navigation.push('FirstView')
                return
            }
            this.conversation = rep.info.reverse()
            this._conversation = new Object()
            ccontact([])
            for (const item of this.conversation){
                if(!this.story[item]){
                    this.story[item] = {
                        "lastMessage": 0
                    }
                }
                if(this.currentScreen != "ConversationView"){
                    return
                }
                if(!this.listUsers[item]){
                    this.listUsers[item] = {
                        "messages": [],
                        "lastMessage": "",
                        "pseudo": "",
                        "infoConv": {}
                    }
                }
                ccontact(temp => [...temp, item])
                if(!rep.last || this.listUsers[item].lastMessage == "" || !rep.last[item] || this.listUsers[item].lastMessage != rep.last[item] || this.listUsers[item].lastMessage == ""){
                    (async function(){
                        let msgs = await MyRequest("GetMessage", "POST", {"user1": item, "user2": this.id})
                        if(msgs.statut == "error"){
                            this.error = msgs.info
                            navigation.push('FirstView')
                            return
                        }
                        else if(msgs.info == "empty"){
                            this.conversation = this.conversation.filter( x=> x != item);
                            delete this.story[item]
                            temp = JSON.stringify(this.story)
                            await SecureStore.setItemAsync("story", temp);
                            delete this.listUsers[item]
                            this._conversation[item]()
                            return
                        }
                        this.listUsers[item].messages = msgs.info.messages
                        this.listUsers[item].infoConv = {
                            [item]: msgs.info[item + " XP"],
                            [this.id]: msgs.info[this.id + " XP"],
                            "lvl": msgs.info.lvl
                        }
                        if(rep.last && rep.last[item]){
                            this.listUsers[item].lastMessage = rep.last[item]
                        }

                        let name = await MyRequest("GetProfile", "POST", {"user": item, "info": "Pseudo", "custom": true})
                        this.listUsers[item].pseudo = name.info.list[0]["text"]

                        if(this.currentScreen == "ConversationView"){
                            this._conversation[item]()
                        }
                    })();
                }
            }
            if(!this.conversation[0]){
                ccontact(["empty"])
                return
            }
        })

        const unsubscribe = navigation.addListener('focus',() => {
            this.currentScreen = "ConversationView"
            this.temp = true
            DeviceEventEmitter.emit('refresh');
            
        });

        return unsubscribe;
    }, [navigation])

    return(
        <View style={styles.container}>
            <ScrollView style={styles.scroll}>
                {
                    contact.map((item)=>{
                        if(item == "empty"){
                            return(
                                <Text key="1" style={{alignSelf: "center", color: "#fff"}}>Vous n'avez pas de conversation.</Text>
                            )
                        }
                        return(
                            <ConversationObject key={item} user={item} navigation={navigation}/>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

const ConversationObject = (props) => {
    const [r, cr] = React.useState(null)
    
    React.useEffect(() => {
        this._conversation[props.user] = () => {
            cr("")
        }
    }, []);

    if(!this.listUsers[props.user].messages[0]){
        return(
            <View style={[styles.tconview]}>
                <View style={[styles.conview]}>
                    <Image style={styles.waitGif} source={{uri: "https://2bee.gq/public/images/waiting1.gif"}}/>
                </View>
            </View>
        )
    }
    else if(!this.listUsers[props.user]){
        return null
    }
    else if(this.listUsers[props.user].messages[0]){
        let last = {}
        if((this.story[props.user]["lastMessage"] != this.listUsers[props.user].messages[this.listUsers[props.user].messages.length-1][2] && this.listUsers[props.user].messages[this.listUsers[props.user].messages.length-1][1] == this.id && Number.isInteger(this.listUsers[props.user].lastMessage)) || (!Number.isInteger(this.listUsers[props.user].lastMessage) && this.listUsers[props.user].lastMessage != this.story[props.user]["lastMessage"] )){
            last = {fontSize: 16, color: "#fff"}
        }
        
        let lastMsg

        if(Number.isInteger(this.listUsers[props.user].lastMessage)){
            lastMsg = this.listUsers[props.user].messages[this.listUsers[props.user].messages.length-1][0]
            if(lastMsg.length > 40){
                lastMsg = lastMsg.substring(0, 37) + "..."
            }
        }
        else{
            lastMsg = "Réaction a un message"
        }

        return(
            <TouchableHighlight
                style={styles.tconview}
                onPress={async ()=>{
                    if(!this.temp) return
                    this.temp = false
                    if(!Number.isInteger(this.listUsers[props.user].lastMessage)){
                        this.story[props.user]["lastMessage"] = this.listUsers[props.user].lastMessage
                        let temp = JSON.stringify(this.story)
                        await SecureStore.setItemAsync("story", temp);
                    }
                    else{
                        this.story[props.user]["lastMessage"] = this.listUsers[props.user].messages[this.listUsers[props.user].messages.length-1][2]
                        let temp = JSON.stringify(this.story)
                        await SecureStore.setItemAsync("story", temp);
                    }
                    props.navigation.push("MessageViewC", {"question": "", "user": props.user, "messages": this.listUsers[props.user].messages, "info": this.listUsers[props.user].infoConv});
                }}
                activeOpacity={0.7}
                onLongPress={()=>{
                    Alert.alert(
                        "Suprimé la Conversation ?",
                        "Il n'y aura pas de retour en arrière.",
                        [
                            { 
                                text: "OUI",
                                onPress: () => {
                                    this.socket.emit('kick', this.ticket, props.user, this.id )
                                    this.conversation = this.conversation.filter( x=> x != props.user);
                                    this.error = "Vous venez de suprimé " + this.listUsers[props.user].pseudo
                                    delete this.infoUsers[props.user]
                                    props.navigation.push('HomeView')
                                }
                            },
                            { 
                                text: "NON",
                                onPress: () => {}
                            },
                        ]
                        
                    )
                }}
            >
                <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#34495e"}}>
                    <View style={[styles.conview]}>
                        <View style={styles.viewname}>
                            <Text style={{fontSize: 20, color: "#fff"}}>{this.listUsers[props.user].pseudo}</Text>
                        </View>
                        <View style={styles.viewlastmessage}>
                            <Text style={[{fontSize: 15, color: "gray"},last]}>{lastMsg}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "center", marginTop: 10, marginRight: 10}}>
                        <Text style={{fontSize: 20, color:"#fff"}}>{this.listUsers[props.user].infoConv.lvl}</Text>
                        <Image style={{width: 30, height: 30}} source={{uri: "https://2bee.gq/public/images/icon.png"}}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        top: 0,
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: '#2c3e50',
    },
    scroll:{
        flex: 1,
        flexDirection: "column",
        width: "100%",
        marginTop: 30
    },
    tconview:{
        backgroundColor: "#34495e",
        height: 70,
        margin: 5,
        borderRadius: 20,
        overflow: "hidden",
    },
    conview:{
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        
    },
    viewname:{
        marginLeft: 20,
        alignItems:"center",
    },
    viewlastmessage:{
        marginLeft: 20,
        alignItems:"center",
    },
    waitGif:{
        width: 70,
        height: 70, 
        alignSelf: "center",
        justifyContent: "center"
    },
});