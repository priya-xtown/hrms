// import { sequelize } from "../../../db/index.js";

// // export const getAttendanceReport = async (req, res) => {
// //   try {
// //     const { year, month } = req.query;

// //     const queryYear = year || new Date().getFullYear();
// //     const queryMonth = month || new Date().getMonth() + 1;

// //     const sql = `
// //       SET @year := :year;
// //       SET @month := :month;

// //       WITH RECURSIVE month_dates AS (
// //           SELECT DATE(CONCAT(@year, '-', LPAD(@month, 2, '0'), '-01')) AS date_val
// //           UNION ALL
// //           SELECT DATE_ADD(date_val, INTERVAL 1 DAY)
// //           FROM month_dates
// //           WHERE MONTH(DATE_ADD(date_val, INTERVAL 1 DAY)) = @month
// //       ),

// //       hrms_employees AS (
// //           SELECT 
// //               e.id AS hrms_emp_id,
// //               e.emp_id,
// //               e.attendance_id,
// //               e.first_name,
// //               ed.departmentId,
// //               dept.department_name,
// //               ed.designationId,
// //               r.role_name AS designation_name,
// //               ed.branchId,
// //               br.branch_name,
// //               b.emp_code AS att_emp_code
// //           FROM hrms.employees AS e
// //           LEFT JOIN hrms.employee_details AS ed 
// //               ON ed.emp_id = e.id
// //           LEFT JOIN hrms.departments AS dept 
// //               ON dept.id = ed.departmentId AND dept.is_active = 1
// //           LEFT JOIN hrms.roles AS r 
// //               ON r.id = ed.designationId 
// //               AND r.department_id = dept.id 
// //               AND r.is_active = 1
// //           LEFT JOIN hrms.branches AS br 
// //               ON br.id = ed.branchId AND br.is_active = 1
// //           LEFT JOIN att.personnel_employee AS b 
// //               ON e.attendance_id = b.emp_code
// //       ),

// //       tx AS (
// //           SELECT 
// //               emp_code,
// //               DATE(punch_time) AS punch_date,
// //               MIN(punch_time) AS punch_time,
// //               GROUP_CONCAT(DISTINCT punch_state ORDER BY punch_time SEPARATOR ',') AS punch_states
// //           FROM att.iclock_transaction
// //           WHERE YEAR(punch_time) = @year
// //             AND MONTH(punch_time) = @month
// //           GROUP BY emp_code, DATE(punch_time)
// //       )

// //       SELECT 
// //           h.emp_id,
// //           h.first_name,
// //           h.department_name,
// //           h.designation_name,
// //           h.branch_name,
// //           d.date_val AS punch_date,
// //           tx.punch_time,
// //           CASE 
// //               WHEN tx.punch_time IS NOT NULL THEN 'PRESENT'
// //               ELSE 'ABSENT'
// //           END AS status,
// //           tx.punch_states AS punch_state
// //       FROM hrms_employees AS h
// //       CROSS JOIN month_dates AS d
// //       LEFT JOIN tx
// //           ON tx.emp_code = h.att_emp_code
// //           AND tx.punch_date = d.date_val
// //       ORDER BY h.emp_id, d.date_val;
// //     `;

// //     const results = await sequelize.query(sql, {
// //       replacements: { year: queryYear, month: queryMonth },
// //       multipleStatements: true
// //     });

// //     // results[2] contains the SELECT output
// //     return res.status(200).json({
// //       message: "Attendance report fetched successfully",
// //       year: queryYear,
// //       month: queryMonth,
// //       data: results[2]
// //     });

// //   } catch (error) {
// //     console.error("Attendance report error:", error);
// //     return res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };


// export const getAttendanceReport = async (req, res) => {
//   try {
//     const { year, month } = req.query;

//     const query = `
//       WITH RECURSIVE month_dates AS (
//           SELECT DATE(CONCAT(:year, '-', LPAD(:month, 2, '0'), '-01')) AS date_val
//           UNION ALL
//           SELECT DATE_ADD(date_val, INTERVAL 1 DAY)
//           FROM month_dates
//           WHERE MONTH(DATE_ADD(date_val, INTERVAL 1 DAY)) = :month
//       ),
      
