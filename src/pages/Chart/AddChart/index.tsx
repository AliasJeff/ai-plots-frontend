import { CHART_TYPE_SELECT } from '@/constants';
import { genChartByAiUsingPOST } from '@/services/AiPlots/ChartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, message, Row, Select, Space, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';
import './AddChart.css';

const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交表单
   * @param values
   */
  const onFinish = async (values: any) => {
    console.log(values);
    // 避免重复提交
    if (submitting) {
      return;
    }
    // 开始提交
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    const param = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(param, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败,' + e.message);
    }
    // 提交完成
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
    <div className="add-chart">
      <div className="tip"></div>
      <Row gutter={24}>
        <Col span={12}>
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
                  智能分析
                </Divider>
              </div>
            </div>
            <Form
              name="addChart"
              labelAlign="left"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <TextArea placeholder="请输入你的分析需求，比如: 分析网站用户的增长情况" />
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
                <Upload
                  name="file"
                  maxCount={1}
                  accept=".csv,.xls,.xlsx,.json,.txt,.xml,.sql"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  customRequest={customRequest}
                >
                  <Button icon={<UploadOutlined />}>上传 CSV 文件(Excel)</Button>
                </Upload>
                {/*todo*/}
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      disabled={submitting}
                    >
                      确定上传
                    </Button>
                    <Button htmlType="reset">重置内容</Button>
                  </Space>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={12}>
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
                  可视化图表
                </Divider>
              </div>
            </div>
            <Card>
              {option ? (
                <ReactECharts option={option} />
              ) : (
                <div
                  style={{
                    color: '',
                    textAlign: 'center',

                    fontSize: '16px',
                  }}
                >
                  请在左侧进行提交分析数据！
                </div>
              )}
              <Spin spinning={submitting} size="large" />
            </Card>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  padding: '5px 10px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Divider style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                  分析结论
                </Divider>
              </div>
            </div>
            <Card>
              {chart?.genResult ?? (
                <div
                  style={{
                    textAlign: 'center',

                    fontSize: '16px',
                  }}
                >
                  无可视化图表，无法得出结论！
                </div>
              )}
              <Spin spinning={submitting} size="large" />
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
