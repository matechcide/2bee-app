import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import MyButton from "../components/MyButton"

export default function FirstView({ navigation }) {

  async function auto(){
    const log = await SecureStore.getItemAsync("log")
    if(log && log != " |!| "){
      navigation.push('LoginView', { "log" : log })
    }
    else if(!log){
      await SecureStore.setItemAsync("log", " |!| ");
    }
  }
  auto()

  return (
    <View style={styles.container}>

      <MyButton
        title="Se connecter"
        preSet="blue"
        onPress={async () => {
          const log = await SecureStore.getItemAsync("log")
          navigation.push('LoginView', { "log" : log})
        }}
      />

      <MyButton
        title="Créer un compte"
        preSet="blue"
        marginTop={100}
        onPress={() => {
          navigation.push('RegisterView')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    height: "100%",
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: "center"
  }
});
