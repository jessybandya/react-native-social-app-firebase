import React,{useState,useEffect,useLayoutEffect,useContext} from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack"
import {Ionicons} from "@expo/vector-icons"
import { NavigationContainer } from '@react-navigation/native';
import { FirebaseContext } from "../context/FirebaseContext";
import { db } from "../firebase";
import { UserContext } from "../context/UserContext";
import HomeScreen from "../src/screens/HomeScreen"
import MessageScreen from "../src/screens/MessageScreen"
import NotificationScreen from "../src/screens/NotificationScreen"
import PostScreen from "../src/screens/PostScreen"
import ProfileScreen from "../src/screens/ProfileScreen"
import PostView from "../src/screens/ViewPost"
import MainStackScreen1 from "./MainStackScreen1"

export default function MainStackScreen(){
     const MainStack = createBottomTabNavigator();
     const Stack = createStackNavigator();
     const [see, setSee] = useState(0)
     const [countFollowers, setCountFollowers] = useState(0)
     const [countComments, setCountComments] = useState(0)
     const [user, setUser] = useContext(UserContext)

     useEffect(() => {
        db.collection("messages").where("read", "==",false).where("toId","==",user.uid)
       .onSnapshot(snapshot => (
        setSee(snapshot.docs.length)
       ))
    }, []);
    useEffect(() => {
        db.collection("follows").where("read", "==",false).where("ownerId","==",user.uid)
       .onSnapshot(snapshot => (
        setCountFollowers(snapshot.docs.length)
       ))
    }, []);
    useEffect(() => {
        db.collection("comments").where("read", "==",false).where("toId","==",user.uid)
       .onSnapshot(snapshot => (
        setCountComments(snapshot.docs.length)
       ))
    }, []);

     const tabBarOptions = {
         showLabel: false,
         style:{
             backgroundColor:"#222222",
             paddingBottom:12,
         }
     }
     const screenOptions = (({route}) =>({
         tabBarIcon: ({focused}) =>{
             let iconName = "";

             switch(route.name){
                case "Home":
                     iconName =  "ios-home"
                     break;
                case "Message":
                      iconName =  "ios-chatbox"
                      break;
                case "Notification":
                      iconName =  "ios-notifications"
                      break;
                case "Profile":
                       iconName =  "ios-person"
                       break; 
              
                default:
                    iconName = ""                               
             }

             if(route.name === "Post"){

                return(
                    <Ionicons  name="ios-add-circle"  size={48} color="#23a8d9" style={{shadowColor: "#23a8d9", shadowOffset:{width:0,height:10}, shadowRadius:10,shadowOpacity:0.3,marginTop:5}}/>
                )
             }

             return <Ionicons name={iconName} size={24} color={focused ? "#ffffff" : "#666666"} />
         }
     }))
     return(
         <>
         <MainStack.Navigator style={{marginTop:10}} initialRouteName="Home"  tabBarOptions={tabBarOptions} screenOptions={screenOptions}>

             <MainStack.Screen name="Home" component={HomeScreen} />
             <MainStack.Screen name="Message" component={MessageScreen} options={{ tabBarBadge: see }}/>
             <MainStack.Screen name="Post" component={PostScreen} />
             <MainStack.Screen name="Notification" component={NotificationScreen} options={{ tabBarBadge: countFollowers + countComments }}/>
             <MainStack.Screen name="Profile" component={ProfileScreen} />
           {/* <Stack.Screen name="Postview" component={PostView} /> */}


         </MainStack.Navigator>
         
{/* 
         <Stack.Navigator initialRouteName="Home">
             <Stack.Screen name="Postview" component={PostView}/>
         </Stack.Navigator> */}
         </>
    

     )



}