//       hrms_employees AS (
//           SELECT 
//               e.id AS hrms_emp_id,
//               e.emp_id,
//               e.attendance_id,
//               e.first_name,
//               ed.departmentId,
//               dept.department_name,
//               ed.designationId,
//               r.role_name AS designation_name,
//               ed.branchId,
//               br.branch_name,
//               b.emp_code AS att_emp_code
//           FROM hrms.employees AS e
//           LEFT JOIN hrms.employee_details AS ed ON ed.emp_id = e.id
//           LEFT JOIN hrms.departments AS dept 
//               ON dept.id = ed.departmentId AND dept.is_active = 1
//           LEFT JOIN hrms.roles AS r 
//               ON r.id = ed.designationId 
//               AND r.department_id = dept.id 
//               AND r.is_active = 1
//           LEFT JOIN hrms.branches AS br 
//               ON br.id = ed.branchId AND br.is_active = 1
//           LEFT JOIN att.personnel_employee AS b 
//               ON e.attendance_id = b.emp_code
//       ),

//       tx AS (
//           SELECT 
//               emp_code,
//               DATE(punch_time) AS punch_date,
//               MIN(punch_time) AS punch_time,
//               GROUP_CONCAT(DISTINCT punch_state ORDER BY punch_time SEPARATOR ',') AS punch_states
//           FROM att.iclock_transaction
//           WHERE YEAR(punch_time) = :year
//             AND MONTH(punch_time) = :month
//           GROUP BY emp_code, DATE(punch_time)
//       )

//       SELECT 
//           h.emp_id,
//           h.first_name,
//           h.department_name,
//           h.designation_name,
//           h.branch_name,
//           d.date_val AS punch_date,
//           tx.punch_time,
//           CASE 
//               WHEN tx.punch_time IS NOT NULL THEN 'PRESENT'
//               ELSE 'ABSENT'
//           END AS status,
//           tx.punch_states AS punch_state
//       FROM hrms_employees AS h
//       CROSS JOIN month_dates AS d
//       LEFT JOIN tx
//           ON tx.emp_code = h.att_emp_code
//           AND tx.punch_date = d.date_val
//       ORDER BY h.emp_id, d.date_val;
//     `;

//     const data = await sequelize.query(query, {
//       replacements: { year, month },
//       type: sequelize.QueryTypes.SELECT,
//       raw: true,
//     });

//     res.json({ success: true, data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// import { sequelize } from "../../../db/index.js";
// import { att } from "../../../db/xtown.js";

// export const getMonthlyAttendance = async (req, res) => {
//   try {
//     let { year, month } = req.query;

//     year = year || new Date().getFullYear();
//     month = month || new Date().getMonth() + 1;

//     // 1️⃣ RUN INDIVIDUAL SET STATEMENTS
//     await sequelize.query(`SET @year := :year`, {
//       replacements: { year }
//     });

//     await sequelize.query(`SET @month := :month`, {
//       replacements: { month }
//     });

//     // 2️⃣ MAIN QUERY (NO SET STATEMENTS HERE)
//     const sqlQuery = `
//       WITH RECURSIVE month_dates AS (
//           SELECT DATE(CONCAT(@year, '-', LPAD(@month, 2, '0'), '-01')) AS date_val
//           UNION ALL
//           SELECT DATE_ADD(date_val, INTERVAL 1 DAY)
//           FROM month_dates
//           WHERE MONTH(DATE_ADD(date_val, INTERVAL 1 DAY)) = @month
//       ),

//       hrms_employees AS (
//           SELECT 
//               e.id AS hrms_emp_id,
//               e.emp_id,
//               e.attendance_id,
//               e.first_name,
//               ed.departmentId,
//               dept.department_name,
//               ed.designationId,
//               r.role_name AS designation_name,
//               ed.branchId,
//               br.branch_name,
//               b.emp_code AS att_emp_code
//           FROM hrms.employees AS e
//           LEFT JOIN hrms.employee_details AS ed ON ed.employee_id = e.id
//           LEFT JOIN hrms.departments AS dept 
//               ON dept.id = ed.departmentId AND dept.is_active = 1
//           LEFT JOIN hrms.roles AS r ON 
//               r.id = ed.designationId 
//               AND r.department_id = dept.id 
//               AND r.is_active = 1
//           LEFT JOIN hrms.branches AS br 
//               ON br.id = ed.branchId AND br.is_active = 1
//           LEFT JOIN att.personnel_employee AS b 
//               ON e.attendance_id = b.emp_code
//       ),

