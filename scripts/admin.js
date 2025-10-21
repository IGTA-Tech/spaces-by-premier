// Admin Dashboard JavaScript

// Mock Data
const mockInquiries = [
    { id: 1, date: '2025-06-15', name: 'Sarah Johnson', email: 'sarah.j@email.com', status: 'pending', eventType: 'Wedding', timeLeft: 42, inquiryCount: 5 },
    { id: 2, date: '2025-06-20', name: 'Michael Peterson', email: 'michael.p@email.com', status: 'pending', eventType: 'Corporate', timeLeft: 38, inquiryCount: 3 },
    { id: 3, date: '2025-06-22', name: 'Jennifer Williams', email: 'jennifer.w@email.com', status: 'pending', eventType: 'Wedding', timeLeft: 45, inquiryCount: 2 },
    { id: 4, date: '2025-06-28', name: 'David Martinez', email: 'david.m@email.com', status: 'pending', eventType: 'Birthday', timeLeft: 12, inquiryCount: 1 },
    { id: 5, date: '2025-07-05', name: 'Lisa Anderson', email: 'lisa.a@email.com', status: 'pending', eventType: 'Conference', timeLeft: 36, inquiryCount: 4 },
    { id: 6, date: '2025-07-10', name: 'Robert Brown', email: 'robert.b@email.com', status: 'pending', eventType: 'Wedding', timeLeft: 28, inquiryCount: 6 },
];

const mockBookings = [
    { date: '2025-06-05', name: 'Amanda Thompson', eventType: 'Wedding' },
    { date: '2025-06-12', name: 'James Wilson', eventType: 'Corporate' },
    { date: '2025-06-18', name: 'Maria Garcia', eventType: 'Wedding' },
];

const recentActivities = [
    { type: 'inquiry', text: 'New inquiry for June 15th', name: 'Sarah Johnson', time: '5 min ago', icon: '📝' },
    { type: 'booking', text: 'Payment received for June 12th', name: 'James Wilson', time: '1 hour ago', icon: '💰' },
    { type: 'inquiry', text: 'New inquiry for July 10th', name: 'Robert Brown', time: '2 hours ago', icon: '📝' },
    { type: 'expired', text: 'Inquiry expired for June 8th', name: 'Mike Brown', time: '3 hours ago', icon: '⏰' },
    { type: 'booking', text: 'Payment received for June 18th', name: 'Maria Garcia', time: '5 hours ago', icon: '💰' },
    { type: 'inquiry', text: 'New inquiry for June 28th', name: 'David Martinez', time: '6 hours ago', icon: '📝' },
];

// Populate Calendar
const populateCalendar = () => {
    const calendarGrid = document.getElementById('calendar-grid');
    const daysInJune = 30;
    const firstDayOfWeek = 0; // June 1, 2025 is a Sunday

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'aspect-square';
        calendarGrid.appendChild(emptyCell);
    }

    // Add days
    for (let day = 1; day <= daysInJune; day++) {
        const dateStr = `2025-06-${day.toString().padStart(2, '0')}`;
        const cell = document.createElement('div');
        cell.className = 'aspect-square p-2 rounded-lg cursor-pointer transition-all hover:shadow-md relative';

        // Check if date has booking
        const hasBooking = mockBookings.some(b => b.date === dateStr);

        // Check if date has inquiries
        const inquiriesForDate = mockInquiries.filter(i => i.date === dateStr);
        const inquiryCount = inquiriesForDate.reduce((sum, i) => sum + i.inquiryCount, 0);

        if (hasBooking) {
            cell.className += ' bg-green-500 text-white font-bold';
        } else if (inquiryCount >= 4) {
            cell.className += ' bg-orange-100 border-2 border-orange-400';
        } else if (inquiryCount > 0) {
            cell.className += ' bg-yellow-100 border-2 border-yellow-400';
        } else {
            cell.className += ' bg-white border-2 border-gray-300';
        }

        cell.innerHTML = `
            <div class="text-sm font-semibold">${day}</div>
            ${inquiryCount > 0 ? `<div class="absolute bottom-1 right-1 w-5 h-5 bg-warning text-white rounded-full text-xs flex items-center justify-center font-bold">${inquiryCount}</div>` : ''}
        `;

        // Add click event to show details
        cell.addEventListener('click', () => {
            if (hasBooking) {
                const booking = mockBookings.find(b => b.date === dateStr);
                alert(`Confirmed Booking\n\nDate: ${dateStr}\nClient: ${booking.name}\nEvent: ${booking.eventType}`);
            } else if (inquiryCount > 0) {
                const inquiries = inquiriesForDate.map(i => `${i.name} (${i.eventType})`).join('\n');
                alert(`Inquiries for ${dateStr}\n\n${inquiries}\n\nTotal: ${inquiryCount} inquiries`);
            } else {
                alert(`Date Available\n\n${dateStr}\nNo inquiries or bookings`);
            }
        });

        calendarGrid.appendChild(cell);
    }
};

