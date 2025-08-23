

export const REGISTER_USER = '/api/auth/register';
export const LOGIN_USER = '/api/auth/login';

// Hostel routes
export const CREATE_HOSTEL = '/api/hostels/createHostel';
export const GET_HOSTELS = '/api/hostels/getHostels';
export const UPDATE_HOSTEL =  `/api/hostels/updateHostel`;
export const DELETE_HOSTEL =`/api/hostels/deleteHostel`;

// Add room to hostel
export const ADD_ROOM_TO_HOSTEL =`/api/hostels/addRoomToHostel`;
export const GET_ALL_ROOMS =`/api/hostels/getAllRooms`;
export const DELETE_ROOM =`/api/hostels/deleteRoom`;
export const UPDATE_ROOM_IN_HOSTEL =`/api/hostels/updateRoomInHostel`;


// Student routes
export const GET_STUDENTS = '/api/students/getStudents';
export const CREATE_STUDENT = '/api/students/createStudent';
export const UPDATE_STUDENT = '/api/students/updateStudent';
export const DELETE_STUDENT = '/api/students/deleteStudent';
export const GET_STUDENTS_BY_ID = '/api/students/getStudentById';


// DEGREE ROUTES

export const ADD_DEGREE = '/api/students/addDegree';
export const GET_DEGREES = '/api/students/getDegree';
export const UPDATE_DEGREE = '/api/students/updateDegree';
export const DELETE_DEGREE = '/api/students/deleteDegree';

// Warden routes
export const CREATE_WARDEN = '/api/warden';
export const GET_WARDENS = '/api/warden';
export const GET_WARDENS_ID = '/api/getWardenById';
export const UPDATE_WARDENS = '/api/updateWarden';
export const DELETE_WARDENS = '/api/deleteWarden';

// PAYMENT ROUTES

export const CREATE_PAYMENT_TRASACTION= "/api/payment/paymentTransaction"
export const CREATE_PAYMENT_ORDER= "/api/payment/createOrder"
export const VERIFY_PAYMENT_ORDER= "/api/payment/verifyOrder"
export const GET_PAYMENT_BY_ID= "/api/payment/getStudentpaymentByID"

// ANNOUMCENT ROUTES

export const CREATE_ANNOUNCEMENT= "/api/announcement/createAnnoucement"
export const UPDATE_ANNOUNCEMENT= "/api/announcement/updateAnouncement"
export const GET_ANNOUNCEMENT= "/api/announcement/getAllAnouncement"
export const DELETE_ANNOUNCEMENT= "/api/announcement/deleteAnouncement"

// REQUEST ROUTES

export const CREATE_REQUEST= "/api/requests/createRequest"
export const UPDATE_REQUEST= "/api/requests/updateRequest"
export const GET_REQUESTS= "/api/requests/getAllRequests"
export const DELETE_REQUEST= "/api/requests/deleteRequest"

// CHATBOT API

export const CHATBOT_API= '/api/ai/ask'
export const GET_AI_CHAT= '/api/ai/getAIchat'