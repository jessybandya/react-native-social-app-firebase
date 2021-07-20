import React,{useState,useEffect,useContext} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import PostCardO from '../../components/PostCardO';
import Stories from '../../components/Stories';
import ViewPost from './ViewPost';

const Posts = ({navigation,route}) => {
    const [posts, setPosts] = useState([])
    const [follows, setFollows] = useState([])
    const [user, setUser] = useContext(UserContext)

    useEffect(()=>{
        const unsuscribe = db.collection('posts').where("ownerId","==",user.uid).onSnapshot(snapshot =>{
           setPosts(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])
      useEffect(()=>{
        const unsuscribe = db.collection('follows').orderBy("timestamp","desc").onSnapshot(snapshot =>{
           setFollows(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])

      const viewPost = (id,ownerId,postCaption,postImage,timestamp) =>{
        navigation.navigate("Postview",{
            id,
            ownerId,
            postCaption,
            postImage,
            timestamp
        })
     }
     const profileView = (id,ownerId,postCaption,postImage,timestamp) =>{
        navigation.navigate("Profile",{
            id,
            ownerId,
            postCaption,
            postImage,
            timestamp
        })
     }

    return (
        
        <View style={styles.container}>
                        <StatusBar  style="dark-content"/>

            <View>
              <ScrollView>
                  {/* <Stories style={{marginTop:-10}}/> */}
                  {user.uid !== true ?(
                      <>
 {posts.map(({ id,data: {ownerId,postImage,postCaption,timestamp}})=>(
    <PostCardO  key={id} profileView={profileView} viewPost={viewPost} postId={id} ownerId={ownerId}  postCaption={postCaption} postImage={postImage} timestamp={timestamp}/>
))}
</>
                  ):(
                      <>
                          {follows.map(({ id,data: {followerId,followedId,timestamp}})=>(
                <PostCardO  key={id}  postId1={id} followerId={followerId}  followedId={followedId} timestamp={timestamp}/>
            ))}
                      </>
                  )}
           
        

                {/* <PostCard /> */}
                <View style={{paddingBottom:100}}/>
            </ScrollView>
            </View>
        </View>
    )
}

export default Posts

const styles = StyleSheet.create({
    container:{
        // flex:1,
        backgroundColor: "#ebecf3",
        paddingTop:0,
        marginBottom:0
    },
    feedContainer:{

    }
})
