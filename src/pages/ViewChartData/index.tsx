import { getChartByIdUsingGET } from '@/services/AiPlots/ChartController';
import { useParams } from '@umijs/max';
import { Card, Col, Divider, message, Row, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const ViewChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [submitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>();
  const params = useParams();

  const viewChart = async () => {
    try {
      const res = await getChartByIdUsingGET({
        // @ts-ignore
        id: params.id,
      });

      if (!res?.data?.genChart) {
        message.error('图表生成失败');
      }

      if (res.data) {
        const chartOptions = JSON.parse(res.data.genChart ?? '');

        if (!chartOptions) {
          message.error('生成图表为空');
          throw new Error('生成图表为空');
        } else {
          setOption(chartOptions);
          setChart(res.data);
          message.success('获取图表成功');
        }
      }
    } catch (e: any) {
      message.error('获取图表失败', e.error);
    }
  };

  useEffect(() => {
    viewChart();
  }, []);

  return (
    <div className="view-chart-data">
      <Row gutter={24}>
        <Col span={24}>
          <Card className="lightblue-card">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <div>
                  <Divider style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    原始数据
                  </Divider>
                </div>
              </div>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
              <p style={{ textAlign: 'center' }}>{chart?.chartData}</p>
            </div>
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card className="blurred-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <div>
                  <Divider style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    图表信息
                  </Divider>
                </div>
              </div>
              <div>
                <p>分析目标：{chart?.goal}</p>
                <p>图表类型：{chart?.chartType}</p>
                <p>图表名称：{chart?.chartName}</p>
                <p>
                  生成时间：
                  {chart?.createTime ? new Date(chart?.createTime).toLocaleString('zh-CN') : '--'}
                </p>
              </div>
            </div>
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card className="blurred-card">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <div>
                  <Divider style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    可视化图表
                  </Divider>
                </div>
              </div>
            </div>
            {option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card className="blurred-card">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <div>
                  <Divider style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    分析结论
                  </Divider>
                </div>
              </div>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', overflow: 'auto', textAlign: 'center' }}>
              <p>{chart?.genResult ?? <div>请先在左侧进行提交</div>}</p>
            </div>
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewChart;
