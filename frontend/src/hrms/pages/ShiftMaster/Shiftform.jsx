import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  TimePicker,
  Switch,
  message
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { shiftService } from "./ShiftApi";

const Shiftform = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();

  const isEdit = location.state?.isEdit || false;
  const initialValues = location.state?.initialValues || {};

  // ------------------ LOAD EDIT DATA ------------------ //
  useEffect(() => {
    if (isEdit && initialValues && Object.keys(initialValues).length) {
      form.setFieldsValue({
        shift_name: initialValues.shift_name,
        shift_type: initialValues.shift_type,

        start_time: initialValues.start_time
          ? dayjs(initialValues.start_time, "HH:mm:ss")
          : null,

        end_time: initialValues.end_time
          ? dayjs(initialValues.end_time, "HH:mm:ss")
          : null,

        min_in_time: initialValues.min_in_time
          ? dayjs(initialValues.min_in_time, "HH:mm:ss")
          : null,

        max_out_time: initialValues.max_out_time
          ? dayjs(initialValues.max_out_time, "HH:mm:ss")
          : null,

        break_start_time: initialValues.break_start_time
          ? dayjs(initialValues.break_start_time, "HH:mm:ss")
          : null,

        break_end_time: initialValues.break_end_time
          ? dayjs(initialValues.break_end_time, "HH:mm:ss")
          : null,

        total_hours: initialValues.total_hours,

        is_night_shift: initialValues.is_night_shift || false,

        status: initialValues.status?.toLowerCase() || "inactive"
      });
    }
  }, [isEdit, initialValues, form]);

  // ------------------ SUBMIT HANDLER ------------------ //
const handleFormSubmit = async (values) => {
  setIsSubmitting(true);

  try {
    const formatTime = (time) =>
      time ? dayjs(time).format("HH:mm:ss") : null;

    const data = {
      shift_name: values.shift_name,
      shift_type: values.shift_type,
      start_time: formatTime(values.start_time),
      end_time: formatTime(values.end_time),
      min_in_time: formatTime(values.min_in_time),
      max_out_time: formatTime(values.max_out_time),
      break_start_time: formatTime(values.break_start_time),
      break_end_time: formatTime(values.break_end_time),
      total_hours: values.total_hours,
      is_night_shift: values.is_night_shift || false,
      status: values.status?.toLowerCase(),
    };
if (isEdit && initialValues.shift_id) {
  await shiftService.updateShift(initialValues.shift_id, data);

      messageApi.success("Shift updated successfully");

      navigate("/hrms/pages/shift");
    } else {
      await shiftService.createShift(data);

      messageApi.success("Shift created successfully");

      navigate("/hrms/pages/shift");
    }
  } catch (error) {
    messageApi.error(
      error?.response?.data?.message || "Failed to save shift"
    );

    console.error("Shift operation failed:", error);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <>
      {contextHolder}

      <div className="p-6 max-w-6xl mx-auto rounded">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Shift" : "Add Shift"}
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleFormSubmit}
          initialValues={{ status: "active", is_night_shift: false }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Shift Name */}
            <Form.Item
              name="shift_name"
              label="Shift Name"
              rules={[{ required: true, message: "Please enter shift name" }]}
            >
              <Select placeholder="Select Shift Name">
                <Select.Option value="Day">Day Shift</Select.Option>
                <Select.Option value="Evening">Evening</Select.Option>
                <Select.Option value="General">General</Select.Option>
                <Select.Option value="Night">Night Shift</Select.Option>
              </Select>
            </Form.Item>


            {/* Start Time */}
            <Form.Item
              name="start_time"
              label="Start Time"
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            {/* End Time */}
            <Form.Item
              name="end_time"
              label="End Time"
              rules={[{ required: true, message: "Please select end time" }]}
            >
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            {/* Break Start */}
            <Form.Item name="break_start_time" label="Break Start Time">
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            {/* Break End */}
            <Form.Item name="break_end_time" label="Break End Time">
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            {/* Total Hours */}
            <Form.Item name="total_hours" label="Total Hours">
              <Input type="number" placeholder="Example: 8.5" />
            </Form.Item>

            {/* Min In */}
            <Form.Item
              name="min_in_time"
              label="Minimum In Time"
              rules={[{ required: true, message: "Please select minimum in time" }]}
            >
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            {/* Max Out */}
            <Form.Item
              name="max_out_time"
              label="Maximum Out Time"
              rules={[{ required: true, message: "Please select maximum out time" }]}
            >
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            {/* Status */}
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button danger onClick={() => navigate("/hrms/pages/shift")}>
              Cancel
            </Button>

            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Shiftform;
