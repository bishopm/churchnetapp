
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { name: 'addsociety', path: '/societies/add', component: () => import('components/AddSociety'), meta: {auth: true} },
      { name: 'group', path: '/groups/:id', component: () => import('components/Group'), meta: {auth: true} },
      { name: 'groups', path: '/groups', component: () => import('components/Groups'), meta: {auth: true} },
      { name: 'home', path: '/', component: () => import('components/Home'), meta: {auth: true} },
      { name: 'editgroup', path: '/group/:id/edit', component: () => import('components/forms/Group'), meta: {auth: true} },
      { name: 'householdform', path: '/household/:action/:id?', component: () => import('components/forms/Household'), meta: {auth: true} },
      { name: 'household', path: '/households/:id', component: () => import('components/Household'), meta: {auth: true} },
      { name: 'households', path: '/households', component: () => import('components/Households'), meta: {auth: true} },
      { name: 'individualform', path: '/individual/:action/:id?', component: () => import('components/forms/Individual'), meta: {auth: true} },
      { name: 'login', path: '/login', component: () => import('components/Login'), meta: {auth: false} },
      { name: 'person', path: '/people/:id', component: () => import('components/Person'), meta: {auth: true} },
      { name: 'people', path: '/people', component: () => import('components/People'), meta: {auth: true} },
      { name: 'phoneverification', path: '/phoneverification', component: () => import('components/Phoneverification'), meta: {auth: false} },
      { name: 'plan', path: '/plan', component: () => import('components/Plan'), meta: {auth: true} },
      { name: 'publish', path: '/publish', component: () => import('components/Publish'), meta: {auth: true} },
      { name: 'society', path: '/societies/:id', component: () => import('components/Society'), meta: {auth: true} },
      { name: 'societies', path: '/societies', component: () => import('components/Societies'), meta: {auth: true} },
      { name: 'settings', path: '/settings', component: () => import('components/Settings'), meta: {auth: true} },
      { name: 'user', path: '/users/:id', component: () => import('components/User'), meta: {auth: true} },
      { name: 'users', path: '/users', component: () => import('components/Users'), meta: {auth: true} }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/Error404')
  }
]
