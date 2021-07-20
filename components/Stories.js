import React, { useState,useEffect,useContext } from 'react'
import { StyleSheet, Text, View,ScrollView,Image } from 'react-native'
// import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
// import { Avatar, VStack, Text, Image } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "react-native-vector-icons/Ionicons"
import {UserContext} from "./../context/UserContext"
import {FirebaseContext} from "./../context/FirebaseContext"
import { db } from "../firebase"


const Stories = () => {
        const [user, setUser] = useContext(UserContext)
     const firebase = useContext(FirebaseContext)
     const [profileUserData, setProfileUserData] = useState();


      useEffect(() => {
      db.collection('users').doc(`${user.uid}`).onSnapshot((doc) => {
          setProfileUserData(doc.data());
      });
  }, [])
    return (
      <View style={{flexDirection:"row"}}>
             <View style={{padding: 7}}>
                 <Image    source={user.profilePhotoUrl === "default" ? require("./../assets/profile.jpg") : {uri: profileUserData?.profilePhotoUrl}} style={styles.userImage}/>
          <View style={{position: "absolute"}}>
            <View style={styles.addBtnContainer}>
            <Ionicons name="add" style={styles.addBtn} />
            </View>
            <Text style={[styles.name, {textTransform:"capitalize"}]}>Your story</Text>
          </View>
       </View>
       <ScrollView style={{flex: 1,marginTop:-5}} horizontal showsHorizontalScrollIndicator={false}>

         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://odel.uonbi.ac.ke/sites/default/files/2020-08/University_Of_Nairobi_Towers.jpg"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Jessy Bandya</Text>
         </View>


         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://imgs.capitalxtra.com/images/64524?crop=16_9&width=660&relax=1&signature=TRIMJWiOs-mdArGQqEnz_egA8X4="}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Chris Brown</Text>
         </View>


         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_0.jpg"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Elon Musk</Text>
         </View>

         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://images.daznservices.com/di/library/GOAL/1b/e9/cristiano-ronaldo-real-madrid-champons-league_13wnw3yuz1nd51f9hso5zns1gf.jpg?t=-738974200&quality=100"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Christiano Ronaldo</Text>
         </View>

         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://i.guim.co.uk/img/media/a7fe7170defa865d2b96b829f05c5d8fa82d8edf/0_20_2201_1321/master/2201.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=410f9319cd3f76b9dccd90c5b5bbad5f"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Lionel Messi</Text>
         </View>
         
         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://pyxis.nymag.com/v1/imgs/62c/fa8/6e52acce958795508a7ecbf6a3656c0190-11-drake-hotline-bling.rsquare.w700.jpg"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Drake</Text>
         </View>


         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://www.biography.com/.image/t_share/MTM2OTI2NTY2Mjg5NTE2MTI5/justin_bieber_2015_photo_courtesy_dfree_shutterstock_348418241_croppedjpg.jpg"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Justine Beiber</Text>
         </View>
         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://cdns-images.dzcdn.net/images/artist/f2e42bcecf4be8f5e169b2154eef68f6/500x500.jpg"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Diamond Platnumz</Text>
         </View>



         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://www.amstadion.com/media/catalog/product/cache/2/image/9df78eab33525d08d6e5fb8d27136e95/r/m/rm-khn02201.jpg"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Real Madrid</Text>
         </View>





         <View style={{width:85,padding:5}}>
         <LinearGradient
         colors={['#bc2a8d','#e95950','#fccc63']}
         style={{padding:2,borderRadius:50}}
         >
          <Image    source={{uri: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/06b71403-8678-4dea-b754-87ad2075f7a4/fc-barcelona-2021-22-match-home-dri-fit-adv-football-shirt-B1MBj9.png"}} style={[styles.userImage, {borderWidth:4}]}/>
          

         </LinearGradient>
         <Text style={styles.name}>Barcelona</Text>
         </View>
       </ScrollView>
       </View>
    )
}

export default Stories

const styles = StyleSheet.create({
    userImage:{
        height:70,
        width:70,
        borderRadius:50,
        borderColor: "#ffffff",
    },
    name:{
        textAlign: "center",
        fontSize:12,
        textTransform: "lowercase",
        marginTop:5

    },
   addBtnContainer:{
   marginTop:55,
   backgroundColor:"#4c68d7",
   marginLeft:55,
   width:23,
   height:23,
   borderRadius:50,
   borderWidth:1.5,
   borderColor: "#ffffff",
   justifyContent: "center"
   },
   addBtn:{
     color: "#ffffff",
     textAlign: "center",
     textAlignVertical: "center",
     fontSize:12
   } 
})
