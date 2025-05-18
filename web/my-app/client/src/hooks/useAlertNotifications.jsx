import { useEffect } from 'react';
import axios from 'axios';
import { useToast } from './../components/ToastContext';
import notificationSound from './../assets/emergence-ringtone.mp3';

export const useAlertNotifications = () => {
  const { showNotiToast } = useToast();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`https://capstone-server-8hss.onrender.com/alerts?userId=${userId}`);
        const allAlerts = res.data;

        // อ่าน alert ที่เคยแจ้งแล้วจาก localStorage
        const alertedIds = JSON.parse(localStorage.getItem("alertedIds") || "[]");

        // คัดกรอง alert ใหม่ที่ยังไม่แจ้งเตือน
        const newUnnotifiedAlerts = allAlerts.filter(
          (a) => !a.resolved && !alertedIds.includes(a._id)
        );

        if (newUnnotifiedAlerts.length > 0) {
          showNotiToast("🚨 New alert received!");
          const audio = new Audio(notificationSound);
          audio.play();

          // บันทึก alert ใหม่ที่แจ้งแล้วลง localStorage
          const updatedIds = [...alertedIds, ...newUnnotifiedAlerts.map((a) => a._id)];
          localStorage.setItem("alertedIds", JSON.stringify(updatedIds));
        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [showNotiToast]);
};
