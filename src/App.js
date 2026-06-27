import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./baseurl";
import { saveUnlocked, saveCompleted, loadCompleted } from "./data/gameData";
import LandingPage from "./components/LandingPage";

export default function App() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false); // don't trust token presence alone
  const [totalMissions, setTotalMissions] = useState(5);
  const [totalMissionLoading, setTotalMissionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setTotalMissionLoading(true);
    axios.get(`${BASE_URL}/user/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setTotalMissions(res.data.total_missions);
      setUnlocked(!!res.data.game_unlocked); // backend is source of truth
      setTotalMissionLoading(false);
    }).catch(() => setTotalMissionLoading(false));
  }, []);
  const handlePayment = () => {
    saveUnlocked(true);
    setUnlocked(true);
    navigate("/game");
  };

  const handleResume = () => {
    navigate("/game");
  };

  return (
    <LandingPage
      unlocked={unlocked}
      onJoin={handlePayment}
      onResume={handleResume}
      totalMissions={totalMissions}
      totalMissionLoading={totalMissionLoading}
    />
  );
}