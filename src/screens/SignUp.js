import React,{useContext, useState,useEffect} from 'react'
import { Image,StyleSheet, Text, View,TextInput,TouchableOpacity,ActivityIndicator,Platform  } from 'react-native'
import {Button} from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import { Input } from 'react-native-elements';
import {AntDesign} from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import {FirebaseContext} from "../../context/FirebaseContext"
import {UserContext} from "../../context/UserContext"
import { db } from "../../firebase"

const SignUp = ({navigation}) => {
    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading] = useState(false)
    const [profilePhoto,setProfilePhoto] = useState("")
    const firebase = useContext(FirebaseContext)
    const [_,setUser] = useContext(UserContext)



    const getPermissions = async () => {
      if(Platform.OS !== 'web'){
          const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
          return status;
      }
    }
   


    // const pickFromGallery = async ()=>{
    //     const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    //      if(granted){
    //     let data = await ImagePicker.launchImageLibraryAsync({
    //          mediaTypes:ImagePicker.MediaTypeOptions.Images,
    //          allowsEditing:true,
    //          aspect:[1,1],
    //          quality:0.5
    //      })
    //      if(!data.cancelled){
    //       let newFile = {uri:data.uri,
    //       type:`test/${data.uri.split(".")[1]}`,
    //       name:`test.${data.uri.split(".")[1]}`}
    //      handleUpload(newFile) 
    //   }
    //      }else{
    //      Alert.alert("You need to give us permission to your phone")
    //      }
    //     }

    //     const handleUpload = (image)=>{
    //         const data = new FormData()
    //         data.append('file',image)
    //         data.append('upload_preset','employeeApp')
    //         data.append("cloud_name","dtmddq4dw")
    
    //         fetch("https://api.cloudinary.com/v1_1/dtmddq4dw/image/upload",{
    //             method:"post",
    //             body:data,
    
    //         }).then(res=>res.json())
    //         .then(data=>{
    //             setProfilePhoto(data.url)
    //             // setModal(false)
    //         }).catch(err=>{
    //             Alert.alert("Something went wrong")
    //         })
    //     }

    const signUp = async () => {
        setLoading(true)

        const user = {username, email,password,profilePhoto}

        try{

            const createUser = await firebase.createUser(user)

           setUser({ ...createUser, isLoggedIn:true})


        }catch(error){
            console.log("Error: ",error)
        } finally {
            setLoading(false)
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
              setProfilePhoto(result.uri)
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
    return (
        <View style={styles.container}>
            <StatusBar  style="light"/>
            <View style={styles.main}>
                <Text style={styles.text}>Sign Up to get started</Text>
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={addProflePhoto}>

          <View style={styles.profile}>
             {profilePhoto ? (
        <Image
        style={{flex:1}}
        source={{uri:profilePhoto}}

        />
             ):(
<View style={styles.dProfile}>
                <AntDesign name="plus" size={24} color="#fff"/>
              </View>
             )}
              
            </View>
            
            </TouchableOpacity>

              
            <View style={styles.auth}>
            <View style={styles.authContainer}>
                    <Text style={styles.label}>Username</Text>
                   <TextInput style={styles.textInput}
                   autoCapitalize="none"
                //    autoCompleteType="text"
                   autoCorrect={false}
                   autoFocus={true}
                   value={username}
                   onChangeText={(text) => setUsername(text)}

                   />
                </View>
                <View style={styles.authContainer}>
                    <Text style={styles.label}>Email</Text>
                   <TextInput style={styles.textInput}
                   autoCapitalize="none"
                   autoCompleteType="email"
                   autoCorrect={false}
                   autoFocus={true}
                   value={email}
                   keyboardType="email-address"
                   onChangeText={(text) => setEmail(text)}

                   />
                </View>
                <View style={styles.authContainer}>
                    <Text style={styles.label}>Password</Text>
                   <TextInput style={styles.textInput}
                   autoCapitalize="none"
                   autoCompleteType="password"
                   autoCorrect={false}
                   autoFocus={true}
                   secureTextEntry={true}
                   value={password}
                   onChangeText={(text) => setPassword(text)}
                   />
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={signUp}>
            <View style={styles.signInContainer} disabled={loading}>
                {loading ?(
                    <ActivityIndicator size="large" color="#fff" />
                ):(
                    <Text style={{color:"#fff",fontWeight:"600"}}>Sign Up</Text>
                )}
            </View>
            </TouchableOpacity>
        
        <TouchableOpacity activeOpacity={0.5} onPress={()=> navigation.navigate("SignIn")}>
        <View>
            <Text style={{
                textAlign: "center",
                color: "#8f9196"
            }}>Already have an account? <Text style={{fontWeight:"600",color:"#8022d9"}}>Sign In</Text></Text>
        </View>
        </TouchableOpacity>
        
            <View style={styles.headerGraphic}>
                <View style={styles.rightCircle}/>
                <View style={styles.leftCircle}/>
            </View>
        </View>
    )
}

export default SignUp

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
    signInContainer:{
      margin: 32,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#8022d9",
      borderRadius:6
    },
    container:{
      flex:1
    },
    auth:{
     marginLeft: 32,
     marginRight:32,
     marginTop:36
    },
    authContainer:{
     marginBottom: 20
    },
    headerGraphic:{
     position:"absolute",
     width:"100%",
     top:-50,
     zIndex:-100

    },
    rightCircle:{
        backgroundColor: "#8022d9",
        position: "absolute",
        width:400,
        height:400,
        borderRadius:200,
        right:-100,
        top:-200
    },
    leftCircle:{
       backgroundColor: "#23a6d5",
       position: "absolute",
       width:200,
       height:200,
       borderRadius:100,
       left:-50,
       top:-50
    },
    main:{
        marginTop:150,
        color:"red",
        fontSize: 32
    },
    text:{
        fontSize:32,
        fontWeight:"300",
        textAlign: "center",
        color: "#8f9196"
    },
    textInput:{
        borderBottomColor: "#8e93a1",
        borderBottomWidth:0.5,
        height:48
    },
    label:{
     color: "#8e93a1",
     fontSize:12,
     textTransform:'uppercase',
     fontWeight:"300"
    }
})
