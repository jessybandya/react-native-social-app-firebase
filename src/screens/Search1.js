import React,{useState,useEffect,useContext} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,SafeAreaView,ActivityIndicator } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import MessageScreen1 from './MessageScreen1';
import { List, ListItem, SearchBar,Avatar  } from "react-native-elements";

const Search1 = ({navigation,postId}) => {
  const [user, setUser] = useContext(UserContext)
  const firebase = useContext(FirebaseContext)
  const [posts, setPosts] = useState([])
  const [follows, setFollows] = useState([])
  const [loading,setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search,setSearch] = useState([])
  const [profileUserData, setProfileUserData] = useState();


  useEffect(() => {
    db.collection('users').doc(postId).onSnapshot((doc) => {
        setProfileUserData(doc.data());
    });
}, [])

const Profileview = (ownerId) =>{
  navigation.navigate("Profileview",{
    ownerId:postId
  })
}


    return (
        <View style={styles.container}>
         <ListItem key={postId}  onPress={()=> Profileview({ownerId:postId})} bottomDivider>
            <Avatar 
            rounded
            source={{uri: profileUserData?.profilePhotoUrl}}

        />
        <ListItem.Content>
             <ListItem.Title  style={{fontWeight:"900",color:"#666",fontSize:20}}>
                  {profileUserData?.username}
             </ListItem.Title>
             <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                 
        {/* {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message} */}
        {profileUserData?.email}
             </ListItem.Subtitle>
        </ListItem.Content> 
        </ListItem>
                 
        </View>
    )
}

export default Search1


const styles = StyleSheet.create({
    container:{

    },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "pink",
      marginTop:30,
  }
})
