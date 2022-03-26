jQuery(function($) {
	function installClickHandler() {
		let linkSel=noreload_settings.noreload_link_selector;
		let formSel=noreload_settings.noreload_form_selector;

		$(document).on("click",linkSel,handleClick);
		$(document).on("click",formSel,handleSubmitClick);
		$(document).on("submit",formSel,handleSubmit);
	}

	function clearContentArea() {
		window.dispatchEvent(new Event("beforereload"));

		let toggleEl=document.querySelector("button.navbar-toggler");
		let barEl=document.querySelector(".navbar-collapse");

		if ($(toggleEl).is(":visible") && $(barEl).is(":visible")) {
			for (let navEl of document.querySelectorAll(".navbar-collapse"))
				new bootstrap.Collapse(navEl);
		}

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

		for (let navEl of el.querySelectorAll("header .nav-link.active")) {
			let href=$(navEl).attr("href");
			$("header .nav-link").filter("[href='"+href+"']").addClass("active");
		}

		window.dispatchEvent(new Event("reload"));
		window.scrollTo(0,0);

		$(window).trigger("resize");

		let tab=$(".um-account-main").attr("data-current_tab");
		$(".um-account-tab[data-tab="+tab+"]").show();
	}

	function loadPage(url) {
		clearContentArea();
		$.get(url,populateContentArea);
	}

	function handleSubmitClick(ev) {
		if ($(ev.target).attr("type")=="submit") {
			$(this).data("submitName",$(ev.target).attr("name"));
			$(this).data("submitVal",$(ev.target).val());
		}
	}

	function handleSubmit() {
		let data=$(this).serializeArray();
		if ($(this).data("submitName")) {
			data.push({
				name: $(this).data("submitName"),
				value: $(this).data("submitVal")
			});
		}

		clearContentArea();

		let url=$(this).attr("action");
		if (!url)
			url=window.location.href;

		$.post(url,data,populateContentArea);
		return false;
	}

	function handleClick() {
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