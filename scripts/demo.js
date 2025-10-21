// Demo.js - Interactive Booking Demo Logic

// Mock Data Generator
const generateMockInquiries = () => {
    const names = [
        'Sarah Johnson', 'Michael Peterson', 'Event Space Co.', 'Jennifer Williams',
        'Robert Brown', 'Emily Davis', 'David Martinez', 'Lisa Anderson',
        'James Wilson', 'Maria Garcia', 'John Taylor', 'Amanda Thompson'
    ];

    const times = [
        '3 minutes ago', '8 minutes ago', '15 minutes ago', '22 minutes ago',
        '35 minutes ago', '1 hour ago', '2 hours ago', '3 hours ago'
    ];

    return names.slice(0, 6).map((name, index) => ({
        name: name.split(' ')[0] + ' ' + name.split(' ')[1][0] + '.',
        time: times[index]
    }));
};

// Calculate inquiry count based on date
const calculateInquiryCount = (date) => {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    // Weekends (Sat/Sun) have more inquiries
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return Math.floor(Math.random() * 3) + 5; // 5-7 inquiries
    }

    // Even dates have some inquiries
    if (dayOfMonth % 2 === 0) {
        return Math.floor(Math.random() * 2) + 2; // 2-3 inquiries
    }

    // Odd dates have fewer inquiries
    return Math.floor(Math.random() * 2); // 0-1 inquiries
};

// Check if date is booked
const isDateBooked = (date) => {
    const dayOfMonth = date.getDate();
    // Random dates are "booked" for demo purposes
    const bookedDates = [5, 12, 19, 26];
    return bookedDates.includes(dayOfMonth);
};

// State Management
let selectedDate = null;
let inquiryCount = 0;

// DOM Elements
const eventDateInput = document.getElementById('event-date');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const availabilityDisplay = document.getElementById('availability-display');
const bookingForm = document.getElementById('booking-form');
const backBtn = document.getElementById('back-btn');
const successModal = document.getElementById('success-modal');
const recentInquiriesDiv = document.getElementById('recent-inquiries');

// Initialize date picker with today's date as minimum
const initializeDatePicker = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toISOString().split('T')[0];
    eventDateInput.min = minDate;

    // Set default value to one week from today
    const defaultDate = new Date(today);
    defaultDate.setDate(defaultDate.getDate() + 7);
    eventDateInput.value = defaultDate.toISOString().split('T')[0];
};

// Display Recent Inquiries
const displayRecentInquiries = () => {
    const inquiries = generateMockInquiries();

    recentInquiriesDiv.innerHTML = inquiries.map((inquiry, index) => `
        <div class="flex items-center text-sm text-gray-600 animate-pulse" style="animation-delay: ${index * 0.1}s">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span><strong>${inquiry.name}</strong> inquired ${inquiry.time}</span>
        </div>
    `).join('');
};

// Show Availability
const showAvailability = (date) => {
    const isBooked = isDateBooked(date);
    inquiryCount = isBooked ? 0 : calculateInquiryCount(date);

    let statusHTML = '';
    let formVisible = true;

    if (isBooked) {
        statusHTML = `
            <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-red-900">Date is Booked</h3>
                        <p class="text-red-700">This date has been secured by another client</p>
                    </div>
                </div>
                <p class="text-sm text-red-600">Someone already paid the deposit for this date. Please choose another date.</p>
            </div>
        `;
        formVisible = false;
    } else if (inquiryCount === 0) {
        statusHTML = `
            <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-green-900">Available! ✨</h3>
                        <p class="text-green-700">Be the first to inquire about this date</p>
                    </div>
                </div>
                <p class="text-sm text-green-600">No inquiries yet - you have the best chance to secure this date!</p>
            </div>
        `;
    } else if (inquiryCount <= 3) {
        statusHTML = `
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                        <span class="text-2xl">⚠️</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-yellow-900">Limited Availability</h3>
                        <p class="text-yellow-700">${inquiryCount} ${inquiryCount === 1 ? 'person has' : 'people have'} inquired about this date</p>
                    </div>
                </div>
                <p class="text-sm text-yellow-600">Others are interested! First to pay the deposit secures the date.</p>
            </div>
        `;
    } else {
        statusHTML = `
            <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <span class="text-2xl">🔥</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-orange-900">High Demand!</h3>
                        <p class="text-orange-700">${inquiryCount} people want this date</p>
                    </div>
                </div>
                <p class="text-sm text-orange-600"><strong>Act fast!</strong> This is a popular date. First to pay wins.</p>
            </div>
        `;
    }

    availabilityDisplay.innerHTML = statusHTML;

    // Show/hide form based on availability
    if (formVisible) {
        document.getElementById('inquiry-form').classList.remove('hidden');
    } else {
        document.getElementById('inquiry-form').classList.add('hidden');
    }

    // Animate the display
    availabilityDisplay.style.animation = 'fadeInUp 0.5s ease-out';
};

