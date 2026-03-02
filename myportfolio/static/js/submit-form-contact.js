// AJAX submit for contact form to Django endpoint at /contact-endpoint/
 (function(){
	 const form = document.getElementById('contact-form');
	 let msg = document.getElementById('contact-msg');
	 if(!form) return;
	 // ensure a message container exists so we don't error when updating UI
	 if(!msg){
		  msg = document.createElement('div');
		  msg.id = 'contact-msg';
		  form.parentNode.insertBefore(msg, form);
	 }

	form.addEventListener('submit', async function(e){
		e.preventDefault();
		msg.innerHTML = '';
		let submit = form.querySelector('button[type="submit"]');
		if(!submit) submit = form.querySelector('button') || null;
		const origText = submit ? submit.textContent : '';
		if(submit) {
			submit.disabled = true;
			submit.textContent = 'Sending...';
		}

		const data = {
			name: form.querySelector('input[name="name"]').value.trim(),
			email: form.querySelector('input[name="email"]').value.trim(),
			message: form.querySelector('textarea[name="message"]').value.trim(),
		};

		try{
			// Always post directly to the backend dev server to avoid initial POST to static Live Server
			const endpoint = 'https://captivating-joy-production-1e9c.up.railway.app/contact-endpoint/';
			let res = await fetch(endpoint, {
				method: 'POST',
				mode: 'cors',
				headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			// If the current origin doesn't have the endpoint (e.g. Live Server on :5500),
			// retry against the Django dev server at localhost:8000.
			if((res.status === 405 || res.status === 404 || res.status === 0) && !endpoint.startsWith('https://captivating-joy-production-1e9c.up.railway.app')){
					const fallback = 'https://captivating-joy-production-1e9c.up.railway.app/contact-endpoint/';
				try{
					res = await fetch(fallback, {
						method: 'POST',
						mode: 'cors',
						headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
						body: JSON.stringify(data)
					});
					}catch(re){
						// retry failed; fall through to error handling
					}
			}

			let payload = null;
			try{ if(res && res.json) payload = await res.json(); }catch(err){ payload = null }

			if(res && res.ok && payload && payload.ok){
				// clear any previous hide timer
				if(msg._hideTimer) clearTimeout(msg._hideTimer);
				msg.innerHTML = '<div style="padding:12px;border-radius:8px;background:linear-gradient(90deg, rgba(95,220,200,0.12), rgba(111,255,233,0.08));color:var(--neon-ice);">Message sent — thank you! I will reply shortly.</div>';
				form.reset();
				// auto-hide after 3 seconds
				msg._hideTimer = setTimeout(()=>{ msg.innerHTML = ''; msg._hideTimer = null; }, 3000);
			} else {
				const errText = payload && payload.error ? payload.error : (res && res.statusText) || 'Unable to send message';
				msg.innerHTML = `<div style="padding:12px;border-radius:8px;background:rgba(255,20,60,0.06);color:#ffb3b3">Error: ${errText}</div>`;
			}
		}catch(err){
			msg.innerHTML = `<div style="padding:12px;border-radius:8px;background:rgba(255,20,60,0.06);color:#ffb3b3">Network error: ${err && err.message ? err.message : String(err)}</div>`;
		} finally{
			if(submit){ submit.disabled = false; submit.textContent = origText; }
		}
	});
})();
