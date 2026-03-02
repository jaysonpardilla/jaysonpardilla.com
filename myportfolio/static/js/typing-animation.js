// Typing animation for hero role
document.addEventListener('DOMContentLoaded', function(){
    const words = ['Web Developer','Mobile Developer'];
    const typedEl = document.getElementById('typed');
    let wIndex = 0, charIndex = 0;
    const typingSpeed = 80; // ms per char
    const deletingSpeed = 40;
    const holdDelay = 5000; // hold full word (ms)

    function type(){
        const word = words[wIndex];
        if(charIndex < word.length){
            typedEl.textContent += word.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        }else{
            // word complete, hold then delete
            setTimeout(deleteWord, holdDelay);
        }
    }

    function deleteWord(){
        if(charIndex > 0){
            typedEl.textContent = typedEl.textContent.slice(0, -1);
            charIndex--;
            setTimeout(deleteWord, deletingSpeed);
        }else{
            wIndex = (wIndex + 1) % words.length;
            setTimeout(type, typingSpeed);
        }
    }

    // start typing
    type();
});