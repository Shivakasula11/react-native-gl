import GenericMediaList from "./GenericMediaList";
import { fetchMediaFiles } from "../services/MediaService";

const WorshipSongsView = ({ onItemPress }) => (
    <GenericMediaList 
        fetchFunction={(pagination) => fetchMediaFiles({ contentTypes: ["song"], tags: ["worship"], ...pagination })} 
        onItemPress={onItemPress} 
    />
);
export default WorshipSongsView;