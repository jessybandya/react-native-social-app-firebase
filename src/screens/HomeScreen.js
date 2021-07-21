import React,{useState,useEffect,useContext} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,ActivityIndicator,TouchableOpacity  } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import PostCard from '../../components/PostCard';
import Stories from '../../components/Stories';
import ViewPost from './ViewPost';
import { Ionicons } from "@expo/vector-icons";


const HomeScreen = ({navigation}) => {
    const [posts, setPosts] = useState([])
    const [follows, setFollows] = useState([])
    const [user, setUser] = useContext(UserContext)
    const [loading,setLoading] = useState(true)

    useEffect(()=>{

        try{
            setLoading(true)

            const unsuscribe = db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot =>{
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

            <View style={styles.feedContainer}>
              <Text style={{fontSize:20,color:"#8f9196",textAlign:"center"}}>Feed</Text>
              <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",margin:5,borderBottomColor: "pink",}}>
                  <View>
                  {/* <Ionicons name="search-outline" size={24} color="black" ></Ionicons> */}

                  </View>
                  <View style={{  borderBottomColor: "pink"}}>
                      <TouchableOpacity onPress={()=> navigation.navigate("Search")}>
                      <Ionicons name="search-outline" size={24} color="black" ></Ionicons>

                      </TouchableOpacity>

                  </View>

              </View>
              <ScrollView style={styles.container}>
              {loading ?
            <ActivityIndicator size="large" color="#0000ff" />
            
            :
            <>
            <Stories style={{marginTop:-10}}/>
            {posts.map(({ id,data: {ownerId,postImage,postCaption,timestamp}})=>(
               <PostCard  key={id} profileView={profileView} viewPost={viewPost} postId={id} ownerId={ownerId}  postCaption={postCaption} postImage={postImage} timestamp={timestamp}/>
           ))}
              </>     
              }
                 
        

                {/* <PostCard /> */}
                <View style={{paddingBottom:100}}/>
            </ScrollView>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        // flex:1,
        backgroundColor: "#ebecf3",
        paddingTop:30,
        marginBottom:10
    },
    feedContainer:{
        borderBottomColor: "pink",
    }
})