// Populate Recent Activity
const populateRecentActivity = () => {
    const activityContainer = document.getElementById('recent-activity');

    recentActivities.forEach((activity, index) => {
        const activityItem = document.createElement('div');
        activityItem.className = 'flex items-start pb-4 border-b border-gray-100 last:border-0 scroll-reveal';
        activityItem.style.animationDelay = `${index * 0.05}s`;

        let bgColor = 'bg-blue-100';
        if (activity.type === 'booking') bgColor = 'bg-green-100';
        if (activity.type === 'expired') bgColor = 'bg-gray-100';

        activityItem.innerHTML = `
            <div class="w-10 h-10 ${bgColor} rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-lg">
                ${activity.icon}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">${activity.text}</p>
                <p class="text-xs text-gray-500">${activity.name}</p>
                <p class="text-xs text-gray-400 mt-1">${activity.time}</p>
            </div>
        `;

        activityContainer.appendChild(activityItem);
    });
};

// Populate Inquiry Table
const populateInquiryTable = () => {
    const tableBody = document.getElementById('inquiry-table-body');

    mockInquiries.forEach((inquiry, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors scroll-reveal';
        row.style.animationDelay = `${index * 0.05}s`;

        let statusBadge = '';
        if (inquiry.status === 'pending') {
            statusBadge = '<span class="status-badge status-pending">Pending</span>';
        } else if (inquiry.status === 'confirmed') {
            statusBadge = '<span class="status-badge status-confirmed">Confirmed</span>';
        } else if (inquiry.status === 'expired') {
            statusBadge = '<span class="status-badge status-expired">Expired</span>';
        }

        let urgencyClass = 'text-green-600';
        if (inquiry.inquiryCount >= 5) urgencyClass = 'text-orange-600 font-bold';
        else if (inquiry.inquiryCount >= 3) urgencyClass = 'text-yellow-600';

        row.innerHTML = `
            <td class="py-4 px-4 text-sm font-medium">${inquiry.date}</td>
            <td class="py-4 px-4 text-sm">${inquiry.name}</td>
            <td class="py-4 px-4 text-sm text-gray-600">${inquiry.email}</td>
            <td class="py-4 px-4">${statusBadge}</td>
            <td class="py-4 px-4">
                <span class="${urgencyClass} text-sm font-semibold">${inquiry.inquiryCount} ${inquiry.inquiryCount === 1 ? 'inquiry' : 'inquiries'}</span>
            </td>
            <td class="py-4 px-4 text-sm">
                <span class="${inquiry.timeLeft < 24 ? 'text-red-600 font-semibold' : 'text-gray-600'}">${inquiry.timeLeft}h remaining</span>
            </td>
            <td class="py-4 px-4">
                <div class="flex gap-2">
                    <button class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" onclick="sendReminder(${inquiry.id})">
                        Send Reminder
                    </button>
                    <button class="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors" onclick="viewDetails(${inquiry.id})">
                        View
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
};

// Create Charts
const createCharts = () => {
    // Conversion Chart
    const conversionCtx = document.getElementById('conversionChart').getContext('2d');
    new Chart(conversionCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Inquiries',
                    data: [18, 22, 25, 28, 32, 35],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Confirmed Bookings',
                    data: [4, 6, 8, 12, 15, 20],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Event Types Chart
    const eventTypesCtx = document.getElementById('eventTypesChart').getContext('2d');
    new Chart(eventTypesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Weddings', 'Corporate Events', 'Birthday Parties', 'Conferences', 'Other'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f59e0b',
                    '#10b981',
                    '#6b7280'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
};

// Action Functions
window.sendReminder = (inquiryId) => {
    const inquiry = mockInquiries.find(i => i.id === inquiryId);
    if (inquiry) {
        window.spacesUtils.showToast(`Reminder sent to ${inquiry.name}`, 'success');
    }
};

window.viewDetails = (inquiryId) => {
    const inquiry = mockInquiries.find(i => i.id === inquiryId);
    if (inquiry) {
        alert(`Inquiry Details\n\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nDate: ${inquiry.date}\nEvent Type: ${inquiry.eventType}\nStatus: ${inquiry.status}\nTime Remaining: ${inquiry.timeLeft} hours\nTotal Inquiries for Date: ${inquiry.inquiryCount}`);
    }
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    populateCalendar();
    populateRecentActivity();
    populateInquiryTable();
    createCharts();

    // Trigger scroll reveal
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);

    console.log('Admin Dashboard loaded! 📊');
});
