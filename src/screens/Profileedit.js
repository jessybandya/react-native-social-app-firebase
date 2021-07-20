import React,{useContext,useEffect,useState,useLayoutEffect} from 'react'
import { StyleSheet, Text, View,SafeAreaView,ScrollView,TouchableOpacity,Image,TextInput,Modal } from 'react-native'
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import { db,auth } from "../../firebase"
import { AntDesign, FontAwesome,MaterialIcons  } from '@expo/vector-icons'; 
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Keyboard,TouchableWithoutFeedback,KeyboardAvoidingView,Platform,ImageBackground  } from 'react-native'
import { Card } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar';
import Comments from '../../components/Comments';
import {Button} from "react-native-paper";
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
// import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";


const Profileedit = ({navigation}) =>{
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
  const [imageUrl,setImageUrl]=useState(`${user.profilePhotoUrl}`)

  
  const [image, setImage] = useState('https://api.adorable.io/avatars/80/abott@adorable.png');
  const {colors} = useTheme();
  const [username,setUsername]=useState(`${user.username}`)
  const [email,setEmail]=useState(`${user.email}`)

  useEffect(() => {
    db.collection('users').doc(user.uid).onSnapshot((doc) => {
        setProfileUserData(doc.data());
    });
}, [])

const getPermissions = async () => {
  if(Platform.OS !== 'web'){
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      return status;
  }
}

const pickImage = async () =>{

  try{
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1,1],
          quality:0.5
      })
      if(!result.cancelled){
        setImageUrl(result.uri)
      }
  } catch(error) {
      console.log("Error Pick Image: ",error)
  };
}


const addProflePhoto = async() =>{
  const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    
    if(granted){
        
      pickImage()

    }else{
      alert("We  need Permission to access your camera roll");
    }
}

const update = () =>{
      try{
        // Set the "capital" field of the city 'DC'
db.collection("users").doc(user.uid).update({
  username: username,
  email:email,
  profilePhotoUrl:imageUrl
});
      }catch(error){
        console.log("Error @Updating: ",error.message)
      }
}

  return(
    <View style={styles.container}>
      <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="black" ></Ionicons>
                    </TouchableOpacity>
                  <View>
                  <TouchableOpacity style={{textAlign:"center",marginLeft:50}}>
                        <Text style={{ fontWeight: "500"}}>{profileUserData?.username}</Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
                <View style={{alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={0.5} onPress={addProflePhoto}>

<View style={styles.profile}>
   {profileUserData ? (
<Image
style={{flex:1}}
source={{uri:profileUserData?.profilePhotoUrl}}

/>
   ):(
<View style={styles.dProfile}>
      <AntDesign name="plus" size={24} color="#fff"/>
    </View>
   )}
    
  </View>
  
  </TouchableOpacity>
          <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
          {profileUserData?.username}
          </Text>
          <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>
          {profileUserData?.email}
          </Text>
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder={profileUserData?.username}
            placeholderTextColor="#666666"
            value={username}
            onChangeText={(text) => setUsername(text)}
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        


        <View style={styles.action}>
          <FontAwesome name="envelope-o" color={colors.text} size={20} />
          <TextInput
            placeholder={profileUserData?.email}
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        {/* <View style={styles.action}>
          <FontAwesome name="globe" color={colors.text} size={20} />
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View> */}
        {/* <View style={styles.action}>
          <Icon name="map-marker-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View> */}
        <TouchableOpacity style={styles.commandButton} onPress={update}>
          <Text style={styles.panelButtonTitle}>Update</Text>
        </TouchableOpacity>
    </View>
  )
}
export default Profileedit

const styles = StyleSheet.create({
  profile:{
    backgroundColor: "#e1e2e6",
    width:80,
    height:80,
    borderRadius:40,
    alignSelf: "center",
    marginTop:10,
    overflow: "hidden"
 },
 dProfile:{
    alignItems:"center",
    justifyContent:"center",
    flex:1
 },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'grey',
    alignItems: 'center',
    marginTop: 200,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
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
