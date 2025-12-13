export const plans = [
  {
    id: 'just-mates',
    name: 'Just mates',
    price: 'Free',
    priceUnit: '',
    features: [
      { icon: 'gps', text: 'Bring your own GPS' },
      { icon: 'mileage', text: 'Mileage reporting to be done by you' },
      { icon: 'key', text: 'In-person key handover to guests' },
    ],
  },
  {
    id: 'good-mates',
    name: 'Good mates',
    price: '$10',
    priceUnit: '/month',
    features: [
      { icon: 'gps', text: 'Primary GPS included' },
      { icon: 'mileage', text: 'Automated mileage calculations' },
      { icon: 'key', text: 'In-person key handover to guests' },
    ],
  },
  {
    id: 'best-mates',
    name: 'Best mates',
    price: '$30',
    priceUnit: '/month',
    features: [
      { icon: 'gps', text: 'Keyless access technology' },
      { icon: 'mileage', text: 'Automated mileage calculations' },
      { icon: 'key', text: 'Remote handover to guests' },
    ],
  },
];

export const allAddons = [
  {
    id: 'byo-gps',
    name: 'BYO secondary GPS - $5/month',
    available: true,
    requiresCard: true,
  },
  {
    id: 'byo-lockbox',
    name: 'BYO lockbox - $10/month',
    available: true,
    requiresCard: true,
  },
  {
    id: 'insurance',
    name: 'Between trip insurance',
    available: true,
    comingSoon: true,
    requiresCard: false,
  },
];

export const addonsByPlan = {
  'just-mates': ['byo-gps'],
  'good-mates': ['byo-gps', 'byo-lockbox'],
  'best-mates': ['byo-gps', 'insurance'],
};

export const plansWithCardDetails = ['good-mates', 'best-mates'];

export const addonsRequiringCard = ['byo-gps', 'byo-lockbox'];
