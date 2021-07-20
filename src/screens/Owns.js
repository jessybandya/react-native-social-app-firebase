import React,{useState,useEffect,useContext} from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import PostCard from '../../components/PostCard';
import LikesN from '../../components/LikesN';
import Posts from './Posts';
import FollowersP from '../../components/FollowersP';
import FollowingP from '../../components/FollowingP';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Owns = ({navigation}) => {
    const [comments, setComments] = useState([])
    const [follows, setFollows] = useState([])
    const [likes, setLikes] = useState([])
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


      // const Posts = (ownerId) =>{
      //   navigation.navigate("Posts",{
      //     ownerId:user.uid,
      //     navigation:navigation
      //   })
      // }
const Tab = createMaterialTopTabNavigator();
    return (
        <>
                            <View style={styles.header}>
                  <View>
                  <TouchableOpacity activeOpacity={1}>
                        <Text style={{ fontWeight: "500",textAlign:"center",justifyContent:"center",alignItems:"center",alignContent:"center"}}>{user.username}</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
        <Tab.Navigator>
        <Tab.Screen name="Posts"  component={Posts}  options={{ tabBarBadge: 3 }}/>
        <Tab.Screen name="Followers" component={FollowersP} />
        <Tab.Screen name="Following" component={FollowingP} options={{ tabBarBadge: 3 }}/>

      </Tab.Navigator>
     
      </>
      
    );

    
}

export default Owns

const styles = StyleSheet.create({
    container:{

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
