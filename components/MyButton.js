import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight } from 'react-native';

export default function MyButton(props) {
    let styles = {
        view:{},
        button:{},
        text:{}
    }
    
    let pressColor = props.pressColor
    let pressOpacity = props.pressOpacity

    if(props.preSet == "blue"){
        styles.button["backgroundColor"] = "#2ecc71"
        styles.button["padding"] = 10
        styles.button["borderRadius"] = 20
        styles.text["color"] = "#ffffff"
        styles.text["fontSize"] = 20
        pressColor = "#2c3e50"
        pressOpacity = 0.7
    }

    //view
    if(props.marginTop){
        styles.view["marginTop"] = props.marginTop
    }
    //button
    if(props.backgroundColor){
        styles.button["backgroundColor"] = props.backgroundColor
    }
    if(props.padding){
        styles.button["padding"] = props.padding
    }
    if(props.borderRadius){
        styles.button["borderRadius"] = props.borderRadius
    }
    if(props.width){
        styles.button["width"] = props.width
    }
    if(props.height){
        styles.button["height"] = props.height
    }
    if(props.xPos){
        styles.button["alignItems"] = props.xPos
    }
    if(props.yPos){
        styles.button["justifyContent"] = props.yPos
    }
    //text
    if(props.textColor){
        styles.text["color"] = props.textColor
    }
    if(props.fontSize){
        styles.text["fontSize"] = props.fontSize
    }

    styles = StyleSheet.create(styles)

    return (
        <View style={styles.view}>

            <TouchableHighlight 
                onPress={props.onPress} 
                underlayColor={pressColor}
                activeOpacity={pressOpacity}
            >
                <View style={styles.button}>

                    <Text style={styles.text}>
                        {props.title}
                    </Text>

                </View>
            </TouchableHighlight>
        </View>
    )
}