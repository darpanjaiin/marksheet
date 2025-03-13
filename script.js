// Get DOM elements
const form = document.getElementById('marksheetForm');
const marksheet = document.getElementById('marksheet');
const downloadButtons = document.querySelector('.download-buttons');
const downloadPDFButton = document.getElementById('downloadPDF');
const downloadImageButton = document.getElementById('downloadImageButton');
const examDisplay = document.getElementById('examDisplay');
const examTitleDisplay = document.getElementById('examTitleDisplay');
const examTypeDisplay = document.getElementById('examTypeDisplay');

// Exam attempt options based on exam type
const examAttemptOptions = {
    'CA Final': [
        'May 2025', 'November 2025',
        'May 2026', 'November 2026',
        'May 2027', 'November 2027',
        'May 2028', 'November 2028'
    ],
    'CA Intermediate': [
        'May 2025', 'September 2025',
        'January 2026', 'May 2026', 'September 2026',
        'January 2027', 'May 2027', 'September 2027',
        'January 2028', 'May 2028', 'September 2028'
    ],
    'CA Foundation': [
        'May 2025', 'September 2025',
        'January 2026', 'May 2026', 'September 2026',
        'January 2027', 'May 2027', 'September 2027',
        'January 2028', 'May 2028', 'September 2028'
    ]
};

// Subject definitions for each exam type
const examSubjects = {
    'CA Final': {
        group1: [
            { id: 'fr', name: 'Financial Reporting' },
            { id: 'afm', name: 'Advanced Financial Management' },
            { id: 'aaa', name: 'Advanced Auditing and Assurance' }
        ],
        group2: [
            { id: 'dtit', name: 'Direct Tax & International Taxation' },
            { id: 'itl', name: 'Indirect Tax Laws' },
            { id: 'ibs', name: 'Integrated Business Solutions' }
        ]
    },
    'CA Intermediate': {
        group1: [
            { id: 'accounting', name: 'Accounting' },
            { id: 'corporateLaws', name: 'Corporate and Other Laws' },
            { id: 'taxation', name: 'Taxation' }
        ],
        group2: [
            { id: 'costAccounting', name: 'Cost and Management Accounting' },
            { id: 'auditing', name: 'Auditing and Assurance' },
            { id: 'fm', name: 'Financial Management and Strategic Management' }
        ]
    },
    'CA Foundation': {
        subjects: [
            { id: 'accounting_f', name: 'Accounting' },
            { id: 'law_f', name: 'Business Laws' },
            { id: 'maths_f', name: 'Quantitative Aptitude (Maths)' },
            { id: 'economics_f', name: 'Business Economics' }
        ]
    }
};

// Store exemption states
const exemptionStates = {};

// Function to check if a subject is exempt
function isExempt(subjectId) {
    return exemptionStates[subjectId] === true;
}

// Function to toggle exemption state
function toggleExemption(subjectId) {
    const input = document.getElementById(subjectId);
    const button = input.nextElementSibling;
    const marks = parseInt(input.value);

    if (marks >= 60) {
        exemptionStates[subjectId] = !exemptionStates[subjectId];
        button.classList.toggle('active');
    }
}

// Function to update exemption button state
function updateExemptionButton(subjectId) {
    const input = document.getElementById(subjectId);
    const button = input.nextElementSibling;
    const marks = parseInt(input.value);

    if (marks >= 60) {
        button.disabled = false;
    } else {
        button.disabled = true;
        button.classList.remove('active');
        exemptionStates[subjectId] = false;
    }
}

// Add input event listeners for all subject inputs
document.addEventListener('DOMContentLoaded', function() {
    const subjects = [
        'fr', 'afm', 'aaa', 'dtit', 'itl', 'ibs',  // CA Final
        'accounting', 'corporateLaws', 'taxation', 'costAccounting', 'auditing', 'fm'  // CA Intermediate
    ];

    subjects.forEach(subject => {
        const input = document.getElementById(subject);
        if (input) {
            input.addEventListener('input', () => updateExemptionButton(subject));
        }
    });
});

// Function to format marks with leading zeros
function formatMarks(marks) {
    return marks.toString().padStart(3, '0');
}

