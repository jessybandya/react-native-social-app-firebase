import React,{useState,useEffect,useContext} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { db,auth } from "../firebase"
import {UserContext} from "./../context/UserContext"
import {FirebaseContext} from "./../context/FirebaseContext"
import CommentsN1 from './CommentsN1'

const Commentsn = ({navigation}) => {
    const [comments, setComments] = useState([])
    const [user, setUser] = useContext(UserContext)

    useEffect(()=>{
        const unsuscribe = db.collection('comments').where("toId","==",user.uid).onSnapshot(snapshot =>{
            setComments(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
    return (
        <View style={styles.container}>
            {comments.map(({ id,data:{toId,fromId,timestamp,postId,read}})=>(
      <CommentsN1  key={id}  postId={postId} navigation={navigation} fromId={fromId} read={read}  timestamp={timestamp}/>
  ))}
        </View>
    )
}

export default Commentsn 
const styles = StyleSheet.create({
    container:{

    }
})
