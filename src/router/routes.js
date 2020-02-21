
const routes = [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { name: 'bulletin', path: '/bulletin', component: () => import('components/Bulletin'), meta: { auth: true } },
      { name: 'circuit', path: '/circuits/:id', component: () => import('components/Circuit'), meta: { auth: true } },
      { name: 'circuits', path: '/circuits', component: () => import('components/Circuits'), meta: { auth: true } },
      { name: 'circuitsettings', path: '/circuitsettings', component: () => import('components/CircuitSettings'), meta: { auth: true } },
      { name: 'communicate', path: '/communicate', component: () => import('components/Communicate'), meta: { auth: true } },
      { name: 'denominationsettings', path: '/denominationsettings', component: () => import('components/DenominationSettings'), meta: { auth: true } },
      { name: 'diaryform', path: '/meeting/:scope/:action/:entity?/:id?', component: () => import('components/forms/Diary'), meta: { auth: true } },
      { name: 'diary', path: '/diary/:scope', component: () => import('components/Diary'), meta: { auth: true } },
      { name: 'feeds', path: '/feeds', component: () => import('components/Feeds'), meta: { auth: true } },
      { name: 'feedform', path: '/feed/:action/:id?', component: () => import('components/forms/Feed'), meta: { auth: true } },
      { name: 'group', path: '/groups/:id', component: () => import('components/Group'), meta: { auth: true } },
      { name: 'groups', path: '/groups', component: () => import('components/Groups'), meta: { auth: true } },
      { name: 'groupform', path: '/group/:action/:id?', component: () => import('components/forms/Group'), meta: { auth: true } },
      { name: 'guests', path: '/guests', component: () => import('components/Guests'), meta: { auth: true } },
      { name: 'guestform', path: '/guests/:action/:guest?', component: () => import('components/forms/Guest'), meta: { auth: true } },
      { name: 'home', path: '/', component: () => import('components/Home'), meta: { auth: true } },
      { name: 'editgroup', path: '/group/:id/edit', component: () => import('components/forms/Group'), meta: { auth: true } },
      { name: 'giving', path: '/giving', component: () => import('components/Giving'), meta: { auth: true } },
      { name: 'givingform', path: '/giving/:action/:society/:id?', component: () => import('components/forms/Payment'), meta: { auth: true } },
      { name: 'givingstats', path: '/giving/:society', component: () => import('components/GivingStats'), meta: { auth: true } },
      { name: 'householdform', path: '/household/:action/:scope/:id?', component: () => import('components/forms/Household'), meta: { auth: true } },
      { name: 'household', path: '/households/:id', component: () => import('components/Household'), meta: { auth: true } },
      { name: 'households', path: '/households', component: () => import('components/Households'), meta: { auth: true } },
      { name: 'individualform', path: '/individual/:action/:id?', component: () => import('components/forms/Individual'), meta: { auth: true } },
      { name: 'leaders', path: '/leaders/:id', component: () => import('components/Leaders'), meta: { auth: true } },
      { name: 'login', path: '/login', component: () => import('components/Login'), meta: { auth: false } },
      { name: 'midweekform', path: '/midweek/:circuit/:action/:id?', component: () => import('components/forms/Midweek'), meta: { auth: true } },
      { name: 'midweek', path: '/midweek', component: () => import('components/Midweek'), meta: { auth: true } },
      { name: 'preacherform', path: '/preachers/:action/:preacher?', component: () => import('components/forms/Preacher'), meta: { auth: true } },
      { name: 'preachers', path: '/preachers', component: () => import('components/Preachers'), meta: { auth: true } },
      { name: 'phoneverification', path: '/phoneverification', component: () => import('components/Phoneverification'), meta: { auth: false } },
      { name: 'plan', path: '/plan', component: () => import('components/Plan'), meta: { auth: true } },
      { name: 'rosterform', path: '/roster/:action/:id?', component: () => import('components/forms/Roster'), meta: { auth: true } },
      { name: 'rosters', path: '/rosters', component: () => import('components/Rosters'), meta: { auth: true } },
      { name: 'roster', path: '/rosters/:id/:year/:month', component: () => import('components/Roster'), meta: { auth: true } },
      { name: 'rostermessages', path: '/rostermessages/:id/:year/:month', component: () => import('components/Rostermessages'), meta: { auth: true } },
      { name: 'serviceform', path: '/services/:action/:society?/:service?', component: () => import('components/forms/Service'), meta: { auth: true } },
      { name: 'society', path: '/societies/:id', component: () => import('components/Society'), meta: { auth: true } },
      { name: 'societyform', path: '/societies/:action', component: () => import('components/forms/Society'), meta: { auth: true } },
      { name: 'societies', path: '/societies', component: () => import('components/Societies'), meta: { auth: true } },
      { name: 'societysettings', path: '/societysettings', component: () => import('components/SocietySettings'), meta: { auth: true } },
      { name: 'statistics', path: '/statistics', component: () => import('components/Statistics'), meta: { auth: true } },
      { name: 'statistic', path: '/statistics/:society/:yr?', component: () => import('components/Statistic'), meta: { auth: true } },
      { name: 'settings', path: '/settings', component: () => import('components/Settings'), meta: { auth: true } },
      { name: 'user', path: '/users/:id', component: () => import('components/User'), meta: { auth: true } },
      { name: 'userform', path: '/user/:action/:id?', component: () => import('components/forms/User'), meta: { auth: true } },
      { name: 'users', path: '/users', component: () => import('components/Users'), meta: { auth: true } },
      { name: 'venueform', path: '/venues/:action/:id?', component: () => import('components/forms/Venue'), meta: { auth: true } },
      { name: 'venues', path: '/venues', component: () => import('components/Venues'), meta: { auth: true } }
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
