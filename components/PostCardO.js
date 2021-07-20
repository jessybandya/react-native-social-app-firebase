import React, { useState,useEffect,useContext } from 'react'
import { StyleSheet,View, Text,Image,SafeAreaView,ScrollView,TouchableOpacity,Modal } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import {UserContext} from "../context/UserContext"
import {FirebaseContext} from "../context/FirebaseContext"
import { Card } from 'react-native-paper'
import { db } from "../firebase"
import moment from "moment";
import ViewPost from '../src/screens/ViewPost';
import {Button} from "react-native-paper";


const PostCardO = ({postId,ownerId,postCaption,postImage,timestamp,viewPost,profileView,postId1}) => {
   const [chatMessages, setChatMessages] = useState([])
        const [user, setUser] = useContext(UserContext)
        const [posts,setPosts] = useState([])
     const firebase = useContext(FirebaseContext)
     const [profileUserData, setProfileUserData] = useState();
     const [countComment,setCountComment] = useState(0)
     const [show, setShow] = useState('like2');
     const [show2, setShow2] = useState('textforlike');
     const [countLikes, setCountLikes] = useState(0)
     const [clicked,setClicked] = useState("")
     const [see,setSee] = useState([])
     const [follows,setFollows] = useState([])
     const [modal,setModal] = useState(false)

    //  useEffect(() => {
    //     db.collection('posts').doc(postId).collection("likes").where("clicked","==", true).onSnapshot((doc) => {
    //         setClicked(doc.data());
    //     });
    // }, [])

     useEffect(()=>{
        const unsuscribe = db.collection('follows').onSnapshot(snapshot =>{
           setPosts(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])

      useEffect(() => {
      db.collection('users').doc(ownerId).onSnapshot((doc) => {
          setProfileUserData(doc.data());
      });
  }, [])

 
  
//   useEffect(() => {
//     db.collection('posts').doc(postId).collection("likes").onSnapshot((doc) => {
//         setSee(doc.data());
//     });
// }, [])
//   useEffect(() => {
//     db.collection('follows').onSnapshot((doc) => {
//         setSee(doc.data());
//     });
// }, [])

  useEffect(() => {
    db.collection('posts').doc(postId).collection("comments").where("count", "==",false)
   .onSnapshot(snapshot => (
    setCountComment(snapshot.docs.length)
   ))
}, []);
useEffect(() => {
    db.collection('posts').doc(postId).collection("likes")
   .onSnapshot(snapshot => (
    setCountLikes(snapshot.docs.length)
   ))
}, []);


const likeHandle = (event) => {
    event.preventDefault();
    if (show == 'like2') {
        setShow('like2 blue');
        setShow2('textforlike bluetextforlike')
    } else {
        setShow('like2');
        setShow2('textforlike')
    }

   const sub = db.collection('posts')
        .doc(postId)
        .get()
        .then(docc => {
            const data = docc.data()
            console.log(show)
            if (show == 'like2') {
                db.collection("posts")
                    .doc(postId)
                    .collection("likes")
                    .doc(user.uid)
                    .get()
                    .then(doc2 => {
                        if (doc2.data()) {
                            console.log(doc2.data())
                        } else {
                            db.collection("posts").doc(postId).collection("likes").doc(user.uid).set({
                                likes: 1,
                                fromId:user.uid,
                                timestamp:Date.now(),
                                toId:ownerId,
                                read:false,
                                clicked:true

                            });
                            db.collection('posts').doc(postId).update({
                                noLikes: data.noLikes + 1
                            });
                        }
                    })

            } else {
                db.collection('posts').doc(postId).collection('likes').doc(user.uid).delete().then(function () {
                    db.collection('posts').doc(postId).update({
                        noLikes: data.noLikes - 1
                    });
                })
            }
        })

        return sub;

        

}





useEffect(()=>{
    const unsuscribe = db.collection('posts').doc(postId).collection("likes").where("fromId","==",user.uid).onSnapshot(snapshot =>{
        setSee(snapshot.docs.map(doc =>({
           id:doc.id,
           data:doc.data()
       })))
    })
    return unsuscribe
  },[])

  const deletePost = () =>{

    db.collection("posts").doc(postId).delete().then(() => {
        alert("Post successfully deleted!");
    }).catch((error) => {
        alert("Error removing Comment: ", error);
    });
} 


    return (
        

    <SafeAreaView style={styles.container}>
  
        <ScrollView>
      {/* {user.uid === posts.followerId} */}
      { user.uid!==posts?.followerId  &&(
        <Card key={postId} 
        style={styles.containerImage}>
          
<View style={styles.feedItem} >
<Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />
<View style={{ flex: 1 }}>
<TouchableOpacity onPress={() => viewPost(postId,ownerId,postCaption,postImage,timestamp,postId,profileView,countComment,countLikes)} key={postId} activeOpacity={1.0}>
<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
    <View>
        <Text style={styles.name}>{profileUserData?.username}</Text>
        <Text style={styles.timestamp}>{moment(timestamp).fromNow()}</Text>
    </View>
     <TouchableOpacity onPress={()=> setModal(true)}>
     <MaterialIcons name="more-horiz" size={24} color="#73788B" />

     </TouchableOpacity>
</View>
<Text style={styles.post}>{postCaption}</Text>

<Image source={{uri: postImage}} style={styles.postImage} resizeMode="cover" />
</TouchableOpacity>

<View style={{ flexDirection: "row" }}>
    {show !== "like2" &&(
    <Ionicons name="heart" size={24} color="#73788B" onPress={likeHandle} />

    )}
    {show === "like2" &&(
    <Ionicons name="heart-outline" size={24} color="#73788B" onPress={likeHandle} />

    )}
    <Text style={{ marginRight: 16 }}>{countLikes}</Text>
    <Ionicons name="ios-chatbox-outline" size={24} color="#73788B" />
    <Text>{countComment}</Text>
</View>
</View>
</View>
    </Card>
      )}

                        {/* <Text
                                >
                                View Comments...
                                </Text> */}

<Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={()=>{
            setModal(false)
        }}
        >
                   <View style={styles.modalView}>

            <View style={styles.modalButtonView}>
           <Button 
        style={{backgroundColor:"#A9A9A9"}}
         mode="contained" 
         onPress={() => deletePost()} 
        >
            Delete Post
        </Button>
        <Button 
       
       onPress={() => setModal(false)} 
       >
           <Text style={{color:"#fff",fontSize:15}}>Cancel</Text>
       </Button>
           </View>
           </View>

        </Modal>
      </ScrollView>            
    </SafeAreaView>




  
    )
}

export default PostCardO

const styles = StyleSheet.create({

    container: {
        // flex: 1,
        // backgroundColor: "#EBECF4",
        paddingBottom:0,
        // marginBottom:20
    },
    header: {

    },
    
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
    headerTitle: {
        fontSize: 20,
        fontWeight: "500"
    },
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
    }
})