import GenericMediaList from "./GenericMediaList";
import { fetchMediaFiles } from "../services/MediaService";

const SermonsView = ({ onItemPress }) => (
    <GenericMediaList 
        fetchFunction={(pagination) => fetchMediaFiles({ contentTypes: ["sermon"], ...pagination })} 
        onItemPress={onItemPress} 
    />
);
export default SermonsView;