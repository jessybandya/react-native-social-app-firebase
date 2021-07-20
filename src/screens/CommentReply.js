import React,{useContext,useState,useEffect} from 'react'
import { StyleSheet, Text, View,Image,SafeAreaView,Button,Modal,KeyboardAvoidingView,Platform,Keyboard } from 'react-native'
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { TouchableOpacity } from 'react-native'
import { db } from "../../firebase"
import { Ionicons } from "@expo/vector-icons";
import { Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'; 
import { ScrollView,TextInput } from 'react-native'
import Comments1 from '../../components/Comments1'

const CommentReply = ({navigation,route}) => {
      

    const [posts,setPosts]= useState([])
    const [modal,setModal]= useState(false);
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)
    const [input,setInput] = useState("")
    const [profileUserData, setProfileUserData] = useState();
    const [show, setShow] = useState('like2');
    const [show2, setShow2] = useState('textforlike');
    const [comment,setComment] = useState([])
    const [countComment,setCountComment] = useState(0)
    const [countLikes, setCountLikes] = useState(0)
    const [comments,setComments] = useState([])


    useEffect(() => {
        db.collection('users').doc(`${route.params.ownerId}`).onSnapshot((doc) => {
            setProfileUserData(doc.data());
        });
    }, [])
    useEffect(() => {
        db.collection('posts').doc(`${route.params.postId}`).collection('comments').doc(`${route.params.commentId}`).onSnapshot((doc) => {
            setComment(doc.data());
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

    useEffect(()=>{
        const unsuscribe = db.collection('posts').doc(route.params.postId).collection("comments").doc(route.params.commentId).collection("replies").orderBy("timestamp","desc").onSnapshot(snapshot =>{
           setPosts(snapshot.docs.map(doc =>({
               id:doc.id,
               data:doc.data()
           })))
        })
        return unsuscribe
      },[])

    const sendComment = (event) =>{
        Keyboard.dismiss()
        event.preventDefault();
          let errors = {};
          if(!input.trim()){
              errors.input=alert(`You can't send with an empty comment field`);
          }else{
              db.collection('posts').doc(route.params.postId).collection('comments').doc(route.params.commentId).collection("replies").add({
                  timestamp:Date.now(),
                  reply:input,
                  fromId: user.uid,
                  toId: route.params.ownerId,
                  count:false,
                  read:false
           })
           setInput("")
          }
        
      }

      useEffect(() => {
        db.collection('posts').doc(route.params.postId).collection("comments").doc(route.params.commentId).collection("likes").where("clicked","==",true)
       .onSnapshot(snapshot => (
        setCountLikes(snapshot.docs.length)
       ))
    }, []);

    useEffect(() => {
        db.collection('posts').doc(route.params.postId).collection("comments").doc(route.params.commentId).collection("replies").where("count", "==",false)
       .onSnapshot(snapshot => (
        setCountComment(snapshot.docs.length)
       ))
    }, []);

    const profileView = (ownerId) =>{
        navigation.navigate("Profileview",{
            ownerId:route.params.ownerId,
   
        })
     }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                       behavior={Platform.OS === "ios" ? "padding" : "height"}
                       style={styles.container}
                       keyboardVerticalOffset={90}
            >
                <>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="md-arrow-back" size={24} color="black" ></Ionicons>
        </TouchableOpacity>
      <View>
      <TouchableOpacity >
            <Text style={{ fontWeight: "500",marginLeft:100}}>Replies</Text>
        </TouchableOpacity>
      </View>

    </View>
    <Card 
                style={[styles.containerImage,{marginTop:10}]}
                
                >
<View style={styles.feedItem} >

{user.uid === route.params.fromId &&(
         
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

           )}
            {user.uid !== route.params.fromId &&(
          <TouchableOpacity  onPress={()=> profileView({ownerId:route.params.ownerId})}
        
        >
        <Image source={{uri: profileUserData?.profilePhotoUrl}} style={styles.avatar} />

        </TouchableOpacity>
           )}

    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>

            {user.uid === route.params.fromId &&(
              
                <Text style={styles.name}>{profileUserData?.username}</Text>

           )}
            {user.uid !== route.params.fromId &&(
             <TouchableOpacity onPress={()=> profileView({ownerId:route.params.ownerId})}>
                <Text style={styles.name}>{profileUserData?.username}</Text>

             </TouchableOpacity>

           )}
                
                <Text style={[styles.post,{maxWidth:250}]}>{comment?.comment}</Text>
            </View>

        </View>
        <Text style={[styles.timestamp,{marginTop:10}]}>{parseTimestamp(comment?.timestamp)}</Text>
        <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                    <View>
                    <Text style={styles.timestamp}>Likes</Text>
                        <Text style={{ color:"#C4C6CE" }}>{countLikes}</Text>
                    </View>
                    <View style={{marginRight:10}}>
                    <Text style={styles.timestamp}>Replies</Text>
                        <Text style={{ color:"#C4C6CE" }}>{countComment}</Text>                       
                        </View>


                    </View>
                </View>
            </View>

            </Card>

    <ScrollView>
        <View>
        {
 posts.map(({ id,data: {fromId,count,read,timestamp,reply,toId}})=>(
                <Comments1  key={id} replyId={id}  postId={route.params.postId} fromId={fromId} toId={toId}  reply={reply}  count={count} read={read} timestamp={timestamp} commentId={route.params.commentId} navigation={navigation}/>
            ))
            }

        

        </View>
    </ScrollView>
    <View style={styles.footer}>
               <TextInput 
                   multiline={true}
               placeholder="Reply comment..."
               style={styles.textInput1}
               value={input}
               onChangeText={(text)=> setInput(text)}
               />
               <TouchableOpacity  onPress={sendComment} activeOpacity={0.5}>
                 <Ionicons name="send" size={24} color="black"/>
               </TouchableOpacity>
            </View>
    
            </>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default CommentReply 
const styles = StyleSheet.create({
    container:{
        flex:1
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
      } ,
        textInput1:{
        bottom:0,
        height:70,
        flex:1,
        marginRight:5,
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
 
 footer:{
    flexDirection:"row",
    alignItems: "center",
    width: "100%",
    padding: 15
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
})