// Function to check if subject marks meet minimum requirement
function isSubjectPassed(marks) {
    return marks >= 40;
}

// Function to check if a group is passed (for CA Final and Intermediate)
function isGroupPassed(marks1, marks2, marks3, groupTotal) {
    // Check if all subjects have minimum marks
    const allSubjectsPassed = isSubjectPassed(marks1) && isSubjectPassed(marks2) && isSubjectPassed(marks3);
    
    // Check if group total is >= 150
    const totalPassed = groupTotal >= 150;
    
    return allSubjectsPassed && totalPassed;
}

// Function to check if CA Foundation is passed
function isFoundationPassed(marks1, marks2, marks3, marks4, totalMarks) {
    // Check if all subjects have minimum marks
    const allSubjectsPassed = isSubjectPassed(marks1) && isSubjectPassed(marks2) && 
                             isSubjectPassed(marks3) && isSubjectPassed(marks4);
    
    // Check if total is >= 200
    const totalPassed = totalMarks >= 200;
    
    return allSubjectsPassed && totalPassed;
}

// Function to determine overall result for CA Final and Intermediate
function determineResult(group1Total, group2Total, allSubjectsPassed) {
    // If any subject is below 40, fail
    if (!allSubjectsPassed) {
        return "UNSUCCESSFUL";
    }
    
    // If combined total is >= 300, pass
    if (group1Total + group2Total >= 300) {
        return "SUCCESSFUL";
    }
    
    // If both groups individually have >= 150, pass
    if (group1Total >= 150 && group2Total >= 150) {
        return "SUCCESSFUL";
    }
    
    return "UNSUCCESSFUL";
}

// Function to check if device is mobile
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to populate exam attempt dropdown based on selected exam type
function populateExamAttempts(examType) {
    const examAttemptSelect = document.getElementById('examAttempt');
    examAttemptSelect.innerHTML = '';
    
    examAttemptOptions[examType].forEach(attempt => {
        const option = document.createElement('option');
        option.value = attempt;
        option.textContent = attempt;
        examAttemptSelect.appendChild(option);
    });
}

// Function to show/hide subject sections based on exam type
function toggleSubjectSections(examType) {
    const caFinalSubjects = document.getElementById('caFinalSubjects');
    const caIntermediateSubjects = document.getElementById('caIntermediateSubjects');
    const caFoundationSubjects = document.getElementById('caFoundationSubjects');
    
    // Hide all sections first
    caFinalSubjects.style.display = 'none';
    caIntermediateSubjects.style.display = 'none';
    caFoundationSubjects.style.display = 'none';
    
    // Show the appropriate section
    if (examType === 'CA Final') {
        caFinalSubjects.style.display = 'block';
        // Set required attributes for CA Final inputs
        setRequiredAttributes('caFinalSubjects', true);
        setRequiredAttributes('caIntermediateSubjects', false);
        setRequiredAttributes('caFoundationSubjects', false);
    } else if (examType === 'CA Intermediate') {
        caIntermediateSubjects.style.display = 'block';
        // Set required attributes for CA Intermediate inputs
        setRequiredAttributes('caFinalSubjects', false);
        setRequiredAttributes('caIntermediateSubjects', true);
        setRequiredAttributes('caFoundationSubjects', false);
    } else if (examType === 'CA Foundation') {
        caFoundationSubjects.style.display = 'block';
        // Set required attributes for CA Foundation inputs
        setRequiredAttributes('caFinalSubjects', false);
        setRequiredAttributes('caIntermediateSubjects', false);
        setRequiredAttributes('caFoundationSubjects', true);
    }
}

// Function to set required attributes for inputs in a container
function setRequiredAttributes(containerId, isRequired) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.required = isRequired;
    });
}

