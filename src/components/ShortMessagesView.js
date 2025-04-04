import GenericMediaList from "./GenericMediaList";
import { fetchMediaFiles } from "../services/MediaService";

const ShortMessagesView = ({ onItemPress }) => (
    <GenericMediaList 
        fetchFunction={(pagination) => fetchMediaFiles({ contentTypes: ["short_message"], ...pagination })} 
        onItemPress={onItemPress} 
    />
);
export default ShortMessagesView;