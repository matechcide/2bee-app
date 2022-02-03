import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

import FirstView from "./views/FirstView"
import LoginView from "./views/LoginView"
import RegisterView from "./views/RegisterView"
import HomeView from "./views/HomeView"
import QuestionView from "./views/QuestionView"
import WaitingView from "./views/WaitingView"
import MessageViewC from "./views/MessageViewC"
import MessageViewQ from "./views/MessageViewQ"
import EditProfileView from "./views/EditProfileView"
import ConversationView from "./views/ConversationView"
import ForgetPasswordView from "./views/ForgetPasswordView"

const Stack = createStackNavigator()

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default function App() {

  React.useEffect(() => {
    async function id(){
      this.error = ""
      this.messages = {}
      this.listPseudo = {}
      this.alert = false
      this.deviceID = await SecureStore.getItemAsync("id")
      this.story = await SecureStore.getItemAsync("story")
      if(!this.story){
        await SecureStore.setItemAsync("story", "{}");
        this.story = "{}"
      }
      this.story = JSON.parse(this.story)
      if(!this.deviceID){
        await SecureStore.setItemAsync("id", `${Math.random(0).toString(36).substr(2)}`);
        this.deviceID = await SecureStore.getItemAsync("id")
      }
    }
    id()
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="FirstView" imingConfig={{duration: 0}}>
        <Stack.Screen name="FirstView" component={FirstView} options={{animationEnabled: false}}/>
        <Stack.Screen name="LoginView" component={LoginView} options={{animationEnabled: false}}/>
        <Stack.Screen name="RegisterView" component={RegisterView} options={{animationEnabled: false}}/>
        <Stack.Screen name="HomeView" component={HomeView} options={{animationEnabled: false}}/>
        <Stack.Screen name="QuestionView" component={QuestionView} options={{animationEnabled: false}}/>
        <Stack.Screen name="WaitingView" component={WaitingView} options={{animationEnabled: false}}/>
        <Stack.Screen name="MessageViewQ" component={MessageViewQ} options={{animationEnabled: false}}/>
        <Stack.Screen name="MessageViewC" component={MessageViewC} options={{animationEnabled: false}}/>
        <Stack.Screen name="EditProfileView" component={EditProfileView} options={{animationEnabled: false}}/>
        <Stack.Screen name="ConversationView" component={ConversationView} options={{animationEnabled: false}}/>
        <Stack.Screen name="ForgetPasswordView" component={ForgetPasswordView} options={{animationEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
  
}
