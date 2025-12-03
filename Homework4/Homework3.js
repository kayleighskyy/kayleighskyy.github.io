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
    const submitButton = document.getElementById('submit');

    function validateField(inputElement) {
        const errorSpan = document.getElementById(inputElement.id + '_text');
        let errorMessage = '';
        const value = inputElement.value.trim();
        const validity = inputElement.validity;

        if (errorSpan) errorSpan.textContent = '';

            if (validity.valueMissing) {
                errorMessage = `${inputElement.name || 'This field'} is required.`;
            }
            else if (value.length > 0 && inputElement.minLength > 0 && value.length < inputElement.minLength){
                errorMessage = `${inputElement.name} must be at least ${inputElement.minLength} characters long.`;
            } 
            else if (inputElement.pattern && value.length > 0) {
                const regex = new RegExp(inputElement.pattern);
                if (!regex.test(value)){
                    errorMessage = inputElement.title || `Invalid format for ${inputElement.name}.`;
                }
            }
            else if (inputElement.maxLength > 0 && value.length > inputElement.maxLength){
                errorMessage = `${inputElement.name} can only be ${inputElement.maxLength} characters long.`;
            }
            else if (validity.typeMismatch) {
                errorMessage = `Please enter a valid ${inputElement.name}`;
            }
            if (errorMessage) {
                 if (errorSpan) errorSpan.textContent = errorMessage;
                 inputElement.classList.add('invalid');
                 return false;
            } 
                inputElement.classList.remove('invalid');
                return true;
            }

        function validatePasswordFields() {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const confirmInput = document.getElementById('vpass');
            const passwordError = document.getElementById('password_text');
            const confirmError = document.getElementById('vpass_text');
            const firstname = document.getElementById('firstname')?.value.toLowerCase() || '';
            const lastname = document.getElementById('lastname')?.value.toLowerCase() || '';
        
            if (!passwordInput || !confirmInput || !passwordError || !confirmError) return true;

                let passwordIsValid = true;
                let password = passwordInput.value;
                let confirmPassword = confirmInput.value;
            
                passwordError.textContent = '';
                confirmError.textContent = '';
                passwordInput.classList.remove('invalid');
                confirmInput.classList.remove('invalid');
            
                const lowerPassword = password.toLowerCase();
                const lowerUsername = usernameInput?.value.toLowerCase() || '';
                const lowerFirstname = firstname.toLowerCase();
                const lowerLastname = lastname.toLowerCase();
            
                const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+.,`~<>])[A-Za-z\d!@#$%^&*()\-_=+.,`~<>]{8,30}$/;

                if (!passwordPattern.test(password)) {
                    passwordError.textContent = 'Password must be 8 to 30 characters and have at least one uppercase, lowercase, number, and special character.';
                    passwordInput.classList.add('invalid');
                    passwordIsValid = false;
                }
                if (password.includes('"') || password.includes("'")) {
                    if (passwordIsValid) passwordError.textContent = 'Qoutes are not allowed.';
                    passwordInput.classList.add('invalid');
                    passwordIsValid = false;
                }
                if (
                    lowerPassword.includes(lowerUsername) ||
                    lowerPassword.includes(lowerFirstname) ||
                    lowerPassword.includes(lowerLastname)
                ) {
                    if (passwordIsValid) passwordError.textContent = 'Password cannot contain your username or name.';
                    passwordInput.classList.add('invalid');
                    passwordIsValid = false;
                }
                if (password !== confirmPassword) {
                    confirmError.textContent = 'Passwords do not match.';
                    confirmInput.classList.add('invalid');
                    passwordIsValid = false;
                }
                return passwordIsValid;
        }
           
     fieldsToValidate.forEach(field => {
            field.addEventListener('blur', () => {
                validateField(field); updateSubmitButton();
         });
            field.addEventListener('input', () => {
                validateField(field); updateSubmitButton();
        });
            field.addEventListener('change', updateSubmitButton);
        });

    form.addEventListener('submit', function(event) {
        const usernameInput = document.getElementById('username');
        if (usernameInput) usernameInput.value = usernameInput.value.toLowerCase();

        let formIsValid = true;

        fieldsToValidate.forEach(field => {
            if (!validateField(field)) formIsValid = false;
        });
        if (!validatePasswordFields()) formIsValid = false;
        const radios = form.querySelectorAll('input[type="radio"]');
        const radioGroups = new Set ();
        radios.forEach(radio => {
            if (radioGroups.has(radio.name)) return;
            radioGroups.add(radio.name);
            const selected = form.querySelector(`input[name="${radio.name}"]:checked`);
            if (!selected) formIsValid = false;
        });
        const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
        checkboxes.forEach(cb => {
            if (!cb.checked) formIsValid = false;
        });
        const selects = form.querySelectorAll('select[required]');
        selects.forEach(sel => {
            if (!sel.value) formIsValid = false;
        });
        if (!formIsValid) {
            event.preventDefault();
            alert('Please review errors and correct before submitting the form.');
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
            updateSubmitButton();
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
            updateSubmitButton();
        });
    }
    const zipInput = document.getElementById('zip');
    if (zipInput) {
        zipInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 9) value = value.substring(0, 9);
            if (value.length > 5) value = value.substring(0, 5) + '-' + value.substring (5);
            this.value = value;
            updateSubmitButton();
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
            updateSubmitButton();
        });
    }
    var slider = document.getElementById("pain");
    var output = document.getElementById("val");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        output.innerHTML = this.value;
        updateSubmitButton();
    }

    function updateSubmitButton() {
        if (!submitButton) return;
        let allValid = true;

        fieldsToValidate.forEach(field => {
            if (!field.checkValidity()) allValid = false;
        });
        if (!validatePasswordFields()) allValid = false; 
        const radios = form.querySelectorAll('input[type="radio"]');
        const radioGroups = new Set();
        radios.forEach(radio => {
            if (radioGroups.has(radio.name)) return;
                radioGroups.add(radio.name);
                const selected = form.querySelector(`input[name="${radio.name}"]:checked`);
                const isRequired = form.querySelector(`input[name="${radio.name}"][required]`);
                if (isRequired && !selected) {
                    allValid = false;
            }
        });
        const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
        checkboxes.forEach(cb => {
            if (!cb.checked) allValid = false;
        });
        const selects = form.querySelectorAll('select[required]');
        selects.forEach(sel => {
            if (!sel.value) allValid = false;
        });

    submitButton.disabled = !allValid;
    submitButton.classList.toggle('disabled-button-style', !allValid);
    
}
    form.querySelectorAll('input[type="radio"]').forEach (radio => {
        radio.addEventListener('change', updateSubmitButton);
    });
    form.querySelectorAll('input[type="checkbox"]').forEach (cb => {
        cb.addEventListener('change', updateSubmitButton);
    });
    form.querySelectorAll('select').forEach (sel => {
        sel.addEventListener('change', updateSubmitButton);
    });
    updateSubmitButton();
                                                 
});
