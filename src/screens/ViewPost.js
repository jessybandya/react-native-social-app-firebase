import React,{useContext,useEffect,useState,useLayoutEffect} from 'react'
import { StyleSheet, Text, View,SafeAreaView,ScrollView,TouchableOpacity,Image,TextInput,Modal } from 'react-native'
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { db,auth } from "../../firebase"
import { AntDesign, FontAwesome,MaterialIcons  } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Keyboard,TouchableWithoutFeedback,KeyboardAvoidingView,Platform  } from 'react-native'
import { Card } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar';
import Comments from '../../components/Comments';
import {Button} from "react-native-paper";



const ViewPost = ({navigation,route}) => {
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)
    const [profileUserData, setProfileUserData] = useState([]);
    const [posts, setPosts] = useState([]);
    const [posts1, setPosts1] = useState([]);
    const [show, setShow] = useState('like2');
    const [show2, setShow2] = useState('textforlike');
    const [input,setInput] = useState("")
    const [report,setReport] = useState("")
    const [comments,setComments] = useState([])
    const [countComment,setCountComment] = useState(0)
    const [countLikes, setCountLikes] = useState(0)
    const [modal,setModal]= useState(false);
    const [currentUser,setCurrentUser] = useState(null)


    const reportPost = (event) => {
        event.preventDefault();
        let errors = {};

        if(!report.trim()){
            errors.report = alert(`Report field is empty!!!`);
        }else{
            db.collection("posts").doc(route.params.id).collection("reports").add({
                report: report,
                read: false,
                count:false,
                postId:route.params.id,
                forId:route.params.ownerId,
                fromId: user.uid,
                fromPhotoProfileUrl: user.profilePhotoUrl,
                fromUsername:user.username,
                timestamp: Date.now(),
            }).then(ref => alert("Report submitted successfully"));
            setReport('');
            setModal(false)
        }


    }

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
            .doc(route.params.id)
            .get()
            .then(docc => {
                const data = docc.data()
                console.log(show)
                if (show == 'like2') {
                    db.collection("posts")
                        .doc(route.params.id)
                        .collection("likes")
                        .doc(user.uid)
                        .get()
                        .then(doc2 => {
                            if (doc2.data()) {
                                console.log(doc2.data())
                            } else {
                                db.collection("posts").doc(route.params.id).collection("likes").doc(user.uid).set({
                                    likes: 1,
                                    fromId:user.uid,
                                    timestamp:Date.now(),
                                    toId:route.params.ownerId,
                                    read:false,
                                    clicked:true
                                });
                                db.collection('posts').doc(route.params.id).update({
                                    noLikes: data.noLikes + 1
                                });
                            }
                        })
    
                } else {
                    db.collection('posts').doc(route.params.id).collection('likes').doc(user.uid).delete().then(function () {
                        db.collection('posts').doc(route.params.id).update({
                            noLikes: data.noLikes - 1
                        });
                    })
                }
            })
    
            return sub;
    
    }

    useEffect(() => {
        db.collection('posts').doc(route.params.id).collection("comments").where("count", "==",false)
       .onSnapshot(snapshot => (
        setCountComment(snapshot.docs.length)
       ))
    }, []);
    useEffect(() => {
        db.collection('posts').doc(route.params.id).collection("likes").where("clicked","==",true)
       .onSnapshot(snapshot => (
        setCountLikes(snapshot.docs.length)
       ))
    }, []);
    useEffect(() => {
        db.collection('users').doc(route.params.ownerId).onSnapshot((doc) => {
            setProfileUserData(doc.data());
        });
    }, [])

        useEffect(() => {
        db.collection('users').doc(user.uid).onSnapshot((doc) => {
            setCurrentUser(doc.data());
        });
    }, [])
            
    useEffect(() => {
        db.collection('posts').doc(`${route.params.id}`).onSnapshot((doc) => {
            setPosts(doc.data());
        });
    }, [])

    const postComment = (event) => {
        event.preventDefault();
        Keyboard.dismiss()
        let errors = {};

        if(!input.trim()){
            errors.comment = alert(`Comment Field is empty!!!`);
        }else{
            db.collection("comments").add({
                comment: input,
                read: false,
                count:false,
                postId:route.params.id,
                toId:route.params.ownerId,
                fromId: user.uid,
                fromPhotoProfileUrl: user.profilePhotoUrl,
                fromUsername:user.username,
                timestamp: Date.now(),
            })
            db.collection("posts").doc(`${route.params.id}`).collection("comments").add({
                comment: input,
                read: false,
                count:false,
                postId:route.params.id,
                toId:route.params.ownerId,
                fromId: user.uid,
                fromPhotoProfileUrl: user.profilePhotoUrl,
                fromUsername:user.username,
                timestamp: Date.now(),
            });
            setInput('');
        }


    }
    useEffect(()=>{
        const unsuscribe = db.collection('posts').doc(route.params.id).collection("comments").orderBy("timestamp","desc").onSnapshot(snapshot =>{
           setPosts1(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])

    //Getting Comments
    useEffect(() => {
        let unsubscribe;
        if (route) {
            unsubscribe = db.collection("posts").doc(route.params.id).collection("comments").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        }
    }, [route]);

    const parseTimestamp = (timestamp) => {
        try {
            let date = new Date(timestamp)
            return date.toUTCString()
        } catch (error) {
            console.error(error)
            return timestamp
        }
    }

    const [posts2, setPosts2]= useState([]);
    useEffect(() => {
        //   db.collection('messages').where('chat', '==', post).orderBy('timestamp', 'asc').get().then(snapshot => {
        //       console.log(snapshot)
        //       setPosts(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })))
        //   }).catch(error => {
        //       console.error(error)
        //   })
          const unsub = db.collection('comments').where('read', '==', false).where("toId","==",user.uid).where("postId","==",route.params.id).onSnapshot(snapshot => {
            //   console.log(snapshot)
              let messages = []
              snapshot.forEach(doc => {
                  messages.push({id:doc.id, toId:doc.data().toId})
                  if (doc.data().toId === user.uid) {
                      doc.ref.update({read:true})
                  }
              })
              setPosts2(messages)
          }, error => console.error(error))
          return 
              unsub()
          
      }, []);

    const profileView = (ownerId) =>{
        navigation.navigate("Profileview",{
            ownerId:route.params.ownerId,
   
        })
     }


    return (
        <SafeAreaView style={styles.container}>
                                    <StatusBar  style="dark-content"/>
                                    <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="black" ></Ionicons>
                    </TouchableOpacity>
                  <View>
                  <TouchableOpacity style={{textAlign:"center",marginLeft:50}}>
                        <Text style={{ fontWeight: "500"}}>{profileUserData?.username}'s Post</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
                <KeyboardAvoidingView
           behavior={Platform.OS === "ios" ? "padding" : "height"}
           style={styles.container}
           keyboardVerticalOffset={90}
           >

            <ScrollView>
     



 
                <Card 
                            style={styles.containerImage}>
       <View style={styles.feedItem} >
           {user.uid === route.params.ownerId &&(
          <TouchableOpacity onPress={()=> navigation.navigate("Profile")
        
        }>
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

        </TouchableOpacity>
           )}
            {user.uid !== route.params.ownerId &&(
          <TouchableOpacity onPress={()=> profileView({ownerId:route?.params?.ownerId})      
        }>
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

        </TouchableOpacity>
           )}
 
                <View style={{ flex: 1 }} >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View  >
                        {user.uid === route.params.ownerId &&(
          <TouchableOpacity onPress={()=> navigation.navigate("Profile")
        
        }>
                        <Text style={styles.name}>{profileUserData?.username}</Text>

        </TouchableOpacity>
           )}
            {user.uid !== route.params.ownerId &&(
          <TouchableOpacity onPress={()=> profileView({ownerId:route?.params.ownerId})
        
        }>
                            <Text style={styles.name}>{profileUserData?.username}</Text>

        </TouchableOpacity>
           )}

                            <Text style={styles.timestamp}>{parseTimestamp(posts?.timestamp)}</Text>
                        </View>
                    {user.uid !== route.params.ownerId &&(
                        <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={()=> setModal(true)}/>

                    )}
                    </View>
                    <Text style={styles.post}>{posts?.postCaption}</Text>
                    <Image source={{uri: posts?.postImage}} style={styles.postImage} resizeMode="cover" />
                    <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                    <View>
                    <Text style={styles.timestamp}>Likes</Text>
                        <Text style={{ color:"#C4C6CE" }}>{countLikes}</Text>
                    </View>
                    <View style={{marginRight:10}}>
                    <Text style={styles.timestamp}>Comments</Text>
                        <Text style={{ color:"#C4C6CE" }}>{countComment}</Text>                       
                        </View>


                    </View>
                </View>
            </View>
                        </Card>
                        <View style={styles.footer}>
                        <Image source={{uri: user?.profilePhotoUrl}} style={styles.avatar} />

               <TextInput 
                                       multiline={true}
               placeholder="comment here..."
               style={styles.textInput}
               value={input}
               onChangeText={(text)=> setInput(text)}
               />
               <TouchableOpacity  activeOpacity={0.5}>
                 <Ionicons name="send" size={24} color="black" onPress={postComment}/>
               </TouchableOpacity>
            </View>
            <View style={{marginBottom:40}}>

                          <View style={{maxWidth:"100%",marginBottom:0}}>
       <>
 
 {
 posts1.map(({ id,data: {fromId,fromPhotoProfileUrl,fromUsername,timestamp,comment,toId}})=>(
                <Comments  key={id}  postId={route.params.id} navigation={navigation} commentId={id}  fromId={fromId}  fromPhotoProfileUrl={fromPhotoProfileUrl} fromUsername={fromUsername} comment={comment} toId={toId} timestamp={timestamp} />
            ))
            }
          

</>


                          </View>
                          
                          </View>
         
            </ScrollView>

            </KeyboardAvoidingView>
            <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={()=>{
            setModal(false)
        }}
        >
            <View style={styles.modalView}>
            <View>

               <View style={styles.footer}>
                        <Image source={{uri: user.profilePhotoUrl}} style={styles.avatar} />

               <TextInput 
                                       multiline={true}
               placeholder="report post..."
               style={styles.textInput}
               value={report}
               onChangeText={(text)=> setReport(text)}
               />
               <TouchableOpacity  activeOpacity={0.5}>
                 <Ionicons name="send" size={24} color="black" onPress={reportPost}/>
               </TouchableOpacity>
            </View>
       <Button 
       
        onPress={() => setModal(false)} 
        >
            <Text style={{color:"#fff",fontSize:15}}>Cancel</Text>
        </Button>
        </View>
            </View>
        </Modal>
        </SafeAreaView>
    )
}

export default ViewPost

const styles = StyleSheet.create({
    
    modalView:{
    //  position: "absolute",
     top:50,
    //  width:"100%",
     backgroundColor:"#D3D3D3",
     padding:10,
     margin:20
 },
    container:{
        flex:1,
        marginBottom:-10
    },
    header: {
        flexDirection: "row",
        // justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "pink",
        marginTop:30,
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
    },
})