//       tx AS (
//           SELECT 
//               emp_code,
//               DATE(punch_time) AS punch_date,
//               MIN(punch_time) AS punch_time,
//               GROUP_CONCAT(DISTINCT punch_state ORDER BY punch_time SEPARATOR ',') AS punch_states
//           FROM att.iclock_transaction
//           WHERE YEAR(punch_time) = @year
//             AND MONTH(punch_time) = @month
//           GROUP BY emp_code, DATE(punch_time)
//       )

//       SELECT 
//           h.emp_id,
//           h.first_name,
//           h.department_name,
//           h.designation_name,
//           h.branch_name,
//           d.date_val AS punch_date,
//           tx.punch_time,
//           CASE 
//               WHEN tx.punch_time IS NOT NULL THEN 'PRESENT'
//               ELSE 'ABSENT'
//           END AS status,
//           tx.punch_states AS punch_state
//       FROM hrms_employees AS h
//       CROSS JOIN month_dates AS d
//       LEFT JOIN tx
//           ON tx.emp_code = h.att_emp_code
//           AND tx.punch_date = d.date_val
//       ORDER BY h.emp_id, d.date_val;
//     `;

//     const result = await sequelize.query(sqlQuery, {
//       type: sequelize.QueryTypes.SELECT
//     });

//     res.status(200).json({
//       success: true,
//       year,
//       month,
//       data: result
//     });

//   } catch (error) {
//     console.error("Error fetching monthly attendance:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };


import { sequelize } from "../../../db/index.js";
import { att } from "../../../db/xtown.js";

