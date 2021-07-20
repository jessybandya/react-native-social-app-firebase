import React,{useEffect,useState,useContext} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,SafeAreaView,ScrollView } from 'react-native'
import { UserContext } from '../context/UserContext';
import { db } from '../firebase';
import { Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const CommentsN1 = ({postId,timestamp,navigation,fromId,toId,read}) => {
    const [profileUserData, setProfileUserData] = useState([]);
    const [post,setPost] = useState([])
    const [user, setUser] = useContext(UserContext)
              useEffect(() => {
                db.collection('users').doc(`${fromId}`).onSnapshot((doc) => {
                    setProfileUserData(doc.data());
                });
            }, [])
            

   const parseTimestamp = (timestamp) => {
        try {
            let date = new Date(timestamp)
            return date.toUTCString()
        } catch (error) {
            console.error(error)
            return timestamp
        }
    }

      const viewPost = (id) =>{
        navigation.navigate("Postview",{
            id:postId,
            ownerId:user.uid,

        })
     }
         const profileView = (ownerId) =>{
        navigation.navigate("Profileview",{
            ownerId:fromId,
   
        })
     }
    return (
        <SafeAreaView style={styles.container}>
      
        <ScrollView>
          {fromId !== user.uid &&(
            <>
   {read === false  &&(
       <>
        <Card key={postId} onPress={()=> viewPost({id:postId,ownerId:user?.uid})}
                style={[styles.containerImage,{marginTop:10}]}>
<View style={[styles.feedItem,{backgroundColor:"#A9A9A9"}]} >


  
          <TouchableOpacity onPress={()=> profileView({ownerId:fromId})}
        
        >
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

        </TouchableOpacity>

    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>

                <Text style={[styles.name,{color:"#DCDCDC"}]}>{profileUserData?.username} commented on your post</Text>

                     

                
                {/* <Text style={[styles.post,{maxWidth:250}]}>{comment}</Text> */}
            </View>

            {/* <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={() => console.log("Delete")} /> */}
        </View>
        <Text style={[styles.timestamp,{marginTop:10}]}>{moment(timestamp).fromNow()}</Text>
       
    </View>
</View>

            </Card>
       </>
   )}   
   {read === true  &&(
       <>
        <Card key={postId} onPress={()=> viewPost({id:postId,ownerId:user?.uid})}
                style={[styles.containerImage,{marginTop:10}]}>
<View style={styles.feedItem} >


  
          <TouchableOpacity onPress={()=> profileView({ownerId:fromId})}
        
        >
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

        </TouchableOpacity>

    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>

                <Text style={styles.name}>{profileUserData?.username} commented on your post</Text>

                     

                
                {/* <Text style={[styles.post,{maxWidth:250}]}>{comment}</Text> */}
            </View>

            {/* <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={() => console.log("Delete")} /> */}
        </View>
        <Text style={[styles.timestamp,{marginTop:10}]}>{moment(timestamp).fromNow()}</Text>
       
    </View>
</View>

            </Card>
       </>
   )}
            </>
              )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default CommentsN1

const styles = StyleSheet.create({
    
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        // marginVertical: 8,
        paddingBottom:0
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899"
    },
    postImage: {
        width: undefined,
        height: 300,
        borderRadius: 5,
        marginVertical: 16
    },
    footer:{
      flexDirection:"row",
      alignItems: "center",
      width: "100%",
      padding: 15
    },
    textInput:{
    //    bottom:0,
       height:80,
       flex:1,
    //    marginRight:15,
    //    borderColor: "transparent",
       backgroundColor: "#ECECEC",
       padding:10,
       color: "grey",
       borderRadius: 15,
    }
    ,
    modalView:{
    //  position: "absolute",
     top:50,
    //  width:"100%",
     backgroundColor:"#D3D3D3",
     padding:10,
     margin:20
 },
 modalButtonView:{
     flexDirection:"row",
     justifyContent:"space-around",
     padding:10
 },
 textInput:{
 //    bottom:0,
    height:80,
    flex:1,
 //    marginRight:15,
 //    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding:10,
    color: "grey",
    borderRadius: 15,
 },
 footer:{
    flexDirection:"row",
    alignItems: "center",
    width: "100%",
    padding: 15
  },
})