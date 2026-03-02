(function(){
    const btn = document.getElementById('hire-btn');
    const contact = document.getElementById('contact');
    const topbar = document.querySelector('.topbar');
    if(!btn || !contact) return;
    btn.addEventListener('click', function(e){
        e.preventDefault();
        const headerH = topbar ? topbar.getBoundingClientRect().height : 0;
        const targetY = contact.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
        window.scrollTo({top: Math.max(0, Math.floor(targetY)), behavior: 'smooth'});
    });
})();