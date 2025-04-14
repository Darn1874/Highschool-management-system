// Sample data storage (in a real app, this would be from a database)
let students = [
    { id: 'S1001', firstName: 'John', lastName: 'Doe', dob: '2005-03-15', gender: 'Male', classForm: 'Form 1', parentName: 'Jane Doe', parentPhone: '555-0101' },
    { id: 'S1002', firstName: 'Mary', lastName: 'Smith', dob: '2005-07-22', gender: 'Female', classForm: 'Form 2', parentName: 'Robert Smith', parentPhone: '555-0102' },
    { id: 'S1003', firstName: 'David', lastName: 'Johnson', dob: '2004-11-05', gender: 'Male', classForm: 'Form 3', parentName: 'Susan Johnson', parentPhone: '555-0103' },
    { id: 'S1004', firstName: 'Sarah', lastName: 'Williams', dob: '2004-09-18', gender: 'Female', classForm: 'Form 4', parentName: 'Michael Williams', parentPhone: '555-0104' }
];

let grades = [
    { studentId: 'S1001', studentName: 'John Doe', classForm: 'Form 1', subject: 'Math', score: 85, grade: 'A', examType: 'Midterm', remarks: 'Excellent performance. Shows great potential.' },
    { studentId: 'S1001', studentName: 'John Doe', classForm: 'Form 1', subject: 'English', score: 78, grade: 'B+', examType: 'Midterm', remarks: 'Good work, but needs to improve in creative writing.' },
    { studentId: 'S1002', studentName: 'Mary Smith', classForm: 'Form 2', subject: 'Science', score: 92, grade: 'A', examType: 'Final', remarks: 'Outstanding performance in all areas.' },
    { studentId: 'S1003', studentName: 'David Johnson', classForm: 'Form 3', subject: 'History', score: 65, grade: 'C', examType: 'Quiz', remarks: 'Needs to study more for upcoming tests.' }
];

let fees = [
    { studentId: 'S1001', studentName: 'John Doe', classForm: 'Form 1', totalFees: 1000, paid: 800, balance: 200, status: 'partial' },
    { studentId: 'S1002', studentName: 'Mary Smith', classForm: 'Form 2', totalFees: 1200, paid: 1200, balance: 0, status: 'paid' },
    { studentId: 'S1003', studentName: 'David Johnson', classForm: 'Form 3', totalFees: 1500, paid: 500, balance: 1000, status: 'unpaid' },
    { studentId: 'S1004', studentName: 'Sarah Williams', classForm: 'Form 4', totalFees: 1800, paid: 1800, balance: 0, status: 'paid' }
];

let activities = [
    { type: 'enrollment', student: 'Sarah Williams', classForm: 'Form 4', date: '2023-05-15' },
    { type: 'payment', student: 'John Doe', amount: 200, date: '2023-05-14' },
    { type: 'grade', student: 'Mary Smith', subject: 'Science', score: 92, date: '2023-05-12' },
    { type: 'enrollment', student: 'David Johnson', classForm: 'Form 3', date: '2023-05-10' }
];

// DOM Elements
const sidebarItems = document.querySelectorAll('.sidebar li');
const sections = document.querySelectorAll('.section');
const studentModal = document.getElementById('student-modal');
const closeModal = document.querySelector('.close-modal');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Set active section
    setActiveSection('dashboard');
    
    // Load dashboard data
    updateDashboard();
    
    // Load student table
    renderStudentTable();
    
    // Load grades table
    renderGradesTable();
    
    // Load fees table
    renderFeesTable();
    
    // Populate student dropdowns
    populateStudentDropdowns();
    
    // Setup event listeners
    setupEventListeners();
});

function setActiveSection(sectionId) {
    // Update sidebar
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
    
    // Update content sections
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
}

