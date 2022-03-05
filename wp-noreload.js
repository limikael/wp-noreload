jQuery(function($) {
	function installClickHandler() {
		$(noreload_settings.noreload_link_selector).unbind("click",handleClick);
		$(noreload_settings.noreload_link_selector).click(handleClick);

		$(noreload_settings.noreload_form_selector).unbind("submit",handleSubmit);
		$(noreload_settings.noreload_form_selector).submit(handleSubmit);
	}

	function clearContentArea() {
		$(".nav-link").removeClass("active");

		let selectors=noreload_settings.noreload_content_selectors.split("\n");
		for (let selector of selectors) {
			selector=selector.trim();
			$(selector).animate({opacity: 0});
		}
	}

	function populateContentArea(data) {
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

		for (let navEl of el.querySelectorAll(".nav-link.active")) {
			let href=$(navEl).attr("href");
			$(".nav-link").filter("[href='"+href+"']").addClass("active");
		}

		installClickHandler();
		window.dispatchEvent(new Event("reload"));
	}

	function loadPage(url) {
		clearContentArea();
		$.get(url,populateContentArea);
	}

	function handleSubmit() {
		clearContentArea();
		let data=$(this).serialize();

		let url=$(this).attr("action");
		if (!url)
			url=window.location.href;

		$.post(url,data,populateContentArea);
		return false;
	}

	function handleClick() {
		let toggleEl=document.querySelector("button.navbar-toggler");
		let barEl=document.querySelector(".navbar-collapse");

		if ($(toggleEl).is(":visible") && $(barEl).is(":visible")) {
			for (let navEl of document.querySelectorAll(".navbar-collapse"))
				new bootstrap.Collapse(navEl);
		}

		let url=$(this).attr("href");

		let state={url: url};
		history.pushState(state,"",url);

		loadPage(url);
		return false;
	}

	installClickHandler();

	window.addEventListener("popstate",(ev)=>{
		if (ev.state && ev.state.url)
			loadPage(ev.state.url);
	});

	let initialState={url: window.location.href};
	history.replaceState(initialState,"",window.location.href);
});