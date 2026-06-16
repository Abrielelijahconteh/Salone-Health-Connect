# Salone-Health-Connect
**Salone Health Connect**

A professional Digital Public Good (DPG) healthcare platform for Sierra Leone, improving access to healthcare information, clinics, health education, emergency alerts, and community health resources.

**Project Overview**

Salone Health Connect is a comprehensive healthcare platform designed to serve the citizens of Sierra Leone by providing:
- Access to healthcare facility information
- Health education resources
- Emergency alerts and notifications
- Community health support
- Digital healthcare services

**SDG Alignment**

- **SDG 3**: Good Health and Well-being
- **SDG 9**: Industry, Innovation and Infrastructure
- **SDG 10**: Reduced Inequalities

**Project Structure**

```
HealthConnect/
├── css/
│   └── styles.css          # Main stylesheet with modern design system
├── js/
│   └── main.js             # JavaScript with authentication and utilities
├── images/                 # Placeholder for healthcare images
├── index.html              # Home page
├── signup.html             # User registration
├── login.html              # User login
├── dashboard.html          # User dashboard
├── clinics.html            # Clinics directory
├── clinic-details.html     # Individual clinic information
├── education.html          # Health education center
├── article-details.html    # Health article details
├── alerts.html             # Emergency alerts
├── contact.html            # Contact support
├── about.html              # About page
├── testimonials.html       # User testimonials
├── faq.html                # Frequently asked questions
└── README.md               # Project documentation
```

**Features**

**Authentication System**
- **Sign Up**: Full registration with validation
- **Login**: Email/password authentication with "Remember Me" option
- **Guest Access**: Browse platform without registration
- **Logout**: Secure session termination
- **Local Storage**: User data stored locally for privacy

**Pages & Functionality**

**1. Home Page (`index.html`)**
- Modern hero section with call-to-action buttons
- Animated health statistics counter
- Services overview with glassmorphism cards
- Featured clinics section
- User testimonials carousel
- FAQ accordion
- Newsletter subscription form
- Dark mode toggle
- Responsive navigation

**2. Dashboard (`dashboard.html`)**
- Personalized welcome message
- Quick access cards to main features
- Healthcare statistics overview
- Recent activity feed
- Health announcements
- Emergency notices
- Logout functionality

**3. Clinics Directory (`clinics.html`)**
- Search functionality (by name, location)
- Filter by district
- Clinic cards with images and details
- 8 featured clinics across Sierra Leone
- View Details buttons for each clinic

**4. Clinic Details (`clinic-details.html`)**
- Full clinic information
- Contact details and hours
- Services offered
- Location information
- Contact button
- Back to directory navigation

**5. Health Education Center (`education.html`)**
- 8 health categories
- Search functionality
- Category filters
- Article cards with images
- Read More buttons
- 8 comprehensive health articles

**6. Article Details (`article-details.html`)**
- Full article content
- Related articles section
- Back to education center
- Category tags

**7. Emergency Alerts (`alerts.html`)**
- Active health alerts
- Disease outbreak notifications
- Vaccination campaign alerts
- Emergency contact numbers (117, 119, 112)
- Filter by alert type

**8. Contact Support (`contact.html`)**
- Contact form with validation
- Contact information cards
- Google Maps integration
- Support hours
- Form submission with success notification

**9. About Page (`about.html`)**
- Mission and vision
- SDG alignment details
- Project goals
- Impact statistics
- Team section

**10. Testimonials (`testimonials.html`)**
- User testimonials
- Healthcare worker feedback
- Patient success stories
- Share your story CTA

**11. FAQ Page (`faq.html`)**
- Search functionality
- Expand/collapse accordion
- 10 comprehensive FAQs
- Contact support CTA

**Design Features**

- **Modern UI/UX**: Professional healthcare startup design
- **Glassmorphism**: Frosted glass card effects
- **Gradients**: Beautiful color transitions
- **Animations**: Smooth hover effects and transitions
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first design (Desktop, Tablet, Mobile)
- **Professional Typography**: Clean, readable fonts
- **Color Palette**: Primary Blue, Teal, Green accents

