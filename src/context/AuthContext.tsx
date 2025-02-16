import { createContext, useState, ReactNode, useContext } from "react";

// Define Employee Type
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  managerId?: number | null;
  email: string;
}

// Define Attendance Report Type
interface AttendanceReport {
  id: number;
  employeeId: number;
  employeeFullName: string;
  date: string;
  startTime?: string | null;
  startTimeText?: string,
  endTimeText?: string,
  endTime?: string | null;
  status: string;
}

// Define Context Type
interface AuthContextType {
  employee: Employee | null;
  setEmployee: (employee: Employee | null) => void;
  attendanceReports: AttendanceReport[];
  setAttendanceReports: (reports: AttendanceReport[]) => void;
  isReportExists: boolean;
  setIsReportExists: (isReportExists: boolean) => void;
}

// Create Context with Initial Value as `undefined`
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendanceReports, setAttendanceReports] = useState<AttendanceReport[]>([]);
  const [isReportExists, setIsReportExists] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ employee, setEmployee, attendanceReports, setAttendanceReports, isReportExists, setIsReportExists }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to Use Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
