import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Upload,
  Modal,
  message,
  Tabs,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  SaveOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { addressServices } from "../services/AddressServices";
import { openDB } from "idb";

const { Option } = Select;
const { TabPane } = Tabs;

// Initialize IndexedDB
const dbPromise = openDB("CompanyFormDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images", { keyPath: "id" });
    }
  },
});

const CompanyForm = ({ isModalOpen, setIsModalOpen, onFinish }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [billingState, setBillingState] = useState([]);
  const [billingCity, setBillingCity] = useState([]);

  const fetchCountry = async () => {
    try {
      const response = await addressServices.getCountry();
      setCountry(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching country data:", error);
      message.error("Failed to fetch countries");
    }
  };

  const fetchState = async (countryId) => {
    try {
      const response = await addressServices.getState(countryId);
      setState(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching state data:", error);
      message.error("Failed to fetch states");
      setState([]);
    }
  };

  const fetchCity = async (stateId) => {
    try {
      const response = await addressServices.getCity(stateId);
      setCity(response.data || []);
    } catch (error) {
      console.error("Error fetching city data:", error);
      message.error("Failed to fetch cities");
      setCity([]);
    }
  };

  const fetchBillingState = async (countryId) => {
    try {
      const response = await addressServices.getState(countryId);
      setBillingState(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching billing state data:", error);
      message.error("Failed to fetch billing states");
      setBillingState([]);
    }
  };

  const fetchBillingCity = async (stateId) => {
    try {
      const response = await addressServices.getCity(stateId);
      setBillingCity(response.data || []);
    } catch (error) {
      console.error("Error fetching billing city data:", error);
      message.error("Failed to fetch billing cities");
      setBillingCity([]);
    }
  };

  useEffect(() => {
    fetchCountry();
    fetchState();
    fetchCity();
    fetchBillingState();
    fetchBillingCity();
  }, []);

  const handleCountryChange = async (countryId) => {
    form.setFieldsValue({ state: undefined, city: undefined });
    setCity([]);
    await fetchState(countryId);
    if (!countryId) {
      await fetchCity();
    }
  };

  const handleStateChange = async (stateId) => {
    form.setFieldsValue({ city: undefined });
    await fetchCity(stateId);
  };

  const handleBillingCountryChange = async (countryId) => {
    form.setFieldsValue({ billing_state: undefined, billing_city: undefined });
    setBillingCity([]);
    await fetchBillingState(countryId);
    if (!countryId) {
      await fetchBillingCity();
    }
  };

  const handleBillingStateChange = async (stateId) => {
    form.setFieldsValue({ billing_city: undefined });
    await fetchBillingCity(stateId);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  // Store image in IndexedDB
  const storeImageInIndexedDB = async (file, base64) => {
    try {
      const db = await dbPromise;
      await db.put("images", { id: file.uid, base64 });
      message.success("Image stored in IndexedDB");
    } catch (error) {
      console.error("Error storing image in IndexedDB:", error);
      message.error("Failed to store image in IndexedDB");
    }
  };

  const handleFileChange = async ({ fileList: newFileList }) => {
    const newFile = newFileList.slice(-1); // Keep only the latest file
    setFileList(newFile);

    if (newFile.length > 0) {
      const file = newFile[0].originFileObj;
      if (file) {
        const base64 = await getBase64(file);
        await storeImageInIndexedDB(file, base64);
      }
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      await form.validateFields();

      let logoDataUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        const db = await dbPromise;
        const storedImage = await db.get("images", file.uid);
        console.log("Stored Image:", storedImage);
        logoDataUrl = storedImage ? storedImage.base64.substring(0, 15) : "";
      }

      const formData = {
        ...values,
        city: Number(values.city),
        state: Number(values.state),
        country: Number(values.country),
        pincode: Number(values.pincode),
        billing_city: Number(values.billing_city),
        billing_state: Number(values.billing_state),
        billing_country: Number(values.billing_country),
        billing_pincode: Number(values.billing_pincode),
        logo: logoDataUrl,
      };

      const result = await onFinish(formData);
      if (result && result.success) {
        message.success(result.message || "Company created successfully");
        form.resetFields();
        setFileList([]);

        setState([]);
        setCity([]);
        setBillingState([]);
        setBillingCity([]);
        // Clear IndexedDB images store
        const db = await dbPromise;
        await db.clear("images");
        setIsModalOpen(false);
      } else {
        message.error(result?.error || "Failed to create company");
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        message.error(
          `Failed to submit form: ${
            error.response.data?.message || "Server error"
          }`
        );
      } else if (error.name === "ValidationError") {
        message.error("Please correct the form errors");
      } else {
        message.error("Failed to submit form: Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleCancel = async () => {
    form.resetFields();
    setFileList([]);
    setState([]);
    setCity([]);
    setBillingState([]);
    setBillingCity([]);
    // Clear IndexedDB images store
    const db = await dbPromise;
    await db.clear("images");
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={<div className="text-xl font-semibold">Add Company</div>}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width="90vw"
      style={{ maxWidth: "800px", top: 20 }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFormSubmit}
        initialValues={{ status: "Active" }}
        className="w-full"
      >
        <Tabs defaultActiveKey="companydetails">
          <TabPane
            tab={
              <span>
                <UserOutlined /> Company Information
              </span>
            }
            key="companydetails"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Company Name"
                  rules={[
                    { required: true, message: "Please enter company name" },
                  ]}
                >
                  <Input placeholder="Enter company name" maxLength={25} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="short_name"
                  label="Short Name"
                  rules={[
                    { required: true, message: "Please enter short name" },
                  ]}
                >
                  <Input placeholder="Enter short name" maxLength={10} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    { required: true, message: "Please enter phone number" },
                    {
                      min: 7,
                      message: "Phone number must be at least 7 characters",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Please enter a valid phone number",
                    },
                  ]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="gst_no"
                  label="GST Number"
                  rules={[
                    { required: true, message: "Please enter GST number" },
                    {
                      pattern:
                        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: "Please enter a valid GST number",
                    },
                  ]}
                >
                  <Input placeholder="Enter GST number" />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab={<span>Addres Information</span>} key="address">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="address_line1"
                  label="Address Line 1"
                  rules={[{ required: true, message: "Please enter address" }]}
                >
                  <Input.TextArea rows={2} placeholder="Enter address line 1" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="address_line2" label="Address Line 2">
                  <Input.TextArea rows={2} placeholder="Enter address line 2" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select
                    placeholder="Select country"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={handleCountryChange}
                  >
                    {country.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: "Please select state" }]}
                >
                  <Select
                    placeholder="Select state"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={handleStateChange}
                  >
                    {state.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: "Please select city" }]}
                >
                  <Select
                    placeholder="Select city"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {city.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="pincode"
                  label="Pincode"
                  rules={[
                    { required: true, message: "Please enter pincode" },
                    {
                      pattern: /^\d{6}$/,
                      message:
                        "Please enter a valid 6-digit pincode (India-specific)",
                    },
                  ]}
                >
                  <Input placeholder="Enter pincode" maxLength={6} />
                </Form.Item>
              </Col>

              {/* <Col xs={24} sm={8}>
  <Form.Item
    name="status"
    label="Status"
    initialValue="Active"
    rules={[{ required: true, message: "Please select status" }]}
  >
    <Select placeholder="Select status">
      <Option value="Active">Active</Option>
      <Option value="Inactive">Inactive</Option>
      <Option value="Closed">Closed</Option>
    </Select>
  </Form.Item>
</Col> */}

              <Col span={24}>
                <div className="border-t border-gray-200 my-4 pt-4">
                  <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="billing_address_line1"
                  label="Billing Address Line 1"
                  rules={[
                    { required: true, message: "Please enter billing address" },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Enter billing address line 1"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="billing_address_line2"
                  label="Billing Address Line 2"
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Enter billing address line 2"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="billing_country"
                  label="Billing Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select billing country",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select billing country"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={handleBillingCountryChange}
                  >
                    {country.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="billing_state"
                  label="Billing State"
                  rules={[
                    { required: true, message: "Please select billing state" },
                  ]}
                >
                  <Select
                    placeholder="Select billing state"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={handleBillingStateChange}
                  >
                    {billingState.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="billing_city"
                  label="Billing City"
                  rules={[
                    { required: true, message: "Please select billing city" },
                  ]}
                >
                  <Select
                    placeholder="Select billing city"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {billingCity.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="billing_pincode"
                  label="Billing Pincode"
                  rules={[
                    { required: true, message: "Please enter billing pincode" },
                    {
                      pattern: /^\d{6}$/,
                      message:
                        "Please enter a valid 6-digit pincode (India-specific)",
                    },
                  ]}
                >
                  <Input placeholder="Enter billing pincode" maxLength={6} />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={
              <span>
                <UserOutlined /> Company Logo
              </span>
            }
            key="logo"
          >
            <Col xs={24}>
              <Form.Item
                name="logo"
                label="Company Logo"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[
                  { required: true, message: "Please upload company logo" },
                ]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={beforeUpload}
                  accept="image/*"
                  maxCount={1}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                  }}
                >
                  {fileList.length < 1 && uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </TabPane>
        </Tabs>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <Button danger onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full sm:w-auto"
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CompanyForm;
