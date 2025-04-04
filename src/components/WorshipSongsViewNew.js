import GenericMediaList from "./GenericMediaList";
import { fetchMediaFiles } from "../services/MediaService";

const WorshipSongsViewNew = ({ onItemPress }) => (
    <GenericMediaList 
        fetchFunction={(pagination) => fetchMediaFiles({ contentTypes: ["song"], tags: ["worship"], ...pagination })} 
        onItemPress={onItemPress} 
    />
);
export default WorshipSongsViewNew;