// Function to populate subject rows in the marksheet
function populateSubjectRows(examType) {
    const group1Subjects = document.getElementById('group1Subjects');
    const group2Subjects = document.getElementById('group2Subjects');
    const foundationSubjectsList = document.getElementById('foundationSubjectsList');
    const groupedSubjects = document.getElementById('groupedSubjects');
    const foundationSubjects = document.getElementById('foundationSubjects');
    const grandTotal = document.querySelector('.grand-total');
    
    // Clear previous content
    group1Subjects.innerHTML = '';
    group2Subjects.innerHTML = '';
    foundationSubjectsList.innerHTML = '';
    
    if (examType === 'CA Final' || examType === 'CA Intermediate') {
        groupedSubjects.style.display = 'block';
        foundationSubjects.style.display = 'none';
        grandTotal.style.display = 'flex'; // Show Grand Total for Final and Intermediate
        
        // Reset any custom colors that might have been set for Foundation
        const totalRows = document.querySelectorAll('.total-row');
        const resultRows = document.querySelectorAll('.result-row');
        
        totalRows.forEach(row => {
            row.style.backgroundColor = ''; // Reset to default from CSS
        });
        
        resultRows.forEach(row => {
            row.style.backgroundColor = ''; // Reset to default from CSS
        });
        
        // Populate Group 1 subjects
        examSubjects[examType].group1.forEach(subject => {
            const subjectRow = document.createElement('div');
            subjectRow.className = 'subject-row';
            subjectRow.innerHTML = `
                <div class="subject">${subject.name}</div>
                <div class="marks" id="display${subject.id.charAt(0).toUpperCase() + subject.id.slice(1)}"></div>
            `;
            group1Subjects.appendChild(subjectRow);
        });
        
        // Populate Group 2 subjects
        examSubjects[examType].group2.forEach(subject => {
            const subjectRow = document.createElement('div');
            subjectRow.className = 'subject-row';
            subjectRow.innerHTML = `
                <div class="subject">${subject.name}</div>
                <div class="marks" id="display${subject.id.charAt(0).toUpperCase() + subject.id.slice(1)}"></div>
            `;
            group2Subjects.appendChild(subjectRow);
        });
    } else if (examType === 'CA Foundation') {
        groupedSubjects.style.display = 'none';
        foundationSubjects.style.display = 'block';
        grandTotal.style.display = 'none'; // Hide Grand Total for Foundation
        
        // Populate Foundation subjects
        examSubjects[examType].subjects.forEach(subject => {
            const subjectRow = document.createElement('div');
            subjectRow.className = 'subject-row';
            subjectRow.innerHTML = `
                <div class="subject">${subject.name}</div>
                <div class="marks" id="display${subject.id.charAt(0).toUpperCase() + subject.id.slice(1)}"></div>
            `;
            foundationSubjectsList.appendChild(subjectRow);
        });
        
        // Apply custom colors for Foundation
        // Wait for the DOM to update with the new elements
        setTimeout(() => {
            // Get the total row and result row in the Foundation section
            const foundationTotalRow = foundationSubjects.querySelector('.total-row');
            const foundationResultRow = foundationSubjects.querySelector('.result-row');
            
            if (foundationTotalRow) {
                foundationTotalRow.style.backgroundColor = '#91008d'; // Darker purple
            }
            
            if (foundationResultRow) {
                foundationResultRow.style.backgroundColor = '#ad5f9d'; // Lighter purple
            }
        }, 0);
    }
}

// Handle exam type change
document.getElementById('examType').addEventListener('change', function() {
    const examType = this.value;
    populateExamAttempts(examType);
    toggleSubjectSections(examType);
    populateSubjectRows(examType);
});

// Initialize form with CA Final selected
document.addEventListener('DOMContentLoaded', function() {
    const examTypeSelect = document.getElementById('examType');
    populateExamAttempts(examTypeSelect.value);
    toggleSubjectSections(examTypeSelect.value);
    populateSubjectRows(examTypeSelect.value);
    
    // Attach click handler to the download button
    const downloadImageButton = document.getElementById('downloadImageButton');
    if (downloadImageButton) {
        downloadImageButton.addEventListener('click', handleDownloadClick);
    }
});

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const examType = document.getElementById('examType').value;
    const examAttempt = document.getElementById('examAttempt').value;
    // Generate a random 6-digit roll number
    const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const name = document.getElementById('name').value.toUpperCase();
    
    // Update marksheet with exam type and attempt
    examTypeDisplay.textContent = examType.replace('CA ', '');
    examDisplay.textContent = examAttempt;
    examTitleDisplay.textContent = examAttempt;
    document.getElementById('displayRollNumber').textContent = rollNumber;
    document.getElementById('displayName').textContent = name;
    
    if (examType === 'CA Final') {
        processCaFinalForm();
    } else if (examType === 'CA Intermediate') {
        processCaIntermediateForm();
    } else if (examType === 'CA Foundation') {
        processCaFoundationForm();
    }
    
    // Make marksheet visible but hidden from view for capture
    marksheet.style.display = 'block';
    marksheet.style.position = 'absolute';
    marksheet.style.left = '-9999px';
    
    // Show loading state on the submit button
    const submitButton = document.querySelector('#marksheetForm button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }
    
    // Generate and redirect to marksheet.html
    generateAndOpenImage();
});

