import React, { useState } from "react";

export default function EmployeeCalculation() {
  const [employees, setEmployees] = useState([]); 

  const getTotalWorkingDays = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const totalWorkingDays = getTotalWorkingDays();

  const handleGenerateSalary = (id) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const baseSalary = 30000;
          const dailyRate = baseSalary / totalWorkingDays;
          const overtimePay = emp.overtime * 150;
          const deduction = emp.leave * dailyRate + emp.latePunch * 100;
          const calculatedSalary =
            emp.presentDays * dailyRate + overtimePay - deduction;

          return { ...emp, salary: Math.round(calculatedSalary) };
        }
        return emp;
      })
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="font-semibold text-xl">Employee Payroll Calculation</h1>
      </div>


      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-4 text-left">
                Employee ID
              </th>
              <th className="border border-gray-100 p-4 text-left">
                Employee Name
              </th>
              <th className="border border-gray-100 p-4 text-center">
                Total Working Days
              </th>
              <th className="border border-gray-100 p-4 text-center">
                Present Days
              </th>
              <th className="border border-gray-100 p-4 text-center">Leave</th>
              <th className="border border-gray-100 p-4 text-center">
                Late Punch
              </th>
              <th className="border border-gray-100 p-4 text-center">
                Over Time (hrs)
              </th>
              <th className="border border-gray-100 p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-purple-50 transition-colors">
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3 text-center">{totalWorkingDays}</td>
                  <td className="p-3 text-center">{emp.presentDays}</td>
                  <td className="p-3 text-center">{emp.leave}</td>
                  <td className="p-3 text-center">{emp.latePunch}</td>
                  <td className="p-3 text-center">{emp.overtime}</td>
                  <td className="p-3 text-center">
                    {emp.salary ? (
                      <span className="font-semibold text-green-600">
                        ₹{emp.salary.toLocaleString()}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleGenerateSalary(emp.id)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-xl shadow hover:scale-105 transition-transform"
                      >
                        Generate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-gray-400 italic p-6"
                >
                  No employee data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
