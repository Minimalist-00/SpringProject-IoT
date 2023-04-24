import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { //各Firebaseサービスへのアクセスを設定
    apiKey: "AIzaSyAwUyytTxkfYF0U4KZdm701Gg4TICcbA4w",
    authDomain: "harupro-iot.firebaseapp.com",
    databaseURL: "https://harupro-iot-default-rtdb.firebaseio.com",
    projectId: "harupro-iot",
    storageBucket: "harupro-iot.appspot.com",
    messagingSenderId: "8196933954",
    appId: "1:8196933954:web:d5b33ab0d552faf32e20db",
    measurementId: "G-HHJYC1YLN0"
  };
  
  const app = initializeApp(firebaseConfig); //Firebaseアプリを初期化
  const db = getFirestore(app); //FirebaseアプリからCloud Firestoreのインスタンスを取得
  
  export default db;
