import io from "socket.io-client"
import { AppState, DeviceEventEmitter, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import MyRequest from "./MyRequest"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export default async function MySocket(navigation){
    if(!this.socket){
        this.socket = io("https://2bee.gq/")
        this.socket.on('message', async (message, info, id) => {
            if(id == this.user || id == this.id){
                DeviceEventEmitter.emit('message', message, info);
                if(this.conversation.indexOf(id) != -1 && message[2] != "react"){
                    if(!this.story[id]){
                        this.story[id] = {
                            "lastMessage": 0
                        }
                    }
                    if(message[2] == "react"){
                        this.story[id]["lastMessage"] = "react" + message[0][1]
                        temp = JSON.stringify(this.story)
                        await SecureStore.setItemAsync("story", temp);
                        return
                    }
                    this.story[id]["lastMessage"] = info[3]
                    temp = JSON.stringify(this.story)
                    await SecureStore.setItemAsync("story", temp);
                }
                else if(message[2] == "react" && id == this.id && message[1] == this.user){
                    this.story[message[1]]["lastMessage"] = "react" + message[0][1]
                    temp = JSON.stringify(this.story)
                    await SecureStore.setItemAsync("story", temp);
                    return
                }
            }
            else if(this.conversation.indexOf(id) != -1 && info){
                if(this.currentScreen == "ConversationView"){
                    DeviceEventEmitter.emit('refresh');
                    return
                }
                if(message[2] == "react"){
                    return
                }
                if(this.listUsers[id].pseudo == ""){
                    let name = await MyRequest("GetProfile", "POST", {"user": id, "info": "Pseudo", "custom": true})
                    this.listUsers[id].pseudo = name.info.list[0]["text"]
                }
                await Notifications.scheduleNotificationAsync({
                    content: {
                      title: "Message",
                      body: this.listUsers[id].pseudo + " t'envois un message.",
                      data: { data: 'goes here' }
                    },
                    trigger: { 
                        seconds: 2
                    }
                });
            }
        })
        this.socket.on('addToConv', async (user) => {
            this.conversation.push(user)
            this.story[user] = {
                "lastMessage": 0
            }
            this.listUsers[user] = {
                "messages": [],
                "lastMessage": "",
                "pseudo": "",
                "infoConv": {}
            }
            temp = JSON.stringify(this.story)
            await SecureStore.setItemAsync("story", temp);
            Alert.alert(
                "Conversation Enregister",
                "La conversation avec cette personne est enregistré.",
                [
                    { 
                        text: "OK",
                        onPress: () => {}
                    }
                ]
                
            )
        })
        this.socket.on('findBody', (question, user) => {
            navigation.push("MessageViewQ", {"question": question, "user": user});
        })
        this.socket.on("disconnect", async () => {
            this.error = "Vous avez été deconnecté du serveur."
            DeviceEventEmitter.removeListener("message");
            DeviceEventEmitter.removeListener("refresh");
            navigation.push('FirstView')
            this.socket.removeAllListeners();
            this.ticket = "disconnect"
            delete this.socket
        })

        AppState.addEventListener("change", (e) => {
            if(e == "background" && this.currentScreen == "WaitingView"){
                this.socket.emit("quitWaiting", this.ticket)
                this.error = "Vous avez été deconnecté de la file d'attente."
                navigation.push('HomeView')
            }
            if(e == "background" && this.currentScreen == "MessageView" && this.conversation.indexOf(this.user) == -1){
                this.socket.emit('kick', this.ticket, this.user, this.id )
                DeviceEventEmitter.removeListener("message");
                this.error = "Vous avez été deconnecté de la conversation."
                navigation.push('HomeView')
            }
        });

        return await new Promise(async (resolve) => {
            this.socket.on('connect', () => {
                this.socket.removeListener('connect');
                resolve(this.socket.id)
            })
        })
    }
}