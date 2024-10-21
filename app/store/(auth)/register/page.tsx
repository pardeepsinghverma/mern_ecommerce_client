"use client";

import React from 'react';
import { Form, notification, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAppDispatch } from '@/src/store/main'; // Use the typed dispatch hook
import { registerUser } from '@/src/store/auth-slice'; // Async thunk
import { useNavigate } from 'react-router-dom';
type NotificationPlacement = NotificationArgsProps['placement'];

import type { NotificationArgsProps } from 'antd';
const Context = React.createContext({ name: 'Default' });

const RegisterPage = () => {
  const dispatch = useAppDispatch(); // Typed dispatch
  const [api, contextHolder] = notification.useNotification();


  const onFinish = (values: any) => {
    dispatch(registerUser(values)) // Dispatch async thunk
      .then((data) => {
        const placement: NotificationPlacement = 'bottomRight';
        // if(data?.payload?.success) {
        //   window.location.href = 'login';
        // }
      }
    );
  };

  return (
    <div className="w-96">
      <Form
        className="w-full"
        name="register"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
              type: "email",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters!",
            },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("You must accept the terms and conditions")
                    ),
            },
          ]}
        >
          <Checkbox>
            I have read and agree to the <a href="#">terms and conditions</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
