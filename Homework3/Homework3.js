document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
        const formattedDate = 
            String(today.getMonth() + 1).padStart(2, '0') + '/' +
            String(today.getDate()).padStart(2, '0') + '/' +
            String(today.getFullYear());
        const dateElement = document.getElementById('date');
        if (dateElement) dateElement.textContent = formattedDate;

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function setBirthLimits() {
        const birthInput = document.getElementById('birth');
        if (!birthInput) return;
        const today = new Date();
            const maxDateString = formatDate(today);
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - 120);
            const minDateString = formatDate(minDate);
            birthInput.setAttribute('max', maxDateString);
            birthInput.setAttribute('min', minDateString);
            console.log(`Birth date range set from ${minDateString} to ${maxDateString}`);
    }
    setBirthLimits();

    const form = document.getElementById('wellnessform');
    if (!form) return;
    const fieldsToValidate = form.querySelectorAll('input, textarea');

    function validateField(inputElement) {
        const errorSpan = document.getElementById(inputElement.id + '_text');
        const value = inputElement.value.trim();
        let errorMessage = '';

        if (!inputElement.checkValidity()) {
            const validity = inputElement.validity;
            
            if (validity.valueMissing) {
                errorMessage = `${inputElement.name || 'This field'} is required.`;
            }
            else if (validity.tooShort){
                errorMessage = `${inputElement.name} must be at least ${inputElement.minLength} characters long.`;
            } 
            else if (validity.patternMismatch && value.length > 0) {
                errorMessage = inputElement.title || `Please match the required format.`;
            }
            else if (value.length > inputElement.maxLength){
                errorMessage = `${inputElement.name} can only be ${inputElement.maxLength} characters long.`;
            }
            else if (validity.typeMismatch) {
                errorMessage = `Please enter a valid ${inputElement.name}`;
            }
            
            if (errorSpan) {
                 errorSpan.textContent = errorMessage;   
                 errorSpan.style.color = 'red';
            } 
            else {
                if (['firstname', 'middleinit', 'lastname', 'city', 'zip'].includes(inputElement.id)) {
            } else {
                if (errorSpan) errorSpan.textContent = '';
                inputElement.classList.remove('invalid');
                return true;
            }
        }
            let displayValue = value;
            if (inputElement.type === 'password') {
                displayValue = '*'.repeat(value.length) + ' (Accepted) ';
            }
            if (errorSpan) {
                errorSpan.textContent = displayVale;
                errorSpan.style.color = 'green';
            }
            inputElement.classList.remove('invaild');
            return true;
        }

        fieldsToValidate.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => validateField(field));
            field.addEventListener('change', () => validateField(field));
        });
        form.addEventListener('submit', function(event) {
            const usernameInput = document.getElementById('username');
            if (usernameInput) usernameInput.value = usernameInput.value.toLowerCase();

            const passwordInput = document.getElementById('password');
            const confirmInput = document.getElementById('vpass');
            const passwordError = document.getElementById('password_text');
            const confirmError = document.getElementById('vpass_text');
            const firstname = document.getElementById('firstname')?.value.toLowerCase() || '';
            const lastname = document.getElementById('lastname')?.value.toLowerCase() || '';

                let formIsValid = true;
                let password = passwordInput.value;
                let confirmPassword = confirmInput.value;

                const lowerPassword = password.toLowerCase();
                const lowerUsername = usernameInput?.value.toLowerCase() || '';
                const lowerFirstname = firstname.toLowerCase();
                const lowerLastname = lastname.toLowerCase();

                const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+.,`~<>])[A-Za-z\d!@#$%^&*()\-_=+.,`~<>]{8,30}$/;

                passwordError.textContent = '';
                confirmError.textContent = '';

                if (!passwordPattern.test(password)) {
                    passwordError.textContent = 'Password must be 8 to 30 characters and have at least one uppercase, lowercase, number, and special character.';
                    formIsValid = false;
                }
                if (password.includes('"') || password.includes("'")) {
                    passwordError.textContent = 'Qoutes are not allowed.';
                    formIsValid = false;
                }
                if (
                    lowerPassword.includes(lowerUsername) ||
                    lowerPassword.includes(lowerFirstname) ||
                    lowerPassword.includes(lowerLastname)
                ) {
                    passwordError.textContent = 'Password cannot contain your username or name.';
                    formIsValid = false;
                }
                if (password !== confirmPassword) {
                    confirmError.textContent = 'Passwords do not match.';
                    formIsValid = false;
                }
            fieldsToValidate.forEach(field => {
                if (!validateField(field)) formIsValid = false;
            });
            if (!formIsValid) {
                event.preventDefault();
                alert('Please review and correct the errors');
            }
        });

    const ssnInput = document.getElementById('ssn');
    if (ssnInput) {
        ssnInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            let formattedValue = '';
            if (value.length > 0) formattedValue += value.substring(0,3);
            if (value.length > 3) formattedValue += '-' + value.substring(3,5);
            if (value.length > 5) formattedValue += '-' + value.substring(5,9);
            this.value = formattedValue;    
        });
    }
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.substring(0,10);
            let formattedValue = '';
            if (value.length > 0) formattedValue += value.substring(0,3);
            if (value.length > 3) formattedValue += '-' + value.substring(3,6);
            if (value.length > 6) formattedValue += '-' + value.substring(6,10);
            this.value = formattedValue;    
        });
    }
    const zipInput = document.getElementById('zip');
    if (zipInput) {
        zipInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 9) value = value.substring(0, 9);
            if (value.length > 5) value = value.substring(0, 5) + '-' + value.substring (5);
            this.value = value;
        });
    }
    document.getElementById('review').addEventListener('click', function() {
        const form = document.getElementById('wellnessform');
        const output = document.getElementById('reviewoutput');
        output.innerHTML = '';
        const handledRadioGroups = new Set();

        Array.from(form.elements).forEach(element => {
            if (['button', 'submit', 'reset'].includes(element.type)) return;

            let value = '';
            let validationMessage = 'Pass';

            if (element.type === 'radio') {
                if (handledRadioGroups.has(element.name)) return;
                const selected = form.querySelector(`input[name="${element.name}"]:checked`);
                if (!selected) return;
                value = selected.value;
                handledRadioGroups.add(element.name);

            }else if (element.type === 'checkbox') {
                if (!element.checked) return;
                value = 'Checked';

            } else {
                value = element.value.trim();
                if (!value) return;
            
            if (['text', 'password', 'textarea', 'number', 'tel', 'email'].includes(element.type)){
                if (element.minLength > 0 && value.length < element.minLength) {
                    validationMessage = `error (min length ${element.minLength})`;
            } else if (element.maxLength > 0 && value.length > element.maxLength) {
                validationMessage = `error (max length ${element.maxLength})`;
            } else if (element.pattern) {
                const regex = new RegExp(`^${element.pattern}$`);
                if (!regex.test(value)) validationMessage = 'error (invalid format)';
            }
        } 
            if (element.id === 'vpass') {
                const passwordElement = document.getElementById('password');
                if (value !== passwordElement.value) validationMessage = 'error (password does not match)';
            }
        }
            const displayValue = (element.type === 'password') ? '*'.repeat(value.length) : value;
            const line = document.createElement('div');

            line.textContent = validationMessage 
                    ? `${element.name || element.id} : ${displayValue} ${validationMessage}` 
                    : `${element.name || element.id} : ${displayValue}`;

            line.style.color = validationMessage.startsWith('error') ? 'red' : 'green';
            output.appendChild(line);
        });
    });
    const resetButton = document.getElementById('reset');
    const reviewOutput = document.getElementById('reviewoutput');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (reviewOutput) reviewOutput.innerHTML = '';
            fieldsToValidate.forEach(field => {
                field.classList.remove('invalid');
                const errorSpan = document.getElementById(field.id + '_text');
                if (errorSpan) errorSpan.textContent = '';
            });
        });
    }
    var slider = document.getElementById("pain");
    var output = document.getElementById("val");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    function updateNameDisplay() {
        const firstname = document.getElementById('firstname')?.value.trim() || '';
        const middleinit = document.getElementById('middleinit')?.value.trim() || '';
        const lastname = document.getElementById('lastname')?.value.trim() || '';
        const nameTextSpan = document.getElementById('name_text');

        let fullname = `${firstname} ${middleinit} ${lastname}`.replace(/\s+/g, ' ').trim();

        if (nameTextSpan) {
            if (fullname) {
                nameTextSpan.textContent = fullname;
                nameTextSpan.style.color = 'green';
            } 
            else {
                nameTextSpan.textContent = '';
            }
        }
    }
        document.getElementById('firstname')?.addEventListener('blur', updateNameDisplay);
        document.getElementById('middleinit')?.addEventListener('blur', updateNameDisplay);
        document.getElementById('lastname')?.addEventListener('blur', updateNameDisplay);

    function updateLocationDisplay() {
        const city = document.getElementById('city')?.value.trim() || '';
        const stateSelect = document.getElementById('state');
        const state = stateSelect?.options[stateSelect.selectedIndex]?.text.trim() || '';
        const zip = document.getElementById('zip')?.value.trim() || '';
        const locationTextSpan = document.getElementById('city_text');

        let fullLocation = `${city}  ${state} ${zip}`.replace(/\s+/g, ' ').trim();
        if (fullLocation.endsWith(',')) fullLocation = fullLocation.slice(0, -1);

        if (locationTextSpan) {
            if (fullLocation.length > 3) {
                locationTextSpan.textContent = fullLocation;
                locationTextSpan.style.color = 'green';
            }
            else {
                locationTextSpan.textContent = '';
            }
        }
    }
        document.getElementById('city')?.addEventListener('blur', updateLocationDisplay);
        document.getElementById('state')?.addEventListener('change', updateLocationDisplay);
        document.getElementById('zip')?.addEventListener('blur', updateLocationDisplay);
});
