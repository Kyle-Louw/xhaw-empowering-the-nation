// mobile menu toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinksMenu = document.getElementById('navLinks');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinksMenu.classList.toggle('show');
    });
}

// function to get discount percentage based on number of courses
// 1 course = 0%, 2 courses = 5%, 3 courses = 10%, 4+ = 15%
function getDiscountPercent(courseCount) {
    if (courseCount === 2) return 5;
    if (courseCount === 3) return 10;
    if (courseCount >= 4) return 15;
    return 0;
}

// main calculation function
function calculateTotal() {
    // get all checkboxes
    const checkboxes = document.querySelectorAll('.course-checkbox input');
    let subtotal = 0;
    let selectedCourses = [];
    
    // loop through and add up fees for checked boxes
    checkboxes.forEach(cb => {
        if (cb.checked) {
            const fee = parseInt(cb.getAttribute('data-fee'));
            subtotal += fee;
            selectedCourses.push(cb.value);
        }
    });
    
    const courseCount = selectedCourses.length;
    
    // if no courses selected, return null
    if (courseCount === 0) {
        return null;
    }
    
    // calculate discount and VAT
    const discountPercent = getDiscountPercent(courseCount);
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const vat = afterDiscount * 0.15;
    const total = afterDiscount + vat;
    
    return {
        subtotal: subtotal,
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        afterDiscount: afterDiscount,
        vat: vat,
        total: total,
        courseCount: courseCount,
        selectedCourses: selectedCourses
    };
}

// display results on the page
function displayResults(calc) {
    const resultsDiv = document.getElementById('results');
    const detailsDiv = document.getElementById('calculationDetails');
    
    if (!calc) {
        resultsDiv.classList.remove('show');
        document.getElementById('courseError').classList.add('show');
        return;
    }
    
    document.getElementById('courseError').classList.remove('show');
    
    let discountText = calc.discountPercent > 0 ? calc.discountPercent + '% Discount' : 'No discount';
    
    detailsDiv.innerHTML = `
        <div class="calc-row">
            <span>Subtotal:</span>
            <strong>R${calc.subtotal.toFixed(2)}</strong>
        </div>
        <div class="calc-row">
            <span>Discount (${discountText}):</span>
            <strong style="color: var(--forest);">- R${calc.discountAmount.toFixed(2)}</strong>
        </div>
        <div class="calc-row">
            <span>Subtotal after discount:</span>
            <strong>R${calc.afterDiscount.toFixed(2)}</strong>
        </div>
        <div class="calc-row">
            <span>VAT (15%):</span>
            <strong>+ R${calc.vat.toFixed(2)}</strong>
        </div>
        <div class="calc-row total">
            <span><i class="fas fa-credit-card"></i> Total Quoted Fee:</span>
            <strong style="font-size: 1.3rem; color: var(--forest);">R${calc.total.toFixed(2)}</strong>
        </div>
    `;
    
    resultsDiv.classList.add('show');
}

// validate all form fields
function validateForm() {
    let isValid = true;
    
    // name validation - cannot be empty
    const name = document.getElementById('fullName').value.trim();
    if (name.length < 2) {
        document.getElementById('nameError').classList.add('show');
        document.getElementById('fullName').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('nameError').classList.remove('show');
        document.getElementById('fullName').classList.remove('error');
    }
    
    // phone validation - must start with 0 and have 10 digits
    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^[0][0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').classList.add('show');
        document.getElementById('phone').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('phoneError').classList.remove('show');
        document.getElementById('phone').classList.remove('error');
    }
    
    // email validation - must have @ and a dot
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').classList.add('show');
        document.getElementById('email').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('emailError').classList.remove('show');
        document.getElementById('email').classList.remove('error');
    }
    
    // course validation - at least one selected
    const anyChecked = document.querySelectorAll('.course-checkbox input:checked').length > 0;
    if (!anyChecked) {
        document.getElementById('courseError').classList.add('show');
        isValid = false;
    } else {
        document.getElementById('courseError').classList.remove('show');
    }
    
    return isValid;
}

// when calculate button is clicked
document.getElementById('calculateBtn').addEventListener('click', () => {
    const calc = calculateTotal();
    displayResults(calc);
});

// auto calculate when checkboxes change
document.querySelectorAll('.course-checkbox input').forEach(cb => {
    cb.addEventListener('change', () => {
        const calc = calculateTotal();
        if (calc) {
            displayResults(calc);
        } else {
            document.getElementById('results').classList.remove('show');
        }
    });
});

// when form is submitted
document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault(); // stop page from refreshing
    
    const calc = calculateTotal();
    displayResults(calc);
    
    if (!validateForm() || !calc) {
        return;
    }
    
    // store enquiry in localStorage (array format for consultant)
    const enquiry = {
        name: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        courses: calc.selectedCourses,
        total: calc.total,
        timestamp: new Date().toISOString()
    };
    
    let enquiries = JSON.parse(localStorage.getItem('courseEnquiries') || '[]');
    enquiries.push(enquiry);
    localStorage.setItem('courseEnquiries', enquiries);
    
    // show success message
    const successDiv = document.getElementById('successMsg');
    successDiv.classList.add('show');
    successDiv.scrollIntoView({ behavior: 'smooth' });
    
    // hide after 5 seconds
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 5000);
});

// remove error when user types in name field
document.getElementById('fullName').addEventListener('input', () => {
    if (document.getElementById('fullName').value.trim().length >= 2) {
        document.getElementById('nameError').classList.remove('show');
        document.getElementById('fullName').classList.remove('error');
    }
});

// remove error when user types valid phone
document.getElementById('phone').addEventListener('input', () => {
    const phoneRegex = /^[0][0-9]{9}$/;
    if (phoneRegex.test(document.getElementById('phone').value.trim())) {
        document.getElementById('phoneError').classList.remove('show');
        document.getElementById('phone').classList.remove('error');
    }
});

// remove error when user types valid email
document.getElementById('email').addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(document.getElementById('email').value.trim())) {
        document.getElementById('emailError').classList.remove('show');
        document.getElementById('email').classList.remove('error');
    }
});
