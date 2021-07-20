import React,{useState,useEffect,useContext} from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import CommentsN from '../../components/CommentsN';
import LikesN from '../../components/LikesN';
import FollowersN from '../../components/FollowersN';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const NotificationScreen = () => {
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

const Tab = createMaterialTopTabNavigator();
    return (
        <>
                            <View style={styles.header}>
                  <View>
                  <TouchableOpacity activeOpacity={1}>
                        <Text style={{ fontWeight: "500",textAlign:"center",justifyContent:"center",alignItems:"center",alignContent:"center"}}>Notifications</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
        <Tab.Navigator>
        <Tab.Screen name="Comments" component={CommentsN} options={{ tabBarBadge: 2 }}/>
        {/* <Tab.Screen name="Likes" component={LikesN} /> */}
        <Tab.Screen name="Followers" component={FollowersN} options={{ tabBarBadge: 3 }}/>
      </Tab.Navigator>
     
      </>
      
    );

    
}

export default NotificationScreen

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
