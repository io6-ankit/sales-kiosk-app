// // src/api/mockData.js

// export const initialMockGallery = [
//   {
//     id: 'g1',
//     title: 'Luxury Tower Exterior View',
//     imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
//     thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: 'g2',
//     title: 'Modern Living Room Interior',
//     imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
//     thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: 'g3',
//     title: 'Infinity Swimming Pool & Deck',
//     imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
//     thumbnailUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80',
//   },
// ];

// export const initialMockVideos = [
//   {
//     id: 'v1',
//     title: '3D Project Virtual Walkthrough',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//     thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
//   },
//   {
//     id: 'v2',
//     title: 'Penthouse & Club House Tour',
//     videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     thumbnailUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
//   },
// ];

// export const initialMockTowers = [
//   {
//     id: 'tower-a',
//     name: 'Tower A (Royal Heights)',
//     units: [
//       { id: 'u101', unitNumber: '101', towerId: 'tower-a', status: 'AVAILABLE', price: 450000, bedrooms: 2 },
//       { id: 'u102', unitNumber: '102', towerId: 'tower-a', status: 'AVAILABLE', price: 480000, bedrooms: 2 },
//       { id: 'u103', unitNumber: '103', towerId: 'tower-a', status: 'BOOKED', price: 520000, bedrooms: 3 },
//       { id: 'u104', unitNumber: '104', towerId: 'tower-a', status: 'AVAILABLE', price: 550000, bedrooms: 3 },
//     ],
//   },
//   {
//     id: 'tower-b',
//     name: 'Tower B (Oceanic Crest)',
//     units: [
//       { id: 'u201', unitNumber: '201', towerId: 'tower-b', status: 'AVAILABLE', price: 620000, bedrooms: 3 },
//       { id: 'u202', unitNumber: '202', towerId: 'tower-b', status: 'BOOKED', price: 640000, bedrooms: 3 },
//       { id: 'u203', unitNumber: '203', towerId: 'tower-b', status: 'AVAILABLE', price: 890000, bedrooms: 4 },
//     ],
//   },
// ];

// src/api/mockData.js

export const initialMockGallery = [
  {
    id: '1',
    title: 'Luxury Tower Exterior View',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'Renovated high-rise modern architectural exterior design.',
  },
  {
    id: '2',
    title: 'Modern Living Room Interior',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Spacious living room with floor-to-ceiling modern glass finish.',
  },
  {
    id: '3',
    title: 'Grand Clubhouse Lounge',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Exclusive resident lounge with premium seating and café bar.',
  },
];

export const initialMockVideos = [
  {
    id: 'v1',
    title: '360° Full Property Walkthrough 4K',
    type: 'VIDEO',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'An updated complete virtual walk-through of the entire township.',
  },
  {
    id: 'v2',
    title: 'Penthouse Virtual Tour',
    type: 'VIDEO',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Exclusive 4K walkthrough of the luxury penthouse suite.',
  },
];

export const initialMockTowers = [
  {
    id: 'tower-a',
    name: 'Tower A',
    units: [
      { id: 'u101', unitNumber: '101', booked: false, bookedBy: null, price: 155000.0 },
      { id: 'u102', unitNumber: '102', booked: false, bookedBy: null, price: 175000.0 },
      { id: 'u103', unitNumber: '103', booked: true, bookedBy: 'Rahul Sharma', price: 185000.0 },
      { id: 'u104', unitNumber: '104', booked: false, bookedBy: null, price: 195000.0 },
    ],
  },
  {
    id: 'tower-b',
    name: 'Tower B',
    units: [
      { id: 'u201', unitNumber: '201', booked: false, bookedBy: null, price: 210000.0 },
      { id: 'u202', unitNumber: '202', booked: true, bookedBy: 'Ankit Maurya', price: 225000.0 },
      { id: 'u203', unitNumber: '203', booked: false, bookedBy: null, price: 250000.0 },
    ],
  },
];