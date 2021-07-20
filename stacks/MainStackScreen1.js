import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Postview from "../src/screens/ViewPost"
import { createStackNavigator } from '@react-navigation/stack';
import ProfileView from "../src/screens/ProfileView"



// const myOptions ={
//   title:"Home",
//   headerTintColor:"white",
//   headerStyle:{
//     backgroundColor:"#3399ff",
//   }
  
// }
// const globalScreenOptions = {
//   headerStyle:{
//     backgroundColor:"#FF1493",
//   },
//   headerTitleStyle: {color: "white",
  
// },
//   headerTintColor: "white",
//   headerTitleAlign: 'center'
// }

export default function App() {
    const Stack = createStackNavigator();
  return (
         <Stack.Navigator 
         >

         <Stack.Screen name="Postview" component={Postview}/>
         
         <Stack.Screen name="Profileview" component={ProfileView}/>



         </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});