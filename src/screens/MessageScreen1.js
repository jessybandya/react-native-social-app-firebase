import React,{useState,useEffect,useContext,useLayoutEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,SafeAreaView,Image } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import MessageScreen2 from './MessageScreen2';

import { Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Badge } from "react-native-elements";

const MessageScreen1 = ({navigation,chatId}) => {

    const [posts, setPosts] = useState([])

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)
    const [profileUserData, setProfileUserData] = useState();
    const [chatMessages, setChatMessages] = useState([])
    const [chatMessages1, setChatMessages1] = useState([])




    const parseTimestamp = (timestamp) => {
        try {
            let date = new Date(timestamp)
            return date.toUTCString()
        } catch (error) {
            console.error(error)
            return timestamp
        }
    }

    // useEffect(() => {
    //     db.collection('chats').doc("4RIP9uuQi0oFlPMfwLBW").collection("messages").where("read","==",false).onSnapshot((doc) => {
    //         setSee(doc.data());
    //     });
    // }, [])
    // useEffect(() => {
    //     db.collection('chats').doc(postId).collection("messages").where("toId", "==",user.uid)
    //    .onSnapshot(snapshot => (
    //     setSee(snapshot.docs.length)
    //    ))
    // }, []);
    const [see, setSee] = useState(0)

    useEffect(() => {
        db.collection("messages").where("read", "==",false).where("toId","==",user.uid).where("chat","==",chatId)
       .onSnapshot(snapshot => (
        setSee(snapshot.docs.length)
       ))
    }, []);
    







      useEffect(() => {
        const unsubscribe = db.collection('chats').doc(chatId).collection('messages').
        orderBy('createdAt','asc').onSnapshot(snapshot => 
            setChatMessages(snapshot.docs.map((doc) => doc.data()))
        );
  
        return unsubscribe
     });
     useEffect(() => {
        const unsubscribe = db.collection('chats').doc(chatId).collection('messages').
        orderBy('createdAt','desc').onSnapshot(snapshot => 
            setChatMessages1(snapshot.docs.map((doc) => doc.data()))
            
        );
  
        return unsubscribe
     });
  
    //   useEffect(() => {
    //     const unsubscribe = db.collection('chats').
    //     orderBy('timestamp','desc').onSnapshot(snapshot => 
    //         setChatMessages(snapshot.docs.map((doc) => doc.data()))
    //     );
  
    //     return unsubscribe
    //  });
    useEffect(() => {
        db.collection('users').doc(chatMessages?.[0]?.user?.fromId).onSnapshot((doc) => {
            setProfileUserData(doc.data());
        });
    }, [])


    const Chat = (ownerId) =>{
        navigation.navigate("Chat",{
             ownerId:chatMessages?.[0]?.user?.toId,
            chatId:chatId,
             myId:user.uid,

        })
      }
      const Chat1 = (ownerId) =>{
        navigation.navigate("Chat",{
             ownerId:chatMessages?.[0]?.user?.fromId,
            chatId:chatId,
             myId:user.uid,

        })
      }
    return (
        <SafeAreaView style={styles.container}>
        <ScrollView>
            {/* {chatMessages?.[0]?.user?.fromId === user.uid  &&( */}
            {(chatMessages[0]?.fromId === user.uid || chatMessages[0]?.toId === user.uid) &&(
                <>
                {chatMessages[0]?.fromId === user.uid ?(
                    <>
                    <Card   
                
                onPress={()=>
                     
                    Chat({ownerId:chatMessages?.[0]?.toId,chatId:chatId,myId:user.uid})}    

style={[styles.containerImage,{marginTop:10}]}>
       
<View style={styles.feedItem} >



<TouchableOpacity 

>
{chatMessages?.[0]?.user?.fromId === user.uid &&(
<Image source={{uri: chatMessages?.[0]?.user?.avatar2}}  style={styles.avatar} />

)}
{chatMessages?.[0]?.user?.toId === user.uid &&(
<Image source={{uri: chatMessages?.[0]?.user?.avatar}}  style={styles.avatar} />

)}


</TouchableOpacity>

<View style={{ flex: 1 }}>
<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

<View>
{chatMessages?.[0]?.user?.fromId === user.uid &&(
<Text style={styles.name}>{chatMessages?.[0]?.user?.name2}</Text>

)}
{chatMessages?.[0]?.user?.toId === user.uid &&(
<Text style={styles.name}>{chatMessages?.[0]?.user?.name}</Text>

)}




{/* <Text style={[styles.post,{maxWidth:250}]}>{comment}</Text> */}
</View>
<Badge
badgeStyle={styles.badge}
textStyle={styles.badgeText}
value={see}
status="error"
//   containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
//   {...badgeProps}
containerStyle={{right:-5,top:-10}}

/>
{/* <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={() => console.log("Delete")} /> */}
</View>

{chatMessages1?.[0]?.fromId === user.uid &&(
     <>
     <Text numberOfLines={1} style={[styles.timestamp,{marginTop:10}]}>You: {chatMessages1?.[0]?.text}</Text>

     </>
 )}
  {chatMessages1?.[0]?.toId === user.uid &&(
     <>
     <Text numberOfLines={1} style={[styles.timestamp,{marginTop:10}]}>{chatMessages1?.[0]?.name}: {chatMessages1?.[0]?.text}</Text>

     </>
 )}
</View>
</View>

</Card>
                    </>
                ):(
                    <>
<Card   
                
                onPress={()=>
                     
                    Chat1({ownerId:chatMessages?.[0]?.fromId,chatId:chatId,myId:user.uid})}    

style={[styles.containerImage,{marginTop:10}]}>
       
<View style={styles.feedItem} >



<TouchableOpacity 

>
{chatMessages?.[0]?.user?.fromId === user.uid &&(
<Image source={{uri: chatMessages?.[0]?.user?.avatar2}}  style={styles.avatar} />

)}
{chatMessages?.[0]?.user?.toId === user.uid &&(
<Image source={{uri: chatMessages?.[0]?.user?.avatar}}  style={styles.avatar} />

)}


</TouchableOpacity>

<View style={{ flex: 1 }}>
<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

<View>
{chatMessages?.[0]?.user?.fromId === user.uid &&(
<Text style={styles.name}>{chatMessages?.[0]?.user?.name2}</Text>

)}
{chatMessages?.[0]?.user?.toId === user.uid &&(
<Text style={styles.name}>{chatMessages?.[0]?.user?.name}</Text>

)}




{/* <Text style={[styles.post,{maxWidth:250}]}>{comment}</Text> */}
</View>
<Badge
badgeStyle={styles.badge}
textStyle={styles.badgeText}
value={see}
status="error"
//   containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
//   {...badgeProps}
containerStyle={{right:-5,top:-10}}

/>

{/* <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={() => console.log("Delete")} /> */}
</View>
 {/* { chatMessages1?.[0]?.fromId === user.uid ?(

 ):(

 )

 } */}
 {chatMessages1?.[0]?.fromId === user.uid &&(
     <>
     <Text numberOfLines={1} style={[styles.timestamp,{marginTop:10}]}>You: {chatMessages1?.[0]?.text}</Text>

     </>
 )}
  {chatMessages1?.[0]?.toId === user.uid &&(
     <>
     <Text numberOfLines={1} style={[styles.timestamp,{marginTop:10}]}>{chatMessages1?.[0]?.name2}: {chatMessages1?.[0]?.text}</Text>

     </>
 )}

</View>

</View>

</Card>
                    </>
                )}
                

       
   </>
 
            )                     
            }
         
            </ScrollView>

        </SafeAreaView>

    )
}

