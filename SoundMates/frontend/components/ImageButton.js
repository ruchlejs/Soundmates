import React from 'react';
import { TouchableOpacity, Image, View} from 'react-native';

const ImageButton = ({ onPress, source, style }) => (
    <View style={[style, { borderTopWidth: 1, borderTopColor: 'black' }]}>
        <TouchableOpacity onPress={onPress}>
            <Image source={source} style={{width:50, height:50}}/>
        </TouchableOpacity>
    </View>
);

export default ImageButton;
