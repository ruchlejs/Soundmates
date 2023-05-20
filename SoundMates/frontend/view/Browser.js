import { useState,useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import ChoixButton from '../components/ChoixButton.js';
import { backend,x_access_token } from './../../App.js'
import { Buffer } from 'buffer';
import ImageBrowser from '../components/ImageBrowser.js';
import { LinearGradient } from 'expo-linear-gradient';


export default function PromptBrowser() {
  // const [imageUrl, setImageUrl] = useState(null); // ajout de l'état imageUrl
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [images, setImages] = useState(new Array(6).fill(null)); // tableau pour les images
  const [sexe, setSexe] = useState('');
  const [tags, setTags] = useState(new Array(8).fill(null));
  const [idCurrent, setIdCurrent] = useState(0);
  const [idCount, setIdCount] = useState(0);
  const [len, setLen] = useState([]);
  const [dist,setDist] = useState(0);
  
  useEffect(() => {
    // Update de l'utilisateur courant
    console.log(x_access_token);
    setTimeout(() => {
      nextProfile();
    }, 200);
  }, []);

  const nextProfile = () => {
    fetch( backend + 'discovery',
    {
      headers: {
        'x-access-token': x_access_token,
        },
      method : 'GET',
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erreur de réponse du serveur');
      }
    })
    .then((data) => {
      setName(data.name);
      setAge(data.age);
      setSexe(data.sexe);
      setDist(Math.floor(data.distance));
      setIdCurrent(data.id);
      console.log(data);      
      if (data.images.length) {
        setLen(data.images.length)
        const updatedImages = [...images];
        data.images.forEach((image, index) => {
          if (index < 6) { // on ne prend que les 6 premières images
              console.log(index)
              const matrice = image.buffer.data
              const binaryString = String.fromCharCode.apply(null,matrice);
              const base64String = Buffer.from(binaryString, 'binary').toString('base64');
              updatedImages[index]=(`data:image/png;base64,${base64String}`); // on met à jour la photo de profil
          }
        });
        setImages(updatedImages);
      }
      const tags = data.tags
      console.log(tags)
        if (tags.length) {
          const newSelectedStyles = [];
          tags.forEach((tag) => {
            newSelectedStyles.push(tag.name);
          });
          setTags(newSelectedStyles);
        }
    }
    )
    .catch((error) => {
      setName(null);
    });
  }

  const nextPicture = () => {
    if (idCount < len - 1) {
      setIdCount(idCount + 1);
    }
    else {
      setIdCount(0);
    }
  }

  const pressYes = () => {
    console.log("PressYes");
    fetch( backend + 'discovery',
    {
      headers: {
        'x-access-token': x_access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
      method : 'POST',
      body: 'data={"id":' + idCurrent + ',"likeOrDislike":"like"}',
      })
      .then(response => {
      nextProfile();
    })
  };

  const pressNo = () => {
    console.log("PressNo");
    fetch( backend + 'discovery',
    {
      headers: {
        'x-access-token': x_access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
      method : 'POST',
      body: 'data={"id":' + idCurrent + ',"likeOrDislike":"dislike"}',
      })
      .then(response => {
        nextProfile();
    })
  };

  return (
  <View style={styles.current}>
    <View style={styles.imageContainer}>
      {/* <Image style={styles.image} source={{uri: images[0]}}/> */} 
      <ImageBrowser source={{uri: images[idCount]}} onPress={nextPicture} style={styles.image}/>
      {name ? (
          <LinearGradient           
            colors={['#F47A6F', '#F43A6F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.age}>{age} years</Text>
          {sexe == 'M' ? (<Text style={styles.sexe}>Male</Text>) : (<Text style={styles.sexe}>Female</Text>)}
          <Text style={styles.km}>{dist} Km</Text>
          <Text style={styles.msc}>Favorite Music :</Text>
          {tags[0] ? (<Text>- {tags[0]}</Text>): null}
          {tags[1] ? (<Text>- {tags[1]}</Text>): null}
          {tags[2] ? (<Text>- {tags[2]}</Text>): null}
          {tags[3] ? (<Text>- {tags[3]}</Text>): null}
          {tags[4] ? (<Text>- {tags[4]}</Text>): null}
          {tags[5] ? (<Text>- {tags[5]}</Text>): null}
          {tags[6] ? (<Text>- {tags[6]}</Text>): null}
          {tags[7] ? (<Text>- {tags[7]}</Text>): null}
        </LinearGradient>
      ) : (
        <View style={styles.plusrien}>
          <Text style={styles.name}>No more users to review</Text>
          <Text>{'Come back later :)'}</Text>
        </View>
      )
      }
    </View>
    <View style={styles.choix}>
      <ChoixButton source={require("./../../assets/coeur.png")} onPress={pressYes}/>
      <ChoixButton source={require("./../../assets/CroixBleue.png")} onPress={pressNo}/>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 1,
        width : '100%',
    },
    infoContainer: {
      flexDirection: 'column',
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 50,
    },
    plusrien: {
      marginRight: 180,
      flex: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'black',
    },
    image: {
      width: 1000,
      height: 500,
      resizeMode: 'contain',
      marginRight: 50,    
    },
    current: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    choix: {
      flexDirection: 'row',
      flex: 0,
      width : '100%',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    infos: {
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      paddingBottom: 20,
    },
    age: {
      fontSize: 20,
      
      paddingBottom: 20,
    },
    sexe: {
      fontSize: 24,
      
      paddingBottom: 20,
    },
    km: {
      fontSize: 20,
      fontWeight: 'bold',
      paddingBottom: 20,
    },
    msc: {
      fontSize: 24,
      fontStyle: 'italic ',
      paddingBottom: 20,
    },
    format: {
      width: 1000,
      height: 500,
      resizeMode: 'contain',
    }
  });