import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Define Routes with Parameters
// ------------------------------------------------------------
const App = () => (
    <BrowserRouter>
        <Routes>
            <Route
                path="/patients/:patientId/appointments/:appointmentId"
                element={<AppointmentDetails />}
            />
            {/* Challenge route added below */}
            <Route
                path="/doctors/:doctorId/patients/:patientId"
                element={<DoctorPatientDetails />}
            />
        </Routes>
    </BrowserRouter>
);

// ------------------------------------------------------------
// B. Extract and Type Params in the Component
// ------------------------------------------------------------
interface AppointmentParams {
    patientId: string;
    appointmentId: string;
    [key: string]: string | undefined; // Index signature for useParams compatibility
}

const AppointmentDetails: React.FC = () => {
    const { patientId, appointmentId } = useParams<AppointmentParams>();

    // Validate and use parameters
    if (!patientId || !appointmentId) {
        return <div>Missing or invalid parameters</div>;
    }

    // Optionally convert to number if needed
    const apptId = Number(appointmentId);
    if (isNaN(apptId)) {
        return <div>Invalid appointment ID</div>;
    }

    return (
        <div>
            <h1>Patient: {patientId}</h1>
            <h2>Appointment: {apptId}</h2>
            {/* Fetch and display appointment details */}
        </div>
    );
};

// ------------------------------------------------------------
// C. Navigating with Typed Params
// ------------------------------------------------------------
const PatientRow: React.FC<{ patientId: string }> = ({ patientId }) => (
    <Link to={`/patients/${patientId}/appointments/123`}>View Appointment 123</Link>
);

// ------------------------------------------------------------
// D. Advanced: Type-Safe Navigation with Helper Libraries
// ------------------------------------------------------------
// Example with react-router-typesafe-routes (reference only):
// import { route, useTypedParams } from "react-router-typesafe-routes";
// const routes = route({ patient: route({ path: "patients/:patientId" }) });
// const { patientId } = useTypedParams(routes.patient);

// Example with react-router-typed-object (reference only):
// const params = ROUTES["/patients/:patientId/appointments/:appointmentId"].path.useParams();
// params.patientId and params.appointmentId are typed as string


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Define a route /doctors/:doctorId/patients/:patientId
// and a DoctorPatientDetails component
// ------------------------------------------------------------
interface DoctorPatientParams {
    doctorId: string;
    patientId: string;
    [key: string]: string | undefined; // Index signature for useParams compatibility
}

const DoctorPatientDetails: React.FC = () => {
    // Challenge 2: Use a typed interface for params and extract them
    const { doctorId, patientId } = useParams<DoctorPatientParams>();

    // Challenge 3: Validate that both IDs are present and numeric
    if (!doctorId || !patientId) {
        return <div>Missing or invalid parameters</div>;
    }

    const docId = Number(doctorId);
    const patId = Number(patientId);

    if (isNaN(docId) || isNaN(patId)) {
        return <div>Error: IDs must be numeric</div>;
    }

    return (
        <div>
            <h1>Doctor ID: {docId}</h1>
            <h2>Patient ID: {patId}</h2>
            {/* Display doctor/patient details */}
        </div>
    );
};

// ------------------------------------------------------------
// Challenge 4: Add a link from a doctor list to a specific 
// doctor/patient page, passing the IDs as parameters
// ------------------------------------------------------------
interface DoctorListItemProps {
    doctorId: string;
    patientId: string;
    doctorName: string;
}

const DoctorListItem: React.FC<DoctorListItemProps> = ({ doctorId, patientId, doctorName }) => (
    <div>
        <span>{doctorName}</span>
        <Link to={`/doctors/${doctorId}/patients/${patientId}`}>
            View Patient Details
        </Link>
    </div>
);

// Export all components
export { App, AppointmentDetails, PatientRow, DoctorPatientDetails, DoctorListItem };
