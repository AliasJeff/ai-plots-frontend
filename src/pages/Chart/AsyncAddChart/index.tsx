import { CHART_TYPE_SELECT } from '@/constants';
import { genChartByAiAsyncMqUsingPOST } from '@/services/AiPlots/ChartController';
import { UploadOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-form';
import { Button, Card, Divider, Form, message, Select, Space, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import './AsyncAddChart.css'; // 导入自定义的 CSS 样式文件
import useForm = ProForm.useForm;

const AsyncAddChart: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交表单
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    // 开始提交
    setSubmitting(true);
    const param = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncMqUsingPOST(param, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('图表分析成功，请稍后到 我的图表 界面查看结果');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败,' + e.message);
    }
    // 提交完成
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <div className="tip">
        <a href="/person/user_info" style={{ color: '#1890ff' }}>
          领取每日智能分析图表次数获取请到个人中心个人信息页面-点击文字-跳转
        </a>
      </div>
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
            <Divider style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>智能分析</Divider>
          </div>
        </div>
        <Form
          form={form}
          name="addChart"
          labelAlign="left"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '请输入分析目标' }]}
          >
            <TextArea placeholder="请输入你的分析需求，比如分析网站用户的增长情况" />
          </Form.Item>

          <Form.Item
            name="chartName"
            label="图表名称"
            rules={[{ required: true, message: '请输入图表名称！' }]}
          >
            <TextArea placeholder="请输入图表名称" />
          </Form.Item>

          <Form.Item
            name="chartType"
            label="图表类型"
            rules={[{ required: true, message: '请选择图表类型！' }]}
          >
            <Select options={CHART_TYPE_SELECT}></Select>
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1} accept=".csv,.xls,.xlsx,.json,.txt,.xml,.sql">
              <Button icon={<UploadOutlined />}>上传 CSV 文件(Excel)</Button>
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16, offset: 2 }}>
            <Space
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              {/*todo*/}
              <a
                href="https://www.yuque.com/kcsshier/zpovmy/lab4hgt8rf9d6sia?singleDoc#"
                target="_blank"
              >
                获取测试数据
              </a>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                  确定上传
                </Button>
                <Button htmlType="reset">重置内容</Button>
              </Space>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AsyncAddChart;
