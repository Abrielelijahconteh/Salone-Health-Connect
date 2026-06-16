/* ============================================
   SALONE HEALTH CONNECT - Main JavaScript
   Modern Healthcare Platform for Sierra Leone
   ============================================ */

// ==================== AUTHENTICATION SYSTEM ====================

const Auth = {
    // Register new user
    register: function(userData) {
        try {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('salone_users')) || [];
            
            // Check if email already exists
            const emailExists = users.some(user => user.email === userData.email);
            if (emailExists) {
                return { success: false, message: 'Email already registered' };
            }
            
            // Add new user
            userData.id = Date.now();
            userData.createdAt = new Date().toISOString();
            users.push(userData);
            
            // Save to localStorage
            localStorage.setItem('salone_users', JSON.stringify(users));
            
            return { success: true, message: 'Registration successful' };
        } catch (error) {
            return { success: false, message: 'Registration failed' };
        }
    },
    
    // Login user
    login: function(email, password, rememberMe = false) {
        try {
            const users = JSON.parse(localStorage.getItem('salone_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Create session
                const session = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                };
                
                // Save session
                if (rememberMe) {
                    localStorage.setItem('salone_session', JSON.stringify(session));
                } else {
                    sessionStorage.setItem('salone_session', JSON.stringify(session));
                }
                
                return { success: true, message: 'Login successful', user: session };
            } else {
                return { success: false, message: 'Invalid email or password' };
            }
        } catch (error) {
            return { success: false, message: 'Login failed' };
        }
    },
    
    // Guest access
    guestAccess: function() {
        try {
            const session = {
                id: 'guest',
                name: 'Guest User',
                email: 'guest@salonehealth.sl',
                phone: '',
                isLoggedIn: true,
                isGuest: true,
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('salone_session', JSON.stringify(session));
            return { success: true, message: 'Guest access granted', user: session };
        } catch (error) {
            return { success: false, message: 'Guest access failed' };
        }
    },
    
    // Logout user
    logout: function() {
        try {
            localStorage.removeItem('salone_session');
            sessionStorage.removeItem('salone_session');
            return { success: true, message: 'Logout successful' };
        } catch (error) {
            return { success: false, message: 'Logout failed' };
        }
    },
    
    // Get current user
    getCurrentUser: function() {
        try {
            let session = localStorage.getItem('salone_session') || sessionStorage.getItem('salone_session');
            if (session) {
                return JSON.parse(session);
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    // Check if user is logged in
    isLoggedIn: function() {
        const user = this.getCurrentUser();
        return user !== null && user.isLoggedIn;
    },
    
    // Update user profile
    updateProfile: function(userData) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser || currentUser.isGuest) {
                return { success: false, message: 'Cannot update guest profile' };
            }
            
            const users = JSON.parse(localStorage.getItem('salone_users')) || [];
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...userData };
                localStorage.setItem('salone_users', JSON.stringify(users));
                
                // Update session
                const session = { ...currentUser, ...userData };
                if (localStorage.getItem('salone_session')) {
                    localStorage.setItem('salone_session', JSON.stringify(session));
                } else {
                    sessionStorage.setItem('salone_session', JSON.stringify(session));
                }
                
                return { success: true, message: 'Profile updated successfully' };
            }
            
            return { success: false, message: 'User not found' };
        } catch (error) {
            return { success: false, message: 'Profile update failed' };
        }
    }
};

// ==================== TOAST NOTIFICATIONS ====================

const Toast = {
    show: function(message, type = 'info', duration = 3000) {
        // Create toast container if it doesn't exist
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${this.getIcon(type)}</span>
            <span>${message}</span>
        `;
        
        // Add to container
        container.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    },
    
    getIcon: function(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    },
    
    success: function(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error: function(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning: function(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    info: function(message, duration) {
        this.show(message, 'info', duration);
    }
};

// ==================== DARK MODE ====================

const DarkMode = {
    init: function() {
        // Check for saved preference
        const savedTheme = localStorage.getItem('salone_theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
        
        // Add toggle button to navbar
        this.addToggleButton();
    },
    
    addToggleButton: function() {
        const navbarActions = document.querySelector('.navbar-actions');
        if (navbarActions) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'dark-mode-toggle';
            toggleBtn.innerHTML = this.getIcon();
            toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
            toggleBtn.addEventListener('click', () => this.toggle());
            navbarActions.appendChild(toggleBtn);
        }
    },
    
    toggle: function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('salone_theme', newTheme);
        
        // Update icon
        const toggleBtn = document.querySelector('.dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = this.getIcon();
        }
        
        Toast.show(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`, 'info', 2000);
    },
    
    getIcon: function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        return currentTheme === 'dark' ? '☀️' : '🌙';
    }
};

