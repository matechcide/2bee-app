import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SelectView from "./SelectView"
import ProfileView from "./ProfileView"
import ConversationView from "./ConversationView"
import ParametersView from "./ParametersView"

const Drawer = createDrawerNavigator();

export default function HomeView({ route, navigation }){
    let view = "Question"
    if(route.params && route.params.view){
        view = route.params.view
    }

    return(
        <Drawer.Navigator initialRouteName={view}>
            <Drawer.Screen name="Question" component={SelectView} />
            <Drawer.Screen name="Conversation" component={ConversationView} />
            <Drawer.Screen name="Profil" component={ProfileView} />
            <Drawer.Screen name="Paramètres" component={ParametersView} />
        </Drawer.Navigator>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "center"
    }
});