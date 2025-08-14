import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';

// Layout Components
import SimpleLayout from '../components/layout/SimpleLayout';

// Auth Pages
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

// Dashboard Pages
// Update the import path or filename to match the actual file
// For example, if the file is named 'DashboardPage.tsx':
import AddHostelPage from '../pages/AddHostelPage';
import HostelDetailsPage from '../pages/HostelDetailsPage';
import WardenListPage from '../pages/WardenListPage';
import AddWardenPage from '../pages/AddWardenPage';
import WardenDetailsPage from '../pages/WardenDetailsPage';
import EditWardenPage from '../pages/EditWardenPage';
import AddRoomPage from '../pages/AddRoomPage';
import AnnouncementsPage from '../pages/AnnouncementsPage';
import AllHostels from "../components/modules/hostel/AllHostels";
import { HostelDashboard } from '../components/modules';
import AllRooms from '../components/modules/room/AllRooms';
import AllStudents from '../components/modules/student/AllStudents';
import AddStudent from '../components/modules/student/AddStudents';
import AllDegree from '../components/modules/degrees/AllDegree';
import AddDegree from '../components/modules/degrees/Adddegree';
import StuentDetailsPage from '../components/modules/student/StudentViewDetails';
import PaymentDashboard from '../components/modules/payment/paymentDashboard';
import PaymentStatus from '../components/modules/payment/paymentStatus';
import PaymentDetailsPage from '../components/modules/payment/viewPaymentDetails';
import AddAnnouncement from '../components/modules/announcement/addAnnouncement';
import AnnouncementDetailsPage from '../components/modules/announcement/viewAnnouncement';

// Loading Component
const Loading = () => (
    <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // You can add authentication logic here
    const isAuthenticated = localStorage.getItem('token'); // Simple auth check

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <SimpleLayout>{children}</SimpleLayout>;
};

// Public Route wrapper (for auth pages)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = localStorage.getItem('token');

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute> <LoginPage /> </PublicRoute>} />
                <Route path="/signup" element={<PublicRoute> <SignupPage /> </PublicRoute>} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute>  <HostelDashboard />   </ProtectedRoute>}
                />

                {/* payment routes */}

                <Route path="/payment" element={<ProtectedRoute>  <PaymentDashboard />   </ProtectedRoute>}
                />
                <Route path="/payment/status" element={<ProtectedRoute>  <PaymentStatus />   </ProtectedRoute>}
                />
                <Route path="/viewPayment" element={<ProtectedRoute>  <PaymentDetailsPage />   </ProtectedRoute>}
                />

                {/* Hostel Routes */}
                <Route path="/hostels" element={<ProtectedRoute>  <AllHostels />   </ProtectedRoute>}
                />

                <Route path="/addhostel" element={<ProtectedRoute>  <AddHostelPage />   </ProtectedRoute>}
                />
                <Route path="/viewHostel" element={<ProtectedRoute><HostelDetailsPage />
                </ProtectedRoute>} />

                {/* Warden Routes */}
                <Route path="/wardens" element={
                    <ProtectedRoute>
                        <WardenListPage />
                    </ProtectedRoute>}
                />

                <Route
                    path="/addWarden"
                    element={
                        <ProtectedRoute>
                            <AddWardenPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/viewWarden"
                    element={
                        <ProtectedRoute>
                            <WardenDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editWarden"
                    element={
                        <ProtectedRoute>
                            <EditWardenPage />
                        </ProtectedRoute>
                    }
                />

                {/* Room Routes */}
                <Route
                    path="/rooms"
                    element={
                        <ProtectedRoute>
                            <AllRooms />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/addRoom"
                    element={
                        <ProtectedRoute>
                            <AddRoomPage />
                        </ProtectedRoute>
                    }
                />

                {/* Announcement Routes */}
                <Route path="/announcements" element={<ProtectedRoute> <AnnouncementsPage />
                </ProtectedRoute>} />
                <Route path="/addAnnouncement" element={<ProtectedRoute> <AddAnnouncement />
                </ProtectedRoute>} />
                <Route path="/viewAnnouncement" element={<ProtectedRoute> <AnnouncementDetailsPage />
                </ProtectedRoute>} />

                {/* degree route */}
                <Route path="/degrees" element={<ProtectedRoute> <AllDegree /> </ProtectedRoute>} />
                <Route path="/addDegree" element={<ProtectedRoute> <AddDegree /> </ProtectedRoute>} />

                {/* Add Student */}
                <Route path="/addStudent" element={<ProtectedRoute> <AddStudent /> </ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute> <AllStudents /> </ProtectedRoute>} />
                <Route path="/viewdStudent" element={<ProtectedRoute> <StuentDetailsPage /> </ProtectedRoute>} />

                {/* Default redirects */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Suspense>
    );
}
