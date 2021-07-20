import React,{useState,useEffect,useContext} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,SafeAreaView,ActivityIndicator } from 'react-native'
import { auth,db } from '../../firebase';
import {UserContext} from "../../context/UserContext"
import {FirebaseContext} from "../../context/FirebaseContext"
import Search1 from './Search1';
import { List, ListItem, SearchBar,Avatar  } from "react-native-elements";

const Search = ({navigation}) => {
  const [user, setUser] = useContext(UserContext)
  const firebase = useContext(FirebaseContext)
  const [posts, setPosts] = useState([])
  const [follows, setFollows] = useState([])
  const [loading,setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search,setSearch] = useState([])
  




  useEffect(()=>{

    try{
        setLoading(true)

        const unsuscribe = db.collection('users').onSnapshot(snapshot =>{
            setPosts(snapshot.docs.map(doc =>({
                id:doc.id,
                data:doc.data()
            })))
         })   
         return unsuscribe

    }catch(error){
        console.log("Error @Fetching: ",error.message)
    }finally{
        setLoading(false)
    }

  },[])

    return (
        <View style={styles.container}>
                                       <View style={styles.header}>
                  <View>
                  <TouchableOpacity activeOpacity={1}>
                        <Text style={{ fontWeight: "500"}}></Text>
                    </TouchableOpacity>
                  </View>
 
                </View>
                <View>
                <SearchBar placeholder="All users" lightTheme round  />
                {posts.map(({ id})=>(
               <Search1  key={id} postId={id} navigation={navigation}/>
           ))}
                </View>
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container:{
        flex:1,

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
