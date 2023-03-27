import { useEffect, useState } from "react";
import baseAPI from "@/api/baseAPI.jsx";
import "./Dashboard.css";
import UserDetails from "@/components/UserDetails.jsx";
import StorageDetails from "@/components/StorageDetails.jsx";
import { getCookie } from "@/helpers/cookies.js";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [storageUsage, setStorageUsage] = useState(0);
    const [storageAvailable, setStorageAvailable] = useState(0);
    const [files, setFiles] = useState([]);
    const [riskScore, setRiskScore] = useState(0);
    const [startList, setStartList] = useState(0);
    const [endList, setEndList] = useState(50);

    const doOnMounted = () => {
        baseAPI.get("/getUserDetails").then((res) => {
            const result = res.data;
            setName(result.data.name);
            setImageUrl(result.data.imageUrl);
            setStorageUsage(result.data.storageUsage);
            setStorageAvailable(result.data.storageAvailable);
            setFiles(result.data.files);
            setLoading(false);
            setEndList(endList % result.data.files.length);
            calculateRiskScore(result.data.files);
        }).catch((err) => {
            console.log(err);
        });
    };

    const calculateRiskScore = (files) => {
        let totalSize = 0;
        let oldestFileAge = Infinity;
        let maxFileSize = -Infinity;

        for (const file of files) {
            const fileSize = parseInt(file.size || 0);
            totalSize += fileSize;
            if (fileSize > maxFileSize) {
                maxFileSize = fileSize;
            }

            const fileAge = Date.now() - new Date(file.createdTime).getTime();
            if (fileAge < oldestFileAge) {
                oldestFileAge = fileAge;
            }
        }

        const avgFileSize = totalSize / files.length;

        const riskScore = (avgFileSize / maxFileSize) * (oldestFileAge / (1000 * 3600 * 24));
        setRiskScore(riskScore * 100);
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const dm = 2;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    useEffect(() => {
        const tokenCookie = getCookie("token");
        if (!tokenCookie) {
            navigate("/");
        }
        doOnMounted();
    }, []);

    if (loading) {
        return <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            /* bring your own prefixes */
            transform: "translate(-50%, -50%)",
        }}>Loading...</div>;
    }
    return (
        <div className="dashboard-container">
            <h1>Google Drive Risk Report</h1>

            <UserDetails name={name} imageUrl={imageUrl} />

            <div style={{ display: "flex", width: "100%", justifyContent: "space-evenly" }}>
                <StorageDetails formatBytes={formatBytes} storageUsage={storageUsage} storageAvailable={storageAvailable} length={files.length} />
                <div className="risk-score">
                    <div className="storage-usage">
                        <h2>Risk Score: {riskScore.toFixed(4)}%</h2>
                    </div>
                </div>
            </div>
            
            <div style={{ display: "flex", width: "100%", justifyContent: "space-around", marginTop: "50px" }}>
                {Array.from({ length: Math.ceil(files.length / 50) }, (_, i) => i + 1).map((num) => (
                    <button className="btn btn-primary" onClick={() => {
                        setStartList((num - 1) * 50);
                        setEndList(num * 50);
                    }}>{num}</button>
                ))}
            </div>

            <table className="table table-dark" align="center" style={{
                width: "100%",
                marginTop: "50px",
                tableLayout: "fixed",
                textAlign: "center",
            }}>
                <thead>
                <tr>
                    <th scope="col" style={{ width: "10%" }}>Serial.No.</th>
                    <th scope="col" style={{ width: "20%" }}>File Name</th>
                    <th scope="col" style={{ width: "50%" }}>Public Link</th>
                    <th scope="col" style={{ width: "10%" }}>Created Time</th>
                    <th scope="col" style={{ width: "10%" }}>File Size</th>
                </tr>
                </thead>
                {files.map((file, index) => {
                    const dateString = file.createdTime;
                    const date = new Date(dateString);
                    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

                    if (index >= startList && index < endList)
                        return (
                            <tbody key={file.webViewLink}>
                            <tr style={{ lineHeight: "300%", verticalAlign: "top" }}>
                                <th scope="row">{index + 1} </th>
                                <td>{file.name}</td>
                                <td><a href={file.webViewLink} target="_blank">{file.webViewLink}</a></td>
                                <td>{formattedDate}</td>
                                <td>{formatBytes(file.size)}</td>
                            </tr>
                            </tbody>
                        );
                })}
            </table>
        </div>
    );
};

export default Dashboard;
