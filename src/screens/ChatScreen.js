import React,{useState,useEffect,useContext,useLayoutEffect,useCallback} from "react";
import { View, Text, StyleSheet, TouchableOpacity,Keyboard, SafeAreaView, TextInput, Image,Platform,Alert } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import { db,auth } from '../../firebase';
import * as ImagePicker from "expo-image-picker";
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { GiftedChat } from 'react-native-gifted-chat'
import { ListItem, Avatar } from 'react-native-elements'




const ChatScreen = ({navigation,route}) => {
    const [post, setPost] = useState(null)
    const [messages, setMessages] = useState([]);
    const [user,setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)
    const [profileUserData, setProfileUserData] = useState([]);
    const [profileUserData1, setProfileUserData1] = useState([]);
    const [modal,setModal] = useState(false)
    const [countPosts,setCountPosts] = useState(0)
    const [countFollowers,setCountFollowers] = useState(0)
    const [countFollowing,setCountFollowing] = useState(0)
    const [toUser, setToUser] = useState(null)



 

    const profileView = (ownerId) =>{
        navigation.navigate("Profileview",{
            ownerId:route.params.ownerId,
   
        })
     }
    useEffect(() => {
        db.collection('users').doc(`${route.params.ownerId}`).onSnapshot((doc) => {
            setProfileUserData(doc.data());
        });
    }, [])
    useEffect(() => {
        db.collection('users').doc(user.uid).onSnapshot((doc) => {
            setProfileUserData1(doc.data());
        });
    }, [])

    // useEffect(() => {
    //   setMessages([
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ])
    // }, [])

    useLayoutEffect(() =>{
      const unsub =  db.collection("chats").doc(route.params.chatId).collection("messages").orderBy("createdAt","desc").onSnapshot(snapshot=> setMessages(
            snapshot.docs.map(doc=>({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user
            }))
        ))
        return function cleanup () {
            unsub()
        }
    },[post])
    const [posts, setPosts]= useState([]);
    useEffect(() => {
        //   db.collection('messages').where('chat', '==', post).orderBy('timestamp', 'asc').get().then(snapshot => {
        //       console.log(snapshot)
        //       setPosts(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })))
        //   }).catch(error => {
        //       console.error(error)
        //   })
          const unsub = db.collection('messages').where('chat', '==', route.params.chatId).onSnapshot(snapshot => {
            //   console.log(snapshot)
              let messages = []
              snapshot.forEach(doc => {
                  messages.push({id:doc.id, toId:doc.data().toId})
                  if (doc.data().toId === user.uid) {
                      doc.ref.update({read:true})
                  }
              })
              setPosts(messages)
          }, error => console.error(error))
          return 
              unsub()
          
      }, []);
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      const {
          _id,
          createdAt,
          text,
          read,
          fromId,
          toId,
          user
      }=messages[0]
      db.collection("chats").doc(route.params.chatId).collection("messages").add({
        _id,
        createdAt,
        text,
        chat:route.params.chatId,
        toId:route.params.ownerId,
        fromId:route.params.myId,
        read:false,
        user
      })
      db.collection("messages").add({
        _id,
        createdAt,
        text,
        chat:route.params.chatId,
        toId:route.params.ownerId,
        fromId:route.params.myId,
        read:false,
        user
      })

    }, [post])


    
    return (
        <View style={styles.container}>
        <View style={styles.header}>
                 <View>
                 <TouchableOpacity onPress={()=> profileView({ownerId:route?.params?.ownerId})      
        }>
                    <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />
                    </TouchableOpacity>
                 </View>

                  <View>
                  <TouchableOpacity style={{textAlign:"center"}}>
                        <Text style={{ fontWeight: "500"}}>Chating with <Text style={{fontSize:17}}>{profileUserData?.username}</Text></Text>
                    </TouchableOpacity>
                  
                      
 

                   
                  </View>
 
                </View>
                <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: profileUserData1?.email,
        name:profileUserData1?.username,
        avatar:profileUserData1?.profilePhotoUrl,
        fromId:user.uid,
        toId:route.params.ownerId,
        avatar2:profileUserData?.profilePhotoUrl,
        name2:profileUserData?.username,
      }}
    />
        </View>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container:{
        flex:1,

    },
    header: {
      flexDirection: "row",
    //   justifyContent: "center",
      alignItems:"center",
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "pink",
      marginTop:30,
  },
  avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 16
  },
})

