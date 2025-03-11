// Get DOM elements
const form = document.getElementById('marksheetForm');
const marksheet = document.getElementById('marksheet');
const downloadButtons = document.querySelector('.download-buttons');
const downloadPDFButton = document.getElementById('downloadPDF');
const downloadImageButton = document.getElementById('downloadImage');
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
    const rollNumber = document.getElementById('rollNumber').value;
    const name = document.getElementById('name').value;
    
    // Validate roll number (6 digits)
    if (!/^\d{6}$/.test(rollNumber)) {
        alert('Please enter a valid 6-digit roll number');
        return;
    }
    
    // Group I marks
    const fr = parseInt(document.getElementById('fr').value) || 0;
    const afm = parseInt(document.getElementById('afm').value) || 0;
    const aaa = parseInt(document.getElementById('aaa').value) || 0;
    
    // Group II marks
    const dtit = parseInt(document.getElementById('dtit').value) || 0;
    const itl = parseInt(document.getElementById('itl').value) || 0;
    const ibs = parseInt(document.getElementById('ibs').value) || 0;
    
    // Calculate totals
    const group1Total = fr + afm + aaa;
    const group2Total = dtit + itl + ibs;
    const grandTotal = group1Total + group2Total;
    
    // Check if all subjects meet minimum marks requirement
    const allSubjectsPassed = isSubjectPassed(fr) && isSubjectPassed(afm) && isSubjectPassed(aaa) &&
                             isSubjectPassed(dtit) && isSubjectPassed(itl) && isSubjectPassed(ibs);
    
    // Determine results
    const group1Result = isGroupPassed(fr, afm, aaa, group1Total);
    const group2Result = isGroupPassed(dtit, itl, ibs, group2Total);
    const overallResult = determineResult(group1Total, group2Total, allSubjectsPassed);
    
    // Update exam attempt
    examDisplay.textContent = examAttempt;
    examTitleDisplay.textContent = examAttempt;
    
    // Update marksheet
    document.getElementById('displayRollNumber').textContent = rollNumber;
    document.getElementById('displayName').textContent = name.toUpperCase();
    
    // Update Group I marks with leading zeros
    document.getElementById('displayFR').textContent = formatMarks(fr);
    document.getElementById('displayAFM').textContent = formatMarks(afm);
    document.getElementById('displayAAA').textContent = formatMarks(aaa);
    document.getElementById('group1Total').textContent = formatMarks(group1Total);
    document.getElementById('group1Result').textContent = group1Result ? "SUCCESSFUL" : "UNSUCCESSFUL";
    
    // Update Group II marks with leading zeros
    document.getElementById('displayDTIT').textContent = formatMarks(dtit);
    document.getElementById('displayITL').textContent = formatMarks(itl);
    document.getElementById('displayIBS').textContent = formatMarks(ibs);
    document.getElementById('group2Total').textContent = formatMarks(group2Total);
    document.getElementById('group2Result').textContent = group2Result ? "SUCCESSFUL" : "UNSUCCESSFUL";
    
    // Update Grand Total with leading zeros
    document.getElementById('grandTotal').textContent = formatMarks(grandTotal);
    
    // Different behavior for mobile and desktop
    if (isMobileDevice()) {
        // For mobile: Hide marksheet and download buttons, generate image directly
        marksheet.style.display = 'block'; // Temporarily show for capture
        downloadButtons.style.display = 'none'; // Hide download buttons
        
        // Show loading message
        let loadingMessage = document.getElementById('loadingMessage');
        if (!loadingMessage) {
            loadingMessage = document.createElement('div');
            loadingMessage.id = 'loadingMessage';
            loadingMessage.style.backgroundColor = 'white';
            loadingMessage.style.padding = '20px';
            loadingMessage.style.borderRadius = '8px';
            loadingMessage.style.marginBottom = '20px';
            loadingMessage.style.textAlign = 'center';
            loadingMessage.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            loadingMessage.innerHTML = '<p style="color: #91008d; font-weight: bold; margin-bottom: 10px;">Generating your marksheet...</p>' +
                                     '<p>Please wait a moment...</p>';
            
            // Insert after form
            document.querySelector('.input-form').after(loadingMessage);
        } else {
            loadingMessage.style.display = 'block';
        }
        
        // Scroll to loading message
        loadingMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Generate and open image directly
        generateAndOpenImage();
    } else {
        // For desktop: Show marksheet and download buttons as usual
        marksheet.style.display = 'block';
        
        // Create top download buttons if they don't exist
        let topDownloadButtons = document.getElementById('topDownloadButtons');
        if (!topDownloadButtons) {
            // Clone the existing download buttons
            topDownloadButtons = downloadButtons.cloneNode(true);
            topDownloadButtons.id = 'topDownloadButtons';
            topDownloadButtons.style.marginBottom = '20px';
            
            // Get the download button from the cloned container
            const topDownloadButton = topDownloadButtons.querySelector('#downloadImageButton');
            if (topDownloadButton) {
                topDownloadButton.id = 'topDownloadImageButton';
                
                // Add event listener to the top download button
                topDownloadButton.addEventListener('click', function() {
                    // Call the same function as the bottom button
                    document.getElementById('downloadImageButton').click();
                });
            }
            
            // Insert before marksheet
            marksheet.parentNode.insertBefore(topDownloadButtons, marksheet);
        }
        
        // Show both download button sections
        downloadButtons.style.display = 'flex';
        topDownloadButtons.style.display = 'flex';
        
        // Scroll to top download buttons
        topDownloadButtons.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Function to generate and open image
function generateAndOpenImage() {
    try {
        // Always use desktop scale for consistent output
        const scale = 2;
        
        // Simple configuration for html2canvas
        html2canvas(document.getElementById('marksheet'), {
            scale: scale,
            backgroundColor: '#ffffff',
            allowTaint: true,
            useCORS: true,
            onclone: function(clonedDoc) {
                const clonedMarksheet = clonedDoc.getElementById('marksheet');
                if (clonedMarksheet) {
                    clonedMarksheet.style.display = 'block';
                    
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
                const filename = `ICAI_Marksheet_${examDisplay.textContent.replace(/\s+/g, '_')}.png`;
                
                // Open in new tab
                const newTab = window.open();
                if (newTab) {
                    newTab.document.write(`
                        <html>
                            <head>
                                <title>ICAI Marksheet</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    body { margin: 0; padding: 20px; text-align: center; background-color: #f5f5f5; }
                                    img { max-width: 100%; height: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
                                    p { font-family: Arial, sans-serif; margin-top: 20px; color: #333; }
                                    .container { max-width: 800px; margin: 0 auto; }
                                    .back-btn { 
                                        display: inline-block; 
                                        margin-top: 20px; 
                                        padding: 10px 20px; 
                                        background-color: #91008d; 
                                        color: white; 
                                        text-decoration: none; 
                                        border-radius: 5px; 
                                        font-weight: bold;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h2 style="color: #91008d;">Your ICAI Marksheet</h2>
                                    <img src="${imgData}" alt="ICAI Marksheet">
                                    <p>Press and hold on the image to save it to your device.</p>
                                    <a href="javascript:window.close();" class="back-btn">Close</a>
                                </div>
                            </body>
                        </html>
                    `);
                    newTab.document.close();
                    
                    // Hide loading message and marksheet
                    const loadingMessage = document.getElementById('loadingMessage');
                    if (loadingMessage) {
                        loadingMessage.style.display = 'none';
                    }
                    marksheet.style.display = 'none';
                } else {
                    alert('Please allow pop-ups to view and save your marksheet.');
                    
                    // Show download buttons as fallback
                    downloadButtons.style.display = 'flex';
                    marksheet.style.display = 'none';
                }
            } catch (error) {
                console.error('Error opening image:', error);
                alert('Could not generate image. Please try again.');
                
                // Show download buttons as fallback
                downloadButtons.style.display = 'flex';
                marksheet.style.display = 'none';
            }
        }).catch(function(error) {
            console.error('Canvas error:', error);
            alert('Could not generate image. Please try again.');
            
            // Show download buttons as fallback
            downloadButtons.style.display = 'flex';
            marksheet.style.display = 'none';
        });
    } catch (error) {
        console.error('General error:', error);
        alert('An error occurred. Please try again.');
        
        // Show download buttons as fallback
        downloadButtons.style.display = 'flex';
        marksheet.style.display = 'none';
    }
}

// Download as Image - for desktop only
downloadImageButton.addEventListener('click', function() {
    // Show loading state
    downloadImageButton.disabled = true;
    downloadImageButton.textContent = 'Generating Image...';
    
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
                const filename = `ICAI_Marksheet_${examDisplay.textContent.replace(/\s+/g, '_')}.png`;
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // Reset button
                downloadImageButton.disabled = false;
                downloadImageButton.textContent = 'Download Marksheet';
                
                // Restore original display
                marksheet.style.display = originalDisplay;
            } catch (error) {
                console.error('Download error:', error);
                alert('Download failed. Please try again.');
                downloadImageButton.disabled = false;
                downloadImageButton.textContent = 'Download Marksheet';
                marksheet.style.display = originalDisplay;
            }
        }).catch(function(error) {
            console.error('Canvas error:', error);
            alert('Could not generate image. Please try again.');
            downloadImageButton.disabled = false;
            downloadImageButton.textContent = 'Download Marksheet';
            marksheet.style.display = originalDisplay;
        });
    } catch (error) {
        console.error('General error:', error);
        alert('An error occurred. Please try again.');
        downloadImageButton.disabled = false;
        downloadImageButton.textContent = 'Download Marksheet';
    }
}); 