import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PromptBrowser from './frontend/view/Browser.js';
import { PromptConnexion } from './frontend/view/Connexion.js';
import PromptProfile from './frontend/view/Profile.js';
import PromptSocial from './frontend/view/Social.js';
import { CheckLogin } from './frontend/components/Boutons.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageButton from './frontend/components/ImageButton.js';

export const backend = "https://soundmates.osc-fr1.scalingo.io/";
export let x_access_token = "";
export let userId = 0;

AsyncStorage.setItem('myBool', JSON.stringify(false)) // On positionne le booléen de connexion à false pour afficer l'écran de connexion
    .then(() => {
      console.log('Valeur myBool sauvegardée');
    })
    .catch((error) => {
      console.log('Erreur lors de la sauvegarde de la valeur myBool : ', error);
    });

AsyncStorage.setItem('myId', JSON.stringify(0)) // Numéro d'id de l'utilisateur connecté
    .then(() => {
      console.log('Valeur myId sauvegardée');
    })
    .catch((error) => {
      console.log('Erreur lors de la sauvegarde de la valeur de myId : ', error);
    });

AsyncStorage.setItem('firstConnection', JSON.stringify(false))
    .then(() => {
        console.log('Valeur firstConnection sauvegardée');
    })
    .catch((error) => {
      console.log('Erreur lors de la sauvegarde de la valeur de firstConnection : ', error);
    });

export default function App() {
  const [showSocial, setShowSocial] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [showConnexion, setShowConnexion] = useState(true);


  const handleSocialPress = () => {
    setShowSocial(true);
    setShowProfile(false);
    setShowBrowser(false);
  };

  const handleFirstConnect = () => {
    setShowConnexion(false);
  }

  const Connect = () => {
    setShowConnexion(false);
    const id = AsyncStorage.getItem('myId')
    .then((value) => {
      const id = JSON.parse(value);

      // Recupération du username
      fetch(backend + "users/"+id, {
        method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            const user = data.user.username;
            // Mise à jour du token d'accès
            fetch(backend + "getToken/"+user, {
              method: "GET"
              })
              .then(response => response.json())
              .then(data => {
                x_access_token = data.token;
                userId = id;
              })

        })


    })
  

    const bool = AsyncStorage.getItem('firstConnection')
    .then((value) => {
      const bool = JSON.parse(value);
      if (bool) {
        handleFirstConnect()
      }
      else {
        handleBrowserPress();
      }
      })
      .catch((error) => {
        console.log('Erreur lors de la récupération de la valeur de firstConnection : ', error);
      });
  }

  const tryConnect = () => { // On récupère le booléen de connection, s'il est true alors on passe à l'écran d'accueil
    const bool = AsyncStorage.getItem('myBool')
    .then((value) => {
      const bool = JSON.parse(value);
      if (bool) {
        Connect();
      }
      else {
        setTimeout(() => {
          tryConnect();
        }, 1000); // Attendre 1 secondes avant de rappeler tryConnect()
      }
    })
    .catch((error) => {
      console.log('Erreur lors de la récupération de la valeur de myBool : ', error);
    });
  };

  const handleProfilePress = () => {
    setShowSocial(false);
    setShowProfile(true);
    setShowBrowser(false);
  };

  const handleBrowserPress = () => {
    setShowSocial(false);
    setShowProfile(false);
    setShowBrowser(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={require("./assets/Soundmates.png")} style={{width: 700, height: 100, resizeMode: 'contain'}}/>
      </View>
      <View style={styles.centerPage}>
        {showConnexion ? (
          <View>
            <PromptConnexion />
            <CheckLogin label={"Invisible"} onPress={tryConnect} />
          </View>
          ) : (
          <View>
            {showBrowser ? (
              <PromptBrowser />
            ) : showSocial ? (
              <PromptSocial />
            ) : showProfile ? (
              <PromptProfile />
            ) : ( 
              <Text style={styles.firstConnectionMessage}> This is your first connexion, please update your profile </Text>
            )}
          </View>
        )}
      </View>
      {!showConnexion ? (
          <View style={styles.bottomPage}>
              <ImageButton source={require("./assets/SansLeNom.png")} style={styles.menu} onPress={handleBrowserPress}/>
              <ImageButton source={require("./assets/messages.png")} style={styles.menu} onPress={handleSocialPress}/>
              <ImageButton source={require("./assets/profile.png")} style={styles.menu} onPress={handleProfilePress}/>
          </View>
      ): (
        null
        )}
      <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPage: {
    flex: 1,
    width : '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstConnectionMessage: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },  
  top : {
    flex: 0,
    paddingTop : 20,
    width : '100%',
    height : '15%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    fontSize : 30,
    paddingBottom : 50,
  },
  menu: {
    flex:1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choix: {
    flexDirection: 'row',
    flex: 0,
    width : '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPage: {
    flexDirection: 'row',
    flex: 0,
    width : '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
