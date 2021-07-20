import React, { useState,useEffect,useContext } from 'react'
import { StyleSheet,View, Text,Image,SafeAreaView,ScrollView,Modal,TouchableOpacity } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import {UserContext} from "../context/UserContext"
import {FirebaseContext} from "../context/FirebaseContext"
import { Card } from 'react-native-paper'
import { db } from "../firebase"
import moment from "moment";
import {TextInput,Button} from "react-native-paper";
import {  Input } from 'react-native-elements';

const Comments1 = ({postId,fromId,timestamp,reply,commentId,toId,replyId,navigation}) => {
               const [posts,setPosts]= useState([])
               const [modal,setModal]= useState(false);
               const [user, setUser] = useContext(UserContext)
               const firebase = useContext(FirebaseContext)
               const [input,setInput] = useState("")
               const [profileUserData, setProfileUserData] = useState();
               const [show, setShow] = useState('like2');
               const [show2, setShow2] = useState('textforlike');
               const [comments,setComments] = useState([])
               const [countComment,setCountComment] = useState(0)
               const [countLikes, setCountLikes] = useState(0)




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
                    .collection("comments")
                    .doc(commentId)
                    .collection("replies")
                    .doc(replyId)
                    .get()
                    .then(docc => {
                        const data = docc.data()
                        console.log(show)
                        if (show == 'like2') {
                            db.collection("posts")
                                .doc(postId)
                                .collection("comments")
                                .doc(commentId)
                                .collection("replies")
                                .doc(replyId)
                                .collection("likes")
                                .doc(user.uid)
                                .get()
                                .then(doc2 => {
                                    if (doc2.data()) {
                                        console.log(doc2.data())
                                    } else {
                                        db.collection("posts").doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId).collection("likes").doc(user.uid).set({
                                            likes: 1,
                                            fromId:user.uid,
                                            timestamp:Date.now(),
                                            toId:toId,
                                            read:false,
                                            clicked:true
                                        });
                                        db.collection('posts').doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId).update({
                                            noLikes: data.noLikes + 1
                                        });
                                    }
                                })
            
                        } else {
                            db.collection('posts').doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId).collection('likes').doc(user.uid).delete().then(function () {
                                db.collection('posts').doc(postId).collection("replies").doc(replyId).update({
                                    noLikes: data.noLikes - 1
                                });
                            })
                        }
                    })
            
                    return sub;
            
            }

            useEffect(() => {
                db.collection('posts').doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId).collection("likes").where("clicked","==",true)
               .onSnapshot(snapshot => (
                setCountLikes(snapshot.docs.length)
               ))
            }, []);

               useEffect(() => {
                db.collection('users').doc(`${fromId}`).onSnapshot((doc) => {
                    setProfileUserData(doc.data());
                });
            }, [])

               const reportComment = (event) => {
                event.preventDefault();
                let errors = {};
        
                if(!input.trim()){
                    errors.comment = alert(`Field is empty!!!`);
                }else{
                    db.collection("posts").doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId).collection("reports").add({
                        report: input,
                        read: false,
                        count:false,
                        postId:postId,
                        commentId:commentId,
                        forId:toId,
                        fromId: user.uid,
                        fromPhotoProfileUrl: user.profilePhotoUrl,
                        fromUsername:user.username,
                        timestamp: Date.now(),
                    }).then(ref => alert("Report submitted successfully"));
                    setInput('');
                    setModal(false)
                }
        
        
            }

            const profileView = (ownerId) =>{
                navigation.navigate("Profileview",{
                    ownerId:fromId,
           
                })
             }


            const parseTimestamp = (timestamp) => {
                try {
                    let date = new Date(timestamp)
                    return date.toUTCString()
                } catch (error) {
                    console.error(error)
                    return timestamp
                }
            }
        const deleteComment = () =>{

            db.collection("posts").doc(postId).collection("comments").doc(commentId).collection("replies").doc(replyId).delete().then(() => {
                alert("Comment successfully deleted!");
            }).catch((error) => {
                alert("Error removing Comment: ", error);
            });
        } 


            
    return (
        <View style={styles.container}>
                            <Card key={replyId} 
                style={[styles.containerImage,{marginTop:10}]}
                >
<View style={styles.feedItem} >

{user.uid === fromId &&(
         
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

           )}
            {user.uid !== fromId &&(
          <TouchableOpacity onPress={()=> profileView({ownerId:fromId})}
        
        >
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

        </TouchableOpacity>
           )}

    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>

            {user.uid === fromId &&(
              
                <Text style={styles.name}>{profileUserData?.username}</Text>

           )}
            {user.uid !== fromId &&(
             <TouchableOpacity onPress={()=> profileView({ownerId:fromId})}>
                <Text style={styles.name}>{profileUserData?.username}</Text>

             </TouchableOpacity>

           )}
                
                <Text style={[styles.post,{maxWidth:250}]}>{reply}</Text>
            </View>

            <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={() => setModal(true)} />
        </View>
        <Text style={[styles.timestamp,{marginTop:10}]}>{parseTimestamp(timestamp)}</Text>
        <View style={{ flexDirection: "row" }}>
        {show !== "like2" &&(
                        <Ionicons name="heart" size={24} color="#73788B" onPress={likeHandle} />

                        )}
                        {show === "like2" &&(
                        <Ionicons name="heart-outline" size={24} color="#73788B" onPress={likeHandle} />

                        )}
            <Text style={{ marginRight: 16 }}>{countLikes}</Text>
        </View>
    </View>
</View>

            </Card>
            <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={()=>{
            setModal(false)
        }}
        >
       <View style={styles.modalView}>
           {fromId === user.uid &&(
               <>
            <View style={styles.modalButtonView}>
           <Button 
        style={{backgroundColor:"#A9A9A9"}}
         mode="contained" 
         onPress={() => deleteComment()} 
        >
            Delete Reply
        </Button>

           </View>
       <Button 
       
        onPress={() => setModal(false)} 
        >
            <Text style={{color:"#fff",fontSize:15}}>Cancel</Text>
        </Button>
        </>
           )}
               {fromId !== user.uid &&(
               <>
               <View>

               <View style={styles.footer}>
                        <Image source={{uri: user.profilePhotoUrl}} style={styles.avatar} />

               <TextInput 
                                       multiline={true}
               placeholder="report comment..."
               style={styles.textInput}
               value={input}
               onChangeText={(text)=> setInput(text)}
               />
               <TouchableOpacity  activeOpacity={0.5}>
                 <Ionicons name="send" size={24} color="black" onPress={reportComment}/>
               </TouchableOpacity>
            </View>
       <Button 
       
        onPress={() => setModal(false)} 
        >
            <Text style={{color:"#fff",fontSize:15}}>Cancel</Text>
        </Button>
        </View>

        </>
           )}       
           
       </View>
        </Modal> 
        </View>
    )
}

export default Comments1

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
