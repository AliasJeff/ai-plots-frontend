import { genTextTaskAsyncAiMqUsingPOST } from '@/services/AiPlots/textController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, message, Select, Space, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import './AddTextMQ.css';

/**
 * 添加文本（异步）页面
 * @constructor
 */
const AddTextMQ: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genTextTaskAsyncAiMqUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的文本页面查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  const customRequest = (option: any) => {
    const urlData = URL.createObjectURL(option.file); //转为blob格式（二进制文件）
    console.log('blob:', urlData);
    option.onSuccess();
  };

  const beforeUpload = (file: any) => {
    const fileSize = file.size / 1024 / 1024 < 5;
    if (!fileSize) {
      message.error('文件应当小于5MB!', 1000);
    }
    return fileSize;
  };

  const handleChange = (info: any) => {
    console.debug('info:', info);
    if (info.file.status === 'done') {
      message.success('上传成功');
    }
    if (info.file.status === 'error') {
      message.error('上传失败');
    }
  };

  return (
    <div className="add-text-async">
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              display: 'inline-block',
              marginBottom: 20,
            }}
          >
            <Divider style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              智能转换文本
            </Divider>
          </div>
        </div>
        <Form
          form={form}
          name="addText"
          labelAlign="left"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="name"
            label="文本名称"
            rules={[{ required: true, message: '请输入文本名称' }]}
          >
            <Input placeholder="请输入文本名称" />
          </Form.Item>
          <Form.Item
            name="textType"
            label="文本类型"
            rules={[{ required: true, message: '请输入文本类型' }]}
          >
            <Select options={[{ value: 'markdown', label: 'markdown格式' }]} />
          </Form.Item>
          <Form.Item name="file" label="原始数据">
            <Upload
              name="file"
              maxCount={1}
              accept=".txt"
              beforeUpload={beforeUpload}
              onChange={handleChange}
              customRequest={customRequest}
            >
              <Button icon={<UploadOutlined />}>上传 TXT 文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 2 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <div className="tip"></div>
      </Card>
    </div>
  );
};
export default AddTextMQ;
