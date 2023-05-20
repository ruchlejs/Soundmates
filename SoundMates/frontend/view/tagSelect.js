import React, { useState, useEffect } from 'react';
import { backend, x_access_token } from './../../App.js';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

export function Tags(username) {
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [availableStyles, setAvailableStyles] = useState([]);
  const [update, setUpdate] = useState(0);
  const [openDeleteTagsMenu, setOpenDeleteTagsMenu] = useState(false);

  const fetchTags = async () => {
    try {
      const response = await fetch(backend + "tags", {
        method: 'GET'
      });
      const json = await response.json();
      if (json.status) {
        const tags = json.data.map(tag => tag.name);
        setAvailableStyles(tags);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetch(`${backend}${username}/tags`, {
      headers: {
        'x-access-token': x_access_token,
      },
      method: 'GET',
    })
      .then(response => response.json())
      .then((data) => {
        const tags = data.data
        if (tags.length) {
          const newSelectedStyles = [];
          tags.forEach((tag) => {
            newSelectedStyles.push(tag.name);
          });
          setSelectedStyles(newSelectedStyles);
        }
      })
  }, [update]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.styleButton}
        onPress={() => {
            if (selectedStyles.length<8) {
                const newSelectedStyles = [...selectedStyles];
                console.log(item+" added")
                const data = "data={\"name\":\""+item+"\"}";
                fetch(`${backend}${username}/tags`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'x-access-token': x_access_token,
                    },
                    body: data,
                    })
                    .then(() => {
                        setUpdate(update+1)
                    })
            }
            setModalVisible(false);
        }}
      >
        <Text style={styles.styleButtonText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderDeletableItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.styleButton}
        onPress={() => {
          if (selectedStyles.length>0) {
              const newSelectedStyles = [...selectedStyles];
              console.log(item+" deleted")
              fetch(`${backend}${username}/tags/${item}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'x-access-token': x_access_token,
                  },
                  })
                  .then(() => {
                      setUpdate(update+1)
                  })
          }
          setModalVisible(false);
      }}
      >
        <Text style={styles.styleButtonText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  function openDeleteMenu () {
    setOpenDeleteTagsMenu(true);
  }
    
    return (
      <LinearGradient           
        colors={['#C090D7', '#E6A9F3']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 1]}
        style={styles.container}>    
      <View style={styles.header}>
    <TouchableOpacity
    style={styles.stylePickerButton}
    onPress={() => {
      setOpenDeleteTagsMenu(false)
      setModalVisible(true)
      }
    }
    >
    <Text style={styles.stylePickerButtonText}>Add a style</Text>
    </TouchableOpacity>
    <Text style={styles.headerText}>My Style</Text>
    <TouchableOpacity
      style={styles.stylePickerButton}
      onPress={() => {
        setOpenDeleteTagsMenu(true)
        setModalVisible(true)
        }
      }
    >
    <Text style={styles.stylePickerButtonText}>Delete styles</Text>
    </TouchableOpacity>
    </View>
    {selectedStyles.length > 0 && (
      <View style={styles.selectedStylesContainer}>
        {selectedStyles.map((tag) => (
          <View style={styles.tagContainer} key={tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    )}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          {openDeleteTagsMenu ? (
            <FlatList
            data={selectedStyles}
            renderItem={renderDeletableItem}
            keyExtractor={(item) => item}
            />
          ) : (
            <FlatList
              data={availableStyles}
              renderItem={renderItem}
              keyExtractor={(item) => item}
            />
          )
          }
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
      </Modal>

    </LinearGradient>
    );
  }

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#C2C2F9',
    width:"100%",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedStylesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
  },
  tagContainer: {
    backgroundColor: '#8282F6',
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  tagText: {
    color: 'black',
    fontSize: 14,
  },  
  stylePickerButton: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
  },
  stylePickerButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  styleButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'stretch',
    margin: 5,
  },
  styleButtonText: {
    fontSize: 16,
    color: '#000',
  },
  modalCloseButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'stretch',
    marginTop: 20,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
})