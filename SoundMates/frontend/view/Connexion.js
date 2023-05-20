import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, CheckBox } from 'react-native';
import { BottomButton, LogButton } from '../components/Boutons.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backend } from './../../App.js'
import * as Location from 'expo-location'
import sha256 from 'crypto-js/sha256';
import { LinearGradient } from 'expo-linear-gradient';


export function PromptConnexion({showConnexion}) {
const [connexionError, setConnexionError] = useState(false);
const [showRegister, setRegister] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [gender, setGender] = useState([false,false]);
const [age, setAge] = useState(0);
const [voidFields, setVoidFields] = useState(false);
const [registerSuccess, setRegisterSuccess] = useState(false);
const [registerError, setRegisterError] = useState(false);
const [location, setLocation] = useState(null)
let sexe =""

useEffect(()=>{
    async function miseEnPlace(){

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
    miseEnPlace()
  },[]);

const setRegisterFalse = () => {
    setConnexionError(false);
    setRegister(false);
    setVoidFields(false);
}

const setRegisterTrue = () => {
    setConnexionError(false);
    setRegister(true);
}

const HandleConnectionPress = () => {
const data = "data={\"username\": \""+ username+"\",\"hashedPassword\": \""+password +"\"}";
fetch(backend + "login", {
headers: {
"Content-Type": "application/x-www-form-urlencoded",
},
body: data,
method: "POST"
})
.then(response => response.json())
.then(data => {
if (data.status === true) {
// La connexion est réussie, vous pouvez effectuer des actions ici
setConnexionError(false);
// Update du booléen d'affichage de l'écran de Connexion et de l'Id de user
AsyncStorage.setItem('myId', JSON.stringify(data.user.id))
.then(() => {
  console.log('Valeur myId sauvegardée');
})
.catch((error) => {
  console.log('Erreur lors de la sauvegarde de la valeur de myId', error);
});

AsyncStorage.setItem('myBool', JSON.stringify(true))
  .then(() => {
    console.log('Valeur myBool sauvegardée');
  })
  .catch((error) => {
    console.log('Erreur lors de la sauvegarde de la valeur de myBool', error);
  });
} 
else {
    setConnexionError(true);
}
});
};

const RegisterRequest = () => {
const data = "data={\"name\": \""+ name+"\", \"age\": \""+ age+"\", \"username\": \""+ username+"\", \"hashedPassword\": \""+password +"\", \"sexe\": \""+sexe +"\", \"latitude\": \""+location.coords.latitude +"\", \"longitude\": \""+location.coords.longitude +"\"}";
console.log(data)
fetch(backend + "register", {
headers: {
"Content-Type": "application/x-www-form-urlencoded",
},
body: data,
method: "POST"
})
.then(response => response.json())
.then(data => {
if (data.status === true) {
    // L'inscription est réussie
    console.log('Success, register done')
    setRegisterSuccess(true)
    AsyncStorage.setItem('firstConnection', JSON.stringify(true))
    .then(() => {
        console.log('Valeur firstConnection sauvegardée');
    })
    .catch((error) => {
        console.log('Erreur lors de la sauvegarde de la valeur de firstConnection : ', error);
    });
} else {
    // L'inscription a échoué
    setRegisterError(true);
    console.log('Error, register failed : ',data)
}
});
};

const Register = () => {
    if (gender[0]) {
        sexe = "M"
    }
    if (gender[1]) {
        sexe = "F"
    }
    console.log("name : ",name,", username : ",username,", password : ",password,", sexe : ",sexe)
    if (name == "" || username == "" || password == "" || sexe == "") {
        setVoidFields(true);
    }
    else {
        if (location) {
            RegisterRequest();
        }
        else {
            alert('Wait until we can access your location');
        }
    }
}

const promptError = () => {
return (
<View style={styles.current}>
{connexionError ? (
<View>
<View style={{ height: 20 }}></View>
<Text style={styles.alertText}> Unknown username or incorrect password, please try again or register first </Text>
</View>
) : (
    voidFields ? (
        <View>
        <View style={{ height: 20 }}></View>
        <Text style={styles.alertText}> Please enter all the fields </Text>
        </View>
    ) : (
    registerError ? (
        <View>
        <View style={{ height: 20 }}></View>
        <Text style={styles.alertText}> Register failed, please try another username </Text>
        </View>
        ) : (
            null
        )
    )
)
}
</View>
)
};

    const promptRegister = () => {
    return (
        <View>
        {registerSuccess ? (
            <Text style={styles.successText}> You are now registered </Text>
        ) : (
            null
        )}
        <LinearGradient       
        colors={['#FFABBB', '#FF9C64']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
        style={styles.formContainer}>
        <Text style={styles.fancy}>Register :</Text>
            <View style={{ height: 15 }}></View>
            <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => {
                setName(text);
                setRegisterSuccess(false);
                setRegisterError(false);
                setVoidFields(false);
            }}
            autoCapitalize="none"
            />
            <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            onChangeText={(text) => {
                setAge(text);
                setRegisterSuccess(false);
                setRegisterError(false);
                setVoidFields(false);
            }}
            autoCapitalize="none"
            />
            <View style={styles.input}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                    value={gender[0]}
                    onValueChange={() => {
                        setGender([true, false]);
                    }}
                    />
                    <Text style={styles.inputLabel}>Male</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                    value={gender[1]}
                    onValueChange={() => {
                        setGender([false, true]);
                    }}
                    />
                    <Text style={styles.inputLabel}>Female</Text>
                </View>
            </View>
            <TextInput
            style={styles.input}
            placeholder="username"
            onChangeText={(text) => {
                setUsername(text);
                setRegisterSuccess(false);
                setRegisterError(false);
                setVoidFields(false);
            }}
            autoCapitalize="none"
            />
            <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(text) => {
                const hashedPassword = sha256(text).toString();
                setPassword(hashedPassword);
                setRegisterSuccess(false);
                setRegisterError(false);
                setVoidFields(false);
            }}
            autoCapitalize="none"
            />
            <View style={{ height: 20 }}></View>
            <LogButton label={"Register"} onPress={Register} />
        </LinearGradient>
        </View>
        )
    };

  const promptOther = () => {
    return (
        <View style={styles.register}>
        {showRegister ? (
            <View>
                <Text style={styles.notLogged}> Already registered ?</Text>
                <LogButton label={"Login"} onPress={setRegisterFalse} />
            </View>
        ) : (
            <View>
                <Text style={styles.notLogged}> Not logged in ?</Text>
                <LogButton label={"Register now"} onPress={setRegisterTrue} />
            </View>
        )}
        </View>
    )
  };

  // Fonction principale
  return (
    <View style={styles.container}>
      {showRegister ? (
            promptRegister()
            ) : (
                <LinearGradient           
                colors={['#FFABBB', '#FF9C64']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 1]}
                style={styles.formContainer}>
                    <Text style={styles.fancy}>Login :</Text>
                    <View style={{ height: 15 }}></View>
                    <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) => {
                        setUsername(text);
                        setConnexionError(false);
                    }}
                    autoCapitalize="none"
                    />
                    <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => {
                        const hashedPassword = sha256(text).toString();
                        setPassword(hashedPassword);
                        setConnexionError(false);
                    }}                   
                    autoCapitalize="none"
                    />
                    <View style={{ height: 20 }}></View>
                    <LogButton label={"Connection"} onPress={HandleConnectionPress} />
                </LinearGradient>
            )
        }
        {promptOther()}
        {promptError()}
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: { 
        borderWidth: 1,
        borderColor: '#F47A07',
        borderRadius: 20,
        padding: 20,
        width: 200,
        marginBottom: 20,
        marginTop: 20,
    },
    notLogged: {
        color: "#F47A6F",
        paddingBottom: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#333333",
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        flexDirection:'row',
    },
    inputLabel: {
        paddingLeft: 3,
        paddingRight: 5,
    },
    register: {
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertText: {
        borderWidth: 1,
        borderColor: '#F47A07',
        color: "#FF0000",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        fontSize: 20,
    },
    successText: {
        borderWidth: 1,
        borderColor: '#F47A07',
        color: "green",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        fontSize: 20,
    },
    fancy: {
        fontSize: 20,
        color: "#111111",
    }
});
