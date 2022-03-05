<?php
/**
 * Don't reload the page.
 *
 * Plugin Name:       No Reload
 * Description:       Don't reload on link clicks and form submits.
 * Version:           0.0.4
 */

define('NORELOAD_URL',plugin_dir_url(__FILE__));
define('NORELOAD_PATH',plugin_dir_path(__FILE__));

function noreload_display_template($fn, $vars=array()) {
	foreach ($vars as $key=>$value) {
		$$key=$value;
	}

	require $fn;
}

function noreload_render_template($fn, $vars=array()) {
	ob_start();
	noreload_display_template($fn,$vars);
	return ob_get_clean();
}

add_action("wp_enqueue_scripts","noreload_wp_enqueue_scripts");
function noreload_wp_enqueue_scripts() {
	wp_enqueue_script("noreload",
		NORELOAD_URL."/wp-noreload.js",
		array("jquery"),"0.0.1",true);

	wp_localize_script("noreload","noreload_settings",array(
		"noreload_link_selector"=>get_option("noreload_link_selector"),
		"noreload_form_selector"=>get_option("noreload_form_selector"),
		"noreload_content_selectors"=>get_option("noreload_content_selectors"),
	));
}

add_action("admin_menu","noreload_admin_menu");
function noreload_admin_menu() {
	add_options_page(
		'No Reload Settings',
		'No Reload Settings', 
		'manage_options', 
		'noreload-settings',
		'noreload_settings_page'
	);
}

add_action("admin_init","noreload_admin_init");
function noreload_admin_init() {
	register_setting("noreload","noreload_link_selector");
	register_setting("noreload","noreload_form_selector");
	register_setting("noreload","noreload_content_selectors");
}

function noreload_settings_page() {
	noreload_display_template(__DIR__."/settings.tpl.php");
}