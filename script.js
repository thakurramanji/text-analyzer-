// DOM elements
const textInput = document.getElementById('textInput');
const charWithSpaces = document.getElementById('charWithSpaces');
const charWithoutSpaces = document.getElementById('charWithoutSpaces');
const wordCount = document.getElementById('wordCount');
const sentenceCount = document.getElementById('sentenceCount');
const paragraphCount = document.getElementById('paragraphCount');
const readingTime = document.getElementById('readingTime');
const avgWordLength = document.getElementById('avgWordLength');
const longestWord = document.getElementById('longestWord');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');

// Text analysis class
class TextAnalyzer {
    constructor() {
        this.text = '';
        this.words = [];
        this.sentences = [];
        this.paragraphs = [];
    }

    analyze(text) {
        this.text = text;
        this.words = this.extractWords(text);
        this.sentences = this.extractSentences(text);
        this.paragraphs = this.extractParagraphs(text);
        
        return {
            charWithSpaces: this.countCharactersWithSpaces(),
            charWithoutSpaces: this.countCharactersWithoutSpaces(),
            wordCount: this.words.length,
            sentenceCount: this.sentences.length,
            paragraphCount: this.paragraphs.length,
            readingTime: this.calculateReadingTime(),
            avgWordLength: this.calculateAverageWordLength(),
            longestWord: this.findLongestWord()
        };
    }

    countCharactersWithSpaces() {
        return this.text.length;
    }

    countCharactersWithoutSpaces() {
        return this.text.replace(/\s/g, '').length;
    }

    extractWords(text) {
        // Remove extra whitespace and split by spaces
        return text.trim().split(/\s+/).filter(word => word.length > 0);
    }

    extractSentences(text) {
        // Split by sentence endings (., !, ?) followed by space or end of text
        const sentences = text.split(/[.!?]+(?=\s|$)/).filter(sentence => 
            sentence.trim().length > 0
        );
        return sentences;
    }

    extractParagraphs(text) {
        // Split by double line breaks or single line breaks
        return text.split(/\n\s*\n/).filter(paragraph => 
            paragraph.trim().length > 0
        );
    }

    calculateReadingTime() {
        // Average reading speed: 200-250 words per minute
        const wordsPerMinute = 225;
        const minutes = this.words.length / wordsPerMinute;
        
        if (minutes < 1) {
            const seconds = Math.round(minutes * 60);
            return `${seconds} sec`;
        } else if (minutes < 2) {
            return `${Math.round(minutes * 10) / 10} min`;
        } else {
            return `${Math.round(minutes)} min`;
        }
    }

    calculateAverageWordLength() {
        if (this.words.length === 0) return 0;
        
        const totalLength = this.words.reduce((sum, word) => sum + word.length, 0);
        return Math.round((totalLength / this.words.length) * 10) / 10;
    }

    findLongestWord() {
        if (this.words.length === 0) return '-';
        
        return this.words.reduce((longest, current) => 
            current.length > longest.length ? current : longest
        );
    }
}

// Initialize analyzer
const analyzer = new TextAnalyzer();

// Update statistics
function updateStats() {
    const text = textInput.value;
    const stats = analyzer.analyze(text);
    
    // Update all statistics
    charWithSpaces.textContent = stats.charWithSpaces;
    charWithoutSpaces.textContent = stats.charWithoutSpaces;
    wordCount.textContent = stats.wordCount;
    sentenceCount.textContent = stats.sentenceCount;
    paragraphCount.textContent = stats.paragraphCount;
    readingTime.textContent = stats.readingTime;
    avgWordLength.textContent = stats.avgWordLength;
    longestWord.textContent = stats.longestWord;
    
    // Add animation to stat cards
    animateStats();
}

// Animate statistics
function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease forwards`;
        }, index * 100);
    });
}

// Clear text
function clearText() {
    textInput.value = '';
    updateStats();
    
    // Add success animation
    clearBtn.classList.add('success');
    setTimeout(() => {
        clearBtn.classList.remove('success');
    }, 600);
}

// Copy text
async function copyText() {
    try {
        await navigator.clipboard.writeText(textInput.value);
        
        // Add success animation and change button text temporarily
        copyBtn.classList.add('success');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.classList.remove('success');
            copyBtn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Fallback for older browsers
        textInput.select();
        document.execCommand('copy');
        
        copyBtn.classList.add('success');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.classList.remove('success');
            copyBtn.innerHTML = originalText;
        }, 2000);
    }
}

// Event listeners
textInput.addEventListener('input', updateStats);
clearBtn.addEventListener('click', clearText);
copyBtn.addEventListener('click', copyText);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to copy
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        copyText();
    }
    
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearText();
    }
});

// Auto-resize textarea
textInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.max(200, this.scrollHeight) + 'px';
});

// Initialize with sample text for demonstration
function initializeWithSampleText() {
    // No default text - start with empty textarea
    textInput.value = '';
    updateStats();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with sample text
    initializeWithSampleText();
    
    // Focus on textarea for better UX
    textInput.focus();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Add some sample text suggestions
function addSampleTextButton() {
    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "To be, or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune."
    ];
    
    const sampleBtn = document.createElement('button');
    sampleBtn.className = 'btn btn-secondary';
    sampleBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Sample Text';
    
    sampleBtn.addEventListener('click', () => {
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        textInput.value = randomText;
        updateStats();
        
        sampleBtn.classList.add('success');
        setTimeout(() => sampleBtn.classList.remove('success'), 600);
    });
    
    document.querySelector('.textarea-actions').appendChild(sampleBtn);
}

// Add sample text button after DOM is loaded
setTimeout(addSampleTextButton, 100);

// Add word count indicator
function addWordCountIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'word-count-indicator';
    indicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.1);
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        color: #666;
        pointer-events: none;
    `;
    
    document.querySelector('.textarea-container').appendChild(indicator);
    
    // Update indicator on input
    textInput.addEventListener('input', () => {
        const words = textInput.value.trim().split(/\s+/).filter(word => word.length > 0);
        indicator.textContent = `${words.length} words`;
    });
}

// Add word count indicator
setTimeout(addWordCountIndicator, 100); 