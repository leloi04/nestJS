export const ADMIN_ROLE = 'SUPER USER';
export const USER_ROLE = 'NORMAL USER';

export const INIT_PERMISSIONS = [
  {
    _id: '67fd36f43522c23185698c12',
    name: 'get companies with paginate',
    apiPath: '/api/v1/companies',
    method: 'GET',
    module: 'COMPANIES',
    deletedAt: null,
    isDeleted: false,
    createdBy: {
      _id: '67ef86ac42d95fcd0676029c',
      email: 'levanloi2004bn@gmail.com',
    },
    createdAt: '2025-04-14T16:25:24.091Z',
    updatedAt: '2025-04-14T16:25:24.091Z',
    __v: 0,
  },
  {
    _id: '67fd37123522c23185698c16',
    name: 'create a company',
    apiPath: '/api/v1/companies',
    method: 'POST',
    module: 'COMPANIES',
    deletedAt: null,
    isDeleted: false,
    createdBy: {
      _id: '67ef86ac42d95fcd0676029c',
      email: 'levanloi2004bn@gmail.com',
    },
    createdAt: '2025-04-14T16:25:54.240Z',
    updatedAt: '2025-04-14T16:25:54.240Z',
    __v: 0,
  },
];
