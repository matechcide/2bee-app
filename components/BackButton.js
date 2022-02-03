import React from 'react';
import { StyleSheet, View} from 'react-native';

import MyButton from "./MyButton"

export default function BackButton(props){
    return (
        <View style={{
            position: 'absolute',
            left: 20,
            top: 20
        }}>
            <MyButton
                title="←"
                textColor="#25b6d2"
                pressColor='#2c3e50'
                fontSize={50}
                onPress={()=>{
                    if(props.thisPage){
                        props.thisPage()
                    }
                    else{
                        props.navigation.goBack()
                    }
                    
                }}
            />
        </View>
    )
}