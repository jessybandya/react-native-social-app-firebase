import  firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAm4bXeT9uSWr0MwemU_evPjzrUz6G6SI",
  authDomain: "jess-soc-app-d3ec1.firebaseapp.com",
  projectId: "jess-soc-app-d3ec1",
  storageBucket: "jess-soc-app-d3ec1.appspot.com",
  messagingSenderId: "591789467623",
  appId: "1:591789467623:web:949888a6d94976d002bf42",
  measurementId: "G-RTW8ZD8K78"
};

  let app;
  if(firebase.apps.length === 0){
      app = firebase.initializeApp(firebaseConfig)
  }else{
    app = firebase.app();
  }

const db = app.firestore();
const auth = firebase.auth();

export {db, auth }