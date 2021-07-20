import React,{useState,useEffect,useContext} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,ScrollView,SafeAreaView } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import PostCard from '../../components/PostCard';
import LikesN from '../../components/LikesN';
import Posts from './Posts';
import FollowersP from '../../components/FollowersP';
import FollowingP from '../../components/FollowingP';
import { Ionicons } from "@expo/vector-icons";
import Postcardowner from '../../components/Postcardowner';
import Followersowner1 from '../../components/Followersowner';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Followerowner = ({navigation,route}) => {
  const [follows, setFollows] = useState([])
  const [user, setUser] = useContext(UserContext)
  const [profileUserData, setProfileUserData] = useState();
  const [posts, setPosts] = useState([])


  useEffect(() => {
    db.collection('users').doc(`${route.params.ownerId}`).onSnapshot((doc) => {
        setProfileUserData(doc.data());
    });
}, [])
  useEffect(()=>{
      const unsuscribe = db.collection('users').doc(route.params.ownerId).collection("followers").orderBy("timestamp","desc").onSnapshot(snapshot =>{
          setFollows(snapshot.docs.map(doc =>({
             id:doc.id,
             data:doc.data()
         })))
      })
      return unsuscribe
    },[])
    return (
        <>
        <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="black" ></Ionicons>
                    </TouchableOpacity>
                  <View>
                  <TouchableOpacity style={{textAlign:"center",marginLeft:50}}>
                        <Text style={{ fontWeight: "500"}}>{profileUserData?.username}'s Followers</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
            <ScrollView>
            {follows.map(({ id,data: {followedId,followerId,count,read,timestamp}})=>(
      <Followersowner1  key={id} followedId={followedId} followerId={followerId} postId={id} count={count} navigation={navigation}  read={read} timestamp={timestamp}/>
  ))}
            </ScrollView>
     
      </>
      
    );

    
}

export default Followerowner

const styles = StyleSheet.create({
    container:{

    },
    
      header: {
        flexDirection: "row",
        // justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "pink",
        marginTop:30,
    }
})
