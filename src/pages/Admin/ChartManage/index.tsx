import { deleteChartUsingPOST, listChartByPageUsingPOST } from '@/services/AiPlots/ChartController';
import { Link, useModel } from '@@/exports';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, List, message, Modal, Result } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const AminChartPage: React.FC = () => {
  /**
   * 初始值
   */
  const initSearchParams = {
    current: 1,
    pageSize: 6,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });

  /**
   * 分页获取图表
   */
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [chartTotal, setChartTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  /**
   * 获取当前用户
   */
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  /**
   * 加载图表数据
   */
  const loadData = async () => {
    setLoading(loading);
    try {
      let res = await listChartByPageUsingPOST(searchParams);
      console.log('获取关于图表的信息', res.data);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setChartTotal(res.data.total ?? 0);
        // 隐藏title
        if (res.data.records) {
          res.data.records.forEach((data) => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            // 取出title并且设置为 undefined
            chartOption.title = undefined;
            console.log('id', data.userId);
            data.genChart = JSON.stringify(chartOption);
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

  /**
   * 变化时执行此处
   */
  useEffect(() => {
    loadData();
  }, [searchParams]);

  /**
   * 删除图表
   * @param chartId
   */
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
          if (res.data) {
            message.success('删除成功');
            // 删除成功后重新加载图表数据
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
    <div className="admin-chart-page">
      <div className="margin-20">
        <Search
          placeholder="请输入图标名称搜索"
          loading={loading}
          enterButton
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              chartName: value,
            });
          }}
          style={{ marginBottom: 20 }}
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
          // 设置分页
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
          position: 'bottom',
          align: 'center',
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={currentUser?.userAvatar} />}
                  title={currentUser?.userName}
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
              {item.chartStatus === 'wait' && (
                <>
                  <Result
                    status="warning"
                    title="排队中...."
                    subTitle={item.execMessage ?? '系统繁忙，请稍后重试'}
                  />
                </>
              )}
              {item.chartStatus === 'running' && (
                <>
                  <Result status="info" title="图表生成中...." subTitle={item.execMessage} />
                  <Link to={`/ViewChartData/${item.id}`}>
                    <Button>查看图表数据</Button>
                  </Link>
                </>
              )}
              {item.chartStatus === 'succeed' && (
                <>
                  <p
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#007BFF',
                      fontSize: '16px',
                    }}
                  >
                    {'图表名称：' + item.chartName}
                  </p>
                  <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                  <List.Item.Meta
                    style={{ textAlign: 'left', fontWeight: 'bold' }}
                    description={item.goal ? '分析目标：' + item.goal : undefined}
                  />
                  <List.Item.Meta
                    style={{ textAlign: 'left', fontWeight: 'bold' }}
                    description={item.chartType ? '图表类型：' + item.chartType : undefined}
                  />
                  <List.Item.Meta
                    style={{ textAlign: 'left', fontWeight: 'bold' }}
                    description={item.genResult ? '分析结果：' + item.genResult : undefined}
                  />
                </>
              )}
              {item.chartStatus === 'failed' && (
                <>
                  <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
                </>
              )}
              <List.Item.Meta
                style={{ textAlign: 'left', fontWeight: 'bold' }}
                description={item.createTime ? '生成时间：' + item.createTime : undefined}
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default AminChartPage;
