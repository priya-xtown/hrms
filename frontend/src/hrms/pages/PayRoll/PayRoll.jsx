import Input from "antd/es/input/Input";
import { Modal } from "antd";
import { useState } from "react";
import { FaEye, FaDownload } from "react-icons/fa";

export default function PayrollMaster() {
  const [records, setRecords] = useState([
    {
      employeeId: "EMP001",
      employeeName: "John Doe",
      basicSalary: 50000,
      allowance: "Medical",
      deduction: "PF",
      bonus: 2000,
      bankName: "HDFC Bank",
      accountNo: "1234567890",
      ifsc: "HDFC0001234",
      accountHolderName: "John Doe",
      netSalary: 50000 + 2000 - 1000 + 2000,
    },
    {
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      basicSalary: 60000,
      allowance: "Conveyance",
      deduction: "Tax",
      bonus: 3000,
      bankName: "ICICI Bank",
      accountNo: "9876543210",
      ifsc: "ICIC0005678",
      accountHolderName: "Jane Smith",
      netSalary: 60000 + 1500 - 1500 + 3000,
    },
    {
      employeeId: "EMP003",
      employeeName: "Robert Johnson",
      basicSalary: 45000,
      allowance: "Medical",
      deduction: "ESI",
      bonus: 1000,
      bankName: "SBI",
      accountNo: "1122334455",
      ifsc: "SBIN0009876",
      accountHolderName: "Robert Johnson",
      netSalary: 45000 + 2000 - 500 + 1000,
    },
  ]);


  const [viewRecord, setViewRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");



  const downloadEmployee = (record) => {
    const content = `
Employee ID: ${record.employeeId}
Name: ${record.employeeName}
Basic Salary: ${record.basicSalary}
Allowance: ${record.allowance}
Deduction: ${record.deduction}
Bonus/Incentive: ${record.bonus}
Net Salary: ${record.netSalary}

Bank Details:
Bank Name: ${record.bankName}
Account Number: ${record.accountNo}
IFSC: ${record.ifsc}
Account Holder Name: ${record.accountHolderName}
    `;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${record.employeeName}_Payroll.txt`;
    link.click();
  };

  const downloadAll = () => {
    let content = "";
    records.forEach((r) => {
      content += `
Employee ID: ${r.employeeId}
Name: ${r.employeeName}
Basic Salary: ${r.basicSalary}
Allowance: ${r.allowance}
Deduction: ${r.deduction}
Bonus/Incentive: ${r.bonus}
Net Salary: ${r.netSalary}

Bank Details:
Bank Name: ${r.bankName}
Account Number: ${r.accountNo}
IFSC: ${r.ifsc}
Account Holder Name: ${r.accountHolderName}
----------------------------
`;
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `All_Payroll.txt`;
    link.click();
  };

  const filtered = records.filter((r) => {
    return (
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRecords = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="font-semibold text-xl">
          Payroll Slip
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-3 rounded-xl w-full sm:w-64 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <button
            onClick={downloadAll}
            className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            <FaDownload /> Download All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead >
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-4 text-left">Employee ID</th>
              <th className="border border-gray-100 p-4 text-left">Name</th>
              <th className="border border-gray-100 p-4 text-center">Basic Salary</th>
              <th className="border border-gray-100 p-4 text-center">Allowance</th>
              <th className="border border-gray-100 p-4 text-center">Deduction</th>
              <th className="border border-gray-100 p-4 text-center">Bonus/Incentive</th>
              <th className="border border-gray-100 p-4 text-center">Net Salary</th>
              <th className="border border-gray-100 p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((r, idx) => (
              <tr key={idx} className="hover:bg-purple-50 transition-colors">
                <td className="p-3">{r.employeeId}</td>
                <td className="p-3 font-medium">{r.employeeName}</td>
                <td className="p-3 text-center">{r.basicSalary}</td>
                <td className="p-3 text-center">{r.allowance}</td>
                <td className="p-3 text-center">{r.deduction}</td>
                <td className="p-3 text-center">{r.bonus}</td>
                <td className="p-3 text-center font-semibold text-green-600">
                  {r.netSalary}
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setViewRecord(r);
                      setIsModalOpen(true);
                    }}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-purple-100 transition"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => downloadEmployee(r)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-purple-100 transition"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>


      <Modal
        title="Bank Details"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setViewRecord(null);
        }}
        footer={null}
        width={600}
      >
        {viewRecord && (
          <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
            <p>
              <strong>Bank Name:</strong> {viewRecord.bankName}
            </p>
            <p>
              <strong>Account No:</strong> {viewRecord.accountNo}
            </p>
            <p>
              <strong>IFSC:</strong> {viewRecord.ifsc}
            </p>
            <p>
              <strong>Account Holder:</strong> {viewRecord.accountHolderName}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
