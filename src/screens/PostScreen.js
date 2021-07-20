import React,{useState,useEffect,useContext} from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image,Platform,Alert } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import { db } from '../../firebase';
import * as ImagePicker from "expo-image-picker";
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"

export default function PostScreen({navigation}){
    const [input,setInput]= useState("")
    const [imageUrl,setImageUrl]=useState("")
    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)



 
    const getPermissions = async () => {
        if(Platform.OS !== 'web'){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            return status;
        }
      }

    const addPost = async(event) =>{
        event.preventDefault();
        let errors = {};
        if(!input.trim()){
            errors.input=alert(`You can't post without a word!!!`);
        }else if(!imageUrl.trim()){
            errors.imageUrl=alert(`Kindly add a photo`);
        }else{
            await db.collection('posts').add({
                postCaption:input,
                postImage:imageUrl,
                ownerId:user.uid,
                ownerUsename:user.username,
                ownerprofilePhotoUrl:user.profilePhotoUrl,
                timestamp:Date.now(),

            }).then(()=>{
                navigation.navigate("Home")
            }).catch((error)=> alert(error))
        setImageUrl("")
        
        setInput("")
        
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

        const handleUpload = (image)=>{
            const data = new FormData()
            data.append('file',image)
            data.append('upload_preset','employeeApp')
            data.append("cloud_name","dtmddq4dw")
    
            fetch("https://api.cloudinary.com/v1_1/dtmddq4dw/image/upload",{
                method:"post",
                body:data,
    
            }).then(res=>res.json())
            .then(data=>{
                setImageUrl(data.url)
            }).catch(err=>{
                Alert.alert("Something went wrong")
            })
    
        }
 

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={addPost}>
                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Image source={{uri: user.profilePhotoUrl}} style={styles.avatar}></Image>
                    <TextInput
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        style={{ flex: 1 }}
                        placeholder="Want to share something?"
                        value={input}
                        onChangeText={(text)=> setInput(text)}
                    ></TextInput>
                </View>

                <TouchableOpacity style={styles.photo} onPress={addProflePhoto}>
                    <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>

                <View style={{marginTop: 32, height: "50%",width:"100%" }}>
                    {imageUrl ?(
                    <Image source={{ uri: imageUrl }} style={{ width: "100%", height: "100%" }}/>
                    ):(
                        <Text>Image</Text>
                    )}
                </View>
            </SafeAreaView>
        );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
        marginTop:50
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
});