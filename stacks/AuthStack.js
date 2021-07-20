import React from "react";
import {StyleSheet,View,Text} from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from "../src/screens/SignIn";
import AuthStack from "./AuthStack";
import SignUp from "../src/screens/SignUp";



export default function AuthStackScreen(){

       const AuthStack = createStackNavigator()

       return(
         <AuthStack.Navigator headerMode="none">
           <AuthStack.Screen name="SignIn" component={SignIn} />
           <AuthStack.Screen name="SignUp" component={SignUp} />

         </AuthStack.Navigator>

       )
}

