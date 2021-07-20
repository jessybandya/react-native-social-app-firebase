import React,{useContext,useState,useEffect} from 'react'
import { StyleSheet, Text, View,Image,SafeAreaView,ScrollView,Button,Modal } from 'react-native'
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { TouchableOpacity } from 'react-native'
import { db } from "../../firebase"
import { Ionicons } from "@expo/vector-icons";

const ProfileView1 = ({navigation,route,ownerId}) => {
     const [user, setUser] = useContext(UserContext)
     const firebase = useContext(FirebaseContext)
     const [profileUserData, setProfileUserData] = useState();
     const [modal,setModal] = useState(false)

     useEffect(() => {
      db.collection('users').doc(`${route.params.fromId}`).onSnapshot((doc) => {
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
      <>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
         <ScrollView
      style={styles.container}
      contentContainerStyle={{justifyContent: 'center'}}
      showsVerticalScrollIndicator={false}>
       

        <View style={styles.header}>
                    {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="black" ></Ionicons>
                    </TouchableOpacity> */}
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
      {profileUserData ? profileUserData.about || 'No details added.' : ''}
      {route.params.ownerId}
      {route.params.fromId}

      </Text>
      <View style={styles.userBtnWrapper}>
   
                      <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
              <Text style={styles.userBtnTxt}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
              <Text style={styles.userBtnTxt}>Follow</Text>
            </TouchableOpacity>

      </View>

      <View style={styles.userInfoWrapper}>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>20</Text>
          <Text style={styles.userInfoSubTitle}>Posts</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>10,000</Text>
          <Text style={styles.userInfoSubTitle}>Followers</Text>
        </View>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>100</Text>
          <Text style={styles.userInfoSubTitle}>Following</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.userBtn}>
              <Text style={styles.userBtnTxt}>Posts</Text>
            </TouchableOpacity>
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

export default ProfileView1

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
        justifyContent: "center",
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