// Update the formatMarksWithExemption function
function formatMarksWithExemption(marks, isExempted) {
    const formattedMarks = formatMarks(marks);
    if (isExempted && marks >= 60) {
        return `${formattedMarks} E`;
    }
    return formattedMarks;
}

// Process CA Final form
function processCaFinalForm() {
    // Get marks
    const frMarks = parseInt(document.getElementById('fr').value);
    const afmMarks = parseInt(document.getElementById('afm').value);
    const aaaMarks = parseInt(document.getElementById('aaa').value);
    const dtitMarks = parseInt(document.getElementById('dtit').value);
    const itlMarks = parseInt(document.getElementById('itl').value);
    const ibsMarks = parseInt(document.getElementById('ibs').value);
    
    // Calculate totals
    const group1Total = frMarks + afmMarks + aaaMarks;
    const group2Total = dtitMarks + itlMarks + ibsMarks;
    const grandTotal = group1Total + group2Total;
    
    // Check if all subjects have minimum marks
    const allSubjectsPassed = isSubjectPassed(frMarks) && isSubjectPassed(afmMarks) && 
                             isSubjectPassed(aaaMarks) && isSubjectPassed(dtitMarks) && 
                             isSubjectPassed(itlMarks) && isSubjectPassed(ibsMarks);

    // Apply set-off logic
    let group1Result = "UNSUCCESSFUL";
    let group2Result = "UNSUCCESSFUL";
    let setOffApplied = false;

    if (allSubjectsPassed) {
        const group1Passed = group1Total >= 150;
        const group2Passed = group2Total >= 150;

        if (grandTotal >= 300 && ((group1Total < 150 && group2Total >= 150) || (group1Total >= 150 && group2Total < 150))) {
            group1Result = "SUCCESSFUL";
            group2Result = "SUCCESSFUL";
            setOffApplied = true;
        } else {
            group1Result = group1Passed ? "SUCCESSFUL" : "UNSUCCESSFUL";
            group2Result = group2Passed ? "SUCCESSFUL" : "UNSUCCESSFUL";
        }
    }
    
    // Update marks with exemptions
    document.getElementById('displayFr').textContent = formatMarksWithExemption(frMarks, isExempt('fr'));
    document.getElementById('displayAfm').textContent = formatMarksWithExemption(afmMarks, isExempt('afm'));
    document.getElementById('displayAaa').textContent = formatMarksWithExemption(aaaMarks, isExempt('aaa'));
    document.getElementById('displayDtit').textContent = formatMarksWithExemption(dtitMarks, isExempt('dtit'));
    document.getElementById('displayItl').textContent = formatMarksWithExemption(itlMarks, isExempt('itl'));
    document.getElementById('displayIbs').textContent = formatMarksWithExemption(ibsMarks, isExempt('ibs'));
    
    // Update totals and results
    document.getElementById('group1Total').textContent = formatMarks(group1Total);
    document.getElementById('group2Total').textContent = formatMarks(group2Total);
    document.getElementById('grandTotal').textContent = formatMarks(grandTotal) + (setOffApplied ? " <" : "");
    document.getElementById('group1Result').textContent = group1Result;
    document.getElementById('group2Result').textContent = group2Result;
}