// ==================== FORM VALIDATION ====================

const Validator = {
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone: function(phone) {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    },
    
    validatePassword: function(password) {
        return password.length >= 6;
    },
    
    validateRequired: function(value) {
        return value && value.trim().length > 0;
    },
    
    validateForm: function(form) {
        const errors = {};
        let isValid = true;
        
        const formData = new FormData(form);
        
        for (let [name, value] of formData.entries()) {
            const field = form.querySelector(`[name="${name}"]`);
            if (!field) continue;
            
            const isRequired = field.hasAttribute('required');
            const fieldType = field.type;
            const fieldName = field.name;
            
            if (isRequired && !this.validateRequired(value)) {
                errors[fieldName] = 'This field is required';
                isValid = false;
                continue;
            }
            
            if (fieldType === 'email' && value && !this.validateEmail(value)) {
                errors[fieldName] = 'Please enter a valid email address';
                isValid = false;
            }
            
            if (fieldType === 'tel' && value && !this.validatePhone(value)) {
                errors[fieldName] = 'Please enter a valid phone number';
                isValid = false;
            }
            
            if (fieldName === 'password' && value && !this.validatePassword(value)) {
                errors[fieldName] = 'Password must be at least 6 characters';
                isValid = false;
            }
            
            if (fieldName === 'confirmPassword') {
                const password = formData.get('password');
                if (value !== password) {
                    errors[fieldName] = 'Passwords do not match';
                    isValid = false;
                }
            }
        }
        
        return { isValid, errors };
    },
    
    showErrors: function(form, errors) {
        // Clear existing errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
            el.style.borderColor = '';
        });
        
        // Show new errors
        for (let [fieldName, message] of Object.entries(errors)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.style.borderColor = '#ef4444';
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = '#ef4444';
                errorDiv.style.fontSize = '0.875rem';
                errorDiv.style.marginTop = '0.25rem';
                errorDiv.textContent = message;
                
                field.parentNode.appendChild(errorDiv);
            }
        }
    }
};

// ==================== ANIMATED COUNTERS ====================

const Counter = {
    animate: function(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    },
    
    init: function() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.textContent.replace(/,/g, ''));
                    if (!isNaN(target)) {
                        this.animate(entry.target, target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
};

// ==================== FAQ ACCORDION ====================

const Accordion = {
    init: function() {
        const headers = document.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all items
                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
};

// ==================== SEARCH FUNCTIONALITY ====================

const Search = {
    init: function(inputSelector, itemSelector, textSelector) {
        const searchInput = document.querySelector(inputSelector);
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = document.querySelectorAll(itemSelector);
            
            items.forEach(item => {
                const text = item.querySelector(textSelector)?.textContent.toLowerCase() || '';
                const isVisible = text.includes(query);
                item.style.display = isVisible ? '' : 'none';
            });
        });
    },
    
    filter: function(items, query) {
        const lowerQuery = query.toLowerCase();
        return items.filter(item => {
            const text = item.textContent.toLowerCase();
            return text.includes(lowerQuery);
        });
    }
};

// ==================== FILTER FUNCTIONALITY ====================

const Filter = {
    init: function(buttonSelector, itemSelector, categoryAttribute) {
        const buttons = document.querySelectorAll(buttonSelector);
        const items = document.querySelectorAll(itemSelector);
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                items.forEach(item => {
                    if (filter === 'all' || item.dataset[categoryAttribute] === filter) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
};

// ==================== SMOOTH SCROLL ====================

const SmoothScroll = {
    init: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// ==================== MOBILE MENU ====================

const MobileMenu = {
    init: function() {
        const toggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.navbar-nav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                    nav.classList.remove('active');
                }
            });
        }
    }
};

// ==================== DATA STORAGE ====================

