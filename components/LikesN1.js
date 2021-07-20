import React,{useEffect,useState,useContext} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,SafeAreaView,ScrollView } from 'react-native'
import { UserContext } from '../context/UserContext';
import { db } from '../firebase';
import { Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Lik from "./../src/screens/Lik"

const LikesN1 = ({ownerId,timestamp,postId,navigation}) => {
    const [likes, setLikes] = useState([])
    const [user, setUser] = useContext(UserContext)

    useEffect(()=>{
        const unsuscribe = db.collection('posts').doc(postId).collection("likes").onSnapshot(snapshot =>{
            setLikes(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
    return (
        <View style={styles.container}>
                                   
                <View>
                    {likes.map(({ id,data: {toId,fromId,clicked,read,timestamp}})=>(
    <Lik  key={id} toId={toId} fromId={fromId} postId={postId} likeId={id} clicked={clicked}  read={read}  timestamp={timestamp} navigation={navigation}/>
))}
   <Text>{likes?.toId}</Text>
                </View>
        </View>
    )
}

export default LikesN1

const styles = StyleSheet.create({
    container:{
        flex:1,

    },

})
