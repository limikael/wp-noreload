jQuery(function($) {
	function loadPage(url) {
		let selectors=noreload_settings.noreload_content_selectors.split("\n");
		for (let selector of selectors) {
			selector=selector.trim();
			$(selector).animate({opacity: 0});
		}

		$.get(url,function(data) {
			let el=document.createElement('html');
			el.innerHTML=data;

			let selectors=noreload_settings.noreload_content_selectors.split("\n");
			for (let selector of selectors) {
				selector=selector.trim();

				let elem=el.querySelector(selector);
				$(selector).replaceWith(elem);
				$(selector).css({opacity: 0});
				$(selector).animate({opacity: 1});
			}
		});
	}

	$(noreload_settings.noreload_link_selector).click(function() {
		let url=$(this).attr("href");

		let state={url: url};
		history.pushState(state,"",url);

		loadPage(url);

		return false;
	});

	window.addEventListener("popstate",(ev)=>{
		if (ev.state && ev.state.url)
			loadPage(ev.state.url);
	});

	let initialState={url: window.location.href};
	history.replaceState(initialState,"",window.location.href);
});