// Process CA Intermediate form
function processCaIntermediateForm() {
    // Get marks
    const accountingMarks = parseInt(document.getElementById('accounting').value);
    const corporateLawsMarks = parseInt(document.getElementById('corporateLaws').value);
    const taxationMarks = parseInt(document.getElementById('taxation').value);
    const costAccountingMarks = parseInt(document.getElementById('costAccounting').value);
    const auditingMarks = parseInt(document.getElementById('auditing').value);
    const fmMarks = parseInt(document.getElementById('fm').value);
    
    // Calculate totals
    const group1Total = accountingMarks + corporateLawsMarks + taxationMarks;
    const group2Total = costAccountingMarks + auditingMarks + fmMarks;
    const grandTotal = group1Total + group2Total;
    
    // Check if all subjects have minimum marks
    const allSubjectsPassed = isSubjectPassed(accountingMarks) && isSubjectPassed(corporateLawsMarks) && 
                             isSubjectPassed(taxationMarks) && isSubjectPassed(costAccountingMarks) && 
                             isSubjectPassed(auditingMarks) && isSubjectPassed(fmMarks);

    // Apply set-off logic
    let group1Result = "UNSUCCESSFUL";
    let group2Result = "UNSUCCESSFUL";
    let setOffApplied = false;

    if (allSubjectsPassed) {
        const group1Passed = group1Total >= 150;
        const group2Passed = group2Total >= 150;

        if (grandTotal >= 300 && ((group1Total < 150 && group2Total >= 150) || (group1Total >= 150 && group2Total < 150))) {
            group1Result = "SUCCESSFUL";
            group2Result = "SUCCESSFUL";
            setOffApplied = true;
        } else {
            group1Result = group1Passed ? "SUCCESSFUL" : "UNSUCCESSFUL";
            group2Result = group2Passed ? "SUCCESSFUL" : "UNSUCCESSFUL";
        }
    }
    
    // Update marks with exemptions
    document.getElementById('displayAccounting').textContent = formatMarksWithExemption(accountingMarks, isExempt('accounting'));
    document.getElementById('displayCorporateLaws').textContent = formatMarksWithExemption(corporateLawsMarks, isExempt('corporateLaws'));
    document.getElementById('displayTaxation').textContent = formatMarksWithExemption(taxationMarks, isExempt('taxation'));
    document.getElementById('displayCostAccounting').textContent = formatMarksWithExemption(costAccountingMarks, isExempt('costAccounting'));
    document.getElementById('displayAuditing').textContent = formatMarksWithExemption(auditingMarks, isExempt('auditing'));
    document.getElementById('displayFm').textContent = formatMarksWithExemption(fmMarks, isExempt('fm'));
    
    // Update totals and results
    document.getElementById('group1Total').textContent = formatMarks(group1Total);
    document.getElementById('group2Total').textContent = formatMarks(group2Total);
    document.getElementById('grandTotal').textContent = formatMarks(grandTotal) + (setOffApplied ? " <" : "");
    document.getElementById('group1Result').textContent = group1Result;
    document.getElementById('group2Result').textContent = group2Result;
}

// Process CA Foundation form
function processCaFoundationForm() {
    // Get marks
    const accountingFMarks = parseInt(document.getElementById('accounting_f').value);
    const lawFMarks = parseInt(document.getElementById('law_f').value);
    const mathsFMarks = parseInt(document.getElementById('maths_f').value);
    const economicsFMarks = parseInt(document.getElementById('economics_f').value);
    
    // Calculate total
    const totalMarks = accountingFMarks + lawFMarks + mathsFMarks + economicsFMarks;
    
    // Check if all subjects have minimum marks
    const allSubjectsPassed = isSubjectPassed(accountingFMarks) && isSubjectPassed(lawFMarks) && 
                             isSubjectPassed(mathsFMarks) && isSubjectPassed(economicsFMarks);
    
    // Determine result
    const foundationResult = isFoundationPassed(accountingFMarks, lawFMarks, mathsFMarks, economicsFMarks, totalMarks) ? "SUCCESSFUL" : "UNSUCCESSFUL";
    
    // Update marks
    document.getElementById('displayAccounting_f').textContent = formatMarks(accountingFMarks);
    document.getElementById('displayLaw_f').textContent = formatMarks(lawFMarks);
    document.getElementById('displayMaths_f').textContent = formatMarks(mathsFMarks);
    document.getElementById('displayEconomics_f').textContent = formatMarks(economicsFMarks);
    
    // Update total and result
    document.getElementById('foundationTotal').textContent = formatMarks(totalMarks);
    document.getElementById('foundationResult').textContent = foundationResult;
    // No need to update grand total for Foundation as it's hidden
}

