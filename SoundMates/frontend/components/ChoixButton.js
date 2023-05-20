import React from 'react';
import { TouchableOpacity, Image, View} from 'react-native';

const ChoixButton = ({ onPress, source}) => (

    
    <View style={{flex:1, alignItems: 'center',justifyContent: 'center',}}>
      <TouchableOpacity onPress={onPress} >
        <Image source={source} style={{width:50, height:50}}/>
    </TouchableOpacity>
    </View>
);

export default ChoixButton;
