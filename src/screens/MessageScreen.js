import React,{useState,useEffect,useContext} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,SafeAreaView,ActivityIndicator } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import MessageScreen1 from './MessageScreen1';


const MessageScreen = ({navigation}) => {
  const [user, setUser] = useContext(UserContext)
  const firebase = useContext(FirebaseContext)
  const [posts, setPosts] = useState([])
  const [follows, setFollows] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    try{
      setLoading(true)

      const unsuscribe = db.collection('chats').onSnapshot(snapshot =>{
        setPosts(snapshot.docs.map(doc =>({
            id:doc.id,
            data:doc.data()
        })))
     })
     return unsuscribe

  }catch(error){
      console.log("Error @Fetching: ",error.message)
  }finally{
      setLoading(false)
  }
  },[])
  const [chatMessages, setChatMessages] = useState([])

  // useEffect(() => {
  //     const unsubscribe = db.collection('chats').onSnapshot(snapshot => 
  //         setChatMessages(snapshot.docs.map((doc) => doc.data()))
  //     );

  //     return unsubscribe
  //  });
    return (
        <View style={styles.container}>
                                       <View style={styles.header}>
                  <View>
                  <TouchableOpacity activeOpacity={1}>
                        <Text style={{ fontWeight: "500"}}>Messages</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
                <View>
                  {loading ?
                              <ActivityIndicator size="large" color="#0000ff" />
                  :
                  <>
                   {posts.map(({ id})=>(
    <MessageScreen1  key={id} chatId={id} navigation={navigation}/>
))}
                  </>
                  }
               
<Text></Text>
                </View>
        </View>
    )
}

export default MessageScreen

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