// Function to handle download button click
function handleDownloadClick() {
    const downloadImageButton = document.getElementById('downloadImageButton');
    
    // Show loading state
    downloadImageButton.disabled = true;
    downloadImageButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Image...';
    
    try {
        // Make sure the marksheet is visible for capture
        const originalDisplay = marksheet.style.display;
        marksheet.style.display = 'block';
        
        // Always use desktop scale for consistent output
        const scale = 2;
        
        // Simple configuration for html2canvas
        html2canvas(document.getElementById('marksheet'), {
            scale: scale,
            backgroundColor: '#ffffff',
            allowTaint: true,
            useCORS: true,
            borderRadius: 16 * scale, // Scale the border radius with the image scale
            onclone: function(clonedDoc) {
                const clonedMarksheet = clonedDoc.getElementById('marksheet');
                if (clonedMarksheet) {
                    clonedMarksheet.style.display = 'block';
                    
                    // Hide the logo in the cloned document before capture
                    const logoContainer = clonedMarksheet.querySelector('.logo-container');
                    if (logoContainer) {
                        logoContainer.style.display = 'none';
                    }
                    
                    // Adjust the header to center the title
                    const header = clonedMarksheet.querySelector('.header');
                    if (header) {
                        header.style.justifyContent = 'center';
                    }
                    
                    const title = clonedMarksheet.querySelector('.title');
                    if (title) {
                        title.style.margin = '0 auto';
                    }
                    
                    // Ensure Group headers don't have bottom borders
                    const groupHeaders = clonedMarksheet.querySelectorAll('.group h3');
                    groupHeaders.forEach(header => {
                        header.style.borderBottom = 'none';
                    });
                    
                    // Apply custom colors for CA Foundation if needed
                    const examType = document.getElementById('examType').value;
                    if (examType === 'CA Foundation') {
                        const foundationSubjects = clonedMarksheet.querySelector('#foundationSubjects');
                        if (foundationSubjects) {
                            const foundationTotalRow = foundationSubjects.querySelector('.total-row');
                            const foundationResultRow = foundationSubjects.querySelector('.result-row');
                            
                            if (foundationTotalRow) {
                                foundationTotalRow.style.backgroundColor = '#91008d'; // Darker purple
                            }
                            
                            if (foundationResultRow) {
                                foundationResultRow.style.backgroundColor = '#ad5f9d'; // Lighter purple
                            }
                        }
                    }
                }
            }
        }).then(function(canvas) {
            try {
                // For desktop devices, use normal download
                const link = document.createElement('a');
                const examDisplay = document.getElementById('examDisplay');
                const examType = document.getElementById('examTypeDisplay').textContent;
                const filename = `ICAI_${examType}_Marksheet_${examDisplay.textContent.replace(/\s+/g, '_')}.png`;
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // Reset button
                downloadImageButton.disabled = false;
                downloadImageButton.innerHTML = '<i class="fas fa-download"></i> Download Marksheet';
                
                // Restore original display
                marksheet.style.display = originalDisplay;
            } catch (error) {
                console.error('Download error:', error);
                alert('Download failed. Please try again.');
                downloadImageButton.disabled = false;
                downloadImageButton.innerHTML = '<i class="fas fa-download"></i> Download Marksheet';
                marksheet.style.display = originalDisplay;
            }
        }).catch(function(error) {
            console.error('Canvas error:', error);
            alert('Could not generate image. Please try again.');
            downloadImageButton.disabled = false;
            downloadImageButton.innerHTML = '<i class="fas fa-download"></i> Download Marksheet';
            marksheet.style.display = originalDisplay;
        });
    } catch (error) {
        console.error('General error:', error);
        alert('An error occurred. Please try again.');
        downloadImageButton.disabled = false;
        downloadImageButton.innerHTML = '<i class="fas fa-download"></i> Download Marksheet';
    }
}

