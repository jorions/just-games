'use strict'

const cards = [
  'Account',
  'Acne',
  'Acre',
  'Act',
  'Actor',
  'Addendum',
  'Address',
  'Administration',
  'Adult',
  'Advantage',
  'Advertise',
  'Advertising',
  'Advice',
  'Affair',
  'Afternoon',
  'Agency',
  'Agent',
  'Agreement',
  'Air',
  'Aircraft',
  'Airplane',
  'Airport',
  'Aisle',
  'Alarm',
  'Alcohol',
  'Alligator',
  'Alphabetize',
  'Ambition',
  'America',
  'Analysis',
  'Anger',
  'Angle',
  'Animal',
  'Ankle',
  'Answer',
  'Anxiety',
  'Anybody',
  'Apartment',
  'Apathy',
  'Applause',
  'Apple',
  'Applesauc',
  'Application',
  'Appointment',
  'Archaeologist',
  'Argument',
  'Aristocrat',
  'Arm',
  'Armada',
  'Army',
  'Art',
  'Article',
  'Asleep',
  'Assignment',
  'Assistant',
  'Associate',
  'Assumption',
  'Astronaut',
  'Athlete',
  'Atlantis',
  'Atmosphere',
  'Attack',
  'Attempt',
  'Attention',
  'Attitude',
  'Audience',
  'Aunt',
  'Author',
  'Average',
  'Avocado',
  'Award',
  'Baby-Sitter',
  'Baby',
  'Backbone',
  'Background',
  'Bag',
  'Baguette',
  'Bake',
  'Balance',
  'Bald',
  'Ball',
  'Balloon',
  'Banana',
  'Band',
  'Banister',
  'Bank',
  'Bar',
  'Base',
  'Baseball',
  'Baseboards',
  'Basket',
  'Basketball',
  'Bat',
  'Bath',
  'Bathroom',
  'Battery',
  'Battle',
  'Beach',
  'Beanstalk',
  'Bear',
  'Beat',
  'Beautiful',
  'Bed',
  'Bedbug',
  'Bedroom',
  'Beer',
  'Beethoven',
  'Beginning',
  'Bell',
  'Belt',
  'Bench',
  'Bend',
  'Benefit',
  'Bet',
  'Bib',
  'Bicycle',
  'Bid',
  'Big',
  'Bike',
  'Bill',
  'Billboard',
  'Bird',
  'Birth',
  'Birthday',
  'Bite',
  'Bitter',
  'Black',
  'Blacksmith',
  'Blame',
  'Blank',
  'Blanket',
  'Bleach',
  'Blimp',
  'Blind',
  'Block',
  'Blood',
  'Blossom',
  'Blueprint',
  'Blunt',
  'Blur',
  'Boa',
  'Board',
  'Boat',
  'Bob',
  'Bobsled',
  'Body',
  'Bomb',
  'Bone',
  'Bonnet',
  'Bonus',
  'Book',
  'Boot',
  'Booth',
  'Border',
  'Boss',
  'Bottle',
  'Bottom',
  'Bowl',
  'Bowtie',
  'Box',
  'Boy',
  'Boyfriend',
  'Brain',
  'Brainstorm',
  'Branch',
  'Brand',
  'Brave',
  'Bread',
  'Break',
  'Breakfast',
  'Breath',
  'Brick',
  'Bride',
  'Bridge',
  'Brief',
  'Brilliant',
  'Broad',
  'Broccoli',
  'Broken',
  'Broom',
  'Brother',
  'Brown',
  'Bruise',
  'Brunette',
  'Brush',
  'Bubble',
  'Buddy',
  'Budget',
  'Buffalo',
  'Bug',
  'Building',
  'Bulb',
  'Bunch',
  'Bunny',
  'Burn',
  'Bus',
  'Business',
  'Button',
  'Buy',
  'Buyer',
  'Cabin',
  'Cabinet',
  'Cable',
  'Cafeteria',
  'Cake',
  'Calculator',
  'Calendar',
  'Call',
  'Calm',
  'Camera',
  'Camp',
  'Campaign',
  'Campsite',
  'Can',
  'Canada',
  'Cancel',
  'Candidate',
  'Candle',
  'Candy',
  'Cap',
  'Cape',
  'Capital',
  'Capitalism',
  'Car',
  'Card',
  'Cardboard',
  'Care',
  'Career',
  'Carpet',
  'Carry',
  'Cartography',
  'Case',
  'Cash',
  'Cat',
  'Catch',
  'Category',
  'Cause',
  'Cd',
  'Ceiling',
  'Celebration',
  'Cell',
  'Century',
  'Chain',
  'Chair',
  'Chalk',
  'Challenge',
  'Champion',
  'Championship',
  'Chance',
  'Change',
  'Channel',
  'Chapter',
  'Character',
  'Charge',
  'Charger',
  'Charity',
  'Chart',
  'Check',
  'Cheek',
  'Cheerleader',
  'Chef',
  'Chemical',
  'Chemistry',
  'Chess',
  'Chest',
  'Chew',
  'Chicken',
  'Child',
  'Childhood',
  'Chime',
  'China',
  'Chip',
  'Chocolate',
  'Choice',
  'Church',
  'Cigarette',
  'Circus',
  'City',
  'Claim',
  'Class',
  'Classic',
  'Classroom',
  'Clay',
  'Clerk',
  'Click',
  'Client',
  'Cliff',
  'Climate',
  'Cloak',
  'Clock',
  'Clockwork',
  'Closet',
  'Clothes',
  'Cloud',
  'Clown',
  'Club',
  'Clue',
  'Coach',
  'Coal',
  'Coast',
  'Coaster',
  'Coat',
  'Code',
  'Coffee',
  'Cog',
  'Cold',
  'Collar',
  'Collection',
  'College',
  'Combination',
  'Combine',
  'Comfort',
  'Command',
  'Comment',
  'Commercial',
  'Commission',
  'Committee',
  'Common',
  'Communication',
  'Community',
  'Company',
  'Comparison',
  'Competition',
  'Complaint',
  'Complex',
  'Computer',
  'Concentrate',
  'Concept',
  'Concern',
  'Concert',
  'Conclusion',
  'Cone',
  'Conference',
  'Confidence',
  'Conflict',
  'Confusion',
  'Connection',
  'Consequence',
  'Consideration',
  'Constant',
  'Constrictor',
  'Construction',
  'Contact',
  'Contest',
  'Context',
  'Continuum',
  'Contract',
  'Contribution',
  'Control',
  'Conversation',
  'Convert',
  'Cook',
  'Cookie',
  'Coop',
  'Copy',
  'Cord',
  'Corduroy',
  'Corner',
  'Cost',
  'Cot',
  'Cough',
  'Count',
  'Counter',
  'Country',
  'Couple',
  'Courage',
  'Course',
  'Court',
  'Cousin',
  'Cover',
  'Cow',
  'Cowboy',
  'Crack',
  'Craft',
  'Crash',
  'Crayon',
  'Crazy',
  'Cream',
  'Creative',
  'Credit',
  'Crew',
  'Crisp',
  'Criticism',
  'Criticize',
  'Cross',
  'Crow',
  'Cruise',
  'Crumb',
  'Crust',
  'Cry',
  'Cuff',
  'Culture',
  'Cup',
  'Currency',
  'Current',
  'Curtain',
  'Curve',
  'Customer',
  'Cut',
  'Cuticle',
  'Cycle',
  'Czar',
  'Dad',
  'Damage',
  'Dance',
  'Dare',
  'Dark',
  'Dart',
  'Data',
  'Database',
  'Date',
  'Daughter',
  'Dawn',
  'Day',
  'Dead',
  'Deal',
  'Dealer',
  'Dear',
  'Death',
  'Debate',
  'Debt',
  'Decision',
  'Deep',
  'Defect',
  'Degree',
  'Delay',
  'Delivery',
  'Demand',
  'Dent',
  'Dentist',
  'Department',
  'Departure',
  'Dependent',
  'Deposit',
  'Depression',
  'Depth',
  'Design',
  'Designer',
  'Desire',
  'Desk',
  'Detail',
  'Development',
  'Device',
  'Devil',
  'Diamond',
  'Dictionary',
  'Diet',
  'Difference',
  'Dig',
  'Dimple',
  'Dinner',
  'Direction',
  'Director',
  'Dirt',
  'Dirty',
  'Disaster',
  'Discipline',
  'Discount',
  'Discussion',
  'Disease',
  'Dish',
  'Disk',
  'Dismantle',
  'Display',
  'Distance',
  'District',
  'Ditch',
  'Diver',
  'Divide',
  'Doctor',
  'Document',
  'Dog',
  'Doghouse',
  'Doll',
  'Dominoes',
  'Door',
  'Dot',
  'Double',
  'Doubt',
  'Draft',
  'Drag',
  'Drain',
  'Drama',
  'Draw',
  'Drawer',
  'Drawing',
  'Dream',
  'Dress',
  'Drink',
  'Drip',
  'Drive',
  'Driver',
  'Drop',
  'Drums',
  'Drunk',
  'Dryer',
  'Duck',
  'Dump',
  'Dunk',
  'Dust',
  'Duty',
  'Ear',
  'Earth',
  'Eat',
  'Ebony',
  'Economics',
  'Edge',
  'Editor',
  'Education',
  'Egg',
  'Elbow',
  'Election',
  'Electricity',
  'Elephant',
  'Elevator',
  'Elf',
  'Elm',
  'Emergency',
  'Emotion',
  'Employee',
  'Employer',
  'End',
  'Energy',
  'Engine',
  'Engineer',
  'England',
  'Entrance',
  'Environment',
  'Equipment',
  'Ergonomic',
  'Error',
  'Escalator',
  'Escape',
  'Essay',
  'Estate',
  'Estimate',
  'Eureka',
  'Europe',
  'Evening',
  'Event',
  'Evidence',
  'Evolution',
  'Exam',
  'Example',
  'Exercise',
  'Exit',
  'Experience',
  'Explanation',
  'Extension',
  'Eye',
  'Eyebrow',
  'Face',
  'Fact',
  'Factor',
  'Failure',
  'Fall',
  'Family',
  'Fan',
  'Fancy',
  'Farm',
  'Farmer',
  'Fast',
  'Fat',
  'Father',
  'Fault',
  'Fear',
  'Feast',
  'Feature',
  'Fee',
  'Feeling',
  'Female',
  'Fence',
  'Feudalism',
  'Fiddle',
  'Field',
  'Fight',
  'Figment',
  'Figure',
  'File',
  'Film',
  'Finger',
  'Finish',
  'Fire',
  'First',
  'Fish',
  'Fishing',
  'Fix',
  'Fizz',
  'Flagpole',
  'Flannel',
  'Flashlight',
  'Flight',
  'Flock',
  'Floor',
  'Flotsam',
  'Flow',
  'Flower',
  'Flu',
  'Flush',
  'Flutter',
  'Fly',
  'Fog',
  'Foil',
  'Food',
  'Foot',
  'Football',
  'Force',
  'Forehead',
  'Forever',
  'Fortnight',
  'Fortune',
  'Foundation',
  'Frame',
  'France',
  'Freckle',
  'Freedom',
  'Freight',
  'Friend',
  'Fringe',
  'Frog',
  'Frown',
  'Fruit',
  'Fuel',
  'Fun',
  'Funeral',
  'Gallop',
  'Game',
  'Gap',
  'Garage',
  'Garbage',
  'Garden',
  'Gas',
  'Gasoline',
  'Gate',
  'Gem',
  'Gene',
  'General',
  'Ginger',
  'Gingerbread',
  'Girl',
  'Glass',
  'Glasses',
  'Glove',
  'Goal',
  'Goblin',
  'God',
  'Gold',
  'Golf',
  'Goodbye',
  'Government',
  'Grade',
  'Grandfather',
  'Grandmother',
  'Grandpa',
  'Grape',
  'Grass',
  'Gratitude',
  'Gray',
  'Green',
  'Grocery',
  'Ground',
  'Guarantee',
  'Guard',
  'Guess',
  'Guest',
  'Guide',
  'Guitar',
  'Gum',
  'Gumball',
  'Guy',
  'Habit',
  'Hair',
  'Half',
  'Hall',
  'Hand',
  'Handle',
  'Handwriting',
  'Hang',
  'Happy',
  'Hat',
  'Hatch',
  'Hate',
  'Head',
  'Headache',
  'Hearing',
  'Heart',
  'Hedge',
  'Helicopter',
  'Hell',
  'Help',
  'Hem',
  'Hide',
  'Highlight',
  'Highway',
  'Hill',
  'Historian',
  'History',
  'Hit',
  'Hockey',
  'Hole',
  'Holiday',
  'Home',
  'Homework',
  'Honey',
  'Honk',
  'Hook',
  'Hope',
  'Hopscotch',
  'Horror',
  'Horse',
  'Hose',
  'Hospital',
  'Host',
  'Hot',
  'Hotel',
  'House',
  'Houseboat',
  'Hug',
  'Humidifier',
  'Hungry',
  'Hunt',
  'Hurdle',
  'Hurt',
  'Husband',
  'Hut',
  'Ice',
  'Idea',
  'Illegal',
  'Image',
  'Impact',
  'Implode',
  'Incident',
  'Income',
  'Independence',
  'Industry',
  'Inflation',
  'Influence',
  'Information',
  'Injury',
  'Inn',
  'Inquisition',
  'Insect',
  'Inspection',
  'Inspector',
  'Instruction',
  'Insurance',
  'Intern',
  'Internet',
  'Interview',
  'Invitation',
  'Iron',
  'Ironic',
  'Island',
  'Issue',
  'Ivory',
  'Ivy',
  'Jacket',
  'Jade',
  'Japan',
  'Jeans',
  'Jelly',
  'Jet',
  'Jig',
  'Job',
  'Jog',
  'Joint',
  'Joke',
  'Journal',
  'Judge',
  'Juice',
  'Jump',
  'Jury',
  'Keep',
  'Key',
  'Kid',
  'Killer',
  'Kilogram',
  'Kind',
  'King',
  'Kiss',
  'Kitchen',
  'Kite',
  'Knee',
  'Kneel',
  'Knife',
  'Knight',
  'Knowledge',
  'Koala',
  'Lab',
  'Lace',
  'Ladder',
  'Ladybug',
  'Lag',
  'Lake',
  'Landfill',
  'Landscape',
  'Language',
  'Lap',
  'Laugh',
  'Laundry',
  'Law',
  'Lawn',
  'Lawnmower',
  'Lawyer',
  'Layer',
  'Lead',
  'Leader',
  'League',
  'Leak',
  'Leather',
  'Lecture',
  'Leg',
  'Lesson',
  'Letter',
  'Level',
  'Library',
  'Lie',
  'Life',
  'Lifestyle',
  'Lift',
  'Ligament',
  'Light',
  'Lightsaber',
  'Lime',
  'Limit',
  'Line',
  'Link',
  'Lion',
  'Lip',
  'List',
  'Literature',
  'Living',
  'Lizard',
  'Load',
  'Loan',
  'Local',
  'Location',
  'Lock',
  'Log',
  'Loiterer',
  'Lollipop',
  'Long',
  'Look',
  'Loss',
  'Love',
  'Loveseat',
  'Loyalty',
  'Luck',
  'Lunch',
  'Lunchbox',
  'Lyrics',
  'Machine',
  'Macho',
  'Magazine',
  'Mail',
  'Mailbox',
  'Maintenance',
  'Major',
  'Male',
  'Mall',
  'Mammoth',
  'Manager',
  'Manufacturer',
  'Map',
  'March',
  'Mark',
  'Market',
  'Marketing',
  'Marriage',
  'Mars',
  'Mascot',
  'Mast',
  'Master',
  'Match',
  'Matchstick',
  'Mate',
  'Math',
  'Mattress',
  'Meal',
  'Meaning',
  'Measurement',
  'Meat',
  'Media',
  'Medicine',
  'Medium',
  'Meeting',
  'Member',
  'Memory',
  'Menu',
  'Mess',
  'Message',
  'Metal',
  'Method',
  'Mexico',
  'Midnight',
  'Midsummer',
  'Might',
  'Milk',
  'Mind',
  'Mine',
  'Minor',
  'Minute',
  'Mirror',
  'Miss',
  'Mission',
  'Mistake',
  'Mix',
  'Mixture',
  'Mobile',
  'Model',
  'Modern',
  'Mold',
  'Mom',
  'Moment',
  'Monday',
  'Money',
  'Monitor',
  'Monster',
  'Month',
  'Mooch',
  'Moon',
  'Mop',
  'Morning',
  'Mortgage',
  'Moth',
  'Mother',
  'Motor',
  'Motorcycle',
  'Mountain',
  'Mouse',
  'Mouth',
  'Movie',
  'Mower',
  'Mud',
  'Muscle',
  'Music',
  'Mute',
  'Nail',
  'Nasty',
  'Nation',
  'Native',
  'Natural',
  'Nature',
  'Neck',
  'Negative',
  'Negotiate',
  'Negotiation',
  'Neighbor',
  'Nerve',
  'Nest',
  'Net',
  'Network',
  'Neutron',
  'News',
  'Niece',
  'Night',
  'Nightmare',
  'Noise',
  'North',
  'Nose',
  'Note',
  'Notice',
  'Novel',
  'Number',
  'Nurse',
  'Oar',
  'Objective',
  'Obligation',
  'Observatory',
  'Offer',
  'Office',
  'Officer',
  'Oil',
  'Old',
  'Olympian',
  'Opaque',
  'Opener',
  'Opening',
  'Operation',
  'Opinion',
  'Opportunity',
  'Option',
  'Orange',
  'Orbit',
  'Order',
  'Organ',
  'Organization',
  'Organize',
  'Outer',
  'Outside',
  'Ovation',
  'Oven',
  'Overture',
  'Owner',
  'Pace',
  'Pack',
  'Page',
  'Pail',
  'Pain',
  'Paint',
  'Painting',
  'Pajamas',
  'Palace',
  'Panic',
  'Pants',
  'Paper',
  'Parent',
  'Park',
  'Parody',
  'Partner',
  'Party',
  'Passage',
  'Passenger',
  'Password',
  'Pastry',
  'Path',
  'Patient',
  'Pattern',
  'Pause',
  'Pawn',
  'Payment',
  'Peace',
  'Peak',
  'Pear',
  'Pen',
  'Penalty',
  'Pencil',
  'Pendulum',
  'Penny',
  'Pension',
  'Pepper',
  'Performance',
  'Permit',
  'Personal',
  'Philosopher',
  'Philosophy',
  'Phone',
  'Photo',
  'Photograph',
  'Physics',
  'Piano',
  'Pick',
  'Picnic',
  'Picture',
  'Pie',
  'Pigpen',
  'Pillow',
  'Pilot',
  'Pin',
  'Pinch',
  'Ping',
  'Pinwheel',
  'Pipe',
  'Pirate',
  'Pitch',
  'Pizza',
  'Plaid',
  'Plan',
  'Plane',
  'Plank',
  'Plant',
  'Plastic',
  'Plate',
  'Platform',
  'Platypus',
  'Play',
  'Player',
  'Playground',
  'Pleasure',
  'Plow',
  'Plumber',
  'Pocket',
  'Poem',
  'Poet',
  'Point',
  'Pole',
  'Police',
  'Policy',
  'Politics',
  'Pollution',
  'Pomp',
  'Pong',
  'Pool',
  'Popsicle',
  'Population',
  'Portfolio',
  'Positive',
  'Possession',
  'Post',
  'Pot',
  'Potato',
  'Pound',
  'Power',
  'Practice',
  'Present',
  'President',
  'Press',
  'Pressure',
  'Price',
  'Pride',
  'Priest',
  'Princess',
  'Principle',
  'Print',
  'Prize',
  'Problem',
  'Procedure',
  'Procrastinate',
  'Professor',
  'Profit',
  'Program',
  'Promotion',
  'Proof',
  'Proposal',
  'Protestant',
  'Psychologist',
  'Psychology',
  'Publisher',
  'Punch',
  'Punk',
  'Puppet',
  'Puppy',
  'Purple',
  'Push',
  'Puzzle',
  'Quarantine',
  'Quarter',
  'Queen',
  'Question',
  'Quicksand',
  'Quiet',
  'Race',
  'Radio',
  'Raft',
  'Rag',
  'Rain',
  'Rainbow',
  'Rainwater',
  'Raise',
  'Random',
  'Raw',
  'Ray',
  'Reaction',
  'Read',
  'Reason',
  'Recipe',
  'Record',
  'Recycle',
  'Red',
  'Reflection',
  'Refrigerator',
  'Refuse',
  'Register',
  'Regret',
  'Reimbursement',
  'Relationship',
  'Rent',
  'Repair',
  'Replacement',
  'Reply',
  'Report',
  'Representative',
  'Republic',
  'Request',
  'Resident',
  'Resolution',
  'Resort',
  'Restaurant',
  'Retaliate',
  'Revenue',
  'Revolution',
  'Reward',
  'Rib',
  'Rice',
  'Rich',
  'Riddle',
  'Rim',
  'Ring',
  'Rink',
  'River',
  'Road',
  'Rock',
  'Roller',
  'Roof',
  'Room',
  'Rope',
  'Rose',
  'Rough',
  'Round',
  'Roundabout',
  'Royal',
  'Ruin',
  'Rule',
  'Rung',
  'Runt',
  'Rush',
  'Rut',
  'Sad',
  'Safe',
  'Sail',
  'Salad',
  'Salary',
  'Salmon',
  'Salt',
  'Sample',
  'Sand',
  'Sandbox',
  'Sandcastle',
  'Sandwich',
  'Sash',
  'Satellite',
  'Savings',
  'Scale',
  'Scar',
  'Scared',
  'Scheme',
  'School',
  'Science',
  'Score',
  'Scoundrel',
  'Scramble',
  'Scratch',
  'Screen',
  'Screw',
  'Script',
  'Scuff',
  'Sea',
  'Seashell',
  'Season',
  'Seat',
  'Second',
  'Secret',
  'Secretary',
  'Senior',
  'Sentence',
  'Sequins',
  'Set',
  'Sex',
  'Shaft',
  'Shallow',
  'Shame',
  'Shampoo',
  'Shark',
  'Sheep',
  'Sheets',
  'Shelter',
  'Sheriff',
  'Ship',
  'Shipwreck',
  'Shirt',
  'Shock',
  'Shoe',
  'Shoelace',
  'Shop',
  'Short',
  'Shot',
  'Shoulder',
  'Shower',
  'Shrink',
  'Sick',
  'Siesta',
  'Sign',
  'Signature',
  'Silhouette',
  'Silver',
  'Singer',
  'Single',
  'Sink',
  'Sip',
  'Sir',
  'Site',
  'Situation',
  'Skate',
  'Skating',
  'Ski',
  'Skin',
  'Skirt',
  'Sky',
  'Slam',
  'Sleep',
  'Slide',
  'Sling',
  'Slip',
  'Slow',
  'Slump',
  'Smell',
  'Smile',
  'Smith',
  'Smoke',
  'Sneeze',
  'Snow',
  'Snuggle',
  'Society',
  'Sock',
  'Software',
  'Soil',
  'Solution',
  'Son',
  'Song',
  'Sound',
  'Soup',
  'Source',
  'South',
  'Space',
  'Spare',
  'Speaker',
  'Speakers',
  'Special',
  'Specialist',
  'Speech',
  'Speed',
  'Spider',
  'Spirit',
  'Spit',
  'Spite',
  'Sponge',
  'Spool',
  'Spoon',
  'Sport',
  'Spot',
  'Spray',
  'Spread',
  'Spring',
  'Sprinkler',
  'Spy',
  'Square',
  'Squint',
  'Stable',
  'Staff',
  'Stage',
  'Stairs',
  'Stand',
  'Standing',
  'Star',
  'State',
  'Statement',
  'Station',
  'Status',
  'Steak',
  'Step',
  'Stick',
  'Stock',
  'Stockholder',
  'Stomach',
  'Stoplight',
  'Storage',
  'Store',
  'Storm',
  'Stout',
  'Stove',
  'Stowaway',
  'Strain',
  'Strategy',
  'Straw',
  'Stream',
  'Streamline',
  'Strength',
  'Stress',
  'Stretch',
  'Strike',
  'String',
  'Strip',
  'Stripe',
  'Stroke',
  'Struggle',
  'Student',
  'Studio',
  'Stupid',
  'Style',
  'Substance',
  'Success',
  'Sugar',
  'Suggestion',
  'Suit',
  'Summer',
  'Sun',
  'Sunburn',
  'Support',
  'Surgery',
  'Surprise',
  'Survey',
  'Sushi',
  'Suspect',
  'Swamp',
  'Swarm',
  'Sweater',
  'Swimming',
  'Swing',
  'Sympathy',
  'System',
  'Table',
  'Tachometer',
  'Tackle',
  'Tale',
  'Talk',
  'Tank',
  'Tap',
  'Target',
  'Task',
  'Taste',
  'Tax',
  'Taxi',
  'Tea',
  'Teach',
  'Teacher',
  'Team',
  'Teapot',
  'Tear',
  'Teenager',
  'Telephone',
  'Television',
  'Temporary',
  'Ten',
  'Tennis',
  'Tension',
  'Term',
  'Text',
  'Thanks',
  'Theory',
  'Thief',
  'Think',
  'Throat',
  'Throne',
  'Through',
  'Thunder',
  'Ticket',
  'Tide',
  'Tie',
  'Tiger',
  'Time',
  'Tinting',
  'Tip',
  'Tiptoe',
  'Tiptop',
  'Tired',
  'Tissue',
  'Title',
  'Toast',
  'Today',
  'Toilet',
  'Tomorrow',
  'Tone',
  'Tongue',
  'Tool',
  'Tooth',
  'Toothbrush',
  'Topic',
  'Tornado',
  'Tough',
  'Tour',
  'Tourist',
  'Tournament',
  'Tower',
  'Town',
  'Track',
  'Tractor',
  'Trade',
  'Tradition',
  'Traffic',
  'Train',
  'Trainer',
  'Transition',
  'Trash',
  'Travel',
  'Treasure',
  'Treat',
  'Tree',
  'Triangle',
  'Trick',
  'Trip',
  'Trouble',
  'Truck',
  'Trust',
  'Truth',
  'Tub',
  'Tuba',
  'Tune',
  'Turn',
  'Tutor',
  'Twang',
  'Twig',
  'Twist',
  'Twitterpated',
  'Type',
  'Uncle',
  'Unemployed',
  'Union',
  'University',
  'Upgrade',
  'Upstairs',
  'User',
  'Vacation',
  'Variation',
  'Vast',
  'Vegetable',
  'Vehicle',
  'Vest',
  'Video',
  'Village',
  'Virus',
  'Vision',
  'Visit',
  'Volume',
  'Wag',
  'Wait',
  'Wake',
  'Walk',
  'Wall',
  'War',
  'Warning',
  'Watch',
  'Water',
  'Watermelon',
  'Wave',
  'Wax',
  'Wealth',
  'Weather',
  'Web',
  'Wedding',
  'Weed',
  'Welder',
  'Western',
  'Whatever',
  'Wheel',
  'Wheelchair',
  'Whiplash',
  'Whisk',
  'Whistle',
  'White',
  'Wife',
  'Wig',
  'Will',
  'Wind',
  'Windmill',
  'Window',
  'Wine',
  'Wing',
  'Winter',
  'Wish',
  'Witness',
  'Wolf',
  'Woman',
  'Wonder',
  'Wood',
  'Wool',
  'Worker',
  'World',
  'Worm',
  'Worry',
  'Wrap',
  'Wristwatch',
  'Writer',
  'Yard',
  'Yardstick',
  'Year',
  'Yesterday',
  'Young',
  'Zamboni',
  'Zen',
  'Zero',
  'Zipper',
  'Zone',
  'Zoo',
]

const tooLong = []
cards.forEach(card => {
  if (card.length > 14) tooLong.push(card)
})
if (tooLong.length) {
  throw new Error(`Some cards are too long: ${tooLong}`)
}

module.exports = cards