import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import MediaItem from "./MediaItem";
import { fetchMusicFiles } from "../services/MediaService";


const SongsView = ({ onItemPress }) => {
    const [songs, setSongs] = useState(null);

    useEffect(() => {   
        loadSongs();
    }, []);


    const loadSongs = async () => {
        const data = await fetchMusicFiles();
        setSongs(data);
      };
    
    const renderItem = ({ item, index }) => (
    <MediaItem item={item} index={index} mediaFiles={songs} onItemPress={onItemPress} />
    );
    
    return (
        <View>
            <FlatList
                data={songs}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}
export default SongsView;