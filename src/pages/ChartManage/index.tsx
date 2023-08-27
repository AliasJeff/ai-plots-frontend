import {
  deleteChartUsingPOST,
  listMyChartByPageUsingPOST,
} from '@/services/AiPlots/ChartController';
import { Link, useModel } from '@@/exports';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Divider, List, message, Modal } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });

  const [chartList, setChartList] = useState<API.Chart[]>();
  const [chartTotal, setChartTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const loadData = async () => {
    setLoading(loading);
    try {
      let res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setChartTotal(res.data.total ?? 0);
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.chartStatus === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const handleDelete = (chartId: any) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个图表吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteChartUsingPOST({ id: chartId });
          console.log('res:', res.data);
          if (res.data) {
            message.success('删除成功');
            loadData();
          } else {
            message.error('删除失败');
          }
        } catch (e: any) {
          message.error('删除失败' + e.message);
        }
      },
    });
  };

  return (
    <div className="my-chart-page">
      <div className="margin-20" style={{ marginBottom: 20 }}>
        <Search
          placeholder="请输入搜索内容"
          loading={loading}
          enterButton
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              chartName: value,
            });
          }}
        />
      </div>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          showTotal: () => `共 ${chartTotal} 条记录`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30'],
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: chartTotal,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <div style={{ overflow: 'auto', maxHeight: '600px' }}>
              <Card style={{ width: '100%', maxWidth: '800px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <List.Item.Meta
                    avatar={<Avatar src={currentUser?.userAvatar} />}
                    title={currentUser?.userName}
                    description={item.chartType ? '图表类型：' + item.chartType : undefined}
                  />

                  <div>
                    <Link to={`/ViewChartData/${item.id}`}>
                      <Button style={{ backgroundColor: '#007BFF', color: 'white' }}>
                        查看图表数据
                      </Button>
                    </Link>
                    <span style={{ margin: '0 10px' }}></span>
                    <Button danger onClick={() => handleDelete(item.id)}>
                      删除
                    </Button>
                  </div>
                </div>
                {item.chartStatus === 'succeed' && (
                  <>
                    <div
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <div
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginBottom: 20,
                        }}
                      >
                        <Divider
                          style={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            margin: 0,
                          }}
                        >
                          {'分析目标：' + item.goal}
                        </Divider>
                      </div>
                    </div>

                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                    <p
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      {'图表名称：' + item.chartName}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {'图表生成时间：' + new Date(item.createTime).toLocaleString()}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyChartPage;
