import React from 'react';
import { TouchableOpacity, Image, View} from 'react-native';

const ImageBrowser = ({ onPress, source,style}) => (

    
    <View style={{flex:1, resizeMode: 'contain',width:1200, height:500}}>
      <TouchableOpacity onPress={onPress} >
        <Image source={source} style ={style}/>
    </TouchableOpacity>
    </View>
);

export default ImageBrowser;