const Storage = {
    // Clinics data
    clinics: [
        {
            id: 1,
            name: 'Connaught Hospital',
            district: 'Western Area',
            address: '1 Siaka Stevens Street, Freetown',
            phone: '+232 75 26 82 22',
            hours: '24/7 Emergency',
            services: ['Emergency Care', 'Surgery', 'Maternity', 'Pediatrics', 'Laboratory'],
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
            description: 'Sierra Leone\'s largest referral hospital providing comprehensive healthcare services.'
        },
        {
            id: 2,
            name: 'Bo Government Hospital',
            district: 'Bo',
            address: 'Bo City, Southern Province',
            phone: '+232 74 91 41 07',
            hours: '8:00 AM - 8:00 PM',
            services: ['General Medicine', 'Surgery', 'Maternity', 'Outpatient'],
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
            description: 'Major government hospital serving the Southern Province with quality healthcare.'
        },
        {
            id: 3,
            name: 'Makeni Regional Hospital',
            district: 'Bombali',
            address: 'Makeni, Northern Province',
            phone: '+232 44 567 890',
            hours: '24/7 Emergency',
            services: ['Emergency Care', 'Surgery', 'Maternity', 'Pediatrics'],
            image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
            description: 'Regional hospital providing essential healthcare services to Northern Province.'
        },
        {
            id: 4,
            name: 'Kenema Government Hospital',
            district: 'Kenema',
            address: 'Kenema, Eastern Province',
            phone: '+232 65 432 100',
            hours: '8:00 AM - 6:00 PM',
            services: ['General Medicine', 'Maternity', 'Outpatient', 'Laboratory'],
            image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400',
            description: 'Government hospital serving the Eastern Province with comprehensive medical care.'
        },
        {
            id: 5,
            name: 'Lumley Government Hospital',
            district: 'Western Area',
            address: 'Lumley, Freetown',
            phone: '+232 76 345 678',
            hours: '8:00 AM - 10:00 PM',
            services: ['General Medicine', 'Maternity', 'Pediatrics', 'Emergency'],
            image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400',
            description: 'Community hospital providing accessible healthcare to Western Area residents.'
        },
        {
            id: 6,
            name: 'Koidu Government Hospital',
            district: 'Kono',
            address: 'Koidu City, Kono District',
            phone: '+232 88 789 012',
            hours: '8:00 AM - 6:00 PM',
            services: ['General Medicine', 'Surgery', 'Maternity', 'Emergency'],
            image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400',
            description: 'Government hospital serving the Kono District with essential healthcare services.'
        },
        {
            id: 7,
            name: 'Port Loko Government Hospital',
            district: 'Port Loko',
            address: 'Port Loko Town',
            phone: '+232 77 234 567',
            hours: '24/7 Emergency',
            services: ['Emergency Care', 'General Medicine', 'Maternity', 'Outpatient'],
            image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
            description: 'District hospital providing emergency and general healthcare services.'
        },
        {
            id: 8,
            name: 'Waterloo Health Centre',
            district: 'Western Area',
            address: 'Waterloo, Freetown',
            phone: '+232 79 890 123',
            hours: '8:00 AM - 5:00 PM',
            services: ['Primary Care', 'Maternity', 'Child Health', 'Immunization'],
            image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=400',
            description: 'Community health centre providing primary healthcare services.'
        }
    ],
    
    // Health education articles
    articles: [
        {
            id: 1,
            title: 'Malaria Prevention: Protect Your Family',
            category: 'Malaria Prevention',
            excerpt: 'Learn effective strategies to prevent malaria and protect your family from this deadly disease.',
            content: `Malaria remains one of the most significant health challenges in Sierra Leone. However, with proper prevention measures, we can significantly reduce its impact.

Key Prevention Strategies:

1. Use Insecticide-Treated Nets (ITNs): Sleep under a mosquito net every night, especially during rainy season when mosquito populations are highest.

2. Eliminate Standing Water: Mosquitoes breed in stagnant water. Regularly empty containers, clean gutters, and ensure proper drainage around your home.

3. Apply Repellent: Use mosquito repellent on exposed skin, particularly during evening hours when mosquitoes are most active.

4. Wear Protective Clothing: Wear long-sleeved shirts and long pants, especially at night.

5. Indoor Residual Spraying: Support government spraying campaigns to reduce mosquito populations in communities.

6. Seek Early Treatment: If you experience fever, headache, or chills, seek medical attention immediately. Early treatment saves lives.

Remember: Prevention is better than cure. Together, we can reduce the burden of malaria in our communities.`,
            image: 'https://images.unsplash.com/photo-1576093529109-59ba86c5a3b4?w=600',
            date: '2024-01-15'
        },
        {
            id: 2,
            title: 'Maternal Health: Ensuring Safe Motherhood',
            category: 'Maternal Health',
            excerpt: 'Essential information for expectant mothers to ensure a healthy pregnancy and safe delivery.',
            content: `Every mother deserves access to quality maternal healthcare. Here's what you need to know for a healthy pregnancy.

Prenatal Care:

- Attend at least 4 antenatal care visits during pregnancy
- Take iron and folic acid supplements as prescribed
- Sleep under a mosquito net to prevent malaria
- Eat a balanced diet rich in nutrients
- Stay physically active with moderate exercise

Warning Signs:

Seek immediate medical attention if you experience:
- Vaginal bleeding
- Severe headache
- Blurred vision
- Severe abdominal pain
- Reduced fetal movements

Delivery Planning:

- Identify a health facility for delivery
- Prepare emergency transport
- Save money for delivery costs
- Have a birth companion ready

Postnatal Care:

- Attend postnatal check-ups within 48 hours after delivery
- Practice exclusive breastfeeding for the first 6 months
- Ensure immunization for your newborn
- Seek family planning counseling

Remember: Skilled birth attendance significantly reduces maternal and newborn mortality.`,
            image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
            date: '2024-01-10'
        },
        {
            id: 3,
            title: 'Child Health: Nutrition and Development',
            category: 'Child Health',
            excerpt: 'Guide to ensuring optimal growth and development for children under five.',
            content: `Proper nutrition and healthcare in the first five years are crucial for a child's lifelong health and development.

Essential Nutrition:

- Exclusive breastfeeding for the first 6 months
- Introduction of complementary foods at 6 months
- Continued breastfeeding until 2 years or beyond
- Diverse diet including fruits, vegetables, proteins
- Regular meals and snacks for growing children

Growth Monitoring:

- Regular weight and height measurements
- Growth chart monitoring at health facilities
- Early detection of malnutrition
- Vitamin A supplementation every 6 months

Immunization Schedule:

- BCG at birth
- Pentavalent vaccine at 6, 10, and 14 weeks
- Polio vaccine at 6, 10, and 14 weeks
- Measles vaccine at 9 months
- Yellow fever vaccine at 9 months

Common Childhood Illnesses:

- Recognize danger signs: difficulty breathing, lethargy, poor feeding
- Seek immediate care for these symptoms
- Complete full course of prescribed medications
- Maintain hydration during illness

Remember: Healthy children become healthy adults. Invest in your child's health today.`,
            image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600',
            date: '2024-01-08'
        },
        {
            id: 4,
            title: 'Nutrition: Building Healthy Communities',
            category: 'Nutrition',
            excerpt: 'Understanding proper nutrition for overall health and disease prevention.',
            content: `Good nutrition is the foundation of health. A balanced diet strengthens immunity and prevents disease.

Food Groups:

1. Carbohydrates: Rice, cassava, yams - provide energy
2. Proteins: Fish, beans, eggs, meat - build and repair tissues
3. Vitamins: Fruits, vegetables - boost immunity
4. Minerals: Dark leafy greens, nuts - support body functions

Balanced Diet Principles:

- Eat a variety of foods from all groups
- Include plenty of fruits and vegetables
- Choose whole grains over refined ones
- Limit sugar and salt intake
- Stay hydrated with clean water

Special Groups:

- Children need more protein for growth
- Pregnant women need iron and folic acid
- Elderly need calcium for bone health
- Sick individuals need nutrient-rich foods

Food Safety:

- Wash hands before handling food
- Cook food thoroughly
- Store food properly
- Use clean water for cooking
- Avoid expired or contaminated food

Remember: You are what you eat. Make every meal count towards better health.`,
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
            date: '2024-01-05'
        },
        {
            id: 5,
            title: 'Hygiene & Sanitation: Preventing Disease',
            category: 'Hygiene & Sanitation',
            excerpt: 'Simple hygiene practices that can prevent the spread of deadly diseases.',
            content: `Good hygiene and sanitation practices are among the most effective ways to prevent disease transmission.

Hand Washing:

- Wash hands with soap and water before eating
- Wash after using the toilet
- Wash after changing diapers
- Wash after handling animals
- Use alcohol-based sanitizer when soap unavailable

Safe Water:

- Drink only treated or boiled water
- Store water in clean containers
- Protect water sources from contamination
- Use water purification tablets when necessary

Sanitation:

- Use proper toilet facilities
- Keep living areas clean
- Dispose of waste properly
- Control pests and rodents
- Maintain clean food preparation areas

Personal Hygiene:

- Bathe regularly with soap
- Keep fingernails short and clean
- Wash clothes regularly
- Maintain oral hygiene
- Keep hair clean and groomed

Environmental Hygiene:

- Keep surroundings clean
- Proper garbage disposal
- Drain stagnant water
- Maintain clean markets and public spaces

Remember: Clean hands save lives. Practice good hygiene every day.`,
            image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600',
            date: '2024-01-03'
        },
        {
            id: 6,
            title: 'Mental Health: Breaking the Stigma',
            category: 'Mental Health',
            excerpt: 'Understanding mental health and seeking help when needed.',
            content: `Mental health is as important as physical health. It's time to break the stigma and seek support.

Common Mental Health Issues:

- Depression: Persistent sadness, loss of interest
- Anxiety: Excessive worry, restlessness
- Stress: Overwhelming pressure, difficulty coping
- Trauma: Response to distressing events

Warning Signs:

- Changes in sleep or appetite
- Withdrawal from social activities
- Difficulty concentrating
- Mood swings or irritability
- Physical symptoms without clear cause

Seeking Help:

- Talk to trusted friends or family
- Visit a healthcare provider
- Access counseling services
- Join support groups
- Practice self-care

Self-Care Strategies:

- Regular physical exercise
- Adequate sleep (7-8 hours)
- Healthy eating
- Stress management techniques
- Maintaining social connections

Community Support:

- Support those struggling
- Listen without judgment
- Encourage professional help
- Create supportive environments
- Educate about mental health

Remember: Mental health matters. Seeking help is a sign of strength, not weakness.`,
            image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=600',
            date: '2024-01-01'
        },
        {
            id: 7,
            title: 'Vaccination: Protecting Our Communities',
            category: 'Vaccination',
            excerpt: 'Understanding the importance of vaccines for disease prevention.',
            content: `Vaccines are among the most effective public health interventions, saving millions of lives annually.

How Vaccines Work:

- Introduce weakened or inactive pathogens
- Stimulate immune system response
- Create memory cells for future protection
- Prevent disease without causing illness

Essential Vaccines:

1. BCG: Protects against tuberculosis
2. Polio: Prevents paralysis
3. Pentavalent: Diphtheria, pertussis, tetanus, hepatitis B, Hib
4. Measles: Prevents measles infection
5. Yellow Fever: Prevents yellow fever
6. COVID-19: Protects against coronavirus

Vaccination Schedule:

- Follow national immunization schedule
- Keep vaccination records
- Attend all recommended doses
- Get booster shots as needed

Vaccine Safety:

- Vaccines undergo rigorous testing
- Side effects are usually mild
- Benefits far outweigh risks
- Report any adverse reactions

Community Protection:

- Herd immunity protects vulnerable populations
- High vaccination rates prevent outbreaks
- Protect those who cannot be vaccinated
- Contribute to public health

Remember: Vaccines save lives. Ensure you and your family are fully vaccinated.`,
            image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600',
            date: '2023-12-28'
        },
        {
            id: 8,
            title: 'First Aid: Essential Life-Saving Skills',
            category: 'First Aid',
            excerpt: 'Basic first aid techniques everyone should know.',
            content: `Knowing basic first aid can save lives in emergency situations.

CPR (Cardiopulmonary Resuscitation):

1. Check responsiveness and breathing
2. Call for emergency help
3. Begin chest compressions
4. Push hard and fast in center of chest
5. Continue until help arrives

Choking:

- Perform Heimlich maneuver
- Stand behind person, wrap arms around waist
- Make fist above navel, grasp with other hand
- Pull upward and inward
- Repeat until object dislodges

Bleeding Control:

- Apply direct pressure with clean cloth
- Elevate injured area if possible
- Do not remove embedded objects
- Seek medical attention for severe bleeding

Burns:

- Cool burn with running water
- Cover with clean, non-stick bandage
- Do not apply ice or butter
- Seek medical care for severe burns

Fractures:

- Immobilize injured area
- Apply splint if available
- Do not attempt to realign bone
- Seek immediate medical attention

Shock:

- Lay person down, elevate legs
- Keep warm with blanket
- Do not give food or drink
- Monitor breathing and consciousness

Remember: Quick action saves lives. Learn first aid and be prepared.`,
            image: 'https://images.unsplash.com/photo-1544525220-77df5303fe24?w=600',
            date: '2023-12-25'
        }
    ],
    
    // Emergency alerts
    alerts: [
        {
            id: 1,
            title: 'Malaria Prevention Campaign',
            type: 'campaign',
            urgency: 'normal',
            content: 'Free mosquito net distribution ongoing at all health centers. Visit your nearest clinic to collect your net.',
            date: '2024-01-15',
            endDate: '2024-02-28'
        },
        {
            id: 2,
            title: 'Cholera Prevention Alert',
            type: 'outbreak',
            urgency: 'urgent',
            content: 'Cholera cases reported in Western Area. Boil drinking water, practice good hygiene, and seek immediate medical attention for severe diarrhea.',
            date: '2024-01-10',
            endDate: '2024-02-15'
        },
        {
            id: 3,
            title: 'COVID-19 Vaccination Drive',
            type: 'vaccination',
            urgency: 'normal',
            content: 'COVID-19 booster shots available at all government hospitals. Bring your vaccination card.',
            date: '2024-01-05',
            endDate: '2024-03-31'
        },
        {
            id: 4,
            title: 'Maternal Health Campaign',
            type: 'campaign',
            urgency: 'normal',
            content: 'Free antenatal care services available. Pregnant women should attend at least 4 check-ups during pregnancy.',
            date: '2024-01-01',
            endDate: '2024-06-30'
        },
        {
            id: 5,
            title: 'Measles Vaccination Campaign',
            type: 'vaccination',
            urgency: 'urgent',
            content: 'Emergency measles vaccination campaign for children 6-59 months. Visit nearest health center immediately.',
            date: '2024-01-12',
            endDate: '2024-01-31'
        }
    ],
    
    // Testimonials
    testimonials: [
        {
            id: 1,
            name: 'Aminata Kamara',
            role: 'Mother of three',
            text: 'Salone Health Connect helped me find the nearest clinic when my child was sick. The information was accurate and saved us precious time.',
            avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100'
        },
        {
            id: 2,
            name: 'Dr. Ibrahim Sesay',
            role: 'Healthcare Worker',
            text: 'This platform has revolutionized how we connect patients with healthcare services. It\'s an invaluable tool for our community.',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'
        },
        {
            id: 3,
            name: 'Fatmata Turay',
            role: 'Community Health Volunteer',
            text: 'The health education resources have been incredibly helpful in my community outreach work. Everyone can understand the information.',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100'
        },
        {
            id: 4,
            name: 'Samuel Bangura',
            role: 'Patient',
            text: 'I found a clinic near me that I didn\'t know existed. The emergency contact numbers were a lifesaver during a medical emergency.',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'
        }
    ],
    
    // FAQs
    faqs: [
        {
            id: 1,
            question: 'What is Salone Health Connect?',
            answer: 'Salone Health Connect is a Digital Public Good (DPG) platform designed to improve access to healthcare information, clinics, health education, emergency alerts, and community health resources across Sierra Leone.'
        },
        {
            id: 2,
            question: 'Is the service free to use?',
            answer: 'Yes, Salone Health Connect is completely free to use. Our mission is to ensure every Sierra Leonean has access to essential healthcare information and resources.'
        },
        {
            id: 3,
            question: 'How do I find a clinic near me?',
            answer: 'Visit our Clinics Directory page where you can search for clinics by district or location. Each listing includes contact information, services offered, and operating hours.'
        },
        {
            id: 4,
            question: 'Can I access the platform without registering?',
            answer: 'Yes, you can use the platform as a guest. However, registering allows you to personalize your experience and save your preferences.'
        },
        {
            id: 5,
            question: 'How current is the health information?',
            answer: 'Our health education content is regularly reviewed and updated by healthcare professionals to ensure accuracy and relevance.'
        },
        {
            id: 6,
            question: 'What should I do in a medical emergency?',
            answer: 'In a medical emergency, call 117 immediately for ambulance services. You can also find emergency contact numbers for hospitals on our Emergency Alerts page.'
        },
        {
            id: 7,
            question: 'Is my personal information secure?',
            answer: 'Yes, we take data privacy seriously. Your information is stored locally on your device and is never shared with third parties without your consent.'
        },
        {
            id: 8,
            question: 'How can I report incorrect information?',
            answer: 'If you find any incorrect information, please use our Contact Support page to report it. We verify and update information regularly.'
        },
        {
            id: 9,
            question: 'Can I contribute health education content?',
            answer: 'We welcome contributions from qualified healthcare professionals. Please contact us through our support page to discuss content contributions.'
        },
        {
            id: 10,
            question: 'Does the platform work offline?',
            answer: 'Some features require internet connectivity, but once loaded, the platform can work offline for basic information viewing.'
        }
    ],
    
    // Emergency contacts
    emergencyContacts: {
        ambulance: '117',
        police: '119',
        fire: '112',
        nationalHealth: '117'
    }
};

