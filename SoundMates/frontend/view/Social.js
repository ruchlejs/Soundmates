import { React, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { backend, userId, x_access_token } from './../../App.js'
import { Buffer } from 'buffer';

export default function UserList() {
    const [userList, setUserList] = useState([]); // tableau pour les images

    useEffect(() => {
        fetch(`${backend}liked/${userId}`, {
            headers: {
                'x-access-token': x_access_token,
            },
            method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            const newUserList = []
            data.MatchedProfiles.forEach((profile, index) => {
                let updatedImages = null;
                if (data.images[index] && data.images[index].length) {
                    const matrice = data.images[index][0].buffer.data
                    const binaryString = String.fromCharCode.apply(null,matrice);
                    const base64String = Buffer.from(binaryString, 'binary').toString('base64');
                    updatedImages = `data:image/png;base64,${base64String}`
                    console.log(updatedImages)
                  }
                const user = {
                    name: profile.name,
                    age: profile.age,
                    image: updatedImages,
                    tags: data.tags[index],
                    sexe: profile.sexe
                }
                newUserList.push(user)
            })
            setUserList(newUserList)
            console.log(newUserList)
        })
    }, [])

  return (
    <LinearGradient           
        colors={['#FF9B9D', '#FF9552']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
        style={styles.container}>
        {userList.length ? (
          <View>
            {userList.map((user, index) => (
                <LinearGradient
                key={index}
                colors={['#FFABBB', '#FF9C64']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                locations={[0, 1]}
                style={styles.userContainer}>
                {false ? (
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{uri : user.image}} />
                    </View>
                    ) : (
                        <View style={styles.noProfilePicture}>
                            <Text style={styles.noProfilePictureText}>No Picture</Text>
                        </View>
                    )}
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>{user.name}</Text>
                    <Text style={styles.ageText}>{user.sexe}</Text>
                    <Text style={styles.ageText}>{user.age} ans</Text>
                    </View>
                </LinearGradient>
            ))}
          </View>
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Vous n'avez pas encore de match</Text>
          </View>
        )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 30,
    width: 800,
    paddingTop: 15,
    paddingBottom: 15,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },
  noProfilePicture: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f0f0f0",
    },
    noProfilePictureText: {
        fontSize: 8,
    },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'row',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  sexeText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  ageText: {
    marginTop: 2,
    fontSize: 14,
    color: '#333',
    paddingRight: 10,
  },
  tagText: {
    marginTop: 1,
    fontSize: 14,
    color: 'blue',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    },
    tagBox: {
        backgroundColor: 'orange',
        borderRadius: 10,
        marginRight: 5,
        marginBottom: 5,
    },
    tagText: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
