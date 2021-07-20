import React,{useContext} from "react";
import {StyleSheet,View,Text} from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import AuthStackScreen from "./AuthStack";
import {UserContext} from "../context/UserContext"
import MainStackScreen from "./MainStackScreen";
import MainStackScreen1 from "./MainStackScreen1";
import SignIn from "../src/screens/SignIn";
import SignUp from "../src/screens/SignUp";
import LoadingScreen from "../src/screens/LoadingScreen";
import PostView from "../src/screens/ViewPost"
import ProfileView from "../src/screens/ProfileView"
import ProfileView1 from "../src/screens/ProfileView1"
import Search from "../src/screens/Search"

import HomeScreen from "../src/screens/HomeScreen"
import CommentReply from "../src/screens/CommentReply"
import ChatScreen from "../src/screens/ChatScreen"
import Owns from "../src/screens/Owns"
import Postsowners from "../src/screens/Postsowners"
import Followerowner from "../src/screens/Followersowner"
import Profileedit from "../src/screens/Profileedit"


import Posts from '../src/screens/Posts';


export default function AppStack (){

       const AppStack = createStackNavigator()
       const [user] = useContext(UserContext)
       return(
         <AppStack.Navigator  headerMode="none" >
           {user.isLoggedIn === null ?(
           <AppStack.Screen name="Loading" component={LoadingScreen} />
           


           ): user.isLoggedIn ?(
            // <AppStack.Screen name="Home" component={HomeScreen} />,
            <>
            <AppStack.Screen name="Main" component={MainStackScreen} />
            <AppStack.Screen name="Postview" component={PostView} />
            <AppStack.Screen name="Profileview" component={ProfileView} />
            <AppStack.Screen name="Commentreply" component={CommentReply} />
            <AppStack.Screen name="Chat" component={ChatScreen} />
            {/* <AppStack.Screen name="Posts" component={Posts} /> */}
            <AppStack.Screen name="Owns" component={Owns} />
            <AppStack.Screen name="Postowners" component={Postsowners} />
            <AppStack.Screen name="Followersowner" component={Followerowner} />
            <AppStack.Screen name="Profileedit" component={Profileedit} />
            <AppStack.Screen name="Search" component={Search} />
            </>

            //  <AppStack.Screen name="Postview" component={PostView} />
           ):(
            <AppStack.Screen name="Auth" component={AuthStackScreen} />


           )}
           {/* {user.isLoggedIn &&(
            <AppStack.Screen name="Main1" component={MainStackScreen1} />
           )} */}

         </AppStack.Navigator>

       )
}

