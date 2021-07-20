import React,{useState,useEffect,useContext} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { db,auth } from "../firebase"
import {UserContext} from "../context/UserContext"
import {FirebaseContext} from "../context/FirebaseContext"
import FollowersP1 from './FollowersP1'

const FollowersP = ({navigation}) => {
    const [follows, setFollows] = useState([])
    const [user, setUser] = useContext(UserContext)

    useEffect(()=>{
        const unsuscribe = db.collection('users').doc(user.uid).collection("followers").orderBy("timestamp","desc").onSnapshot(snapshot =>{
            setFollows(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
    return (
        <View style={styles.container}>
           {follows.map(({ id,data: {followedId,followerId,count,read,timestamp}})=>(
      <FollowersP1  key={id} followedId={followedId} followerId={followerId} postId={id} count={count} navigation={navigation}  read={read} timestamp={timestamp}/>
  ))}
        </View>
    )
}

export default FollowersP 
const styles = StyleSheet.create({
    container:{
  
    }
})