// Handle Date Selection
eventDateInput.addEventListener('change', (e) => {
    const dateValue = e.target.value;
    if (!dateValue) return;

    selectedDate = new Date(dateValue + 'T00:00:00');

    // Show step 2
    step1.classList.add('hidden');
    step2.classList.remove('hidden');

    // Show availability
    showAvailability(selectedDate);

    // Update recent inquiries with animation
    displayRecentInquiries();
});

// Back Button
backBtn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    selectedDate = null;
});

// Handle Form Submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;
    const eventType = document.getElementById('event-type').value;
    const guestCount = document.getElementById('guest-count').value;
    const details = document.getElementById('event-details').value;

    // Format date
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update modal content
    document.getElementById('modal-name').textContent = name.split(' ')[0];
    document.getElementById('modal-date').textContent = formattedDate;
    document.getElementById('modal-event-date').textContent = formattedDate;

    // Generate urgency message
    let urgencyHTML = '';
    if (inquiryCount === 0) {
        urgencyHTML = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-green-800 font-semibold">🎉 You're the first to inquire about this date!</p>
                <p class="text-green-700 text-sm mt-1">You have the best chance to secure it. Pay within 48 hours to confirm.</p>
            </div>
        `;
        document.getElementById('modal-inquiry-info').textContent = "You're the first to inquire! Act now to secure this date.";
    } else {
        urgencyHTML = `
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p class="text-orange-800 font-semibold">⚠️ ${inquiryCount} ${inquiryCount === 1 ? 'other person has' : 'other people have'} inquired about this date!</p>
                <p class="text-orange-700 text-sm mt-1">First to pay the deposit secures the date. Don't miss out!</p>
            </div>
        `;
        document.getElementById('modal-inquiry-info').textContent = `${inquiryCount} others want this date. Be the first to pay!`;
    }

    document.getElementById('urgency-message').innerHTML = urgencyHTML;

    // Show success modal with confetti
    successModal.classList.remove('hidden');
    window.spacesUtils.createConfetti();

    // Simulate adding to recent inquiries
    setTimeout(() => {
        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1] || '';
        const initials = lastName ? lastName[0] + '.' : '';
        const newInquiry = `
            <div class="flex items-center text-sm text-gray-600 bg-green-50 p-2 rounded animate-pulse">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span><strong>${firstName} ${initials}</strong> inquired just now</span>
            </div>
        `;
        recentInquiriesDiv.insertAdjacentHTML('afterbegin', newInquiry);
    }, 500);
});

// Try Another Date Button
document.getElementById('try-another-date-btn').addEventListener('click', () => {
    successModal.classList.add('hidden');
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    bookingForm.reset();
    selectedDate = null;
});

// Close modal when clicking backdrop
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.add('hidden');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDatePicker();
    displayRecentInquiries();

    // Refresh inquiries every 10 seconds for demo effect
    setInterval(() => {
        if (!successModal.classList.contains('hidden')) return;
        displayRecentInquiries();
    }, 10000);
});

console.log('Demo page loaded! 🎉');
