import React, { useState, useEffect } from 'react';
import { getHostels } from '../auth/api/hostelApi';
import { HostelLoader } from '../../utils/hostelLoader';
import AdminDashboard from './AdminDashboard';
import WardenDashboard from './wardenDashboard';
import StudentDashboard from './studentDashBoard';




const HostelDashboard: React.FC<{}> = () => {
  const [loading, setLoading] = useState<boolean>(false);
  let data = localStorage.getItem('user') || '{}';
  const user = JSON.parse(data);
  console.log('User data:', user);


  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await getHostels();
      console.log('Fetched hostels:', response.data);
      // setHostels(response.data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);


  if (loading) {
    return <HostelLoader />
  }

  return (
      <>
      {
        user.role == "admin" ? 
        <AdminDashboard /> : 
        user.role == "warden" ?
         <WardenDashboard/>
        : <StudentDashboard/>
      }
      </>
  );
};

export default HostelDashboard;