export const getMonthlyAttendance = async (req, res) => {
  try {
    let { year, month } = req.query;

    year = year || new Date().getFullYear();
    month = month || new Date().getMonth() + 1;

    // 1️⃣ Set SQL variables
    await sequelize.query(`SET @year := :year`, {
      replacements: { year }
    });

    await sequelize.query(`SET @month := :month`, {
      replacements: { month }
    });

    // 2️⃣ MAIN SQL QUERY
    const sqlQuery = `
      WITH RECURSIVE month_dates AS (
          SELECT DATE(CONCAT(@year, '-', LPAD(@month, 2, '0'), '-01')) AS date_val
          UNION ALL
          SELECT DATE_ADD(date_val, INTERVAL 1 DAY)
          FROM month_dates
          WHERE MONTH(DATE_ADD(date_val, INTERVAL 1 DAY)) = @month
      ),

      hrms_employees AS (
          SELECT 
              e.id AS hrms_emp_id,
              e.emp_id,
              e.attendance_id,
              e.first_name,
              ed.departmentId,
              dept.department_name,
              ed.designationId,
              r.role_name AS designation_name,
              ed.branchId,
              br.branch_name,
              b.emp_code AS att_emp_code
          FROM hrms.employees AS e
          LEFT JOIN hrms.employee_details AS ed ON ed.employee_id = e.id
          LEFT JOIN hrms.departments AS dept 
              ON dept.id = ed.departmentId AND dept.is_active = 1
          LEFT JOIN hrms.roles AS r ON 
              r.id = ed.designationId 
              AND r.department_id = dept.id 
              AND r.is_active = 1
          LEFT JOIN hrms.branches AS br 
              ON br.id = ed.branchId AND br.is_active = 1
          LEFT JOIN att.personnel_employee AS b 
              ON e.attendance_id = b.emp_code
      ),

      tx AS (
          SELECT 
              emp_code,
              DATE(punch_time) AS punch_date,
              MIN(punch_time) AS punch_time,
              GROUP_CONCAT(DISTINCT punch_state ORDER BY punch_time SEPARATOR ',') AS punch_states
          FROM att.iclock_transaction
          WHERE YEAR(punch_time) = @year
            AND MONTH(punch_time) = @month
          GROUP BY emp_code, DATE(punch_time)
      )

      SELECT 
          h.emp_id,
          h.first_name,
          h.department_name,
          h.designation_name,
          h.branch_name,
          d.date_val AS punch_date,
          tx.punch_time,
          CASE 
              WHEN tx.punch_time IS NOT NULL THEN 'PRESENT'
              ELSE 'ABSENT'
          END AS status,
          tx.punch_states AS punch_state
      FROM hrms_employees AS h
      CROSS JOIN month_dates AS d
      LEFT JOIN tx
          ON tx.emp_code = h.att_emp_code
          AND tx.punch_date = d.date_val
      ORDER BY h.emp_id, d.date_val;
    `;

    // 3️⃣ EXECUTE QUERY
    const rows = await sequelize.query(sqlQuery, {
      type: sequelize.QueryTypes.SELECT
    });

// //     // // 4️⃣ GROUP BY EMPLOYEE
// //     // const grouped = {};

// //     // for (const row of rows) {
// //     //   const empKey = row.emp_id;

// //     //   if (!grouped[empKey]) {
// //     //     grouped[empKey] = {
// //     //       emp_id: row.emp_id,
// //     //       first_name: row.first_name,
// //     //       department_name: row.department_name,
// //     //       designation_name: row.designation_name,
// //     //       branch_name: row.branch_name,
// //     //       attendance: []
// //     //     };
// //     //   }

// //     //   grouped[empKey].attendance.push({
// //     //     punch_date: row.punch_date,
// //     //     punch_time: row.punch_time,
// //     //     status: row.status,
// //     //     punch_state: row.punch_state
// //     //   });
// //     // }

// //     // 4️⃣ GROUP BY EMPLOYEE WITH DATE → STATUS FORMAT
// // const grouped = {};

// // for (const row of rows) {
// //   const empKey = row.emp_id;

// //   if (!grouped[empKey]) {
// //     grouped[empKey] = {
// //       emp_id: row.emp_id,
// //       first_name: row.first_name,
// //       department_name: row.department_name,
// //       designation_name: row.designation_name,
// //       branch_name: row.branch_name,
// //       attendance: {}   // ← CHANGE HERE
// //     };
// //   }

// //   // Convert date to string YYYY-MM-DD
// //   const dateKey = row.punch_date.toISOString().split("T")[0];

// //   // Store only status ("PRESENT"/"ABSENT")
// //   grouped[empKey].attendance[dateKey] = row.status; 
// // }

// // res.json({
// //   success: true,
// //   year,
// //   month,
// //   data: Object.values(grouped),
// // });

//    // 4️⃣ GROUP BY EMPLOYEE → DATE → STATUS
// const grouped = {};

// for (const row of rows) {
//   const empKey = row.emp_id;

//   if (!grouped[empKey]) {
//     grouped[empKey] = {
//       emp_id: row.emp_id,
//       first_name: row.first_name,
//       department_name: row.department_name,
//       designation_name: row.designation_name,
//       branch_name: row.branch_name,
//       attendance: {},     // Store date → status
//       present: 0,
//       absent: 0,
//       leave: 0,
//       late_min: 0,
//       overtime: 0
//     };
//   }

//   // Format: YYYY-MM-DD → DD
//   const dateStr = row.punch_date.toISOString().split("T")[0];
//   const day = dateStr.split("-")[2];  // "01", "02", ...

//   const status = row.status;

//   grouped[empKey].attendance[day] = status;

//   // Auto counting
//   if (status === "PRESENT") grouped[empKey].present++;
//   if (status === "ABSENT") grouped[empKey].absent++;
// }

// // Convert to array
// res.json({
//   success: true,
//   year,
//   month,
//   data: Object.values(grouped),
// });


// 4️⃣ GROUP BY EMPLOYEE → DATE → STATUS
const grouped = {};

for (const row of rows) {
  const empKey = row.emp_id;

  if (!grouped[empKey]) {
    grouped[empKey] = {
      emp_id: row.emp_id,
      first_name: row.first_name,
      department_name: row.department_name,
      designation_name: row.designation_name,
      branch_name: row.branch_name,
      attendance: {},
      present: 0,
      absent: 0,
      leave: 0,
      late_min: 0,
      overtime: 0
    };
  }

  // Convert DATE to string safely
  const dateStr = String(row.punch_date);
  const day = dateStr.split("-")[2]; // "01", "02", ...

  const status = row.status;

  grouped[empKey].attendance[day] = status;

  if (status === "PRESENT") grouped[empKey].present++;
  if (status === "ABSENT") grouped[empKey].absent++;
}

res.json({
  success: true,
  year,
  month,
  data: Object.values(grouped),
});


  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
