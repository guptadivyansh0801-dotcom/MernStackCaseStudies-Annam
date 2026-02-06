// Code Walkthrough - Enum and Interface
enum PatientStatus { Admitted, Discharged, UnderObservation }

interface Patient {
    id: number;
    name: string;
    age: number;
    status: PatientStatus;
    vitals: [number, number];
}

// Code Walkthrough - Array of patients
let patients: Patient[] = [
    { id: 1, name: "Alice", age: 30, status: PatientStatus.Admitted, vitals: [120, 80] },
    { id: 2, name: "Bob", age: 45, status: PatientStatus.UnderObservation, vitals: [130, 85] }
];

// Code Walkthrough - Class for staff
class Nurse {
    constructor(public name: string) { }
    takeVitals(patient: Patient, vitals: [number, number]): void {
        patient.vitals = vitals;
        console.log(`${this.name} updated vitals for ${patient.name}`);
    }
}

// Code Walkthrough - Using tuples and enums
let newVitals: [number, number] = [118, 76];
let nurse = new Nurse("Carol");
nurse.takeVitals(patients[0], newVitals);

// Challenge 1: Define enum Role
enum Role { Doctor, Nurse, Admin }

// Challenge 2: Create interface Staff
interface Staff {
    id: number;
    name: string;
    role: Role;
}

// Challenge 3: Create array of staff members
let staffMembers: Staff[] = [
    { id: 1, name: "Divyansh Gupta", role: Role.Doctor },
    { id: 2, name: "Sarah", role: Role.Nurse },
    { id: 3, name: "Mike", role: Role.Admin }
];

// Challenge 4: Function to print staff summary
function printStaffSummary(staff: Staff[]): void {
    for (let member of staff) {
        console.log(`${member.name} - ${Role[member.role]}`);
    }
}

printStaffSummary(staffMembers);
