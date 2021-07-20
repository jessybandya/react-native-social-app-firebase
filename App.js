import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { UserProvider } from "./context/UserContext"
import { createStackNavigator } from '@react-navigation/stack';
import AppStack from "./stacks/AppStack"
import { FirebaseProvider } from "./context/FirebaseContext"
import PostView from "./src/screens/ViewPost"
import MainStackScreen1 from "./stacks/MainStackScreen1"


export default function App (){
  const Stack = createStackNavigator();

  return(
    <>
    <FirebaseProvider>
    <UserProvider>
    <NavigationContainer>
        <AppStack />         
    </NavigationContainer>
    
    </UserProvider>
    </FirebaseProvider>

</>
  )
}