**Technology Stack**

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **Vanilla JavaScript**: No frameworks required
- **Local Storage**: For authentication and user data
- **Responsive Design**: Mobile-first approach

*How to Use*

**Installation**
1. Clone or download the project
2. Open `index.html` in a web browser 
3. use live server extension

**Authentication**
1. Click "Sign Up" to create an account
2. Fill in your details (name, email, phone, password)
3. Or click "Login" if you already have an account
4. Or continue as "Guest" for limited access

**Navigation**
- Use the navigation bar to access different pages
- All links are functional and properly routed
- Mobile menu available on smaller screens

**Key Features**
- **Dark Mode**: Click the moon/sun icon in the navbar
- **Search**: Use search bars in Clinics, Education, and FAQ pages
- **Filters**: Use filter buttons to narrow down results
- **Forms**: All forms include validation and success notifications

**Data Included**

**Clinics (8 facilities)**
- Connaught Hospital (Western Area)
- Bo Government Hospital (Bo)
- Makeni Regional Hospital (Bombali)
- Kenema Government Hospital (Kenema)
- Lumley Government Hospital (Western Area)
- Koidu Government Hospital (Kono)
- Port Loko Government Hospital (Port Loko)
- Waterloo Health Centre (Western Area)

**Health Articles (8 categories)**
- Malaria Prevention
- Maternal Health
- Child Health
- Nutrition
- Hygiene & Sanitation
- Mental Health
- Vaccination
- First Aid

**Emergency Alerts (5 active)**
- Malaria Prevention Campaign
- Cholera Prevention Alert
- COVID-19 Vaccination Drive
- Maternal Health Campaign
- Measles Vaccination Campaign

**Testimonials (4 user + 2 healthcare workers)**
- User reviews and success stories
- Healthcare worker feedback
- Patient testimonials

**FAQs (10 questions)**
- Platform information
- Service details
- Technical support
- Privacy and security

**Security & Privacy**

- All user data stored locally in browser
- No data sent to external servers
- Password validation (minimum 6 characters)
- Email validation
- Session management with Local Storage and Session Storage

**Browser Compatibility**

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

**Responsive Breakpoints**

- **Desktop**: 1200px and above
- **Laptop**: 992px - 1199px
- **Tablet**: 768px - 991px
- **Mobile**: Below 768px

**Key JavaScript Features**

- **Auth Module**: Complete authentication system
- **Toast Notifications**: User feedback messages
- **Dark Mode**: Theme switching
- **Form Validation**: Client-side validation
- **Search & Filter**: Dynamic content filtering
- **Animated Counters**: Statistics animation
- **Accordion**: FAQ expand/collapse
- **Smooth Scroll**: Navigation effects
- **Mobile Menu**: Responsive navigation

**Deployment**

This is a static website that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service
- Local file system

Simply upload the files and the site will work immediately.

**Customization**

**Changing Colors**
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-blue: #2563eb;
    --teal: #14b8a6;
    --green: #22c55e;
    /* ... more variables */
}
```

**Adding Content**
Edit the `Storage` object in `js/main.js` to add:
- More clinics
- More articles
- More alerts
- More testimonials
- More FAQs

**Modifying Pages**
Each HTML file is self-contained and can be edited independently.

**Contributing**

This is a Digital Public Good project. Contributions are welcome to:
- Add more healthcare facilities
- Expand health education content
- Improve accessibility
- Add new features
- Translate to local languages

**License**

This is a Digital Public Good (DPG) for Sierra Leone. Free to use, modify, and distribute for public health purposes.

**Acknowledgments**

- Designed for the people of Sierra Leone
- Aligned with UN Sustainable Development Goals
- Built as a contribution to digital public goods
- Supporting healthcare access and education

**Support**

For questions or support:
- Email: info@salonehealth.sl
- Phone: +232 752 68 222
- Emergency: 117


**Salone Health Connect** 
Improving healthcare access through digital innovation in Sierra Leone.
