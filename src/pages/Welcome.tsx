import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, theme } from 'antd';
import React from 'react';

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

  return (
    <PageContainer key="index" title={false}>
      <Alert
        message={'开发不易，给孩子点个Star吧'}
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 28,
          marginTop: 38,
          minWidth: '220px',
        }}
      />
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
            }}
          >
            欢迎使用 AI Plots 平台
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 6,
              width: '65%',
            }}
          >
            AI Plots 平台 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            {/*todo*/}
          </p>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            {/*todo*/}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              title="AI Plots平台"
              desc="我们的AI Plots平台是革命性的数据分析工具，为用户提供轻松、快速、智能化的数据分析体验。AI Plots平台让您轻松完成复杂数据分析任务，即使对数据分析一无所知。我们利用AI接口和自动化技术，为您提供快速、准确、可靠的数据洞察。立即体验AI Plots，让数据分析变得简单而智能！"
            />
            <InfoCard
              index={2}
              title="AI Plots介绍"
              desc="AI Plots是领先的人工智能解决方案，专注于图表分析、文本分析和问题分析。借助先进的机器学习技术，它能迅速准确地解读和处理各种复杂数据。在图表分析方面，AI Plots能自动识别并解释图表中的趋势、模式和关联，助您深入理解数据背后的洞察。通过文本分析，它能提取文本的关键信息、情感倾向和主题，为您提供全面的文本理解支持。不论是处理大量文本数据还是理解复杂文章，AI Plots都能帮助您快速获取所需信息，从而加速决策和研究过程。此外，AI Plots还具备强大的问题分析能力，能自动分析问题并提供准确的答案或解决方案。不论是企业决策难题还是个人研究知识盲点，AI Plots都能为您提供有价值的见解和建议。综合图表分析、文本分析和问题分析功能，AI Plots是全面的智能助手，助您在信息时代脱颖而出，做出更明智决策。"
            />
            <InfoCard
              index={3}
              title="AI Plots特点"
              desc="1.多领域分析能力：AI Plots具备跨多个领域的分析能力，包括图表、文本和问题分析。不论是商业数据、科研论文还是实际问题，它都能从多角度进行深入分析。2.智能图表解读：该解决方案能自动解读图表中的趋势、模式和关联，帮助用户更好地理解数据，并发现有价值的见解。3.全面文本理解：AI Plots能提取文本的关键信息、情感倾向和主题，为用户提供全面的文本理解支持，加速信息获取和处理。4.自动问题分析：它具备强大的问题分析能力，能自动分析问题并提供准确的答案或解决方案，帮助用户解决各种难题。"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
