import React,{useContext,useState,useEffect} from 'react'
import { StyleSheet, Text, View,Image,SafeAreaView,ScrollView,Button,Modal } from 'react-native'
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { TouchableOpacity } from 'react-native'
import { db } from "../../firebase"
import { Ionicons } from "@expo/vector-icons";

const ProfileView = ({navigation,route,ownerId}) => {
     const [user, setUser] = useContext(UserContext)
     const firebase = useContext(FirebaseContext)
     const [profileUserData, setProfileUserData] = useState();
     const [modal,setModal] = useState(false)
     const [countPosts,setCountPosts] = useState(0)
     const [countFollowers,setCountFollowers] = useState(0)
     const [countFollowing,setCountFollowing] = useState(0)
     const [post, setPost] = useState(null)
     const [toUser, setToUser] = useState(null)
 
     useEffect(() => {
         db.collection('chats').where(`users.${route?.params?.ownerId}`, '==', true).where(`users.${user?.uid}`, '==', true).get().then(
             snapshot => {
                 if (snapshot.docs.length >= 1) {
                     setPost(snapshot.docs[0].id)
                 } else {
                     db.collection('chats').add({users:{[`${route?.params?.ownerId}`]:true, [user?.uid]:true}}).then(ref => setPost(ref.route?.params?.ownerId))
                     console.log(snapshot.docs)
                 }
             }
         )
         db.collection('users').doc(`${route?.params?.ownerId}`).get().then(
             doc => {
                 setToUser({id:doc.id, data:doc.data()})
             }
         )
         
 
     }, []);

     useEffect(() => {
      db.collection('follows').where("followerId", "==", route.params.ownerId)
     .onSnapshot(snapshot => (
      setCountFollowing(snapshot.docs.length)
     ))
  }, []);


     useEffect(() => {
      db.collection('users').doc(`${route.params.ownerId}`).onSnapshot((doc) => {
          setProfileUserData(doc.data());
      });
  }, [])
  useEffect(() => {
    db.collection('posts').where("ownerId", "==", route.params.ownerId)
   .onSnapshot(snapshot => (
    setCountPosts(snapshot.docs.length)
   ))
}, []);

useEffect(() => {
  db.collection('users').doc(`${route.params.ownerId}`).collection("followers").where("followedId", "==", `${route.params.ownerId}`)
 .onSnapshot(snapshot => (
  setCountFollowers(snapshot.docs.length)
 ))
}, []);

const [posts2, setPosts2]= useState([]);
const [posts3, setPosts3]= useState([]);

useEffect(() => {
    //   db.collection('messages').where('chat', '==', post).orderBy('timestamp', 'asc').get().then(snapshot => {
    //       console.log(snapshot)
    //       setPosts(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })))
    //   }).catch(error => {
    //       console.error(error)
    //   })
      const unsub = db.collection('follows').where('read', '==', false).where("ownerId","==",user.uid).where("followerId","==",route.params.ownerId).onSnapshot(snapshot => {
        //   console.log(snapshot)
          let messages = []
          snapshot.forEach(doc => {
              messages.push({id:doc.id, ownerId:doc.data().ownerId})
              if (doc.data().ownerId === user.uid) {
                  doc.ref.update({read:true})
              }
          })
          setPosts2(messages)
      }, error => console.error(error))
      return 
          unsub()
      
  }, []);

  useEffect(() => {
    //   db.collection('messages').where('chat', '==', post).orderBy('timestamp', 'asc').get().then(snapshot => {
    //       console.log(snapshot)
    //       setPosts(snapshot.docs.map(doc => ({id: doc.id, data: doc.data() })))
    //   }).catch(error => {
    //       console.error(error)
    //   })
      const unsub = db.collection('users').doc(user.uid).collection("followers").where('read', '==', false).where("followedId","==",user.uid).where("followerId","==",route.params.ownerId).onSnapshot(snapshot => {
        //   console.log(snapshot)
          let messages = []
          snapshot.forEach(doc => {
              messages.push({id:doc.id, followedId:doc.data().followedId})
              if (doc.data().followedId === user.uid) {
                  doc.ref.update({read:true})
              }
          })
          setPosts3(messages)
      }, error => console.error(error))
      return 
          unsub()
      
  }, []);

const Chat = (ownerId) =>{
  navigation.navigate("Chat",{
      ownerId:route.params.ownerId,
      chatId:post,
      myId:user.uid

  })
}
const Postowners = (ownerId) =>{
  navigation.navigate("Postowners",{
      ownerId:route.params.ownerId,


  })
}
const Followersowner = (ownerId) =>{
  navigation.navigate("Followersowner",{
      ownerId:route.params.ownerId,


  })
}



const follower = () =>{


  db.collection("users").doc(`${route.params.ownerId}`).collection("followers").where("followerId", "==", user.uid).get().then(
    snap =>{
      if (snap.docs.length > 0) {
        alert(`You already following ${profileUserData?.username}`)
      }else{
        db.collection("users").doc(`${route.params.ownerId}`).collection("followers").add({
          followerId: user.uid,
          read: false,
          followedId:route.params.ownerId,
          count:false,
         timestamp: Date.now(),
      }).then(ref => alert(`you started following ${profileUserData?.username}`));
      } 
    }
  )
      
      db.collection("follows").where("followerId", "==", user.uid).where("ownerId", "==", route.params.ownerId).get().then(
    snap =>{
      if (snap.docs.length > 0) {
        alert(`You already following ${profileUserData?.username}`)
      }else{
        db.collection("follows").add({
          followerId: user.uid,
          read: false,
          ownerId:route.params.ownerId,
          count:false,
         timestamp: Date.now(),
      }).then(ref => alert(`you started following ${profileUserData?.username}`));
      } 
    }
  )
    
      

  

}



     const logOut = async () =>{
       const loggedOut = await firebase.logOut();

       if(loggedOut){
           setUser(state => ({ ...state, isLoggedIn: false}));
       }
     }

    return (
      <>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
         <ScrollView
      style={styles.container}
      contentContainerStyle={{justifyContent: 'center'}}
      showsVerticalScrollIndicator={false}>
       

        <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="black" ></Ionicons>
                    </TouchableOpacity>
                  <View>
                  <TouchableOpacity style={{textAlign:"center",marginLeft:50}}>
                        <Text style={{ fontWeight: "500"}}>{profileUserData?.username}'s Profile</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
                <View style={{alignItems:"center"}}>
                  <TouchableOpacity activeOpacity={0.5} onPress={()=> setModal(true)}>
                  <Image source={profileUserData?.profilePhotoUrl === "default" ? require("../../assets/profile.jpg") : {uri: profileUserData?.profilePhotoUrl}} style={[styles.userImg,{marginTop:10}]}/>

                  </TouchableOpacity>
          


      <Text style={styles.userName}>{profileUserData?.username}</Text>
      {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
      <Text style={styles.aboutUser}>
      {profileUserData ? profileUserData.email || 'No details added.' : ''}
  

      </Text>
      <View style={styles.userBtnWrapper}>
   
                      <TouchableOpacity style={styles.userBtn} onPress={() => Chat({ownerId:route?.params?.ownerId,fromId:profileUserData?.email,myId:user.uid})}>
              <Text style={styles.userBtnTxt}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
              <Text style={styles.userBtnTxt} onPress={follower}>Follow</Text>
            </TouchableOpacity>

      </View>

      <View style={styles.userInfoWrapper}>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countPosts}</Text>
          <TouchableOpacity style={styles.userBtn} onPress={()=> Postowners({ownerId:route.params.ownerId})}>
          <Text style={styles.userInfoSubTitle}>Posts</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countFollowers}</Text>
          <TouchableOpacity style={styles.userBtn} onPress={()=> Followersowner({ownerId:route.params.ownerId})}>
          <Text style={styles.userInfoSubTitle}>Followers</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countFollowing}</Text>
          <TouchableOpacity style={styles.userBtn}>
          <Text style={styles.userInfoSubTitle}>Following</Text>

          </TouchableOpacity>
        </View>
      </View>


            </View>

    </ScrollView>
    
    </SafeAreaView>
    <Modal
    animationType="slide"
    transparent={true}
    visible={modal}
    onRequestClose={()=>{
        setModal(false)
    }}
    >
      <View style={styles.modalView}>
      <Image source={profileUserData?.profilePhotoUrl === "default" ? require("../../assets/profile.jpg") : {uri: profileUserData?.profilePhotoUrl}} style={{width:"100%",height:"100%"}}/>
      </View>
    </Modal>
    </>
    )
}

export default ProfileView

const styles = StyleSheet.create({
    container: {
      flex:1,
      marginBottom:-10
      },
      userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
      },
      aboutUser: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
      },
      userBtnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
      },
      userBtn: {
        borderColor: '#2e64e5',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 5,
      },
      userBtnTxt: {
        color: '#2e64e5',
      },
      userInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
      },
      userInfoItem: {
        justifyContent: 'center',
      },
      userInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
      },
      userInfoSubTitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
      },
      header: {
        flexDirection: "row",
        // justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "pink",
        marginTop:30,
    },  modalView:{
      //  position: "absolute",
       top:50,
       width:"100%",
       backgroundColor:"#D3D3D3",
       padding:0,
       height:"70%",
       justifyContent:"center",
       alignItems:"center"
      //  margin:20
   },
})