function updateDashboard() {
    document.getElementById('total-students').textContent = students.length;
    
    const totalArrears = fees.reduce((sum, fee) => sum + fee.balance, 0);
    document.getElementById('fee-arrears').textContent = `$${totalArrears}`;
    
    document.getElementById('recent-exams').textContent = grades.length;
    
    // Render recent activities
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';
    
    activities.slice(0, 5).forEach(activity => {
        const li = document.createElement('li');
        
        let activityText = '';
        switch(activity.type) {
            case 'enrollment':
                activityText = `New student enrolled: ${activity.student} (${activity.classForm})`;
                break;
            case 'payment':
                activityText = `Payment recorded for ${activity.student}: $${activity.amount}`;
                break;
            case 'grade':
                activityText = `Grade recorded for ${activity.student} in ${activity.subject}: ${activity.score}`;
                break;
        }
        
        li.innerHTML = `
            <span class="activity-text">${activityText}</span>
            <span class="activity-date">${formatDate(activity.date)}</span>
        `;
        activityList.appendChild(li);
    });
}

function renderStudentTable(filter = '') {
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = '';
    
    const filteredStudents = students.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return fullName.includes(filter.toLowerCase()) || 
               student.id.toLowerCase().includes(filter.toLowerCase()) || 
               student.classForm.toLowerCase().includes(filter.toLowerCase());
    });
    
    filteredStudents.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.classForm}</td>
            <td>${student.parentPhone}</td>
            <td>
                <button class="view-btn" data-id="${student.id}">View</button>
                <button class="edit-btn" data-id="${student.id}">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const studentId = this.dataset.id;
            viewStudentDetails(studentId);
        });
    });
}

