
// import React, { useState } from "react";
// import {
//   Form,
//   Input,
//   Row,
//   Col,
//   Button,
//   DatePicker,
//   Upload,
//   Avatar,
//   message,
//   Modal,
//   Select,
// } from "antd";
// import { UploadOutlined, UserOutlined } from "@ant-design/icons";

// const EmployeeForm = () => {
//   const [form] = Form.useForm();
//   const [imageUrl, setImageUrl] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(true); // ✅ modal opens directly

//   const handleImageChange = (info) => {
//     const file = info.file.originFileObj;
//     if (file) {
//       setImageUrl(URL.createObjectURL(file)); // preview
//     }
//   };

//   const uploadProps = {
//     beforeUpload: () => false,
//     showUploadList: false,
//     onChange: handleImageChange,
//   };

//   const handleSubmit = (values) => {
//     console.log("Form Submitted:", { ...values, profileImage: imageUrl });
//     message.success("Employee saved successfully!");
//     setIsModalOpen(false);
//     form.resetFields();
//     setImageUrl(null);
//   };

//   return (
//     <Modal
//       title="Add Employee"
//       open={isModalOpen}
//       onCancel={() => setIsModalOpen(false)}
//       footer={null}
//       width={800}
//       destroyOnClose
//     >

//       {/* Profile Upload */}
//       <div className="flex items-center gap-6 mb-6">
//         <Avatar
//           size={96}
//           src={imageUrl}
//           icon={!imageUrl && <UserOutlined />}
//           style={{ border: "1px solid #d9d9d9" }}
//         />
//         <Upload {...uploadProps}>
//           <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
//         </Upload>
//       </div>

//       {/* Employee Form */}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         initialValues={{ status: "active" }}
//       >
//         <Row gutter={16}>
//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="employee_Id"
//               label="Employee ID"
//               rules={[{ required: true, message: "Enter Employee Id" }]}
//             >
//               <Input placeholder="EMP001" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="attendance_id"
//               label="Attendance ID"
//               rules={[{ required: true, message: "Enter Attendance ID" }]}
//             >
//               <Input placeholder="ID" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="first_name"
//               label="First Name"
//               rules={[{ required: true, message: "Enter First Name" }]}
//             >
//               <Input placeholder="First name" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="last_name"
//               label="Last Name"
//               rules={[{ required: true, message: "Enter Last Name" }]}
//             >
//               <Input placeholder="Last name" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="date_of_joining"
//               label="Date of Joining"
//               rules={[{ required: true }]}
//             >
//               <DatePicker className="w-full" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="reporting_manager"
//               label="Reporting Manager"
//               rules={[{ required: true, message: "Enter Reporting Manager" }]}
//             >
//               <Input placeholder="Manager name" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="employee_type"
//               label="Employee Type"
//               rules={[{ required: true, message: "Please select Employee Type" }]}
//             >
//               <Select placeholder="Select Employee Type">
//                 <Select.Option value="permanent">Permanent</Select.Option>
//                 <Select.Option value="contract">Contract</Select.Option>
//                 <Select.Option value="intern">Intern</Select.Option>
//               </Select>
//             </Form.Item>
//           </Col>


//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="role"
//               label="Role"
//               rules={[{ required: true, message: "Enter Role" }]}
//             >
//               <Input placeholder="Role" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//             <Form.Item
//               name="status"
//               label="Status"
//               rules={[{ required: true, message: "Please select Status" }]}
//             >
//               <Select placeholder="Select Status">
//                 <Select.Option value="active">Active</Select.Option>
//                 <Select.Option value="inactive">Inactive</Select.Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={8}>
//            <Form.Item
//   name="shiftType"
//   label="Shift Type"
//   rules={[{ required: true, message: "Please select a shift type" }]}
// >
//   <Select placeholder="Select Shift Type">
//     <Select.Option value="day">Day Shift</Select.Option>
//     <Select.Option value="night">Night Shift</Select.Option>
//   </Select>
// </Form.Item>

//           </Col>
//         </Row>

//         {/* Buttons */}
//         <Form.Item className="flex justify-end mt-6">
//           <Button onClick={() => setIsModalOpen(false)} danger>
//             Cancel
//           </Button>
//           <Button type="primary" htmlType="submit" className="ml-2">
//             Save Employee
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default EmployeeForm;