// ==================== PAGE NAVIGATION ====================

const Navigation = {
    goToPage: function(page) {
        window.location.href = page;
    },
    
    goToClinicDetails: function(clinicId) {
        const clinic = Storage.clinics.find(c => c.id === clinicId);
        if (clinic) {
            localStorage.setItem('selectedClinic', JSON.stringify(clinic));
            this.goToPage('clinic-details.html');
        }
    },
    
    goToArticleDetails: function(articleId) {
        const article = Storage.articles.find(a => a.id === articleId);
        if (article) {
            localStorage.setItem('selectedArticle', JSON.stringify(article));
            this.goToPage('article-details.html');
        }
    }
};

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    DarkMode.init();
    Counter.init();
    Accordion.init();
    SmoothScroll.init();
    MobileMenu.init();
    
    // Check authentication status
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        updateUIForLoggedInUser(user);
    }
});

// Update UI for logged-in user
function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <span class="user-greeting">Welcome, ${user.name}</span>
            <button class="btn btn-outline btn-sm" onclick="handleLogout()">Logout</button>
        `;
    }
}

// Handle logout
function handleLogout() {
    const result = Auth.logout();
    if (result.success) {
        Toast.success(result.message);
        setTimeout(() => {
            Navigation.goToPage('index.html');
        }, 1000);
    } else {
        Toast.error(result.message);
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const validation = Validator.validateForm(form);
    
    if (!validation.isValid) {
        Validator.showErrors(form, validation.errors);
        return;
    }
    
    const formData = new FormData(form);
    const userData = {
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password')
    };
    
    const result = Auth.register(userData);
    
    if (result.success) {
        Toast.success(result.message);
        setTimeout(() => {
            Navigation.goToPage('login.html');
        }, 1500);
    } else {
        Toast.error(result.message);
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const validation = Validator.validateForm(form);
    
    if (!validation.isValid) {
        Validator.showErrors(form, validation.errors);
        return;
    }
    
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe') === 'on';
    
    const result = Auth.login(email, password, rememberMe);
    
    if (result.success) {
        Toast.success(result.message);
        setTimeout(() => {
            Navigation.goToPage('dashboard.html');
        }, 1000);
    } else {
        Toast.error(result.message);
    }
}

// Handle guest access
function handleGuestAccess() {
    const result = Auth.guestAccess();
    
    if (result.success) {
        Toast.success(result.message);
        setTimeout(() => {
            Navigation.goToPage('dashboard.html');
        }, 1000);
    } else {
        Toast.error(result.message);
    }
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const validation = Validator.validateForm(form);
    
    if (!validation.isValid) {
        Validator.showErrors(form, validation.errors);
        return;
    }
    
    Toast.success('Message sent successfully! We will contact you soon.');
    form.reset();
}

// Handle newsletter subscription
function handleNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!Validator.validateEmail(email)) {
        Toast.error('Please enter a valid email address');
        return;
    }
    
    Toast.success('Successfully subscribed to newsletter!');
    form.reset();
}

// Make functions globally available
window.handleLogout = handleLogout;
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.handleGuestAccess = handleGuestAccess;
window.handleContactForm = handleContactForm;
window.handleNewsletter = handleNewsletter;
window.Navigation = Navigation;
window.Storage = Storage;
window.Auth = Auth;
window.Validator = Validator;
