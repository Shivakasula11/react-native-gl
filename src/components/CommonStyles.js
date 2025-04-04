import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 10,
      // backgroundColor: '#085b87',
    },
    itemContainer: {
      width: 180,
      height: 180,
      alignItems: 'center',
      padding: 15,
      marginRight: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      position: 'relative',
    },
    coverImage: {
      width: 120,
      height: 120,
      borderRadius: 10,
      marginBottom: 5,
    },
    textContainer: {
      flex: 1,
      alignItems: 'center',
    },
    itemText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      
    },
    itemSubText: {
      fontSize: 14,
      color: '#666',
    },
    playButton: {
      position: 'absolute',
      right: 1,
      bottom: 1,
    },
    title: {
      fontSize: 17,
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 10,
      marginLeft: 10,
      textAlign: 'left',
      marginTop: 20,
      textShadowColor: '#000',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
    welecomeText: {
        fontSize: 15,
        // fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
      },
  });