import React,{useState,useEffect,useContext} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { db,auth } from "../firebase"
import {UserContext} from "../context/UserContext"
import {FirebaseContext} from "../context/FirebaseContext"
import FollowingP1 from "./FollowingP1"

const FollowingP = ({navigation}) => {
    const [follows, setFollows] = useState([])
    const [user, setUser] = useContext(UserContext)

    useEffect(()=>{
        const unsuscribe = db.collection('follows').where("followerId","==",user.uid).onSnapshot(snapshot =>{
            setFollows(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
    return (
        <View style={styles.container}>
           {follows.map(({ id,data: {ownerId,followerId,count,read,timestamp}})=>(
      <FollowingP1  key={id} ownerId={ownerId} followerId={followerId} postId={id} count={count} navigation={navigation}  read={read} timestamp={timestamp}/>
  ))}
        </View>
    )
}

export default FollowingP 
const styles = StyleSheet.create({
    container:{
  
    }
})
