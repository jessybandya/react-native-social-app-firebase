import React,{useContext, useState} from 'react'
import { StyleSheet, Text, View,TextInput,TouchableOpacity,ActivityIndicator  } from 'react-native'
import {Button} from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import { Input } from 'react-native-elements';
// import Text from "../../components/Text"
import { FirebaseContext } from '../../context/FirebaseContext';
import { UserContext } from '../../context/UserContext';


const SignIn = ({navigation}) => {
    const [email,setEmail] = useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading] = useState(false)
    const [_,setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

   const signIn = async () => {
       setLoading(true)
       
       try{
        await firebase.signIn(email,password)

        const uid =  firebase.getCurrentUser().uid;
        const userInfo = await firebase.getUserInfo(uid)

        setUser({
            username: userInfo.username,
            email: userInfo.email,
            uid,
            profilePhotoUrl: userInfo.profilePhotoUrl,
            isLoggedIn: true
        })
       }catch(error){
           alert(error.message)
       }finally{
           setLoading(false)
       }
   }

    return (
        <View style={styles.container}>
            <StatusBar  style="light"/>
            <View style={styles.main}>
                <Text style={styles.text}>Welcome Back</Text>
            </View>
            <View style={styles.auth}>
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
            <TouchableOpacity activeOpacity={0.5} onPress={signIn}>
            <View style={styles.signInContainer} disabled={loading}>
                {loading ?(
                    <ActivityIndicator size="large" color="#fff" />
                ):(
                    <Text style={{color:"#fff",fontWeight:"600"}}>Sign In</Text>
                )}
            </View>
            </TouchableOpacity>
        
        <TouchableOpacity activeOpacity={0.5} onPress={()=> navigation.navigate("SignUp")}>
        <View>
            <Text style={{
                textAlign: "center",
                color: "#8f9196"
            }}>New to the SocialApp? <Text style={{fontWeight:"600",color:"#8022d9"}}>Sign Up</Text></Text>
        </View>
        </TouchableOpacity>
        
            <View style={styles.headerGraphic}>
                <View style={styles.rightCircle}/>
                <View style={styles.leftCircle}/>
            </View>
        </View>
    )
}

export default SignIn

const styles = StyleSheet.create({
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
     marginTop:64
    },
    authContainer:{
     marginBottom: 32
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
        marginTop:192,
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