function renderGradesTable(classFilter = '', subjectFilter = '') {
    const tbody = document.querySelector('#grades-table tbody');
    tbody.innerHTML = '';
    
    const filteredGrades = grades.filter(grade => {
        return (classFilter === '' || grade.classForm === classFilter) && 
               (subjectFilter === '' || grade.subject === subjectFilter);
    });
    
    filteredGrades.forEach(grade => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${grade.studentId}</td>
            <td>${grade.studentName}</td>
            <td>${grade.classForm}</td>
            <td>${grade.subject}</td>
            <td>${grade.score}</td>
            <td>${grade.grade}</td>
            <td>${grade.remarks || '-'}</td>
            <td>
                <button class="edit-grade-btn" data-id="${grade.studentId}" data-subject="${grade.subject}" data-exam="${grade.examType}">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderFeesTable(classFilter = '', statusFilter = '') {
    const tbody = document.querySelector('#fees-table tbody');
    tbody.innerHTML = '';
    
    const filteredFees = fees.filter(fee => {
        return (classFilter === '' || fee.classForm === classFilter) && 
               (statusFilter === '' || fee.status === statusFilter);
    });
    
    filteredFees.forEach(fee => {
        const statusClass = `badge-${fee.status}`;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fee.studentId}</td>
            <td>${fee.studentName}</td>
            <td>${fee.classForm}</td>
            <td>$${fee.totalFees}</td>
            <td>$${fee.paid}</td>
            <td>$${fee.balance}</td>
            <td><span class="badge ${statusClass}">${fee.status}</span></td>
            <td>
                <button class="view-fee-btn" data-id="${fee.studentId}">View</button>
                <button class="add-payment-btn" data-id="${fee.studentId}">Add Payment</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateStudentDropdowns() {
    const gradeStudentSelect = document.getElementById('grade-student');
    const paymentStudentSelect = document.getElementById('payment-student');
    
    // Clear existing options
    gradeStudentSelect.innerHTML = '<option value="">Select Student</option>';
    paymentStudentSelect.innerHTML = '<option value="">Select Student</option>';
    
    // Add students
    students.forEach(student => {
        const option1 = document.createElement('option');
        option1.value = student.id;
        option1.textContent = `${student.firstName} ${student.lastName} (${student.classForm})`;
        gradeStudentSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = student.id;
        option2.textContent = `${student.firstName} ${student.lastName} (${student.classForm})`;
        paymentStudentSelect.appendChild(option2);
    });
}

function viewStudentDetails(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('modal-title').textContent = `${student.firstName} ${student.lastName}'s Details`;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="student-info">
            <p><strong>Student ID:</strong> ${student.id}</p>
            <p><strong>Class/Form:</strong> ${student.classForm}</p>
            <p><strong>Date of Birth:</strong> ${formatDate(student.dob)}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Parent/Guardian:</strong> ${student.parentName}</p>
            <p><strong>Contact Phone:</strong> ${student.parentPhone}</p>
        </div>
        
        <div class="student-actions no-print">
            <button onclick="generateReportCard('${studentId}')" class="print-btn">
                Generate Report Card
            </button>
        </div>
        
        <div class="student-grades">
            <h3>Grades</h3>
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Exam Type</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderStudentGrades(studentId)}
                </tbody>
            </table>
        </div>
        
        <div class="student-fees">
            <h3>Fee Status</h3>
            ${renderStudentFees(studentId)}
        </div>
    `;
    
    studentModal.classList.remove('hidden');
}

function generateReportCard(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const studentGrades = grades.filter(g => g.studentId === studentId);
    const currentTerm = getCurrentTerm();
    
    // Calculate rankings
    const classRank = calculateClassRank(studentId, student.classForm);
    const overallRank = calculateOverallRank(studentId);
    
    const reportContent = `
        <div class="report-header">
            <div class="school-logo-placeholder">[LOGO]</div>
            <div class="school-info">
                <h2>GENERAL HIGH SCHOOL</h2>
                <p>123 Education Road, Academic City</p>
                <p>P.O. Box 4567, Phone: (123) 456-7890</p>
                <p>Email: info@generalhigh.edu</p>
            </div>
        </div>
        
        <div class="report-meta">
            <div class="report-meta-item">
                <strong>Student Name:</strong>
                <span>${student.firstName} ${student.lastName}</span>
            </div>
            <div class="report-meta-item">
                <strong>Class/Form:</strong>
                <span>${student.classForm}</span>
            </div>
            <div class="report-meta-item">
                <strong>Student ID:</strong>
                <span>${student.id}</span>
            </div>
        </div>
        
        <div class="report-meta">
            <div class="report-meta-item">
                <strong>Term:</strong>
                <span>${currentTerm.name} ${new Date().getFullYear()}</span>
            </div>
            <div class="report-meta-item">
                <strong>Opening Date:</strong>
                <span>${formatDate(currentTerm.startDate)}</span>
            </div>
            <div class="report-meta-item">
                <strong>Closing Date:</strong>
                <span>${formatDate(currentTerm.endDate)}</span>
            </div>
        </div>
        
        <div class="student-ranking">
            <h4>Performance Summary</h4>
            <div class="rank-item">
                <span>Class Rank (${student.classForm}):</span>
                <strong>${classRank.position} out of ${classRank.total}</strong>
            </div>
            <div class="rank-item">
                <span>Overall Rank:</span>
                <strong>${overallRank.position} out of ${overallRank.total}</strong>
            </div>
            <div class="rank-item">
                <span>Average Score:</span>
                <strong>${calculateStudentAverage(studentId).toFixed(1)}%</strong>
            </div>
        </div>
        
        <h3>Academic Performance</h3>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                ${studentGrades.map(grade => `
                    <tr>
                        <td>${grade.subject}</td>
                        <td>${grade.score}</td>
                        <td>${grade.grade}</td>
                        <td>${grade.remarks || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="teacher-comments">
            <h3>Form Teacher's Comments</h3>
            <p>${getFormTeacherComments(studentId) || 'No comments available.'}</p>
        </div>
        
        <div class="print-controls no-print">
            <button class="print-btn" onclick="window.print()">Print Report</button>
        </div>
    `;
    
    document.getElementById('modal-title').textContent = 'Student Report Card';
    document.getElementById('modal-body').innerHTML = reportContent;
    studentModal.classList.remove('hidden');
}

function renderStudentGrades(studentId) {
    const studentGrades = grades.filter(grade => grade.studentId === studentId);
    
    if (studentGrades.length === 0) {
        return '<tr><td colspan="5">No grades recorded yet</td></tr>';
    }
    
    return studentGrades.map(grade => `
        <tr>
            <td>${grade.subject}</td>
            <td>${grade.score}</td>
            <td>${grade.grade}</td>
            <td>${grade.examType}</td>
            <td>${grade.remarks || '-'}</td>
        </tr>
    `).join('');
}

function renderStudentFees(studentId) {
    const feeRecord = fees.find(fee => fee.studentId === studentId);
    if (!feeRecord) return '<p>No fee record found</p>';
    
    const progress = (feeRecord.paid / feeRecord.totalFees) * 100;
    const statusClass = `text-${feeRecord.status === 'paid' ? 'success' : feeRecord.status === 'unpaid' ? 'danger' : 'warning'}`;
    
    return `
        <div class="fee-progress">
            <p><strong>Total Fees:</strong> $${feeRecord.totalFees}</p>
            <p><strong>Paid:</strong> $${feeRecord.paid}</p>
            <p><strong>Balance:</strong> $${feeRecord.balance}</p>
            <p><strong>Status:</strong> <span class="${statusClass}">${feeRecord.status}</span></p>
            
            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function calculateGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C+';
    if (score >= 50) return 'C';
    return 'D';
}

// Helper functions for reports
function getCurrentTerm() {
    // In a real system, this would come from a database
    const now = new Date();
    const year = now.getFullYear();
    
    return {
        name: 'Term ' + (now.getMonth() < 4 ? 1 : now.getMonth() < 8 ? 2 : 3),
        startDate: `${year}-01-10`,
        endDate: `${year}-04-05`
    };
}

function calculateClassRank(studentId, classForm) {
    const classStudents = students.filter(s => s.classForm === classForm);
    const classGrades = grades.filter(g => classStudents.some(s => s.id === g.studentId));
    
    // Calculate averages for each student
    const studentAverages = {};
    classStudents.forEach(student => {
        const studentGrades = classGrades.filter(g => g.studentId === student.id);
        if (studentGrades.length > 0) {
            const total = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
            studentAverages[student.id] = total / studentGrades.length;
        }
    });
    
    // Sort students by average
    const sortedStudents = Object.keys(studentAverages)
        .map(id => ({ id, average: studentAverages[id] }))
        .sort((a, b) => b.average - a.average);
    
    // Find the student's position
    const position = sortedStudents.findIndex(s => s.id === studentId) + 1;
    
    return {
        position,
        total: sortedStudents.length
    };
}

function calculateOverallRank(studentId) {
    // Calculate averages for all students
    const studentAverages = {};
    students.forEach(student => {
        const studentGrades = grades.filter(g => g.studentId === student.id);
        if (studentGrades.length > 0) {
            const total = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
            studentAverages[student.id] = total / studentGrades.length;
        }
    });
    
    // Sort all students by average
    const sortedStudents = Object.keys(studentAverages)
        .map(id => ({ id, average: studentAverages[id] }))
        .sort((a, b) => b.average - a.average);
    
    // Find the student's position
    const position = sortedStudents.findIndex(s => s.id === studentId) + 1;
    
    return {
        position,
        total: sortedStudents.length
    };
}

function calculateStudentAverage(studentId) {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    
    const total = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    return total / studentGrades.length;
}

function getFormTeacherComments(studentId) {
    // In a real system, this would come from a database
    const comments = [
        "A very diligent student who shows consistent improvement.",
        "Good performance overall. Could participate more in class discussions.",
        "Excellent work this term. Keep it up!",
        "Needs to improve in completing assignments on time."
    ];
    
    // Return a random comment for demo purposes
    return comments[Math.floor(Math.random() * comments.length)];
}

function setupEventListeners() {
    // Sidebar navigation
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            setActiveSection(this.dataset.section);
        });
    });
    
    // Student search
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('student-search').value;
        renderStudentTable(searchTerm);
    });
    
    // Student enrollment form
    document.getElementById('enrollment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Generate student ID
        const newId = 'S' + (1000 + students.length + 1);
        
        // Create new student
        const newStudent = {
            id: newId,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            classForm: document.getElementById('class-form').value,
            parentName: document.getElementById('parent-name').value,
            parentPhone: document.getElementById('parent-phone').value
        };
        
        // Add to students array
        students.push(newStudent);
        
        // Add fee record
        const baseFee = newStudent.classForm === 'Form 1' ? 1000 : 
                       newStudent.classForm === 'Form 2' ? 1200 :
                       newStudent.classForm === 'Form 3' ? 1500 : 1800;
        
        fees.push({
            studentId: newId,
            studentName: `${newStudent.firstName} ${newStudent.lastName}`,
            classForm: newStudent.classForm,
            totalFees: baseFee,
            paid: 0,
            balance: baseFee,
            status: 'unpaid'
        });
        
        // Add activity
        activities.unshift({
            type: 'enrollment',
            student: `${newStudent.firstName} ${newStudent.lastName}`,
            classForm: newStudent.classForm,
            date: new Date().toISOString().split('T')[0]
        });
        
        // Reset form
        this.reset();
        
        // Update UI
        renderStudentTable();
        populateStudentDropdowns();
        updateDashboard();
        
        alert(`Student enrolled successfully! Student ID: ${newId}`);
    });
    
    // Grade form
    document.getElementById('grade-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentId = document.getElementById('grade-student').value;
        const subject = document.getElementById('grade-subject-input').value;
        const score = parseInt(document.getElementById('grade-score').value);
        const examType = document.getElementById('grade-exam').value;
        const remarks = document.getElementById('grade-remarks').value;
        
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        
        const grade = calculateGrade(score);
        
        // Check if grade already exists for this student/subject/exam
        const existingGradeIndex = grades.findIndex(g => 
            g.studentId === studentId && 
            g.subject === subject && 
            g.examType === examType
        );
        
        if (existingGradeIndex >= 0) {
            // Update existing grade
            grades[existingGradeIndex] = {
                studentId,
                studentName: `${student.firstName} ${student.lastName}`,
                classForm: student.classForm,
                subject,
                score,
                grade,
                examType,
                remarks
            };
        } else {
            // Add new grade
            grades.push({
                studentId,
                studentName: `${student.firstName} ${student.lastName}`,
                classForm: student.classForm,
                subject,
                score,
                grade,
                examType,
                remarks
            });
        }
        
        // Add activity
        activities.unshift({
            type: 'grade',
            student: `${student.firstName} ${student.lastName}`,
            subject,
            score,
            date: new Date().toISOString().split('T')[0]
        });
        
        // Reset form
        this.reset();
        
        // Update UI
        renderGradesTable();
        updateDashboard();
        
        alert('Grade saved successfully!');
    });
    
    // Payment form
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentId = document.getElementById('payment-student').value;
        const amount = parseFloat(document.getElementById('payment-amount').value);
        const date = document.getElementById('payment-date').value;
        const method = document.getElementById('payment-method').value;
        const notes = document.getElementById('payment-notes').value;
        
        const feeRecord = fees.find(fee => fee.studentId === studentId);
        if (!feeRecord) return;
        
        // Update fee record
        feeRecord.paid += amount;
        feeRecord.balance = feeRecord.totalFees - feeRecord.paid;
        
        if (feeRecord.balance <= 0) {
            feeRecord.status = 'paid';
        } else if (feeRecord.paid > 0) {
            feeRecord.status = 'partial';
        } else {
            feeRecord.status = 'unpaid';
        }
        
        // Add activity
        activities.unshift({
            type: 'payment',
            student: feeRecord.studentName,
            amount,
            date: new Date().toISOString().split('T')[0]
        });
        
        // Reset form
        this.reset();
        
        // Update UI
        renderFeesTable();
        updateDashboard();
        
        alert('Payment recorded successfully!');
    });
    
    // Load grades button
    document.getElementById('load-grades').addEventListener('click', function() {
        const classFilter = document.getElementById('grade-class').value;
        const subjectFilter = document.getElementById('grade-subject').value;
        renderGradesTable(classFilter, subjectFilter);
    });
    
    // Load fees button
    document.getElementById('load-fees').addEventListener('click', function() {
        const classFilter = document.getElementById('fee-class').value;
        const statusFilter = document.getElementById('fee-status').value;
        renderFeesTable(classFilter, statusFilter);
    });
    
    // Report cards
    document.querySelectorAll('.report-card').forEach(card => {
        card.addEventListener('click', function() {
            const reportType = this.dataset.report;
            showReportForm(reportType);
        });
    });
    
    // Modal close
    closeModal.addEventListener('click', function() {
        studentModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === studentModal) {
            studentModal.classList.add('hidden');
        }
    });
}

function showReportForm(reportType) {
    const reportForm = document.getElementById('report-form');
    const reportParams = document.getElementById('report-params');
    const reportResults = document.getElementById('report-results');
    
    reportParams.innerHTML = '';
    reportResults.innerHTML = '';
    reportResults.classList.add('hidden');
    
    // Common parameters
    let paramsHTML = `
        <div class="form-group">
            <label for="report-format">Format</label>
            <select id="report-format" required>
                <option value="html">Web View</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
            </select>
        </div>
    `;
    
    // Add type-specific parameters
    switch(reportType) {
        case 'student-list':
            paramsHTML += `
                <div class="form-group">
                    <label for="report-class">Filter by Class/Form</label>
                    <select id="report-class">
                        <option value="">All Classes</option>
                        <option value="Form 1">Form 1</option>
                        <option value="Form 2">Form 2</option>
                        <option value="Form 3">Form 3</option>
                        <option value="Form 4">Form 4</option>
                    </select>
                </div>
            `;
            break;
        case 'fee-report':
            paramsHTML += `
                <div class="form-row">
                    <div class="form-group">
                        <label for="report-fee-class">Filter by Class/Form</label>
                        <select id="report-fee-class">
                            <option value="">All Classes</option>
                            <option value="Form 1">Form 1</option>
                            <option value="Form 2">Form 2</option>
                            <option value="Form 3">Form 3</option>
                            <option value="Form 4">Form 4</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="report-fee-status">Filter by Status</label>
                        <select id="report-fee-status">
                            <option value="">All</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partial</option>
                        </select>
                    </div>
                </div>
            `;
            break;
        case 'exam-results':
            paramsHTML += `
                <div class="form-row">
                    <div class="form-group">
                        <label for="report-exam-class">Filter by Class/Form</label>
                        <select id="report-exam-class">
                            <option value="">All Classes</option>
                            <option value="Form 1">Form 1</option>
                            <option value="Form 2">Form 2</option>
                            <option value="Form 3">Form 3</option>
                            <option value="Form 4">Form 4</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="report-exam-subject">Filter by Subject</label>
                        <select id="report-exam-subject">
                            <option value="">All Subjects</option>
                            <option value="Math">Mathematics</option>
                            <option value="English">English</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                        </select>
                    </div>
                </div>
            `;
            break;
    }
    
    reportParams.innerHTML = paramsHTML;
    reportForm.classList.remove('hidden');
    
    // Handle form submission
    reportForm.onsubmit = function(e) {
        e.preventDefault();
        generateReport(reportType);
    };
}

function generateReport(reportType) {
    const format = document.getElementById('report-format').value;
    const reportResults = document.getElementById('report-results');
    
    let reportContent = '';
    
    switch(reportType) {
        case 'student-list':
            const classFilter = document.getElementById('report-class').value;
            const filteredStudents = students.filter(student => 
                classFilter === '' || student.classForm === classFilter
            );
            
            reportContent = `
                <div class="report-header">
                    <div class="school-logo-placeholder"></div>
                    <div class="school-info">
                        <h2>RAMBA HIGH SCHOOL</h2>
                        <p>10 - 45007, NDORI</p>
                    </div>
                </div>
                <h3>Student List Report</h3>
                <div class="report-meta">
                    <div class="report-meta-item">
                        <strong>Generated on:</strong>
                        <span>${new Date().toLocaleDateString()}</span>
                    </div>
                    ${classFilter ? `
                    <div class="report-meta-item">
                        <strong>Class/Form:</strong>
                        <span>${classFilter}</span>
                    </div>` : ''}
                    <div class="report-meta-item">
                        <strong>Total Students:</strong>
                        <span>${filteredStudents.length}</span>
                    </div>
                </div>
                
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class/Form</th>
                            <th>Parent Name</th>
                            <th>Parent Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredStudents.map(student => `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.firstName} ${student.lastName}</td>
                                <td>${student.classForm}</td>
                                <td>${student.parentName}</td>
                                <td>${student.parentPhone}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="print-controls no-print">
                    <button class="print-btn" onclick="window.print()">Print Report</button>
                </div>
            `;
            break;
            
        case 'fee-report':
            const feeClassFilter = document.getElementById('report-fee-class').value;
            const feeStatusFilter = document.getElementById('report-fee-status').value;
            
            const filteredFees = fees.filter(fee => {
                return (feeClassFilter === '' || fee.classForm === feeClassFilter) && 
                       (feeStatusFilter === '' || fee.status === feeStatusFilter);
            });
            
            const totalFees = filteredFees.reduce((sum, fee) => sum + fee.totalFees, 0);
            const totalPaid = filteredFees.reduce((sum, fee) => sum + fee.paid, 0);
            const totalBalance = filteredFees.reduce((sum, fee) => sum + fee.balance, 0);
            
            reportContent = `
                <div class="report-header">
                    <div class="school-logo-placeholder">[LOGO]</div>
                    <div class="school-info">
                        <h2>GENERAL HIGH SCHOOL</h2>
                        <p>123 Education Road, Academic City</p>
                    </div>
                </div>
                <h3>Fee Report</h3>
                <div class="report-meta">
                    <div class="report-meta-item">
                        <strong>Generated on:</strong>
                        <span>${new Date().toLocaleDateString()}</span>
                    </div>
                    ${feeClassFilter ? `
                    <div class="report-meta-item">
                        <strong>Class/Form:</strong>
                        <span>${feeClassFilter}</span>
                    </div>` : ''}
                    ${feeStatusFilter ? `
                    <div class="report-meta-item">
                        <strong>Status:</strong>
                        <span>${feeStatusFilter}</span>
                    </div>` : ''}
                    <div class="report-meta-item">
                        <strong>Total Records:</strong>
                        <span>${filteredFees.length}</span>
                    </div>
                </div>
                
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Total Fees</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredFees.map(fee => `
                            <tr>
                                <td>${fee.studentId}</td>
                                <td>${fee.studentName}</td>
                                <td>${fee.classForm}</td>
                                <td>$${fee.totalFees}</td>
                                <td>$${fee.paid}</td>
                                <td>$${fee.balance}</td>
                                <td><span class="badge badge-${fee.status}">${fee.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="report-summary">
                    <h4>Summary</h4>
                    <div class="rank-item">
                        <span>Total Fees:</span>
                        <strong>$${totalFees}</strong>
                    </div>
                    <div class="rank-item">
                        <span>Total Paid:</span>
                        <strong>$${totalPaid}</strong>
                    </div>
                    <div class="rank-item">
                        <span>Total Balance:</span>
                        <strong>$${totalBalance}</strong>
                    </div>
                </div>
                
                <div class="print-controls no-print">
                    <button class="print-btn" onclick="window.print()">Print Report</button>
                </div>
            `;
            break;
            
        case 'exam-results':
            const examClassFilter = document.getElementById('report-exam-class').value;
            const examSubjectFilter = document.getElementById('report-exam-subject').value;
            
            const filteredGrades = grades.filter(grade => {
                return (examClassFilter === '' || grade.classForm === examClassFilter) && 
                       (examSubjectFilter === '' || grade.subject === examSubjectFilter);
            });
            
            // Group by student for averages
            const studentAverages = {};
            filteredGrades.forEach(grade => {
                if (!studentAverages[grade.studentId]) {
                    studentAverages[grade.studentId] = {
                        name: grade.studentName,
                        classForm: grade.classForm,
                        scores: [],
                        count: 0,
                        total: 0
                    };
                }
                studentAverages[grade.studentId].scores.push(grade.score);
                studentAverages[grade.studentId].count++;
                studentAverages[grade.studentId].total += grade.score;
            });
            
            // Calculate averages
            Object.keys(studentAverages).forEach(studentId => {
                studentAverages[studentId].average = 
                    studentAverages[studentId].total / studentAverages[studentId].count;
            });
            
            reportContent = `
                <div class="report-header">
                    <div class="school-logo-placeholder">[LOGO]</div>
                    <div class="school-info">
                        <h2>GENERAL HIGH SCHOOL</h2>
                        <p>123 Education Road, Academic City</p>
                    </div>
                </div>
                <h3>Exam Results Report</h3>
                <div class="report-meta">
                    <div class="report-meta-item">
                        <strong>Generated on:</strong>
                        <span>${new Date().toLocaleDateString()}</span>
                    </div>
                    ${examClassFilter ? `
                    <div class="report-meta-item">
                        <strong>Class/Form:</strong>
                        <span>${examClassFilter}</span>
                    </div>` : ''}
                    ${examSubjectFilter ? `
                    <div class="report-meta-item">
                        <strong>Subject:</strong>
                        <span>${examSubjectFilter}</span>
                    </div>` : ''}
                    <div class="report-meta-item">
                        <strong>Total Records:</strong>
                        <span>${filteredGrades.length}</span>
                    </div>
                </div>
                
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Score</th>
                            <th>Grade</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredGrades.map(grade => `
                            <tr>
                                <td>${grade.studentId}</td>
                                <td>${grade.studentName}</td>
                                <td>${grade.classForm}</td>
                                <td>${grade.subject}</td>
                                <td>${grade.score}</td>
                                <td>${grade.grade}</td>
                                <td>${grade.remarks || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                ${examSubjectFilter === '' ? `
                    <div class="page-break"></div>
                    <h3>Student Averages</h3>
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Class/Form</th>
                                <th>Average Score</th>
                                <th>Average Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.keys(studentAverages)
                                .map(id => ({ id, average: studentAverages[id].average }))
                                .sort((a, b) => b.average - a.average)
                                .map((student, index) => {
                                    const studentData = studentAverages[student.id];
                                    const avgGrade = calculateGrade(student.average);
                                    return `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${student.id}</td>
                                            <td>${studentData.name}</td>
                                            <td>${studentData.classForm}</td>
                                            <td>${student.average.toFixed(1)}</td>
                                            <td>${avgGrade}</td>
                                        </tr>
                                    `;
                                }).join('')}
                        </tbody>
                    </table>
                ` : ''}
                
                <div class="print-controls no-print">
                    <button class="print-btn" onclick="window.print()">Print Report</button>
                </div>
            `;
            break;
    }
    
    reportResults.innerHTML = reportContent;
    reportResults.classList.remove('hidden');
    
    if (format !== 'html') {
        alert(`In a real application, this would generate and download a ${format.toUpperCase()} file.`);
    }
}

// Add this to script.js after the existing code

// Function to filter and display data by form
function filterByForm(form) {
    // Filter students
    const filteredStudents = students.filter(student => student.classForm === form);
    renderStudentTable('', form);
    
    // Filter grades
    renderGradesTable(form, '');
    
    // Filter fees
    renderFeesTable(form, '');
    
    // Update UI to show current form filter
    document.querySelectorAll('.form-filter').forEach(el => {
        el.textContent = `Current Filter: ${form}`;
    });
    
    // Highlight the form in classes section
    const formItems = document.querySelectorAll('#classes-list li');
    formItems.forEach(item => {
        item.classList.remove('active-form');
        if (item.textContent.includes(form)) {
            item.classList.add('active-form');
        }
    });
}

// Add event listeners to form items in classes section
document.querySelectorAll('#classes-list li').forEach(item => {
    item.addEventListener('click', function() {
        const form = this.textContent.split(' ')[0] + ' ' + this.textContent.split(' ')[1];
        filterByForm(form);
        setActiveSection('students'); // Show students by default
    });
});