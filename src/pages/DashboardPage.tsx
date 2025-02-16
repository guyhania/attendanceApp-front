import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import EmployeeDashboard from "../components/EmployeeDashboard";
import { Info } from "lucide-react";

const DashboardPage = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const { postApi, putApi } = useApi();

    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isClockedOut, setIsClockedOut] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [reportText, setReportText] = useState("");
    const [clockInReportId, setClockInReportId] = useState<number | null>(null);
    const [attendanceReports, setAttendanceReports] = useState(authContext?.attendanceReports || []);
    const [tooltipVisible, setTooltipVisible] = useState<number | null>(null);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { employee, isReportExists } = authContext;
    const isClockButtonsActive = employee && employee.managerId !== 0;

    const toggleTooltip = (id: number) => {
        setTooltipVisible(tooltipVisible === id ? null : id);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    const handleClockAction = async () => {
        if (!employee) return;

        if (popupType === "ClockIn") {
            try {
                const response = await postApi("api/AttendanceReports", {
                    employeeId: employee.id,
                    employeeFullName: `${employee.firstName} ${employee.lastName}`,
                    date: new Date().toISOString(),
                    startTime: new Date().toLocaleTimeString([], { hour12: false }),
                    endTime: null,
                    startTimeText: reportText,
                    endTimeText: null,
                    status: "Pending",
                });

                setClockInReportId(response.id); // Store report ID
                setIsClockedIn(true);
            } catch (error) {
                alert("Failed to clock in.");
            }
        } else if (popupType === "ClockOut" && clockInReportId) {
            try {
                await putApi(`api/attendanceReports/${clockInReportId}`, {
                    EndTime: new Date().toLocaleTimeString([], { hour12: false }),
                    EndTimeText: reportText,
                });

                setIsClockedOut(true);
            } catch (error) {
                alert("Failed to clock out.");
            }
        }

        setShowPopup(false);
        setReportText("");
    };
    const handleReportAction = async (reportId: number, updates: Record<string, any>) => {
        try {
            const response = await putApi(`api/attendanceReports/${reportId}`, updates);
            if (response?.id) {
                const updatedStatus = updates?.Status;
                if (updatedStatus) {
                    setAttendanceReports((prevReports) =>
                        prevReports.map((report) =>
                            report.id === reportId ? { ...report, status: updatedStatus } : report
                        )
                    );
                }
            }
        } catch (error) {
            alert(`Failed to update report`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">

                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Employee Details</h1>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                    Logout
                </button>

                {/* Employee Details */}
                {employee ? <EmployeeDashboard employee={employee} />
                    : (
                        <p className="text-red-500">Loading employee details...</p>
                    )}

                {/* Clock In / Clock Out Buttons */}
                {isClockButtonsActive && (
                    <div className="mt-4 flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setPopupType("ClockIn");
                                setShowPopup(true);
                            }}
                            disabled={isClockedIn || isReportExists}
                            className={`px-4 py-2 rounded-md text-white transition ${isClockedIn ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                }`}                        >
                            Clock In
                        </button>
                        <button
                            onClick={() => {
                                setPopupType("ClockOut");
                                setShowPopup(true);
                            }}
                            disabled={!isClockedIn || isClockedOut || isReportExists}
                            className={`px-4 py-2 rounded-md text-white transition ${!isClockedIn ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                                }`}                        >
                            Clock Out
                        </button>
                    </div>
                )}

                {/* Popup for Report Input */}
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-semibold">{popupType === "ClockIn" ? "Clock In" : "Clock Out"} Report</h3>
                            <input
                                type="text"
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Enter report text..."
                                className="border p-2 w-full mt-2 rounded-md"
                            />
                            <div className="flex mt-4 gap-2 justify-center">
                                <button onClick={handleClockAction} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    Save
                                </button>
                                <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Attendance Reports Table */}
                <h2 className="mt-6 text-xl font-semibold">Attendance Reports</h2>
                {attendanceReports.length > 0 ? (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full border-collapse border bg-white shadow-md rounded-lg">
                            <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Start Time</th>
                                    <th className="border px-4 py-2">End Time</th>
                                    <th className="border px-4 py-2">Status</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceReports
                                    .filter((report) => report.startTime && report.endTime)
                                    .map((report) => (
                                        <tr key={report.id} className="border">
                                            <td className="border px-4 py-2">{report.employeeFullName}</td>
                                            <td className="border px-4 py-2">{new Date(report.date).toLocaleDateString("en-GB")}</td>
                                            <td className="border px-4 py-2">
                                                {report.startTime || "N/A"}
                                                {report.startTimeText && (
                                                    <button onClick={() => toggleTooltip(report.id)} className="focus:outline-none">
                                                        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                                                    </button>
                                                )}
                                                {report.startTimeText && tooltipVisible === report.id && (
                                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 shadow-lg">
                                                        {report.startTimeText}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {report.endTime || "N/A"}
                                                {report.endTimeText && (
                                                    <button onClick={() => toggleTooltip(report.id + 1000)} className="focus:outline-none">
                                                        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                                                    </button>
                                                )}
                                                {report.endTimeText && tooltipVisible === report.id + 1000 && (
                                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 shadow-lg">
                                                        {report.endTimeText}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">{report.status}</td>
                                            <td className="border px-4 py-2">
                                                {report.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleReportAction(report.id, { Status: "Approved" })}
                                                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                                            disabled={report.status in ["Approved", "Rejected"]}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReportAction(report.id, { Status: "Rejected" })}
                                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                                            disabled={report.status in ["Approved", "Rejected"]}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No attendance reports available.</p>
                )}
            </div>

        </div>
    );
};

export default DashboardPage;
