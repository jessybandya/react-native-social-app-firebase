import React,{useEffect,useContext} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import  LottieView from "lottie-react-native"
// import { StatusBar } from 'expo-status-bar';
import { UserContext } from '../../context/UserContext'
import { FirebaseContext } from '../../context/FirebaseContext'


const LoadingScreen = () => {      

    const [_,setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
          setTimeout(async () => {
              const user = firebase.getCurrentUser()

              if(user){
                  const userInfo = await firebase.getUserInfo(user.uid)

                  setUser({
                      isLoggedIn: true,
                      email: userInfo.email,
                      uid: userInfo.uid,
                      username: userInfo.username,
                      profilePhotoUrl: userInfo.profilePhotoUrl
                  })
              }else{
                setUser((state) => ({ ...state,isLoggedIn: false}))

              }

          },500)
    }, [])
    return (
        <View style={styles.container}>
             {/* <StatusBar  style="light"/> */}
            <Text style={{color:"#8f9196",fontSize:32}}>SocialApp</Text>

            <LottieView source={require("../../assets/66650-loading-circle.json")} autoPlay loop style={{width:"100%"}}/>
        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#222222"
    }
})
