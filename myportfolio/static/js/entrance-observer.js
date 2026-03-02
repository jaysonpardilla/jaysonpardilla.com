// Contact section entrance observer + staggered reveal for inputs
(function(){
	const contact = document.getElementById('contact');
	if(!contact) return;

	const formEls = Array.from(contact.querySelectorAll('.contact-form .input, .contact-form textarea'));
	const submitBtn = contact.querySelector('.contact-form .btn');

	const observer = new IntersectionObserver((entries, obs)=>{
		entries.forEach(entry=>{
			if(!entry.isIntersecting) return;
			contact.classList.add('in-view');
			// stagger delays for inputs
			formEls.forEach((el, i)=>{
				el.style.transitionDelay = (i * 0.09) + 's';
			});
			if(submitBtn) submitBtn.style.transitionDelay = (formEls.length * 0.09) + 's';
			obs.unobserve(contact);
		});
	},{threshold:0.12});

	// make sure inputs are rendered with their initial hidden state
	formEls.forEach(el=>{ el.style.willChange = 'transform,opacity'; });
	if(submitBtn) submitBtn.style.willChange = 'transform,opacity';

	// small delay to avoid firing during initial page load jank
	requestAnimationFrame(()=> observer.observe(contact));
})();
