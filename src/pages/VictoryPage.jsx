import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../baseurl";
import { saveCompleted } from "../data/gameData";
import VictoryScreen from "../components/VictoryScreen";

export default function VictoryPage() {
  const navigate = useNavigate();
  const [totalMissions, setTotalMissions] = useState(null);
  const [totalMissionsLoading, setTotalMissionsLoading] = useState(false);
  useEffect(() => {
    setTotalMissionsLoading(true)

    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    axios.get(`${BASE_URL}/user/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {setTotalMissions(res.data.total_missions)
        setTotalMissionsLoading(false)

    })
      .catch(() => {});
  }, []);

  const handleRestart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/user/restartHunt`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to restart hunt:", err);
    } finally {
      saveCompleted(false);
      navigate("/game");
    }
  };

  const handleHome = () => {
    saveCompleted(false);
    navigate("/");
  };

  return (
    <VictoryScreen
      onRestart={handleRestart}
      onHome={handleHome}
      totalMissionsLoading={totalMissionsLoading}
      totalMissions={totalMissions}
    />
  );
}