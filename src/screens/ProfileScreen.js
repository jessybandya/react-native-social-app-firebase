import React,{useContext,useState,useEffect} from 'react'
import { StyleSheet, Text, View,Image,SafeAreaView,ScrollView,Button,Modal } from 'react-native'
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { TouchableOpacity } from 'react-native'
import { db } from "../../firebase"

const ProfileScreen = ({navigation,route}) => {
     const [user, setUser] = useContext(UserContext)
     const firebase = useContext(FirebaseContext)
     const [profileUserData, setProfileUserData] = useState();
     const [modal,setModal] = useState(false)
     const [countPosts,setCountPosts] = useState(0)
     const [countFollowers,setCountFollowers] = useState(0)
     const [countFollowing,setCountFollowing] = useState(0)


     useEffect(() => {
      db.collection('follows').where("followerId", "==", user.uid)
     .onSnapshot(snapshot => (
      setCountFollowing(snapshot.docs.length)
     ))
  }, []);

  useEffect(() => {
    db.collection('users').doc(user?.uid).collection("followers").where("followedId", "==", user.uid)
   .onSnapshot(snapshot => (
    setCountFollowers(snapshot.docs.length)
   ))
  }, []);

     useEffect(() => {
      db.collection('posts').where("ownerId", "==", user?.uid)
     .onSnapshot(snapshot => (
      setCountPosts(snapshot.docs.length)
     ))
  }, []);

     useEffect(() => {
      db.collection('users').doc(`${user?.uid}`).onSnapshot((doc) => {
          setProfileUserData(doc.data());
      });
  }, [])

     const logOut = async () =>{
       const loggedOut = await firebase.logOut();

       if(loggedOut){
           setUser(state => ({ ...state, isLoggedIn: false}));
       }
     }

    return (
      
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={styles.header}>

                  <View>
                  <TouchableOpacity style={{textAlign:"center"}}>
                        <Text style={{ fontWeight: "500"}}>My Profile</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
      <ScrollView
      style={styles.container}
      contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
      showsVerticalScrollIndicator={false}>
       <TouchableOpacity activeOpacity={0.5} onPress={()=> setModal(true)}>
       <Image source={user.profilePhotoUrl === "default" ? require("../../assets/profile.jpg") : {uri: profileUserData?.profilePhotoUrl}} style={styles.userImg}/>

       </TouchableOpacity>

      <Text style={styles.userName}>{user.username}</Text>
      <Text style={styles.aboutUser}>
      {user ? user.email || 'No details added.' : ''}
      </Text>
      <View style={styles.userBtnWrapper}>
    
            <TouchableOpacity
              style={styles.userBtn}
              onPress={() => {
                navigation.navigate('Profileedit');
                // console.log("Edit")
              }}>
              <Text style={styles.userBtnTxt}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={logOut}>
              <Text style={styles.userBtnTxt}>Logout</Text>
            </TouchableOpacity>
 
      </View>

      <View style={styles.userInfoWrapper}>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countPosts}</Text>
          <Text style={styles.userInfoSubTitle}>Posts</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countFollowers}</Text>
          <Text style={styles.userInfoSubTitle}>Followers</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{countFollowing}</Text>
          <Text style={styles.userInfoSubTitle}>Following</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.userBtn} onPress={()=> navigation.navigate("Owns")}>
              <Text style={styles.userBtnTxt}>View</Text>
            </TouchableOpacity>

    </ScrollView>

    <Modal
    animationType="slide"
    transparent={true}
    visible={modal}
    onRequestClose={()=>{
        setModal(false)
    }}
    >
      <View style={styles.modalView}>
      <Image source={user.profilePhotoUrl === "default" ? require("../../assets/profile.jpg") : {uri: profileUserData?.profilePhotoUrl}} style={{width:"100%",height:"100%"}}/>
      </View>
    </Modal>


    </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop:60
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
     header: {
       flexDirection: "row",
       justifyContent: "center",
       paddingHorizontal: 32,
       paddingVertical: 12,
       borderBottomWidth: 1,
       borderBottomColor: "pink",
       marginTop:30,
   },
})
