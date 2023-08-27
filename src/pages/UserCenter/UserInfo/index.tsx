import Footer from '@/components/Footer';
import { selectAvatarUrl, selectGender } from '@/constants';
import { getAiFrequencyUsingGET } from '@/services/AiPlots/aiFrequencyController';
import { addOrderUsingPOST } from '@/services/AiPlots/aiFrequencyOrderController';
import { signCreditUsingGET } from '@/services/AiPlots/creditController';
import {
  getCreditByUserIdUsingGET,
  getLoginUserUsingGET,
  getUserVOByIdUsingGET,
  updateMyInfoUsingPOST,
} from '@/services/AiPlots/UserController';
import { useModel } from '@@/exports';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { ProFormSelect } from '@ant-design/pro-form';
import { Button, Card, Descriptions, Divider, InputNumber, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const UserInfo: React.FC = () => {
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [myUser, setMyUser] = useState({
    userName: '',
    userAccount: '',
    userAvatar: '',
    userPassword: '',
    userRole: 'user',
    gender: '',
    phone: '',
    email: '',
    userStatus: '0',
    userCode: '',
    createTime: '',
    updateTime: '',
  });
  const renderSuccessModal = () => (
    <Modal
      title="修改成功"
      visible={successModalVisible}
      onOk={() => {
        setSuccessModalVisible(false);
        window.location.reload(); // 刷新页面
      }}
      onCancel={() => setSuccessModalVisible(false)}
      centered
      okText="确定"
    >
      您的信息已成功修改！
    </Modal>
  );
  const [creditInfo, setCreditInfo] = useState<number>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getLoginUserUsingGET(); // 使用 getLoginUserUsingGET 发送请求
        // @ts-ignore
        setMyUser(res.data);
      } catch (error) {
        // 处理请求错误
        message.error('请求参数错误！');
      }
    }

    fetchData();
  }, []);

  const [frequency, setFrequency] = useState<API.AiFrequencyVO>();
  const [number, setNumber] = useState<number>();
  const [data, setData] = useState<API.UserVO>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const res = await getAiFrequencyUsingGET();
      // console.log('用户次数', res.data);
      if (res.data) {
        setFrequency(res.data);
      }
    } catch (e: any) {
      message.error('获取数据失败' + e.error);
    }
  };

  // 用户充值次数
  const onChange = async (value: number) => {
    console.log('changed', value);
    setNumber(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const res = await addOrderUsingPOST({ total: number || 1 });
    if (res.data) {
      message.success('生成订单成功，请在 个人订单 中查看订单信息');
    } else {
      message.error('生成订单失败');
    }
    loadData();
    setIsModalOpen(false);
  };
  // 取消支付
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 获取用户信息
  const getUserInfo = async (id: any) => {
    return getUserVOByIdUsingGET({ id }).then((res: any) => {
      console.log('编号', res.data);
      if (res.data) {
        setInitialState((s: any) => ({ ...s, loginUser: res.data }));
        setData(res.data);
      }
    });
  };
  /**
   * 获取积分
   */
  const creditTotal = async () => {
    try {
      const res = await getCreditByUserIdUsingGET();
      if (res.data) {
        setCreditInfo(res.data ?? 0);
      } else {
        message.error('获取我的积分失败');
      }
    } catch (e: any) {
      message.error('获取我的积分失败，' + e.message);
    }
  };

  useEffect(() => {
    creditTotal();
  }, []);

  /**
   * 签到
   */
  const signDaily = async () => {
    setSubmitting(true);
    try {
      const res = await signCreditUsingGET();
      if (!res?.data) {
        message.error('签到失败，今天已签到');
      } else {
        message.success('签到成功');
      }
    } catch (e: any) {
      message.error('签到失败，' + e.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    try {
      loadData();
      getUserInfo(initialState?.currentUser?.id).then(() => {});
      // console.log('用户信息', initialState?.currentUser);
    } catch (e: any) {
      console.log(e);
    }
  }, []);

  return (
    <div style={{ margin: 'auto' }}>
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
            智能图表|问题次数
          </Divider>
        </div>
      </div>
      <Descriptions bordered size={'default'} contentStyle={{ color: 'black' }}>
        <Card style={{ textAlign: 'center' }} type="inner">
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div style={{ fontSize: 16, color: 'black' }}>
              {'已使用：' + frequency?.totalFrequency + ' 次'}
            </div>
            <div style={{ fontSize: 16, color: 'black' }}>
              {'剩余：' + frequency?.remainFrequency + ' 次'}
            </div>
            <div>
              <Button type="primary" onClick={showModal}>
                充值
              </Button>
              <Modal
                title="请输入充值次数"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <InputNumber min={1} max={1000} defaultValue={1} onChange={onChange} />
              </Modal>
            </div>
          </div>
        </Card>
      </Descriptions>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <div>
          <Divider style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
            文本分析积分获取
          </Divider>
        </div>
      </div>
      <Descriptions bordered size={'default'} contentStyle={{ color: 'black' }}>
        <Card style={{ textAlign: 'center' }} type="inner">
          <div style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 16 }}>
            <span>当前积分为：{creditInfo ? creditInfo : 0}</span>
            <span>
              <Button
                type={'primary'}
                onClick={signDaily}
                style={{ marginLeft: '150px' }}
                disabled={submitting}
              >
                每日签到
              </Button>
            </span>
          </div>
        </Card>
      </Descriptions>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <div>
          <Divider style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>用户信息</Divider>
        </div>
      </div>
      <Descriptions
        bordered
        column={1}
        size={'default'}
        style={{ width: 1200 }}
        contentStyle={{ color: 'black', maxWidth: '200px' }}
      >
        <Descriptions.Item style={{ textAlign: 'center' }} label="用户名：">
          {myUser.userName}
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="用户头像：">
          <img
            src={data?.userAvatar}
            alt="userAvatar"
            style={{ width: 40, borderRadius: '50%', height: 40 }}
          />
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="性别：">
          {myUser.gender}
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="用户权限：">
          {myUser.userRole === 'user' ? '普通用户' : '管理员'}
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="手机号码：">
          {myUser.phone === null ? '尚未填写手机号码！' : myUser.phone}
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="我的邮箱：">
          {myUser.email === null ? '尚未填写邮箱！' : myUser.email}
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="我的状态：">
          {myUser.userStatus === 0 ? '正常' : '账号异常'}
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="用户创建时间：">
          {new Date(myUser.createTime).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'center' }} label="用户更新时间：">
          {new Date(myUser.updateTime).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <ModalForm<API.UserUpdateMyRequest>
        title="修改我的信息"
        trigger={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              type="primary"
              shape="round"
              size="large"
              color="#007BFF"
              block
              style={{ margin: '50px', width: '250px' }}
            >
              修改个人信息
            </Button>
          </div>
        }
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          await waitTime(1000);
          try {
            const isModify = await updateMyInfoUsingPOST(values);
            if (isModify) {
              setSuccessModalVisible(true); // 打开修改成功弹窗
            } else {
              message.error('修改失败！');
            }
          } catch (error) {
            message.error('修改失败！');
          }
          return false;
        }}
      >
        {renderSuccessModal()}
        <ProForm.Group>
          <ProFormText
            width="md"
            name="userName"
            label="用户名"
            placeholder="请输入用户名"
            initialValue={myUser.userName}
          />
          <ProFormText width="md" name="userPassword" label="密码" placeholder="修改密码" />
          <ProFormText
            width="md"
            name="phone"
            label="手机号码"
            placeholder="修改手机号码"
            initialValue={myUser.phone}
          />
          <ProFormSelect
            width="md"
            name="gender"
            label="性别"
            placeholder="修改性别"
            options={selectGender}
            initialValue={myUser.gender}
          />
          <ProFormText
            width="md"
            name="email"
            label="邮箱"
            placeholder="修改邮箱"
            initialValue={myUser.email}
          />
          <ProFormSelect
            name="userAvatar"
            fieldProps={{
              size: 'small',
            }}
            label="修改头像"
            options={selectAvatarUrl}
            placeholder={'请选择用户头像 '}
            initialValue={myUser.userAvatar}
          />
        </ProForm.Group>
      </ModalForm>
      <Footer />
    </div>
  );
};

export default UserInfo;