// Function to generate and open image
function generateAndOpenImage() {
    try {
        // Show loading state on the submit button
        const submitButton = document.querySelector('#marksheetForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        }
        
        // Always use desktop scale for consistent output
        const scale = 2;
        
        // Simple configuration for html2canvas
        html2canvas(document.getElementById('marksheet'), {
            scale: scale,
            backgroundColor: '#ffffff',
            allowTaint: true,
            useCORS: true,
            borderRadius: 16 * scale, // Scale the border radius with the image scale
            onclone: function(clonedDoc) {
                const clonedMarksheet = clonedDoc.getElementById('marksheet');
                if (clonedMarksheet) {
                    clonedMarksheet.style.display = 'block';
                    clonedMarksheet.style.position = 'static';
                    clonedMarksheet.style.left = 'auto';
                    
                    // Ensure desktop layout even on mobile
                    if (isMobileDevice()) {
                        clonedMarksheet.style.minWidth = '1000px';
                        clonedMarksheet.style.width = '1000px';
                    }
                    
                    // Hide the logo in the cloned document before capture
                    const logoContainer = clonedMarksheet.querySelector('.logo-container');
                    if (logoContainer) {
                        logoContainer.style.display = 'none';
                    }
                    
                    // Adjust the header to center the title
                    const header = clonedMarksheet.querySelector('.header');
                    if (header) {
                        header.style.justifyContent = 'center';
                    }
                    
                    const title = clonedMarksheet.querySelector('.title');
                    if (title) {
                        title.style.margin = '0 auto';
                    }
                    
                    // Ensure Group headers don't have bottom borders
                    const groupHeaders = clonedMarksheet.querySelectorAll('.group h3');
                    groupHeaders.forEach(header => {
                        header.style.borderBottom = 'none';
                    });
                    
                    // Apply custom colors for CA Foundation if needed
                    const examType = document.getElementById('examType').value;
                    if (examType === 'CA Foundation') {
                        const foundationSubjects = clonedMarksheet.querySelector('#foundationSubjects');
                        if (foundationSubjects) {
                            const foundationTotalRow = foundationSubjects.querySelector('.total-row');
                            const foundationResultRow = foundationSubjects.querySelector('.result-row');
                            
                            if (foundationTotalRow) {
                                foundationTotalRow.style.backgroundColor = '#91008d'; // Darker purple
                            }
                            
                            if (foundationResultRow) {
                                foundationResultRow.style.backgroundColor = '#ad5f9d'; // Lighter purple
                            }
                        }
                    }
                }
            }
        }).then(function(canvas) {
            try {
                const imgData = canvas.toDataURL('image/png');
                
                // Store the image data and student name in localStorage
                localStorage.setItem('marksheetImage', imgData);
                localStorage.setItem('studentName', document.getElementById('displayName').textContent);
                localStorage.setItem('examType', document.getElementById('examTypeDisplay').textContent);
                
                // Redirect to marksheet.html
                window.location.href = 'marksheet.html';
                
            } catch (error) {
                console.error('Error generating image:', error);
                alert('Could not generate image. Please try again.');
                
                // Reset the submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-file-alt"></i> Generate Marksheet';
                }
            }
        }).catch(function(error) {
            console.error('Canvas error:', error);
            alert('Could not generate image. Please try again.');
            
            // Reset the submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-file-alt"></i> Generate Marksheet';
            }
        });
    } catch (error) {
        console.error('General error:', error);
        alert('An error occurred. Please try again.');
        
        // Reset the submit button
        const submitButton = document.querySelector('#marksheetForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-file-alt"></i> Generate Marksheet';
        }
    }
}

// Function to reset the form and UI after generation
function resetFormAfterGeneration() {
    // Re-enable the submit button
    const submitButton = document.querySelector('#marksheetForm button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-file-alt"></i> Generate Marksheet';
    }
    
    // For mobile: Reset the marksheet that was positioned off-screen for capture
    if (isMobileDevice() && marksheet) {
        marksheet.style.display = 'none';
        marksheet.style.position = '';
        marksheet.style.left = '';
    }
}

