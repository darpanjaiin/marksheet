// Get DOM elements
const form = document.getElementById('marksheetForm');
const marksheet = document.getElementById('marksheet');
const downloadButtons = document.querySelector('.download-buttons');
const downloadPDFButton = document.getElementById('downloadPDF');
const downloadImageButton = document.getElementById('downloadImageButton');
const examDisplay = document.getElementById('examDisplay');
const examTitleDisplay = document.getElementById('examTitleDisplay');

// Function to format marks with leading zeros
function formatMarks(marks) {
    return marks.toString().padStart(3, '0');
}

// Function to check if subject marks meet minimum requirement
function isSubjectPassed(marks) {
    return marks >= 40;
}

// Function to check if a group is passed
function isGroupPassed(marks1, marks2, marks3, groupTotal) {
    // Check if all subjects have minimum marks
    const allSubjectsPassed = isSubjectPassed(marks1) && isSubjectPassed(marks2) && isSubjectPassed(marks3);
    
    // Check if group total is >= 150
    const totalPassed = groupTotal >= 150;
    
    return allSubjectsPassed && totalPassed;
}

// Function to determine overall result
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

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const examAttempt = document.getElementById('examAttempt').value;
    // Keep roll number blank
    const rollNumber = "";
    const name = document.getElementById('name').value;
    
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
    
    // Determine results
    const group1Result = isGroupPassed(frMarks, afmMarks, aaaMarks, group1Total) ? "SUCCESSFUL" : "UNSUCCESSFUL";
    const group2Result = isGroupPassed(dtitMarks, itlMarks, ibsMarks, group2Total) ? "SUCCESSFUL" : "UNSUCCESSFUL";
    const overallResult = determineResult(group1Total, group2Total, allSubjectsPassed);
    
    // Update marksheet with form values
    document.getElementById('examDisplay').textContent = examAttempt;
    document.getElementById('examTitleDisplay').textContent = examAttempt;
    document.getElementById('displayRollNumber').textContent = rollNumber;
    document.getElementById('displayName').textContent = name;
    
    // Update marks
    document.getElementById('displayFR').textContent = formatMarks(frMarks);
    document.getElementById('displayAFM').textContent = formatMarks(afmMarks);
    document.getElementById('displayAAA').textContent = formatMarks(aaaMarks);
    document.getElementById('displayDTIT').textContent = formatMarks(dtitMarks);
    document.getElementById('displayITL').textContent = formatMarks(itlMarks);
    document.getElementById('displayIBS').textContent = formatMarks(ibsMarks);
    
    // Update totals and results
    document.getElementById('group1Total').textContent = formatMarks(group1Total);
    document.getElementById('group2Total').textContent = formatMarks(group2Total);
    document.getElementById('grandTotal').textContent = formatMarks(grandTotal);
    document.getElementById('group1Result').textContent = group1Result;
    document.getElementById('group2Result').textContent = group2Result;
    
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
                }
            }
        }).then(function(canvas) {
            try {
                // For desktop devices, use normal download
                const link = document.createElement('a');
                const examDisplay = document.getElementById('examDisplay');
                const filename = `ICAI_Marksheet_${examDisplay.textContent.replace(/\s+/g, '_')}.png`;
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
                }
            }
        }).then(function(canvas) {
            try {
                const imgData = canvas.toDataURL('image/png');
                
                // Store the image data in localStorage
                localStorage.setItem('marksheetImage', imgData);
                
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

// Attach event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Attach click handler to the download button
    const downloadImageButton = document.getElementById('downloadImageButton');
    if (downloadImageButton) {
        downloadImageButton.addEventListener('click', handleDownloadClick);
    }
}); 