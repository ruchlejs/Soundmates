import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


export function BottomButton({ label, onPress }) {
  return (
    <View style={{flex:1}}>
          <Pressable onPress={onPress}>
            <Text style={styles.buttonLabel}>{label}</Text>
          </Pressable>
     </View>
  );
}

export function CheckLogin({ label, onPress }) {
  return (
  <View style={{flex:1}}>
  <Pressable onPress={onPress()}>
  <Text style={styles.invisible}>{label}</Text>
  </Pressable>
  </View>
  );
  }

export function YesOrNo({ label, onPress }) {
  return (
    <View>
      <Pressable onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

export function LogButton({ label, onPress }) {
  return (
    <View style={styles.formContainer}>
      <Pressable onPress={onPress}>
        <LinearGradient           
          colors={['#FF7F50', '#FD8D7E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
          style={styles.LoginStyle}>
            <Text>{label}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonLabel: {
    color: 'black',
    backgroundColor: 'green',
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'blue',
  },
  invisible: {
    display: 'none',
  },
  LoginStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#333333',
  }
});