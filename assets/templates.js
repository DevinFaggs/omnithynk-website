/* Smart templates: instant, AI-free first drafts for common business types. */
(function () {
  const M = window.OmniMockup;
  const P = (bg, surface, text, accent, accent2) => ({ bg, surface, text, accent, accent2 });

  // Color themes (also used by the live editor)
  M.THEMES = {
    ember: { label: 'Ember', style: 'warm', palette: P('#FFF7EE', '#FFFFFF', '#3B2416', '#C2552A', '#F2A541') },
    ocean: { label: 'Ocean', style: 'clean', palette: P('#F6F8FB', '#FFFFFF', '#0F1B2D', '#2563EB', '#14B8A6') },
    forest: { label: 'Forest', style: 'warm', palette: P('#F4F8F3', '#FFFFFF', '#14281D', '#2F7D4F', '#E0B84E') },
    berry: { label: 'Berry', style: 'elegant', palette: P('#FAF5F6', '#FFFFFF', '#2A1720', '#9D2F5B', '#E6A87C') },
    night: { label: 'Night', style: 'bold', palette: P('#0F1115', '#1A1D24', '#F3F4F6', '#FF5A36', '#FFC93C') },
    candy: { label: 'Candy', style: 'playful', palette: P('#FFF9EC', '#FFFFFF', '#24123A', '#7C3AED', '#FF7AB6') }
  };
  M.FEELS = { 'Warm and friendly': 'ember', 'Bold and modern': 'night', 'Elegant and premium': 'berry', 'Fun and playful': 'candy', 'Clean and simple': 'ocean' };

  const tabs = (a, b, c) => [{ label: 'Home', icon: 'home' }, a, b, c];
  function T(o) {
    return {
      name: o.name, style: o.style, palette: o.palette, logoIcon: o.icon, nav: o.nav,
      hero: { title: o.hero[0], text: o.hero[1], cta: o.hero[2], badge: o.hero[3] },
      productsTitle: o.pt, products: o.items.map(x => ({ name: x[0], desc: x[1], price: x[2], icon: x[3] })),
      features: o.feats.map(x => ({ title: x[0], text: x[1], icon: x[2] })),
      about: o.about, ctaBand: { title: o.cta[0], button: o.cta[1] },
      app: { greeting: o.app[0], promo: { title: o.app[1], text: o.app[2], button: o.app[3] }, categories: o.app[4], listTitle: o.app[5], actionTitle: o.app[6], actionButton: o.app[7], tabs: o.app[8], rewardsTitle: o.app[9] }
    };
  }

  const NEW = {
    restaurant: T({ name: 'Corner Table Kitchen', style: 'warm', palette: P('#FBF6EF', '#FFFFFF', '#2B1D14', '#B4442B', '#D9A441'), icon: 'burger', nav: ['Menu', 'Reservations', 'Catering', 'Visit'],
      hero: ['Comfort food made from scratch', 'Seasonal plates, local ingredients and a table waiting for you. Order online or book a seat.', 'Reserve a table', 'Open tonight until 10'],
      pt: 'Tonight’s favorites', items: [['Short Rib Plate', 'Braised 8 hours, mashed potatoes', '$24', 'flame'], ['Garden Harvest Salad', 'Greens, roasted beets, goat cheese', '$13', 'leaf'], ['Wood-Fired Pizza', 'House dough, fresh mozzarella', '$17', 'pizza'], ['Smash Burger', 'Two patties, special sauce, fries', '$16', 'burger'], ['Warm Bread Basket', 'Baked in-house every day', '$6', 'bread'], ['Chocolate Lava Cake', 'With vanilla bean ice cream', '$9', 'cake']],
      feats: [['Book in seconds', 'Pick a time, get a text reminder.', 'calendar'], ['Order for pickup', 'Skip the wait, pay ahead.', 'clock'], ['Private events', 'Space for parties up to 40.', 'users']],
      about: 'A neighborhood kitchen where everything is made by hand and every guest is treated like family.', cta: ['Hungry? Your table is ready.', 'Book now'],
      app: ['What sounds good?', 'Date night special', 'Two entrées and dessert for $49.', 'Order', ['Mains', 'Starters', 'Desserts', 'Drinks'], 'Popular tonight', 'Reserve a table', 'Reserve', tabs({ label: 'Menu', icon: 'burger' }, { label: 'Book', icon: 'calendar' }, { label: 'Rewards', icon: 'gift' }), 'Your rewards'] }),
    coffee: T({ name: 'Daily Grind Coffee', style: 'warm', palette: P('#F7F1EA', '#FFFFFF', '#2A1C14', '#6F4428', '#D9A15B'), icon: 'coffee', nav: ['Menu', 'Order ahead', 'Beans', 'Visit'],
      hero: ['Your morning, made better', 'Small-batch roasts and fresh pastries. Order ahead and your drink is waiting when you walk in.', 'Order ahead', 'Fresh roast Monday'],
      pt: 'House favorites', items: [['Honey Oat Latte', 'Espresso, oat milk, wildflower honey', '$5.75', 'coffee'], ['Cold Brew', 'Steeped 18 hours, smooth and bold', '$4.50', 'coffee'], ['Butter Croissant', 'Flaky, baked every morning', '$3.75', 'bread'], ['Matcha Cloud', 'Ceremonial matcha, vanilla foam', '$6.00', 'leaf'], ['House Roast Beans', '12 oz bag, whole or ground', '$16', 'bag'], ['Blueberry Muffin', 'Bursting with real berries', '$3.50', 'cake']],
      feats: [['Order ahead', 'Skip the line every morning.', 'clock'], ['Earn free drinks', 'Every 10th drink is on us.', 'gift'], ['Roasted in-house', 'Beans roasted right here weekly.', 'flame']],
      about: 'A cozy corner shop roasting our own beans and remembering your usual.', cta: ['Your usual, ready when you are', 'Order now'],
      app: ['Good morning!', 'Double points today', 'Earn 2x stars on every drink.', 'Order', ['Hot', 'Iced', 'Food', 'Beans'], 'Your favorites', 'Order for pickup', 'Pay now', tabs({ label: 'Menu', icon: 'coffee' }, { label: 'Pickup', icon: 'clock' }, { label: 'Rewards', icon: 'gift' }), 'Coffee club'] }),
    barber: T({ name: 'Sharp Line Barbershop', style: 'bold', palette: P('#111214', '#1C1E22', '#F2F2F2', '#D4A63A', '#B83A2E'), icon: 'scissors', nav: ['Services', 'Barbers', 'Gallery', 'Book'],
      hero: ['Fresh cuts. No waiting.', 'Book your barber, pick your time and walk right into the chair.', 'Book a cut', 'Walk-ins welcome'],
      pt: 'Services', items: [['Classic Cut', 'Clipper and scissor, hot towel finish', '$30', 'scissors'], ['Skin Fade', 'Sharp, clean, blended', '$35', 'scissors'], ['Beard Trim & Line Up', 'Shape, edge and oil', '$20', 'sparkle'], ['Cut + Beard', 'The full refresh', '$48', 'star'], ['Kids Cut', '12 and under', '$22', 'smile'], ['Hot Towel Shave', 'Straight razor, old school', '$35', 'droplet']],
      feats: [['Book your barber', 'See real-time openings.', 'calendar'], ['Reminders by text', 'Never miss your chair.', 'chat'], ['Loyalty rewards', 'Every 8th cut is free.', 'gift']],
      about: 'Old-school craft with a modern booking system. Good cuts, good conversation.', cta: ['Your chair is open', 'Book now'],
      app: ['Looking sharp?', 'Refer a friend', 'You both get $5 off.', 'Invite', ['Cuts', 'Beard', 'Shave', 'Kids'], 'Popular', 'Book a cut', 'Book', tabs({ label: 'Services', icon: 'scissors' }, { label: 'Book', icon: 'calendar' }, { label: 'Me', icon: 'user' }), 'Your cuts'] }),
    dental: T({ name: 'Bright Smile Dental', style: 'clean', palette: P('#F4F9FB', '#FFFFFF', '#0E2433', '#0E8AA8', '#5BC8AF'), icon: 'tooth', nav: ['Services', 'New patients', 'Insurance', 'Book'],
      hero: ['Gentle care for the whole family', 'Modern dentistry, friendly people and online booking that takes seconds.', 'Book a visit', 'New patients welcome'],
      pt: 'Our services', items: [['Cleanings & Exams', 'Twice-yearly visits made easy', 'Most insurance', 'tooth'], ['Teeth Whitening', 'Brighter smile in one visit', 'From $199', 'sparkle'], ['Invisalign', 'Clear aligners, free consult', 'Free consult', 'smile'], ['Kids Dentistry', 'Fun, gentle first visits', 'Most insurance', 'heart'], ['Emergency Care', 'Same-day appointments', 'Call today', 'medical'], ['Crowns & Implants', 'Long-lasting, natural look', 'Free estimate', 'shield']],
      feats: [['Book online 24/7', 'Pick a time that works.', 'calendar'], ['Text reminders', 'Fewer missed visits.', 'chat'], ['Insurance help', 'We handle the paperwork.', 'briefcase']],
      about: 'A calm, modern practice where you are a person, not a chart number.', cta: ['Ready for your best smile?', 'Book now'],
      app: ['Hi there', 'Whitening special', '20% off this month.', 'Book', ['Cleaning', 'Cosmetic', 'Kids', 'Urgent'], 'Services', 'Book a visit', 'Confirm', tabs({ label: 'Care', icon: 'tooth' }, { label: 'Book', icon: 'calendar' }, { label: 'Me', icon: 'user' }), 'My visits'] }),
    realestate: T({ name: 'Keystone Realty', style: 'elegant', palette: P('#F7F6F3', '#FFFFFF', '#1B1F24', '#1F4E5F', '#C9A26B'), icon: 'home', nav: ['Buy', 'Sell', 'Neighborhoods', 'Contact'],
      hero: ['Find the place you’ll love coming home to', 'Local agents, real advice and listings updated every hour.', 'Browse homes', 'New listings daily'],
      pt: 'Featured homes', items: [['Maple Street Craftsman', '4 bed · 3 bath · 2,400 sq ft', '$429,000', 'home'], ['Downtown Loft', '2 bed · 2 bath · walkable', '$315,000', 'home'], ['Lakeview Ranch', '3 bed · 2 bath · big yard', '$389,000', 'leaf'], ['Starter Townhome', '2 bed · 1.5 bath · garage', '$219,000', 'home'], ['Modern Farmhouse', '5 bed · 4 bath · 1 acre', '$612,000', 'sun'], ['Free Home Valuation', 'Know what yours is worth', 'Free', 'chart']],
      feats: [['Instant alerts', 'New matches sent to your phone.', 'bolt'], ['Local experts', 'Agents who live here.', 'pin'], ['Simple selling', 'Pricing, photos and showings handled.', 'star']],
      about: 'A local team helping families buy and sell with honesty and zero pressure.', cta: ['Thinking of moving?', 'Talk to an agent'],
      app: ['Find your next home', 'Open house Sunday', '6 homes, 1-4 PM.', 'See all', ['Buy', 'Rent', 'Sell', 'Saved'], 'New listings', 'Schedule a tour', 'Book tour', tabs({ label: 'Search', icon: 'search' }, { label: 'Tours', icon: 'calendar' }, { label: 'Saved', icon: 'heart' }), 'My homes'] }),
    landscaping: T({ name: 'GreenEdge Landscaping', style: 'warm', palette: P('#F5F8F1', '#FFFFFF', '#1C2A17', '#3F7D2C', '#E3A93B'), icon: 'leaf', nav: ['Services', 'Projects', 'Plans', 'Free estimate'],
      hero: ['A yard you’ll want to show off', 'Lawn care, landscaping and patios done right, with free estimates and simple monthly plans.', 'Get an estimate', 'Booking spring now'],
      pt: 'What we do', items: [['Weekly Lawn Care', 'Mow, edge and blow', 'From $45', 'leaf'], ['Landscape Design', 'Plans, plants and install', 'Free estimate', 'brush'], ['Patios & Walkways', 'Stone and pavers that last', 'Free estimate', 'home'], ['Spring Cleanup', 'Beds, mulch and trimming', 'From $189', 'sun'], ['Irrigation', 'Install and repair', 'From $120', 'droplet'], ['Snow Removal', 'Seasonal contracts', 'From $40/visit', 'snowflake']],
      feats: [['Free estimates', 'Send photos, get a price.', 'camera'], ['Reliable crews', 'Same team, same day, every week.', 'users'], ['Easy billing', 'Pay online, auto-pay ready.', 'tag']],
      about: 'Family-run crews who take pride in clean lines and happy neighbors.', cta: ['Ready for a better yard?', 'Get my estimate'],
      app: ['Your yard, handled', 'Spring cleanup', 'Book by April for 10% off.', 'Book', ['Lawn', 'Design', 'Patios', 'Snow'], 'Services', 'Request service', 'Request', tabs({ label: 'Services', icon: 'leaf' }, { label: 'Book', icon: 'calendar' }, { label: 'Account', icon: 'user' }), 'My property'] }),
    cleaning: T({ name: 'Sparkle Pro Cleaning', style: 'clean', palette: P('#F5F9FF', '#FFFFFF', '#0F1E3A', '#2F6FED', '#33C3A5'), icon: 'sparkle', nav: ['Services', 'Pricing', 'Reviews', 'Book'],
      hero: ['Come home to a spotless house', 'Trusted, background-checked cleaners. Book online in 60 seconds.', 'Book a cleaning', 'Same-week openings'],
      pt: 'Cleaning services', items: [['Standard Clean', 'Kitchen, baths, floors, dusting', 'From $120', 'sparkle'], ['Deep Clean', 'Top to bottom, inside and out', 'From $220', 'star'], ['Move In / Move Out', 'Leave it spotless', 'From $260', 'truck'], ['Office Cleaning', 'Weekly or nightly service', 'Free quote', 'briefcase'], ['Window Washing', 'Inside and out', 'From $8/window', 'sun'], ['Carpet Cleaning', 'Steam clean and deodorize', 'From $99', 'droplet']],
      feats: [['Book online', 'Pick your day and time.', 'calendar'], ['Vetted pros', 'Insured and background-checked.', 'shield'], ['Happiness promise', 'Not right? We come back.', 'heart']],
      about: 'A local team that treats your home like their own, every single visit.', cta: ['Take cleaning off your list', 'Book now'],
      app: ['Need a clean?', 'First clean 20% off', 'New customers only.', 'Book', ['Home', 'Deep', 'Move', 'Office'], 'Services', 'Book a cleaning', 'Book', tabs({ label: 'Services', icon: 'sparkle' }, { label: 'Book', icon: 'calendar' }, { label: 'Me', icon: 'user' }), 'My cleanings'] }),
    auto: T({ name: 'Precision Auto Care', style: 'bold', palette: P('#101318', '#1B2029', '#F1F3F6', '#E63B2E', '#3B82F6'), icon: 'car', nav: ['Services', 'Specials', 'Book', 'Contact'],
      hero: ['Honest repairs. Done today.', 'Certified mechanics, upfront prices and updates by text while you wait.', 'Book service', 'Free inspection'],
      pt: 'Services', items: [['Oil Change', 'Synthetic, filter and top-off', '$59', 'droplet'], ['Brake Service', 'Pads, rotors, inspection', 'From $149', 'shield'], ['Check Engine Light', 'Diagnostic scan and report', '$49', 'bolt'], ['Tires & Alignment', 'Mount, balance, align', 'From $89', 'car'], ['A/C Repair', 'Cold air again fast', 'From $99', 'snowflake'], ['State Inspection', 'Quick and easy', '$35', 'check']],
      feats: [['Upfront pricing', 'Approve before we start.', 'tag'], ['Text updates', 'Photos and status sent to you.', 'chat'], ['12-month warranty', 'Parts and labor covered.', 'shield']],
      about: 'A local shop built on honest advice. We fix what you need and nothing you don’t.', cta: ['Car trouble? We’re ready.', 'Book now'],
      app: ['Keep it running', 'Oil change special', 'Synthetic for $49 this week.', 'Book', ['Repair', 'Tires', 'Oil', 'Inspect'], 'Popular services', 'Book service', 'Book', tabs({ label: 'Services', icon: 'wrench' }, { label: 'Book', icon: 'calendar' }, { label: 'Garage', icon: 'car' }), 'My vehicles'] }),
    photo: T({ name: 'Golden Hour Photography', style: 'elegant', palette: P('#F8F5F0', '#FFFFFF', '#211B16', '#A4643A', '#D8B178'), icon: 'camera', nav: ['Portfolio', 'Packages', 'About', 'Book'],
      hero: ['Moments worth keeping forever', 'Weddings, families and portraits captured in warm, natural light.', 'Check my date', 'Booking 2027 weddings'],
      pt: 'Packages', items: [['Wedding Day', '8 hours, 2 photographers, gallery', 'From $2,800', 'heart'], ['Engagement Session', '1 hour, 2 locations', '$450', 'gem'], ['Family Portraits', '45 minutes, 30 edited photos', '$325', 'users'], ['Senior Pictures', 'Outfit changes, fun locations', '$275', 'graduation'], ['Headshots', 'Clean, professional, fast', '$150', 'user'], ['Photo Album', 'Hand-bound heirloom book', 'From $400', 'book']],
      feats: [['Online galleries', 'Share and download easily.', 'globe'], ['Easy booking', 'Check dates and pay deposits.', 'calendar'], ['Fast delivery', 'Sneak peeks in 48 hours.', 'bolt']],
      about: 'Natural, joyful photos that look like you on your very best day.', cta: ['Let’s make something beautiful', 'Book a session'],
      app: ['Your memories', 'Fall mini sessions', '20 minutes, 10 photos, $175.', 'Book', ['Weddings', 'Family', 'Portraits', 'Albums'], 'Packages', 'Book a session', 'Book', tabs({ label: 'Gallery', icon: 'camera' }, { label: 'Book', icon: 'calendar' }, { label: 'Me', icon: 'user' }), 'My galleries'] }),
    boutique: T({ name: 'Willow & Thread', style: 'elegant', palette: P('#FBF7F4', '#FFFFFF', '#2A1F1D', '#8A5A44', '#D9A6A0'), icon: 'shirt', nav: ['New in', 'Shop', 'Lookbook', 'Visit'],
      hero: ['Pieces you’ll wear on repeat', 'Curated clothing and accessories from small makers. Free shipping over $75.', 'Shop new arrivals', 'New drop Friday'],
      pt: 'New arrivals', items: [['Linen Wrap Dress', 'Breezy, flattering, sizes XS-3X', '$78', 'shirt'], ['Everyday Tote', 'Vegan leather, fits a laptop', '$58', 'bag'], ['Gold Huggie Hoops', 'Hypoallergenic, 14k plated', '$34', 'gem'], ['Cozy Knit Cardigan', 'Soft, oversized, three colors', '$69', 'shirt'], ['Wide-Leg Trousers', 'High-rise, all-day comfort', '$72', 'shirt'], ['Gift Card', 'Let them choose', 'From $25', 'gift']],
      feats: [['Free shipping', 'On orders over $75.', 'truck'], ['Easy returns', '30 days, no questions.', 'heart'], ['Try in store', 'Reserve online, try it on.', 'pin']],
      about: 'A small shop with a big closet, picking pieces that make getting dressed fun again.', cta: ['Find your new favorite', 'Shop now'],
      app: ['Hey gorgeous', 'Weekend sale', '20% off all knits.', 'Shop', ['New', 'Dresses', 'Bags', 'Jewelry'], 'Just in', 'Reserve to try on', 'Reserve', tabs({ label: 'Shop', icon: 'bag' }, { label: 'Saved', icon: 'heart' }, { label: 'Me', icon: 'user' }), 'Style rewards'] }),
    pets: T({ name: 'Happy Paws Grooming', style: 'playful', palette: P('#FFF8EF', '#FFFFFF', '#2B1B10', '#F07A2A', '#4BB4C9'), icon: 'paw', nav: ['Services', 'Pricing', 'Gallery', 'Book'],
      hero: ['Clean, happy, tail-wagging pets', 'Gentle grooming by people who love animals. Book online in seconds.', 'Book grooming', 'Puppy cuts available'],
      pt: 'Grooming menu', items: [['Full Groom', 'Bath, haircut, nails, ears', 'From $65', 'paw'], ['Bath & Brush', 'Fresh and fluffy', 'From $40', 'droplet'], ['Puppy Intro', 'Gentle first visit', '$35', 'heart'], ['Nail Trim', 'Quick and calm', '$15', 'scissors'], ['De-Shed Treatment', 'Less fur on your couch', '$25', 'sparkle'], ['Teeth Brushing', 'Fresh breath add-on', '$10', 'smile']],
      feats: [['Online booking', 'Pick your groomer and time.', 'calendar'], ['Photo updates', 'See them mid-groom.', 'camera'], ['Gentle handling', 'Patient with nervous pets.', 'heart']],
      about: 'A cage-free grooming salon where every pet gets patience, treats and a little extra love.', cta: ['Treat your best friend', 'Book now'],
      app: ['Hi, pet parent!', 'Spa day special', 'Full groom + teeth $70.', 'Book', ['Dogs', 'Cats', 'Puppies', 'Add-ons'], 'Popular', 'Book grooming', 'Book', tabs({ label: 'Services', icon: 'paw' }, { label: 'Book', icon: 'calendar' }, { label: 'Pets', icon: 'heart' }), 'My pets'] }),
    tutoring: T({ name: 'BrightPath Tutoring', style: 'clean', palette: P('#F5F7FF', '#FFFFFF', '#14183A', '#4F46E5', '#F59E0B'), icon: 'graduation', nav: ['Subjects', 'Tutors', 'Pricing', 'Book'],
      hero: ['Confidence that shows up on report cards', 'One-on-one tutoring in person or online, matched to how your child learns.', 'Book a free session', 'Free first session'],
      pt: 'Subjects', items: [['Math Tutoring', 'Elementary through calculus', '$45/hr', 'chart'], ['Reading & Writing', 'Phonics, essays, comprehension', '$45/hr', 'book'], ['Science', 'Biology, chemistry, physics', '$50/hr', 'sparkle'], ['SAT & ACT Prep', 'Practice tests and strategy', '$60/hr', 'star'], ['Homework Help', 'Weekly accountability', '$35/hr', 'clock'], ['Study Skills', 'Organization and focus', '$40/hr', 'graduation']],
      feats: [['Matched tutors', 'Paired by subject and style.', 'users'], ['Progress reports', 'See growth every week.', 'chart'], ['Flexible times', 'After school and weekends.', 'calendar']],
      about: 'Certified teachers helping students catch up, keep up and get ahead.', cta: ['Let’s build some confidence', 'Book a session'],
      app: ['Ready to learn?', 'Exam prep week', 'Extra sessions available.', 'Book', ['Math', 'Reading', 'Science', 'Tests'], 'Subjects', 'Book a session', 'Book', tabs({ label: 'Learn', icon: 'book' }, { label: 'Book', icon: 'calendar' }, { label: 'Progress', icon: 'chart' }), 'Progress'] }),
    pro: T({ name: 'Summit Advisory Group', style: 'elegant', palette: P('#F6F7F9', '#FFFFFF', '#121A26', '#1E3A5F', '#B8925A'), icon: 'briefcase', nav: ['Services', 'Industries', 'About', 'Contact'],
      hero: ['Clear advice. Real results.', 'Accounting, tax and business advice for owners who want to grow with confidence.', 'Book a consultation', 'Now booking tax season'],
      pt: 'How we help', items: [['Bookkeeping', 'Monthly, accurate, on time', 'From $299/mo', 'book'], ['Tax Preparation', 'Business and personal', 'Free estimate', 'tag'], ['Payroll', 'Paid right, every time', 'From $99/mo', 'users'], ['Business Planning', 'Budgets, forecasts, strategy', 'Free consult', 'chart'], ['Business Formation', 'LLCs and setup done right', 'From $499', 'briefcase'], ['Advisory Retainer', 'A partner on call', 'Custom', 'shield']],
      feats: [['Secure client portal', 'Share documents safely.', 'shield'], ['Responsive team', 'Answers within one business day.', 'clock'], ['Plain-English advice', 'No jargon, just next steps.', 'chat']],
      about: 'A trusted team of advisors helping local businesses stay compliant and grow.', cta: ['Let’s talk about your goals', 'Book a call'],
      app: ['Welcome back', 'Tax deadline soon', 'Upload your documents.', 'Upload', ['Tax', 'Books', 'Payroll', 'Advice'], 'Services', 'Book a consult', 'Book', tabs({ label: 'Docs', icon: 'book' }, { label: 'Book', icon: 'calendar' }, { label: 'Account', icon: 'user' }), 'My account'] }),
    florist: T({ name: 'Petal & Stem', style: 'elegant', palette: P('#FCF7F6', '#FFFFFF', '#2C1E22', '#C0506E', '#7FA77A'), icon: 'leaf', nav: ['Shop', 'Weddings', 'Subscriptions', 'Visit'],
      hero: ['Flowers that say it for you', 'Hand-tied bouquets delivered same day. Weddings and events by appointment.', 'Send flowers', 'Same-day delivery'],
      pt: 'Bestsellers', items: [['Garden Bouquet', 'Seasonal blooms, hand-tied', '$65', 'leaf'], ['Dozen Roses', 'Classic red or blush', '$79', 'heart'], ['Sunshine Mix', 'Bright and cheerful', '$55', 'sun'], ['Monthly Flowers', 'A fresh bouquet every month', '$49/mo', 'gift'], ['Potted Orchid', 'Long-lasting and elegant', '$45', 'sparkle'], ['Wedding Florals', 'Bouquets to centerpieces', 'Free consult', 'gem']],
      feats: [['Same-day delivery', 'Order by 1 PM.', 'truck'], ['Hand-written cards', 'Your message, our pen.', 'chat'], ['Fresh guarantee', 'Lasts 7 days or we replace it.', 'heart']],
      about: 'A small studio arranging locally grown flowers for every reason to celebrate.', cta: ['Brighten someone’s day', 'Send flowers'],
      app: ['Who’s it for?', 'Mother’s Day', 'Pre-order and save 15%.', 'Shop', ['Bouquets', 'Roses', 'Plants', 'Events'], 'Bestsellers', 'Schedule delivery', 'Checkout', tabs({ label: 'Shop', icon: 'leaf' }, { label: 'Deliver', icon: 'truck' }, { label: 'Me', icon: 'user' }), 'My orders'] }),
    events: T({ name: 'Ever After Events', style: 'elegant', palette: P('#FAF6F2', '#FFFFFF', '#251D1B', '#9C6B53', '#D6B48C'), icon: 'gem', nav: ['Weddings', 'Events', 'Gallery', 'Contact'],
      hero: ['Celebrations without the stress', 'Full planning, day-of coordination and design for weddings and events.', 'Plan my event', 'Booking 2027'],
      pt: 'Planning packages', items: [['Full Planning', 'From first idea to last dance', 'From $4,500', 'gem'], ['Partial Planning', 'We pick up where you are', 'From $2,500', 'star'], ['Day-Of Coordination', 'Relax, we’ve got it', '$1,200', 'clock'], ['Corporate Events', 'Launches, galas, retreats', 'Custom', 'briefcase'], ['Event Design', 'Florals, lighting, decor', 'Custom', 'brush'], ['Birthday Parties', 'Milestones done right', 'From $800', 'gift']],
      feats: [['Planning portal', 'Timelines and vendors in one place.', 'calendar'], ['Trusted vendors', 'Our favorite local pros.', 'users'], ['Budget tracking', 'Know where every dollar goes.', 'chart']],
      about: 'Planners and designers who sweat the details so you can enjoy the day.', cta: ['Let’s start planning', 'Get in touch'],
      app: ['Countdown: 142 days', 'Tasks this week', 'Final tasting and invitations.', 'View', ['Timeline', 'Vendors', 'Budget', 'Guests'], 'Your plan', 'Book a meeting', 'Book', tabs({ label: 'Plan', icon: 'calendar' }, { label: 'Vendors', icon: 'users' }, { label: 'Budget', icon: 'chart' }), 'My event'] }),
    construction: T({ name: 'Ironclad Roofing & Construction', style: 'bold', palette: P('#F4F5F7', '#FFFFFF', '#14171C', '#D9480F', '#1E3A5F'), icon: 'home', nav: ['Services', 'Projects', 'Financing', 'Free estimate'],
      hero: ['Built right. Built to last.', 'Roofing, remodels and repairs from a licensed local crew. Free inspections and fair quotes.', 'Free estimate', 'Storm damage help'],
      pt: 'Services', items: [['Roof Replacement', 'Shingle, metal and flat roofs', 'Free estimate', 'home'], ['Roof Repair', 'Leaks fixed fast', 'From $350', 'wrench'], ['Kitchen Remodel', 'Design to final walkthrough', 'Free estimate', 'brush'], ['Bathroom Remodel', 'Showers, tile, vanities', 'Free estimate', 'droplet'], ['Gutters', 'Seamless install and guards', 'From $899', 'shield'], ['Storm Damage', 'Insurance claim help', 'Free inspection', 'bolt']],
      feats: [['Licensed & insured', 'Fully covered crews.', 'shield'], ['Financing available', 'Low monthly payments.', 'tag'], ['Workmanship warranty', '10 years on every roof.', 'star']],
      about: 'A local, family-owned crew building homes we’d be proud to live in.', cta: ['Storm damage or big plans?', 'Get my estimate'],
      app: ['Your project', 'Free roof inspection', 'Book this month.', 'Book', ['Roofing', 'Remodel', 'Repair', 'Storm'], 'Services', 'Schedule inspection', 'Book', tabs({ label: 'Services', icon: 'wrench' }, { label: 'Book', icon: 'calendar' }, { label: 'Project', icon: 'home' }), 'My project'] }),
    daycare: T({ name: 'Little Sprouts Learning Center', style: 'playful', palette: P('#FFFAF0', '#FFFFFF', '#1F2A3A', '#2BA36B', '#F4B63F'), icon: 'smile', nav: ['Programs', 'Our day', 'Tuition', 'Tour'],
      hero: ['Where little ones learn and grow', 'Safe, joyful early learning with daily photo updates for parents.', 'Book a tour', 'Now enrolling'],
      pt: 'Programs', items: [['Infants', '6 weeks to 12 months', 'Ask about tuition', 'heart'], ['Toddlers', '1 to 2 years', 'Ask about tuition', 'smile'], ['Preschool', '3 to 4 years, kindergarten ready', 'Ask about tuition', 'book'], ['Before & After School', 'Homework help and play', 'Ask about tuition', 'clock'], ['Summer Camp', 'Themed weeks, field trips', 'Weekly rates', 'sun'], ['Drop-In Care', 'When you need it', 'Daily rate', 'calendar']],
      feats: [['Daily photo updates', 'See their day in the app.', 'camera'], ['Secure check-in', 'Only approved pickups.', 'shield'], ['Healthy meals', 'Fresh snacks and lunches.', 'leaf']],
      about: 'Caring teachers, bright classrooms and a curriculum that makes learning feel like play.', cta: ['Come see us in person', 'Book a tour'],
      app: ['Hi, parents!', 'Today at Sprouts', 'Art day and a nature walk.', 'See photos', ['Photos', 'Meals', 'Naps', 'Notes'], 'Today', 'Book a tour', 'Book', tabs({ label: 'Day', icon: 'sun' }, { label: 'Photos', icon: 'camera' }, { label: 'Billing', icon: 'tag' }), 'My family'] }),
    music: T({ name: 'Harmony Music Lessons', style: 'playful', palette: P('#FBF8FF', '#FFFFFF', '#1E1533', '#7C3AED', '#F97316'), icon: 'music', nav: ['Lessons', 'Teachers', 'Recitals', 'Book'],
      hero: ['Learn the music you love', 'Private lessons for all ages and levels, in studio or online.', 'Book a trial lesson', 'First lesson free'],
      pt: 'Lessons', items: [['Piano', 'Beginner to advanced', '$40/30 min', 'music'], ['Guitar', 'Acoustic and electric', '$40/30 min', 'music'], ['Voice', 'Technique and confidence', '$45/30 min', 'chat'], ['Drums', 'Rhythm and groove', '$40/30 min', 'music'], ['Violin', 'Classical and fiddle', '$45/30 min', 'music'], ['Group Classes', 'Learn with friends', '$20/class', 'users']],
      feats: [['Easy scheduling', 'Reschedule in a tap.', 'calendar'], ['Practice tracker', 'Earn badges for practice.', 'star'], ['Recitals', 'Two shows a year.', 'heart']],
      about: 'Friendly teachers helping students of every age fall in love with making music.', cta: ['Your first lesson is on us', 'Book now'],
      app: ['Time to practice!', '7-day streak', 'Keep it going for a badge.', 'Practice', ['Piano', 'Guitar', 'Voice', 'Drums'], 'Lessons', 'Book a lesson', 'Book', tabs({ label: 'Lessons', icon: 'music' }, { label: 'Book', icon: 'calendar' }, { label: 'Progress', icon: 'star' }), 'My progress'] }),
    generic: T({ name: 'Your Business', style: 'clean', palette: P('#F6F8FB', '#FFFFFF', '#0F1B2D', '#2563EB', '#14B8A6'), icon: 'sparkle', nav: ['Services', 'About', 'Reviews', 'Contact'],
      hero: ['Make it easy to choose you', 'Everything your customers need to learn about you, book or buy, in one beautiful place.', 'Get started', 'Now booking'],
      pt: 'What we offer', items: [['Signature Service', 'Our most popular option', 'From $99', 'star'], ['Premium Package', 'Everything, done for you', 'From $249', 'gem'], ['Free Consultation', 'Talk through your needs', 'Free', 'chat'], ['Monthly Plan', 'Ongoing care and support', 'From $49/mo', 'calendar'], ['Gift Cards', 'Share something great', 'From $25', 'gift'], ['Custom Requests', 'Tell us what you need', 'Custom', 'sparkle']],
      feats: [['Book online', 'Any time, any device.', 'calendar'], ['Fast replies', 'Questions answered quickly.', 'chat'], ['Trusted locally', 'Real people, real service.', 'heart']],
      about: 'A local business built on quality work and treating every customer right.', cta: ['Ready when you are', 'Contact us'],
      app: ['Welcome!', 'This month’s special', 'Save 15% on your first visit.', 'Claim', ['Popular', 'New', 'Deals', 'More'], 'Popular', 'Book a time', 'Book', tabs({ label: 'Browse', icon: 'search' }, { label: 'Book', icon: 'calendar' }, { label: 'Me', icon: 'user' }), 'My account'] })
  };
  Object.assign(M.PRESETS, NEW);

  const KEYS = [
    ['barber', /barber|fade|beard/i], ['salon', /salon|hair|nail|spa\b|beauty|lash|brow|makeup|stylist|esthetic/i],
    ['pets', /\bpet|dog|cat\b|groom|vet|kennel|paw/i], ['dental', /dent|tooth|teeth|orthodon|clinic|medical|doctor|chiro|therap|health/i],
    ['coffee', /coffee|cafe|café|espresso|tea\b|juice|smoothie/i], ['cookie', /cookie|bake|bakery|baking|dessert|cake|cupcake|pastr|donut|sweet|candy|chocolate|brownie/i],
    ['foodtruck', /food truck|taco|truck|street food|bbq|barbecue/i], ['restaurant', /restaurant|kitchen|diner|pizza|burger|grill|bistro|catering|eatery|food/i],
    ['hvac', /hvac|heat|cool|air ?cond|furnace|plumb|electric|handyman|appliance/i], ['construction', /roof|construct|remodel|contractor|builder|renovat|gutter|carpent/i],
    ['landscaping', /landscap|lawn|garden|yard|tree|snow removal|mow/i], ['cleaning', /clean|maid|janitor|pressure wash|carpet/i],
    ['auto', /auto|car\b|cars\b|mechanic|tire|detail|garage|vehicle/i], ['realestate', /real estate|realtor|realty|homes?\b|propert|rental|mortgage/i],
    ['photo', /photo|video|film|portrait/i], ['events', /wedding|event|party|planner|venue|dj\b/i], ['florist', /flower|florist|floral/i],
    ['boutique', /boutique|cloth|apparel|fashion|jewel|store|shop|retail|candle|soap|craft/i], ['fitness', /fitness|gym|coach|train|yoga|pilates|workout|wellness|nutrition|martial|dance/i],
    ['tutoring', /tutor|school|educat|lesson|teach|course|class|academy|learn/i], ['music', /music|piano|guitar|voice|drum|band|sing/i],
    ['daycare', /daycare|day care|child ?care|preschool|nanny|kids/i], ['church', /church|ministry|faith|worship|nonprofit|non-profit|charity|community|club/i],
    ['pro', /account|tax|law|lawyer|attorney|legal|consult|insurance|financ|advis|agency|marketing|bookkeep/i]
  ];
  M.closest = function (text) { for (const [k, re] of KEYS) if (re.test(text || '')) return k; return 'generic'; };

  const cap = s => s.replace(/(^|\s)([a-z])/g, (m, a, c) => a + c.toUpperCase());
  function nameFrom(text, fallback) {
    let t = String(text || '').trim().replace(/[.!?]+$/, '');
    const m = t.match(/\b(?:for|called|named)\s+(?:my|our|a|an|the)?\s*(.+)$/i);
    if (m) t = m[1];
    t = t.replace(/^(?:an?|my|our|the)\s+/i, '').replace(/^(?:online\s+)?(?:website|site|web site|app|mobile app|application|store|online store)\s+(?:for|of)\s+/i, '');
    t = t.replace(/\b(?:website|web site|mobile app|app|online store)\b/ig, '').replace(/\s{2,}/g, ' ').trim();
    if (!t || t.split(' ').length > 4) return fallback;
    return cap(t);
  }
  M.instant = function (business, goal, feel) {
    const k = M.closest(business + ' ' + (goal || ''));
    const d = JSON.parse(JSON.stringify(M.PRESETS[k]));
    d.name = nameFrom(business, d.name);
    const th = M.THEMES[M.FEELS[feel]];
    if (th) { d.palette = Object.assign({}, th.palette); d.style = th.style; }
    return { data: d, industry: k };
  };
  // full editable copy of a design (fills any gaps so live edits never lose content)
  M.full = function (raw) {
    const n = M.normalize(raw);
    return { name: n.name, style: n.style, palette: { bg: n.pal.bg, surface: n.pal.surface, text: n.pal.text, accent: n.pal.accent, accent2: n.pal.accent2 }, logoIcon: n.logoIcon, nav: n.nav, hero: n.hero, productsTitle: n.productsTitle, products: n.products, features: n.features, about: n.about, ctaBand: n.ctaBand, app: n.app };
  };
})();
