import React,{useState,useEffect,useContext} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { db,auth } from "../firebase"
import {UserContext} from "./../context/UserContext"
import {FirebaseContext} from "./../context/FirebaseContext"
import LikesN1 from './LikesN1'

const Likesn = ({navigation}) => {
        const [likes, setLikes] = useState([])
    const [user, setUser] = useContext(UserContext)

    useEffect(()=>{
        const unsuscribe = db.collection('posts').where("ownerId","==",user.uid).onSnapshot(snapshot =>{
            setLikes(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
    return (
        <View style={styles.container}>
          {likes.map(({ id,data:{ownerId,timestamp}})=>(
      <LikesN1  key={id}  postId={id} navigation={navigation} ownerId={ownerId}  timestamp={timestamp}/>
  ))}
        </View>
    )
}

export default Likesn 
const styles = StyleSheet.create({
  
})
