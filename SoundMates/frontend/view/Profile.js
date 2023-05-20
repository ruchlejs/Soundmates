import { React, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageButton from './../components/ImageButton.js';
import { backend, x_access_token, userId } from './../../App.js';
import { launchImageLibrary } from 'react-native-image-picker';
import { encode } from 'base64-js';
import { Buffer } from 'buffer';
import { Tags } from './tagSelect.js'
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function promptProfile() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState(0);
    const [sexe, setSexe] = useState('');
    const [settings, setSettings] = useState(false);
    const [images, setImages] = useState(new Array(6).fill(null)); // tableau pour les images
    const [profilePicture, setProfilePicture] = useState(null);
    const [update, setUpdate] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    
    useEffect(() => {
        // Update des valeurs de noms et age
        fetch(backend + 'users/'+userId, {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((data) => {
            setAge(JSON.stringify(data.user.age));
            setName(data.user.name);
            setUsername(data.user.username);
            // setSexe(data.user.sexe)
          })
      }, []);
      
    useEffect(() => {
    if (username) {
        // Mise à jour des images
        setImages(new Array(6).fill(null)); // On reset la liste dse images
        fetch(`${backend}${username}/images`, {
            headers: {
            'x-access-token': x_access_token,
            },
            method: 'GET',
        })
        .then(response => response.json())
        .then((data) => {
            if (!data.images.length) {
                setProfilePicture(null)
            }
            else {
                const updatedImages = [...images];
                data.images.forEach((image, index) => {
                    if (index < 6) { // on ne prend que les 6 premières images
                        console.log(index)
                        const matrice = data.images[index].buffer.data
                        const binaryString = String.fromCharCode.apply(null,matrice);
                        const base64String = Buffer.from(binaryString, 'binary').toString('base64');
                        updatedImages[index]=(`data:image/png;base64,${base64String}`); // on met à jour la photo de profil
                        if (index==0) {
                            setProfilePicture(`data:image/png;base64,${base64String}`); // on met à jour la photo de profil
                            console.log(`data:image/png;base64,${base64String}`)
                        }
                    }
                });
                setImages(updatedImages);
            }
        })
    }
    }, [username, update]);    
      

    // Naviguer vers l'écran de modification du profil
    function editProfile() {
        setSettings(true);
    }

    // Revenir à l'écran de profil
    function saveProfile() {
        setSettings(false);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.cancelled) {
          setSelectedImage(result.uri);
        }
      };

    const ajoutPhoto = async () => {
        let formData = new FormData();
        formData.append('image', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      
        try {
          let response = await fetch(`${backend}${username}/images`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              //'Content-Type': 'multipart/form-data',
              'x-access-token': x_access_token,
            },
            body: formData,
          });
      
          let responseJson = await response.json();
          console.log(responseJson);
        } catch (error) {
          console.error(error);
        }
      };
      

  function deleteImage(index) {
    const updatedImages = [...images];

    fetch(`${backend}${username}/images/`, {
        headers: {
          'x-access-token': x_access_token,
        },
        method: 'GET',
    })
    .then(response => response.json())
    .then((data) => {
        const id = data.images[index].id
        fetch(`${backend}${username}/images/${id}`, {
            headers: {
              'x-access-token': x_access_token,
            },
            method: 'DELETE',
          })
        .then(() => {    
            updatedImages[index] = null;
            setUpdate(update+1)
        })
    })
  }

  function PromptTags() {
    return Tags(username);
  }
  

  return (
    <View>
      {settings ? (
        <ScrollView>
          <LinearGradient           
            colors={['#8282F6', '#C2C2F9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Edit Profile</Text>
                <TouchableOpacity
                style={styles.editButton}
                onPress={saveProfile}
                >
                <Text style={styles.editButtonText}>Exit</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.profile}>
                <Text style={styles.name}> {name} </Text>
                <Text style={styles.age}> {age} years </Text>
                <View style={styles.photoContainer}>
                <View style={styles.row}>
                {images.map((image, index) => (
                    <View style={styles.imageContainer} key={index}>
                        {image ? (
                        <View>
                            <Image source={{ uri: image }} style={styles.image} />
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(index)}>
                                <Image source={require('../../assets/delete.png')} style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </View>
                        ) : (
                        <View style={styles.emptyImageContainer}>
                            <Pressable onPress={ajoutPhoto}>
                                <Text style={styles.choseFile}>Add a picture</Text>
                            </Pressable>
                        </View>
                        )}
                    </View>
                    ))}
                </View>
                </View>
                <View style={styles.tagContainer}>
                    <PromptTags/>
                </View>
            </View>
            </LinearGradient>
        </ScrollView>
      ) : (
        <LinearGradient           
          colors={['#8282F6', '#9E9EF9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
          style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Profile  </Text>
                <TouchableOpacity
                style={styles.editButton}
                onPress={editProfile}
                >
                <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>
            <LinearGradient       
          colors={['#C2C2F9', '#8282F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
          style={styles.container}>
                {profilePicture ? (
                <Image style={styles.image} source={{ uri: profilePicture }} />
                ) : <View style={styles.noProfilePicture}>
                        <Text>No Picture</Text>
                    </View>}
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>{age} years</Text>
            </LinearGradient>
        </LinearGradient>
      )}
    </View>
    
  );
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      borderRadius: 10,
    },
    containerEdit: {
        backgroundColor: '#8282F6',
        padding: 20,
        flex: 1,
        borderRadius: 30,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    editButton: {
      backgroundColor: '#0066cc',
      padding: 10,
      borderRadius: 5,
    },
    editButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    tagContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 1,
        width: '100%',
      },
    profile: {
      alignItems: 'center',
      padding: 20,
      flex: 1,
      borderRadius: 10,
    },
    choseFile: {
        justifyContent: 'center',
        fontSize: 16,
        color: '#333',
        alignItems: 'center',
        width: "100%",
        height: "100%",
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginBottom: 15,
      marginTop: 15,
      backgroundColor: "#222"
    },
    noProfilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#f0f0f0",
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    age: {
      fontSize: 16,
      color: '#333',
      marginBottom: 20,
    },
    descriptionInput: {
        marginTop: 20,
        fontSize: 24,
    },
    photoContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    uploadButton: {
      backgroundColor: '#0066cc',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    deleteButton: {
        position: 'absolute',
        marginTop: 5,
        backgroundColor:'#C5C5F7',
        right:-5,
        borderRadius: 100,
      },
      deleteIcon: {
        width: 40,
        height: 40,
      },
    imageContainer: {
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor:'#C5C5F7',
        alignItems: 'center',
        borderRadius: 50,
        width: '30%',
        height: '40%',
        marginBottom: 10,
        marginHorizontal: 10,
      },
    emptyImageContainer: {
      width: "100%",
      height: "100%",
      backgroundColor: "#C2C2F9",
      borderRadius: 40,
      padding: 5,
      justifyContent: "center",
      alignItems: 'center',
    }
  });
  