function calculateResults() {
    const examType = document.getElementById('examType').value;
    const name = document.getElementById('name').value;

    // Get marks based on exam type
    let group1Total = 0;
    let group2Total = 0;
    let allSubjectsAbove40 = true;

    if (examType === 'CA Final') {
        // Group 1
        const fr = parseInt(document.getElementById('fr').value) || 0;
        const afm = parseInt(document.getElementById('afm').value) || 0;
        const aaa = parseInt(document.getElementById('aaa').value) || 0;
        group1Total = fr + afm + aaa;

        // Group 2
        const dtit = parseInt(document.getElementById('dtit').value) || 0;
        const itl = parseInt(document.getElementById('itl').value) || 0;
        const ibs = parseInt(document.getElementById('ibs').value) || 0;
        group2Total = dtit + itl + ibs;

        // Check if any subject is below 40
        allSubjectsAbove40 = fr >= 40 && afm >= 40 && aaa >= 40 && 
                            dtit >= 40 && itl >= 40 && ibs >= 40;
    } else if (examType === 'CA Intermediate') {
        // Group 1
        const accounting = parseInt(document.getElementById('accounting').value) || 0;
        const corporateLaws = parseInt(document.getElementById('corporateLaws').value) || 0;
        const taxation = parseInt(document.getElementById('taxation').value) || 0;
        group1Total = accounting + corporateLaws + taxation;

        // Group 2
        const costAccounting = parseInt(document.getElementById('costAccounting').value) || 0;
        const auditing = parseInt(document.getElementById('auditing').value) || 0;
        const fm = parseInt(document.getElementById('fm').value) || 0;
        group2Total = costAccounting + auditing + fm;

        // Check if any subject is below 40
        allSubjectsAbove40 = accounting >= 40 && corporateLaws >= 40 && taxation >= 40 && 
                            costAccounting >= 40 && auditing >= 40 && fm >= 40;
    } else if (examType === 'CA Foundation') {
        // Foundation logic remains unchanged
        const accounting_f = parseInt(document.getElementById('accounting_f').value) || 0;
        const law_f = parseInt(document.getElementById('law_f').value) || 0;
        const maths_f = parseInt(document.getElementById('maths_f').value) || 0;
        const economics_f = parseInt(document.getElementById('economics_f').value) || 0;
        
        group1Total = accounting_f + law_f;
        group2Total = maths_f + economics_f;
        
        allSubjectsAbove40 = accounting_f >= 40 && law_f >= 40 && 
                            maths_f >= 40 && economics_f >= 40;
    }

    // Calculate results with set-off consideration
    let group1Result = 'UNSUCCESSFUL';
    let group2Result = 'UNSUCCESSFUL';
    const totalMarks = group1Total + group2Total;

    // Set-off logic for CA Inter and Final
    if ((examType === 'CA Final' || examType === 'CA Intermediate') && allSubjectsAbove40) {
        // If total marks are 300 or more (50% of 600) and all subjects are above 40,
        // apply set-off between groups
        if (totalMarks >= 300) {
            group1Result = 'SUCCESSFUL';
            group2Result = 'SUCCESSFUL';
        } else {
            // Individual group assessment without set-off
            group1Result = group1Total >= 150 ? 'SUCCESSFUL' : 'UNSUCCESSFUL';
            group2Result = group2Total >= 150 ? 'SUCCESSFUL' : 'UNSUCCESSFUL';
        }
    } else if (examType === 'CA Foundation' && allSubjectsAbove40) {
        // Foundation logic remains unchanged
        group1Result = group1Total >= 100 ? 'SUCCESSFUL' : 'UNSUCCESSFUL';
        group2Result = group2Total >= 100 ? 'SUCCESSFUL' : 'UNSUCCESSFUL';
    }

    // Update the display
    if (examType === 'CA Foundation') {
        updateFoundationDisplay(name, group1Total, group2Total, group1Result, group2Result);
    } else {
        updateGroupedDisplay(name, examType, group1Total, group2Total, group1Result, group2Result);
    }
}

// Update the formatMarksWithExemption function
function formatMarksWithExemption(marks, isExempted) {
    const formattedMarks = formatMarks(marks);
    if (isExempted && marks >= 60) {
        return `${formattedMarks} E`;
    }
    return formattedMarks;
} 