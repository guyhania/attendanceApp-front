interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  managerId?: number | null;
  email: string;
}
interface EmployeeDashboardProps {
  employee: Employee;
}
const EmployeeDashboard = ({ employee }: EmployeeDashboardProps) => {

  return (
    <div className="grid grid-cols-2 gap-6 border p-6 rounded-lg bg-gray-50 max-w-lg mx-auto text-center">
    <div className="flex flex-col items-center">
      <strong className="text-gray-900">First Name:</strong> 
      <span className="text-gray-700">{employee.firstName}</span>
    </div>
    
    <div className="flex flex-col items-center">
      <strong className="text-gray-900">Last Name:</strong> 
      <span className="text-gray-700">{employee.lastName}</span>
    </div>
  
    <div className="flex flex-col items-center">
      <strong className="text-gray-900">Role:</strong> 
      <span className="text-gray-700">{employee.role === "1" ? "Manager" : "Employee"}</span>
    </div>
  
    <div className="flex flex-col items-center">
      <strong className="text-gray-900">Manager:</strong> 
      <span className="text-gray-700">
        {employee.managerId ? `Manager ID: ${employee.managerId}` : "None"}
      </span>
    </div>
  </div>
  
  );
}
export default EmployeeDashboard;