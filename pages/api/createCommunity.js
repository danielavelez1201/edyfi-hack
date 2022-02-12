import db from '../../firebase/clientApp'
import { collection, addDoc } from 'firebase/firestore'

async function handler(req, res) {
  const industries = [
    'Accounting',
    'Airlines/Aviation',
    'Alternative Dispute Resolution',
    'Alternative Medicine',
    'Animation',
    'Apparel & Fashion',
    'Architecture & Planning',
    'Arts & Crafts',
    'Automotive',
    'Aviation & Aerospace',
    'Banking',
    'Biotechnology',
    'Broadcast Media',
    'Building Materials',
    'Business Supplies & Equipment',
    'Capital Markets',
    'Chemicals',
    'Civic & Social Organization',
    'Civil Engineering',
    'Commercial Real Estate',
    'Computer & Network Security',
    'Computer Games',
    'Computer Hardware',
    'Computer Networking',
    'Computer Software',
    'Construction',
    'Consumer Electronics',
    'Consumer Goods',
    'Consumer Services',
    'Cosmetics',
    'Dairy',
    'Defense & Space',
    'Design',
    'Education Management',
    'E-learning',
    'Electrical & Electronic Manufacturing',
    'Entertainment',
    'Environmental Services',
    'Events Services',
    'Executive Office',
    'Facilities Services',
    'Farming',
    'Financial Services',
    'Fine Art',
    'Fishery',
    'Food & Beverages',
    'Food Production',
    'Fundraising',
    'Furniture',
    'Gambling & Casinos',
    'Glass, Ceramics & Concrete',
    'Government Administration',
    'Government Relations',
    'Graphic Design',
    'Health, Wellness & Fitness',
    'Higher Education',
    'Hospital & Health Care',
    'Hospitality',
    'Human Resources',
    'Import & Export',
    'Individual & Family Services',
    'Industrial Automation',
    'Information Services',
    'Information Technology & Services',
    'Insurance',
    'International Affairs',
    'International Trade & Development',
    'Internet',
    'Investment Banking/Venture',
    'Investment Management',
    'Judiciary',
    'Law Enforcement',
    'Law Practice',
    'Legal Services',
    'Legislative Office',
    'Leisure & Travel',
    'Libraries',
    'Logistics & Supply Chain',
    'Luxury Goods & Jewelry',
    'Machinery',
    'Management Consulting',
    'Maritime',
    'Marketing & Advertising',
    'Market Research',
    'Mechanical or Industrial Engineering',
    'Media Production',
    'Medical Device',
    'Medical Practice',
    'Mental Health Care',
    'Military',
    'Mining & Metals',
    'Motion Pictures & Film',
    'Museums & Institutions',
    'Music',
    'Nanotechnology',
    'Newspapers',
    'Nonprofit Organization Management',
    'Oil & Energy',
    'Online Publishing',
    'Outsourcing/Offshoring',
    'Package/Freight Delivery',
    'Packaging & Containers',
    'Paper & Forest Products',
    'Performing Arts',
    'Pharmaceuticals',
    'Philanthropy',
    'Photography',
    'Plastics',
    'Political Organization',
    'Primary/Secondary',
    'Printing',
    'Professional Training',
    'Program Development',
    'Public Policy',
    'Public Relations',
    'Public Safety',
    'Publishing',
    'Railroad Manufacture',
    'Ranching',
    'Real Estate',
    'Recreational',
    'Facilities & Services',
    'Religious Institutions',
    'Renewables & Environment',
    'Research',
    'Restaurants',
    'Retail',
    'Security & Investigations',
    'Semiconductors',
    'Shipbuilding',
    'Sporting Goods',
    'Sports',
    'Staffing & Recruiting',
    'Supermarkets',
    'Telecommunications',
    'Textiles',
    'Think Tanks',
    'Tobacco',
    'Translation & Localization',
    'Transportation/Trucking/Railroad',
    'Utilities',
    'Venture Capital',
    'Veterinary',
    'Warehousing',
    'Wholesale',
    'Wine & Spirits',
    'Wireless',
    'Writing & Editing',
    'Web3',
    'Crypto',
    'Creator Economy',
    'Trading'
  ]
  const defaultInterests = [
    {
      title: '3D printing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Acrobatics',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Acting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Amateur radio',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Animation',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Aquascaping',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Astrology',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Astronomy',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Baking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Baton twirling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Blogging',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Building',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Board/tabletop games',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Book discussion clubs',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Book restoration',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Bowling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Brazilian jiu-jitsu',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Breadmaking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Bullet journaling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cabaret',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Calligraphy',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Candle making',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Candy making',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Car fixing & building',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Card games',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cheesemaking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cleaning',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Clothesmaking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Coffee roasting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Collecting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Coloring',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Computer programming',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Confectionery',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cooking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cosplaying',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Couponing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Craft',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Creative writing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Crocheting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cross-stitch',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Crossword puzzles',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cryptography',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Cue sports',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Dance',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Digital arts',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Distro Hopping',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'DJing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Do it yourself',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Drama',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Drawing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Drink mixing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Drinking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Electronic games',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Electronics',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Embroidery',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Experimenting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Fantasy sports',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Fashion',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Fashion design',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Fishkeeping',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Filmmaking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Flower arranging',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Fly tying',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Foreign language learning',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Furniture building',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Gaming',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Genealogy',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Gingerbread house making',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Glassblowing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Graphic design',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Gunsmithing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Gymnastics',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Hacking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Herp keeping',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Home improvement',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Homebrewing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Houseplant care',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Hula hooping',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Humor',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Hydroponics',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Ice skating',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Jewelry making',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Jigsaw puzzles',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Journaling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Juggling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Karaoke',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Karate',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Kendama',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Knife making',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Knitting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Knot tying',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Kombucha brewing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Lace making',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Lapidary',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Leather crafting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Lego building',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Lock picking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Listening to music',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Listening to podcasts',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Machining',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Macrame',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Magic',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Makeup',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Mazes (indoor/outdoor)',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Metalworking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Model building',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Model engineering',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Nail art',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Needlepoint',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Origami',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Painting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Palmistry',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Pet adoption & fostering',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Philately',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Photography',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Practical jokes',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Pressed flower craft',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Playing musical instruments',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Poi',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Pottery',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Powerlifting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Puzzles',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Quilling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Quilting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Quizzes',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Radio-controlled model',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Rail transport modeling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Rapping',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Reading',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Refinishing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Reiki',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Robot combat',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: "Rubik's Cube",
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Scrapbooking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Sculpting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Sewing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Shoemaking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Singing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Sketching',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Skipping rope',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Slot car',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Soapmaking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Social media',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Spreadsheets',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Stand-up comedy',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Stamp collecting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Table tennis',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Tarot',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Taxidermy',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Thrifting',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Video editing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Video game developing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Video gaming',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Watching movies',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Watching television',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Videography',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Virtual reality',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Waxing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Weaving',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Weight training',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Welding',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Whittling',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Wikipedia editing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Winemaking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Wood carving',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Woodworking',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Worldbuilding',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Writing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Word searches',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Yo-yoing',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Yoga',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Zumba',
      category: 'General',
      subCategory: 'Indoors'
    },
    {
      title: 'Amusement park visiting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Air sports',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Airsoft',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Amateur geology',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Archery',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Astronomy',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Backpacking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Badminton',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'BASE jumping',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Baseball',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Basketball',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Beekeeping',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Birdwatching',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Blacksmithing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'BMX',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Board sports',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Bodybuilding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Bonsai',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Butterfly watching',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Bus riding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Camping',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Canoeing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Canyoning',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Car riding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Caving',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Composting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Cycling',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Dowsing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Driving',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Farming',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Fishing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Flag football',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Flower growing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Flying',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Flying disc',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Foraging',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Fossicking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Freestyle football',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Gardening',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Geocaching',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Ghost hunting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Gold prospecting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Graffiti',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Handball',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Herbalism',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Herping',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'High-power rocketry',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Hiking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Hobby horsing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Hobby tunneling',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Hooping',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Horseback riding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Hunting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Inline skating',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Jogging',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Jumping rope',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Kayaking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Kite flying',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Kitesurfing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Lacrosse',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'LARPing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Letterboxing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Longboarding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Martial arts',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Metal detecting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Meteorology',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Motor sports',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Mountain biking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Mountaineering',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Museum visiting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Mushroom hunting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Netball',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Nordic skating',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Orienteering',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Paintball',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Parkour',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Photography',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Podcast hosting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Polo',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Public transport riding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Rafting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Railway journeys',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Rappelling',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Road biking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Rock climbing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Roller skating',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Rugby',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Running',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Radio-controlled model',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Sailing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Sand art',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Scouting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Scuba diving',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Sculling',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Shooting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Shopping',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Shuffleboard',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Skateboarding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Skiing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Skimboarding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Skydiving',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Slacklining',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Snowboarding',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Snowmobiling',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Snowshoeing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Soccer',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Stone skipping',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Sun bathing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Surfing',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Survivalism',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Swimming',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Taekwondo',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tai chi',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tennis',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Topiary',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tourism',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Thru-hiking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Trade fair visiting',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Travel',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Urban exploration',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Vacation',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Vegetable farming',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Videography',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Vehicle restoration',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Walking',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Water sports',
      category: 'General',
      subCategory: 'Outdoors'
    },
    {
      title: 'Astronomy',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Biology',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Chemistry',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Electrochemistry',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Physics',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Psychology',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Sports science',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Geography',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'History',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Mathematics',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Railway studies',
      category: 'Educational',
      subCategory: false
    },
    {
      title: 'Action figure',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Antiquing',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Ant-keeping',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Art collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Book collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Button collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Cartophily',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Coin collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Comic book collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Deltiology',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Die-cast toy',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Digital hoarding',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Dolls',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Element collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Ephemera collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Fusilately',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Knife collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Lotology',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Movie and movie memorabilia collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Fingerprint collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Perfume',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Phillumeny',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Radio-controlled model',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Rail transport modelling',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Record collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Rock tumbling',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Scutelliphily',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Shoes',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Slot car',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Sports memorabilia',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Stamp collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Stuffed toy collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Tea bag collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Ticket collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Toys',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Transit map collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Video game collecting',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Vintage cars',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Vintage clothing',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Vinyl Records',
      category: 'Collection',
      subCategory: 'Indoors'
    },
    {
      title: 'Antiquities',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Auto audiophilia',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Flower collecting and pressing',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Fossil hunting',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Insect collecting',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Magnet fishing',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Metal detecting',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Mineral collecting',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Rock balancing',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Sea glass collecting',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Seashell collecting',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Stone collecting',
      category: 'Collection',
      subCategory: 'Outdoors'
    },
    {
      title: 'Animal fancy',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Axe throwing',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Backgammon',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Badminton',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Baton twirling',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Beauty pageants',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Billiards',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Bowling',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Boxing',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Bridge',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Checkers (draughts)',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Cheerleading',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Chess',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Color guard',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Cribbage',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Curling',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Dancing',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Darts',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Debate',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Dominoes',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Eating',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Esports',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Fencing',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Go',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Gymnastics',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Ice hockey',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Ice skating',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Judo',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Jujitsu',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Kabaddi',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Knowledge/word games',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Laser tag',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Longboarding',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Mahjong',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Marbles',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Martial arts',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Model United Nations',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Poker',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Pool',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Role-playing games',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Shogi',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Slot car racing',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Speedcubing',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Sport stacking',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Table football',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Table tennis',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Volleyball',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Weightlifting',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Wrestling',
      category: 'Competitive',
      subCategory: 'Indoors'
    },
    {
      title: 'Airsoft',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Archery',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Association football',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Australian rules football',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Auto racing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Baseball',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Beach volleyball',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Breakdancing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Climbing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Cricket',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Croquet',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Cycling',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Disc golf',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Dog sport',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Equestrianism',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Exhibition drill',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Field hockey',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Figure skating',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Fishing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Footbag',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Frisbee',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Golfing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Handball',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Horseback riding',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Horseshoes',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Iceboat racing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Jukskei',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Kart racing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Knife throwing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Lacrosse',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Longboarding',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Long-distance running',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Marching band',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Model aircraft',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Orienteering',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Pickleball',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Quidditch',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Race walking',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Racquetball',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Radio-controlled car racing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Roller derby',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Rugby league football',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Sculling',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Shooting sport',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Skateboarding',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Skiing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Sled dog racing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Softball',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Speed skating',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Squash',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Surfing',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Swimming',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Table tennis',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tennis',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tennis polo',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tether car',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tour skating',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Tourism',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Trapshooting',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Triathlon',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Ultimate frisbee',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Volleyball',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Water polo',
      category: 'Competitive',
      subCategory: 'Outdoors'
    },
    {
      title: 'Fishkeeping',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Learning',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Meditation',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Microscopy',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Reading',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Research',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Shortwave listening',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Audiophile',
      category: 'Observation',
      subCategory: 'Indoors'
    },
    {
      title: 'Aircraft spotting',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Amateur astronomy',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Birdwatching',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Bus spotting',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Geocaching',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Gongoozling',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Herping',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Hiking',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Meteorology',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Photography',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Satellite watching',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Trainspotting',
      category: 'Observation',
      subCategory: 'Outdoors'
    },
    {
      title: 'Whale watching',
      category: 'Observation',
      subCategory: 'Outdoors'
    }
  ]

  const interestsArray = []
  defaultInterests.forEach((interest) => {
    const firstCapitalizedInterest = interest.title.charAt(0).toUpperCase() + interest.title.slice(1).toLowerCase()
    interestsArray.push(firstCapitalizedInterest)
  })

  try {
    const docRef = await addDoc(collection(db, 'communities'), {
      communityId: req.body.formData.communityId,
      communityToken: req.body.formData.communityToken,
      adminGoogleUser: req.headers.googleuser,
      lastUpdated: Date.now(),
      targetedMatching: req.body.formData.communityBumps,
      users: [],
      industries: industries,
      interests: interestsArray
    })

    res.status(200).json({ msg: 'success' })
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export default handler
