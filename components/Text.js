import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
const Text = () => {
    return (
        <View style={styles.container}>
            <Text>Text Component</Text>
        </View>
    )
}

export default Text

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center"
    }
})
