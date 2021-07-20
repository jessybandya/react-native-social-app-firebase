import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React, { useState, useCallback, useEffect,useLayoutEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { db,auth } from '../../firebase';




const ChatScreen1 = ({navigation,chatId}) => {
    const [messages, setMessages] = useState([]);

     useLayoutEffect(() =>{
      const unsub =  db.collection("chats").doc(chatId).collection("messages").onSnapshot(snapshot=> setMessages(
            snapshot.docs.map(doc=>({
                _id: doc.data()._id,
                // createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user
            }))
        ))
        return function cleanup () {
            unsub()
        }
    },[])
    return (
 
                <View>
                    <Text style={{justifyContent:"center",alignItems: "center"}}>
                        {chatId}
                    </Text>
                </View>
    )
}

export default ChatScreen1

const styles = StyleSheet.create({
    container:{
        flex:1,

    },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "pink",
      marginTop:30,
  }
})
