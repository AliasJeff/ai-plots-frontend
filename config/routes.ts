export default [
  { path: '/welcome', name: '首页', icon: 'HomeTwoTone', component: './Welcome' },
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', name: '登录', component: './UserCenter/Login' },
      { path: '/user/register', name: '注册', component: './UserCenter/Register' },
      { component: './404' },
    ],
  },

  {
    path: '/chart',
    name: '智能图表',
    icon: 'PieChartTwoTone',
    routes: [
      {
        path: '/chart/add_chart',
        icon: 'PieChartTwoTone',
        name: '智能分析图表（同步）',
        component: './Chart/AddChart',
      },
      {
        path: '/chart/add_chart_async',
        icon: 'PieChartTwoTone',
        name: '智能分析图表（异步）',
        component: './Chart/AsyncAddChart',
      },
      { component: './404' },
    ],
  },

  {
    path: '/text',
    name: '智能文本',
    icon: 'FileMarkdownTwoTone',
    routes: [
      { path: '/text/add_text', name: '智能分析文本(异步）', component: './Text/AddTextMQ' },
      { component: './404' },
    ],
  },
  {
    path: '/ai_question',
    name: '智能分析',
    icon: 'AlertTwoTone',
    routes: [
      {
        path: '/ai_question/assistant',
        name: '智能分析问题',
        icon: 'smile',
        component: './AiChatAssistant/AddChat',
      },
      {
        path: '/ai_question/history',
        name: '智能分析结果',
        icon: 'smile',
        component: './AiChatAssistant/AiChatManage',
      },
    ],
  },
  { path: '/chatgpt', name: 'AI聊天', icon: 'MessageTwoTone', component: './ChatGPT' },
  { path: '/gen_chart', name: '图表中心', icon: 'SlidersTwoTone', component: './ChartManage' },
  { path: '/gen_text', name: '文本中心', icon: 'ProfileTwoTone', component: './TextManage' },
  {
    path: '/viewChartData/:id',
    icon: 'checkCircle',
    component: './ViewChartData',
    name: '查看图表',
    hideInMenu: true,
  },
  {
    path: '/viewTextData/:id',
    icon: 'checkCircle',
    component: './ViewTextData',
    name: '查看文本',
    hideInMenu: true,
  },

  {
    path: '/person',
    icon: 'SmileTwoTone',
    name: '个人中心',
    routes: [
      { path: '/person/user_info', name: '个人信息', component: './UserCenter/UserInfo/' },
      { path: '/person/order', name: '个人订单', component: './UserCenter/UserOrder' },
      { path: '/person/pay_order', name: '订单付款', component: './UserCenter/UserPayOrder' },
      { path: '/person/payInfo', name: '支付信息查询', component: './UserCenter/UserPayInfo' },
    ],
  },
  {
    path: '/admin',
    icon: 'SettingTwoTone',
    name: '系统管理',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/user_manage', name: '用户管理', component: './Admin/UserManage' },
      { path: '/admin/adduser', name: '添加用户', component: './Admin/AddUser' },
      { path: '/admin/chart_manage', name: '图表管理', component: './Admin/ChartManage' },
      { path: '/admin/chat_manage', name: '对话管理', component: './Admin/AiChatManage' },
      { path: '/admin/user_order_manage', name: '订单管理', component: './Admin/UserOrderManage' },
      {
        path: '/admin/user_pay_order_manage',
        name: '管理员支付订单',
        component: './Admin/UserPayOrderManage',
      },
      {
        path: '/admin/user_pay_info_manage',
        name: '支付信息结果查询',
        component: './Admin/UserPayInfoManage',
      },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
