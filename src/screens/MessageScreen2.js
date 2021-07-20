import React,{useState,useEffect,useContext,useLayoutEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,SafeAreaView,Image } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import MessageScreen1 from './MessageScreen1';



const MessageScreen2 = ({navigation,postId}) => {
    const [user, setUser] = useContext(UserContext)
   const [post,setPost] = useState(null)
    const [see,setSee] = useState([])
    const [chatMessages, setChatMessages] = useState([])

    useLayoutEffect(() =>{
        const unsub =  db.collection("chats").doc(postId).collection("messages").orderBy("createdAt","desc").onSnapshot(snapshot=> setChatMessages(
              snapshot.docs.map(doc=>({
                id:doc.id,
                data:doc.data()
              }))
          ))
          return function cleanup () {
              unsub()
          }
      },[post])

    // useEffect(() => {
    //     db.collection('chats').doc("4RIP9uuQi0oFlPMfwLBW").collection("messages").where("read","==",false).onSnapshot((doc) => {
    //         setSee(doc.data());
    //     });
    // }, [])
    useEffect(() => {
        db.collection('chats').doc(postId).collection("messages").where("toId", "==",user.uid)
       .onSnapshot(snapshot => (
        setSee(snapshot.docs.length)
       ))
    }, []);

    return (
        <View style={styles.container}>

{chatMessages.map(({ id,data: {text,createdAt,read,toId,fromId}})=>(
      <MessageScreen1  key={id} messageId={id} text={text} postId={postId} toId={toId} read={read} navigation={navigation} fromId={fromId}   createdAt={createdAt} see={see}/>
  ))}
        </View>
    )
}

export default MessageScreen2

const styles = StyleSheet.create({
    container:{
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
