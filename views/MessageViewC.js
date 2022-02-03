import react from 'react';
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, KeyboardAvoidingView, TouchableHighlight, DeviceEventEmitter, Alert, Platform, LogBox, Image } from 'react-native';
import Drawer from 'react-native-drawer'
import * as SecureStore from 'expo-secure-store';

import BackButton from "../components/BackButton"
import MyRequest from "../components/MyRequest"

export default function MessageViewC({ route, navigation }){
    LogBox.ignoreAllLogs(true)
    const [listInfo, clistInfo] = react.useState([
        {"title":"Pseudo","text":""},
        {"title":"Votre devise","text":""},
        {"title":"Sports","text":""},
        {"title":"Etude/Profession","text":""},
        {"title":"Jeux vidéos","text":""},
        {"title":"Autres activités","text":""},
        {"title":"Films appréciés","text":""},
        {"title":"Séries appréciées","text":""},
        {"title":"Meilleur voyage","text":""},
        {"title":"Endroit à découvrir","text":""},
        {"title":"Chose à faire avant de mourrir","text":""},
        {"title":"Anecdote rigolotte","text":""},
        {"title":"Blague préférée","text":""},
        {"title":"Mes activitées de hors la loi","text":""},
        {"title":"Réseau le plus utilisé","text":""},
        {"title":"Mouvements soutenus","text":""},
        {"title":"Avis politique","text":""},
        {"title":"Age","text":""},
        {"title":"Sexe","text":""},
        {"title":"Prénom","text":""},
        {"title":"Genre","text":""}
    ])

    const [messageList, addMassage] = react.useState([])
    const [textMassage, changetm] = react.useState("")
    const [xpHim, cxpHim] = react.useState(0)
    const [xpYou, cxpYou] = react.useState(0)
    const [lvl, clvl] = react.useState(0)
    const [textInputMaxLength, ctextInputMaxLength] = react.useState(250)
    const [textInputPlaceholder, ctextInputPlaceholder] = react.useState("Message...")
    
    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if(this._drawer._open){
                e.preventDefault();
                this._drawer.close()
                return
            }
            if(this._textInput.react){
                e.preventDefault();
                this._messages[this._textInput.react]("")
                delete this._textInput.react
                this._textInput.maxLength(250)
                this._textInput.placeholder("Message...")
                return
            }
            delete this._drawer
            this._messages = new Object()
            delete this._textInput
            this.user = ""
            DeviceEventEmitter.removeListener("message");
        })
        const unsubscribe = navigation.addListener('focus', () => {
            this.alert = false
            this.currentScreen = "MessageView"
            let constante = 500
            let niv = 0
            this.temporisation = true
            this._messages = new Object()
            this._textInput.maxLength = (arg)=>{ctextInputMaxLength(arg)}
            this._textInput.placeholder = (arg)=>{ctextInputPlaceholder(arg)}
            this.user = route.params.user
            DeviceEventEmitter.addListener("message", async (message, info)=> {
                if(!info){
                    this.error = "l'utilisateur a quitté la conversation."
                    navigation.push('HomeView')
                    return
                }
                if(message[2] == "react"){
                    this._messages[message[0][1]](message[0][0])
                    return
                }
                if(niv != info[0]){
                    const rep = await MyRequest("GetProfile", "POST", {"user1": this.user, "user2": this.id})
                    if(rep.statut == "error"){
                        this.error = rep.info
                        navigation.push('FirstView')
                        return
                    }
                    let list = listInfo
                    list.splice(0, info[0])
                    clistInfo([...rep.info, ...list])
                    clvl(info[0])
                    niv = info[0]
                }
                if(info[1][0] == this.id){
                    cxpYou(info[1][1]*100/(300+niv*constante))
                    cxpHim(info[2][1]*100/(300+niv*constante))
                }
                else{
                    cxpYou(info[2][1]*100/(300+niv*constante))
                    cxpHim(info[1][1]*100/(300+niv*constante))
                }
                if(message != ""){
                    addMassage( temp => [...temp, message])
                }
                setTimeout(() => {
                    this.myScroll.scrollToEnd();
                }, 100);
            })
            niv = route.params.info.lvl
            clvl(niv)
            cxpYou(route.params.info[this.id]*100/(300+niv*constante))
            cxpHim(route.params.info[this.user]*100/(300+niv*constante))
            for(const message of route.params.messages){
                addMassage( temp => [...temp, message])
            }
            setTimeout(() => {
                this.myScroll.scrollToEnd({ animated: false });
            }, 100);
            (async () => {
                const rep = await MyRequest("GetProfile", "POST", {"user1": this.user, "user2": this.id})
                if(rep.statut == "error"){
                    this.error = rep.info
                    navigation.push('FirstView')
                    return
                }
                let list = listInfo
                list.splice(0, niv)
                clistInfo([...rep.info, ...list])
            })()
        });
        return unsubscribe;
    }, [navigation])

    function send(){
        if(this._textInput.react){
            this._textInput.maxLength(250)
            this._textInput.placeholder("Message...")
            this._textInput.ref.clear()
            this.socket.emit('reactMessage', this.ticket, this.user, [textMassage, this._textInput.react], this.id)
            delete this._textInput.react
        }
        else if(textMassage != "" && this.temporisation && textMassage.replace(/ /g,"").length > 0){
            this._textInput.ref.clear()
            this.socket.emit('sendMessage', this.ticket, this.user, textMassage, this.id)
            this.temporisation = false
            setTimeout(() => {
                this.temporisation = true
            }, 1000);
        }
    }
    
    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.container}
        >
            <Drawer
                ref={(ref) => {this._drawer = ref}}
                openDrawerOffset={0}
                content={
                    <View style={{width: "100%", height: "100%"}}>
                        <ScrollView style={{backgroundColor: '#2c3e50', flex: 1, flexDirection: "column", marginLeft: 10, marginTop: 30}}>
                            <TouchableHighlight 
                                style={{flex: 1, flexDirection: "row", marginBottom: 5, marginTop: 15}}
                                onPress={()=>{
                                    this._drawer.close()
                                }}
                                underlayColor="#2c3e50"
                                activeOpacity={0.7}
                                >
                                <View style={{flex: 1, flexDirection: "row", marginBottom: 5}}>
                                    <View style={{marginLeft: 10, flex: 1, flexDirection: "column"}}>
                                        <Text style={{fontSize: 30, color: "#fff"}}>Retourn</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            {listInfo.map((item) => {
                                    let key = listInfo.indexOf(item)+1
                                    let color
                                    if(key <= lvl){
                                        color = "#2ecc71"
                                    }
                                    else{
                                        color = "gray"
                                    }
                                    return(
                                        <View key={key} style={{flex: 1, flexDirection: "row", marginBottom: 5}}>
                                            <View style={{minHeight: 40, width: 15, backgroundColor: color, borderRadius: 5}}>
                                            </View>
                                            <View style={{marginLeft: 10, flex: 1, flexDirection: "column"}}>
                                                <Text style={{fontSize: 20, color: "#fff"}}>{item.title}:</Text>
                                                <Text style={{color: "#fff"}}>{item.text}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                                <View style={{flex: 1, flexDirection: "column", marginBottom: 5, alignItems: "center", alignSelf: "center"}}>
                                    <Text style={{fontSize: 20, color: "#fff"}}>Photo:</Text>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            style={styles.pdp}
                                            source={{uri: "https://2bee.gq/Image?token=" + this.token + "&random=" + `${Date.now()}` + Math.random(0).toString(36).substr(2) + "&user1=" + this.user + "&user2=" + this.id}}
                                        />
                                    </View>
                                </View>
                        </ScrollView>
                    </View>
                }
                tweenHandler={Drawer.tweenPresets.parallax}
            >
                <View
                    style={styles.container}
                    >
                    <TouchableHighlight 
                        underlayColor="#2c3e50"
                        activeOpacity={0.7}
                        style={[styles.lvlView]}
                        onPress={() => {
                            if(this._textInput.react){
                                this._messages[this._textInput.react]("")
                                delete this._textInput.react
                                this._textInput.maxLength(250)
                                this._textInput.placeholder("Message...")
                            }
                            this._drawer.open()
                            this._textInput.ref.blur()
                        }}
                        >
                        <View style={{height:"100%", width:"100%", flex: 1, flexDirection: "row"}}>
                            <View style={styles.xpBar}>
                                <View style={{
                                    backgroundColor:"#fff",
                                    height: "51%",
                                    width: `${xpHim}` + "%",
                                }}>
                                
                                </View>
                                <View style={{
                                    backgroundColor:"#fff",
                                    height: "51%",
                                    width: `${xpYou}` + "%",
                                }}>
                                
                                </View>
                            </View>
                            <View style={styles.lvl}>
                                <Text style={styles.textLvl}>{lvl}</Text>
                            </View>
                            <View style={{marginRight: 10}}>
                                <Image style={{width: 30, height: 30}} source={{uri: "https://2bee.gq/public/images/icon.png"}}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <ScrollView style={[styles.scrollView]} ref={(ref) => this.myScroll = ref}>
                        {messageList.map((message) => {
                            if(message[1] == this.user){
                                return(
                                    <MessageObject key={message[2]} style={styles.you} message={message} FC={"#000"} BG={"#D1DADD"} />
                                )
                            }
                            else{
                                return(
                                    <MessageObject key={message[2]} style={styles.him} message={message} FC={"#fff"} BG={"#25b6d2"} />
                                )
                            }
                            
                        })}
                    </ScrollView>
                    <TextInput
                        style={styles.textBar}
                        ref={(ref) => { 
                            if(!this._textInput){
                                this._textInput = new Object()
                            }
                            this._textInput.ref = ref; 
                        }}
                        maxLength={textInputMaxLength}
                        placeholder={textInputPlaceholder}
                        onChangeText={text => {changetm(text);}}
                        onFocus={()=>{
                            setTimeout(() => {
                                this.myScroll.scrollToEnd({ animated: false });
                            }, 500);
                        }}
                    >
                    </TextInput>
                    <TouchableHighlight
                        style={styles.viewButton}
                        onPress={()=>send()} 
                        underlayColor='#2c3e50'
                        activeOpacity={0.7}
                    >
                        <View style={styles.button}>

                            <Text style={styles.textButton}>
                                Envoyer
                            </Text>

                        </View>
                    </TouchableHighlight>
                    <BackButton thisPage={()=>{
                        navigation.goBack()
                    }}/>
                </View>
            </Drawer>
       </KeyboardAvoidingView>
    );
}

const MessageObject = (props) => {
    const [react, onReact] = React.useState(props.message[3])
    const [content, onContent] = React.useState(props.message[0])

    this._messages[props.message[2]] = (arg) =>{
        onReact(arg)
    }

    return(
        <View style={props.style}>
            
            <TouchableHighlight
                style={{maxWidth: "85%", borderRadius: 15}}
                onLongPress={()=>{
                    if (props.message[1] != this.user) {
                        if(this._textInput.react){
                            this._messages[this._textInput.react]("")
                        }
                        this._textInput.react = props.message[2]
                        this._messages[props.message[2]]("Ecrie ta réaction...")
                        this._textInput.maxLength(3)
                        this._textInput.placeholder("Reaction...")
                        this._textInput.ref.focus();
                    }
                    
                }}
                activeOpacity={0.7}
            >
                <View style={{padding: 10, backgroundColor: props.BG, borderRadius: 15}}>
                    <Text style={{color: props.FC}}>{content}</Text>
                </View>
            </TouchableHighlight>

            <View style={{alignSelf:"flex-end", margin: -5}}>
                <Text style={{color: "#fff"}}>{react}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c3e50',
        flexDirection: "column",
        height: "100%",
        width: "100%"
    },
    text1:{
        textAlign: "center",
        marginTop: 50,
        fontSize: 20,
        color: "#25b6d2"
    },
    scrollView: {
        flex: 1,
        flexDirection: "column",
        position: "absolute",
        backgroundColor: '#2c3e50',
        bottom: 60,
        top: 115,
        left: 5,
        right: 5
    },
    containerText: {
        position: "absolute",
        flexDirection: "row",
        backgroundColor: '#fff',
        bottom: 10,
        width: "100%"
    },
    textBar:{
        position: "absolute",
        padding: 5,
        borderRadius: 20,
        height: 40,
        left: 10,
        bottom: 10,
        right: 100,
        backgroundColor: "#fff"
    },
    you:{
        flex: 1,
        alignItems: "flex-end",
        flexDirection: "row-reverse",
        marginTop: 0,
        marginRight:0,
        marginBottom: 5,
        borderRadius: 15
    },
    him:{
        flex:1,
        alignItems: "flex-start",
        flexDirection: "row",
        marginTop: 0,
        marginLeft:0,
        marginBottom: 5,
        borderRadius: 15
    },
    button:{
        backgroundColor: "#2ecc71",
        padding: 10,
        borderRadius: 20
    },
    textButton:{
        color: "#fff"
    },
    viewButton:{
        position: "absolute",
        bottom: 10,
        right: 10
    },
    lvlView:{
        backgroundColor:'#2c3e50',
        position: "absolute",
        height: 30,
        top: 80,
        right: 10,
        left: 10,
    },
    xpBar:{
        backgroundColor:'#2c3e50',
        height: "100%",
        maxWidth: "100%",
        borderRadius: 10,
        borderWidth: 4,
        borderColor: "gray",
        overflow: "hidden",
        flexGrow: 1
    },
    lvl:{
        marginLeft: 10,
        justifyContent: "center"
        
    },
    textLvl:{
        fontSize: 20,
        color: "#fff"
    },
    imageContainer:{
        height: "90%",
        borderRadius: 40,
        overflow: "hidden"
    },
    pdp:{
        height: "100%",
        width: "100%",
        aspectRatio: 1
    }
});