export default MessageScreen1

const styles = StyleSheet.create({
    badge: {
        borderRadius: 9,
        height: 18,
        minWidth: 0,
        width: 18
      },
      badgeContainer: {
        position: "absolute"
      },
      badgeText: {
        fontSize: 10,
        paddingHorizontal: 0
      },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        // marginVertical: 8,
        paddingBottom:0
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 15,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 300,
        borderRadius: 5,
        marginVertical: 16
    },
    footer:{
      flexDirection:"row",
      alignItems: "center",
      width: "100%",
      padding: 15
    },
    textInput:{
    //    bottom:0,
       height:80,
       flex:1,
    //    marginRight:15,
    //    borderColor: "transparent",
       backgroundColor: "#ECECEC",
       padding:10,
       color: "grey",
       borderRadius: 15,
    }
    ,
    modalView:{
    //  position: "absolute",
     top:50,
    //  width:"100%",
     backgroundColor:"#D3D3D3",
     padding:10,
     margin:20
 },
 modalButtonView:{
     flexDirection:"row",
     justifyContent:"space-around",
     padding:10
 },
 textInput:{
 //    bottom:0,
    height:80,
    flex:1,
 //    marginRight:15,
 //    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding:10,
    color: "grey",
    borderRadius: 15,
 },
 footer:{
    flexDirection:"row",
    alignItems: "center",
    width: "100%",
    padding: 15
  },
})