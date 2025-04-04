import GenericMediaList from "./GenericMediaList";
import { fetchMediaFiles } from "../services/MediaService";

const WeddingSongsView = ({ onItemPress }) => (
    <GenericMediaList 
        fetchFunction={(pagination) => fetchMediaFiles({ contentTypes: ["song"], tags: ["wedding"], ...pagination })} 
        onItemPress={onItemPress} 
    />
);
export default WeddingSongsView;