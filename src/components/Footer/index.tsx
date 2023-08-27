import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // @ts-ignore
      copyright={currentYear}
      links={[
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> AliasJeff
            </>
          ),

          href: 'https://github.com/AliasJeff',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
