import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../baseurl";
import { saveCompleted } from "../data/gameData";
import { useSocket } from "../context/SocketContext";
import GameScreen from "../components/GameScreen";

export default function GamePage() {
  const navigate = useNavigate();
  const socketRef = useSocket();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalMissions, setTotalMissions] = useState(5);
  const [completedMissions, setCompletedMissions] = useState(0); // ✅
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentLevelRef = useRef(currentLevel); // ✅ keeps socket callback in sync

  // keep ref in sync with state
  useEffect(() => {
    currentLevelRef.current = currentLevel;
  }, [currentLevel]);

  const socket = useSocket(); // ✅ now a socket instance, not a ref

  useEffect(() => {
    if (!socket) return;
 
    socket.on("riddles_updated", (riddles) => {
        // ✅ match on old_mission_number — what the user currently has loaded
        const updated = riddles.find(r => r.old_mission_number === currentLevelRef.current);
        if (updated) {
          setMission(prev => ({ ...prev, ...updated }));
          setCurrentLevel(updated.mission_number); // ✅ update level if number changed
          currentLevelRef.current = updated.mission_number;
        }
      });
  
    // ✅ when admin adds a new riddle, re-fetch progress to get updated totalMissions
    socket.on("riddle_created", (newRiddle) => {
        setTotalMissions(prev => prev + 1);
      
        // if new riddle is inserted before or at current level, re-fetch
        // so user gets the correct mission for their position
        if (newRiddle.mission_number <= currentLevelRef.current) {
          fetchProgressThenRiddle();
        }
      });
  
    return () => {
      socket.off("riddles_updated");
      socket.off("riddle_created");
    };
  }, [socket]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    fetchProgressThenRiddle();
  }, []);

  const fetchRiddle = async (missionNumber) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/user/riddle`,
        { mission_number: missionNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message === "Congratulations! You have completed all missions!") {
        saveCompleted(true);
        navigate("/victory");
        return;
      }

      const riddle = res.data.riddle;
      setMission(riddle);
      setCurrentLevel(riddle.mission_number);
    } catch (err) {
      console.error("Failed to fetch riddle:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressThenRiddle = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/user/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTotalMissions(res.data.total_missions);
      setCompletedMissions(res.data.completed_missions); // ✅
      
      if (res.data.all_completed) {
        saveCompleted(true);
        navigate("/victory");
        return;
      }
      
      const nextMission = res.data.next_mission_number;
      await fetchRiddle(nextMission);

    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };


  const handleCodeSubmit = async (enteredCode) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/user/check-code`,
        { mission_number: currentLevel, secret_code: enteredCode.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.game_completed) {
        saveCompleted(true);
        navigate("/victory");
        return true;
      }

      const next = res.data.next_mission;
      setMission(next);
      setCurrentLevel(next.mission_number);
      setCompletedMissions(res.data.completed_missions); // ✅
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
<GameScreen
  mission={mission}
  currentLevel={currentLevel}
  completedMissions={completedMissions}
  totalMissions={totalMissions}
  onSubmitCode={handleCodeSubmit}
  onHome={() => navigate("/")}
  loading={loading}
/>
  );
}