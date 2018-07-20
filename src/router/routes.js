
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { name: 'group', path: '/groups/:id', component: () => import('components/Group'), meta: {auth: true} },
      { name: 'groups', path: '/groups', component: () => import('components/Groups'), meta: {auth: true} },
      { name: 'home', path: '/', component: () => import('components/Home'), meta: {auth: true} },
      { name: 'household', path: '/households/:id', component: () => import('components/Household'), meta: {auth: true} },
      { name: 'households', path: '/households', component: () => import('components/Households'), meta: {auth: true} },
      { name: 'society', path: '/societies/:id', component: () => import('components/Society'), meta: {auth: true} },
      { name: 'societies', path: '/societies', component: () => import('components/Societies'), meta: {auth: true} },
      { name: 'settings', path: '/settings', component: () => import('components/Settings'), meta: {auth: true} }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
