import { getCountUsingGET } from '@/services/AiPlots/AiAssistantController';
import { getChartCountUsingGET } from '@/services/AiPlots/ChartController';
import { getTextCountUsingGET } from '@/services/AiPlots/textController';
import { getUserCountUsingGET } from '@/services/AiPlots/UserController';
import {
  AlertOutlined,
  FileMarkdownOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Button, Card, Statistic, theme } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
}> = ({ title, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const [statistic, setStatistic] = useState({});

  const loadData = async () => {
    try {
      getUserCountUsingGET().then((res) =>
        setStatistic((prev) => ({ ...prev, userCount: res?.data })),
      );
      getChartCountUsingGET().then((res) =>
        setStatistic((prev) => ({ ...prev, chartCount: res?.data })),
      );
      getCountUsingGET().then((res) =>
        setStatistic((prev) => ({ ...prev, assistantCount: res?.data })),
      );
      getTextCountUsingGET().then((res) =>
        setStatistic((prev) => ({ ...prev, textCount: res?.data })),
      );
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer key="index" title={false}>
      <Card
        style={{
          borderRadius: 8,
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
              marginBottom: 50,
            }}
          >
            欢迎使用 AI Plots 平台
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              rowGap: 20,
              marginBottom: 20,
            }}
          >
            <Card bordered={false} style={{ width: '100%', margin: 10 }}>
              <Statistic
                title="全  站  用  户  数"
                value={statistic?.userCount}
                valueStyle={{ color: '#0000FF' }}
                prefix={<UserOutlined />}
                suffix="位"
              />
            </Card>
            <Card bordered={false} style={{ width: '100%', margin: 10 }}>
              <Statistic
                title="智 能 分 析 图 表 数"
                value={statistic?.chartCount}
                valueStyle={{ color: '#cf1322' }}
                prefix={<PieChartOutlined />}
                suffix="个"
              />
            </Card>
            <Card bordered={false} style={{ width: '100%', margin: 10 }}>
              <Statistic
                title="智  能  问  答  数"
                value={statistic?.assistantCount}
                valueStyle={{ color: '#3f8600' }}
                prefix={<AlertOutlined />}
              />
            </Card>
            <Card bordered={false} style={{ width: '100%', margin: 10 }}>
              <Statistic
                title="智  能  文  本  数"
                value={statistic?.textCount}
                valueStyle={{ color: '#f8cc5e' }}
                prefix={<FileMarkdownOutlined />}
              />
            </Card>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              title="平台介绍"
              desc={
                <>
                  <p>
                    AI
                    Plots是基于AIGC的智能数据分析平台，专注于图表分析、文本分析和问题分析，为用户提供轻松、快速、智能化的数据分析体验。
                  </p>
                  <p>
                    用户只需将原始数据集导入到平台，系统会根据用户的分析诉求，自动生成可视化图表，并给出相应的分析结论。无需手动控制，极大地提高了大数据工作人员的工作效率和准确性。
                  </p>
                </>
              }
            />
            <InfoCard
              index={2}
              title="技术选型"
              desc={
                <>
                  <div>
                    <p style={{ marginLeft: 10, fontWeight: 600 }}>前端</p>
                    <ul>
                      <li>- React 18</li>
                      <li>- Ant Design Pro 脚手架</li>
                      <li>- Umi 前端框架</li>
                      <li>- Echarts 可视化图表</li>
                    </ul>
                  </div>
                  <div>
                    <p style={{ marginLeft: 10, fontWeight: 600 }}>后端</p>
                    <ul>
                      <li>- Java Spring Boot</li>
                      <li>- MySQL 数据库</li>
                      <li>- Mybatis-Plus</li>
                      <li>- Redis + Redisson 限流</li>
                      <li>- RabbitMQ 消息队列</li>
                      <li>- JDK线程池及异步化</li>
                    </ul>
                  </div>
                </>
              }
            />
            <InfoCard
              index={3}
              title=""
              desc={
                <>
                  <Alert
                    message={'开发不易，给孩子点个Stars吧(˚ ˃̣̣̥᷄⌓˂̣̣̥᷅ )~ 🠗🠗🠗🠗🠗🠗🠗🠗🠗🠗🠗'}
                    type="success"
                    showIcon
                    banner
                    style={{
                      marginBottom: 28,
                      marginTop: 38,
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      rowGap: 20,
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() => {
                        window.open('https://github.com/AliasJeff?tab=repositories');
                      }}
                      type="link"
                    >
                      这次一定！(Github)
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        window.open('https://gitee.com/AliasJeff');
                      }}
                      type="link"
                    >
                      这次一定！(Gitee)
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
