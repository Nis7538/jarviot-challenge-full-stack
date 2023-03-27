import "@/App.css";

const StorageDetails = (props) => {
    return (
        <div className="storage-details">
            <div className="storage-usage">
                <h2>Storage Used: {props.formatBytes(props.storageUsage)}</h2>
            </div>
            <div className="storage-available">
                <h2>Total Storage Available: {props.formatBytes(props.storageAvailable)}</h2>
            </div>
            <div className="total-files">
                <h2>Total Files Fetched: {props.length}</h2>
            </div>
        </div>
    );
};

export default StorageDetails;
