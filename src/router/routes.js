
const routes = [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { name: 'circuithouseholds', path: '/circuithouseholds', component: () => import('components/Circuithouseholds'), meta: {auth: true} },
      { name: 'circuit', path: '/circuits/:id', component: () => import('components/Circuit'), meta: {auth: true} },
      { name: 'circuits', path: '/circuits', component: () => import('components/Circuits'), meta: {auth: true} },
      { name: 'communicate', path: '/communicate', component: () => import('components/Communicate'), meta: {auth: true} },
      { name: 'feeds', path: '/feeds', component: () => import('components/Feeds'), meta: {auth: true} },
      { name: 'feedform', path: '/feed/:action/:id?', component: () => import('components/forms/Feed'), meta: {auth: true} },
      { name: 'group', path: '/groups/:id', component: () => import('components/Group'), meta: {auth: true} },
      { name: 'groups', path: '/groups', component: () => import('components/Groups'), meta: {auth: true} },
      { name: 'home', path: '/', component: () => import('components/Home'), meta: {auth: true} },
      { name: 'editgroup', path: '/group/:id/edit', component: () => import('components/forms/Group'), meta: {auth: true} },
      { name: 'householdform', path: '/household/:action/:scope/:id?', component: () => import('components/forms/Household'), meta: {auth: true} },
      { name: 'household', path: '/households/:id', component: () => import('components/Household'), meta: {auth: true} },
      { name: 'households', path: '/households', component: () => import('components/Households'), meta: {auth: true} },
      { name: 'individualform', path: '/individual/:action/:id?', component: () => import('components/forms/Individual'), meta: {auth: true} },
      { name: 'login', path: '/login', component: () => import('components/Login'), meta: {auth: false} },
      { name: 'meetings', path: '/meetings', component: () => import('components/Meetings'), meta: {auth: true} },
      { name: 'preacher', path: '/preachers/:id', component: () => import('components/Preacher'), meta: {auth: true} },
      { name: 'preacherform', path: '/preachers/:action/:preacher?', component: () => import('components/forms/Preacher'), meta: {auth: true} },
      { name: 'preachers', path: '/preachers', component: () => import('components/Preachers'), meta: {auth: true} },
      { name: 'phoneverification', path: '/phoneverification', component: () => import('components/Phoneverification'), meta: {auth: false} },
      { name: 'plan', path: '/plan', component: () => import('components/Plan'), meta: {auth: true} },
      { name: 'rosterform', path: '/roster/:action/:id?', component: () => import('components/forms/Roster'), meta: {auth: true} },
      { name: 'rosters', path: '/rosters', component: () => import('components/Rosters'), meta: {auth: true} },
      { name: 'roster', path: '/rosters/:id/:year/:month', component: () => import('components/Roster'), meta: {auth: true} },
      { name: 'serviceform', path: '/services/:action/:society?/:service?', component: () => import('components/forms/Service'), meta: {auth: true} },
      { name: 'society', path: '/societies/:id', component: () => import('components/Society'), meta: {auth: true} },
      { name: 'societyform', path: '/societies/:action', component: () => import('components/forms/Society'), meta: {auth: true} },
      { name: 'societies', path: '/societies', component: () => import('components/Societies'), meta: {auth: true} },
      { name: 'statistics', path: '/statistics', component: () => import('components/Statistics'), meta: {auth: true} },
      { name: 'statistic', path: '/statistics/:society/:yr', component: () => import('components/Statistic'), meta: {auth: true} },
      { name: 'settings', path: '/settings', component: () => import('components/Settings'), meta: {auth: true} },
      { name: 'user', path: '/users/:id', component: () => import('components/User'), meta: {auth: true} },
      { name: 'userform', path: '/user/:action/:id?', component: () => import('components/forms/User'), meta: {auth: true} },
      { name: 'users', path: '/users', component: () => import('components/Users'), meta: {auth: true} }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
