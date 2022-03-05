<div class="wrap">
	<h1>No Reload Settings</h1>

	<form method="post" action="options.php">
		<?php settings_fields( 'noreload' ); ?>
		<?php do_settings_sections( 'noreload' ); ?>
		<table class="form-table">
			<tr valign="top">
				<th scope="row">Link Selector</th>
				<td>
					<input type="text" name="noreload_link_selector" 
							value="<?php echo esc_attr(get_option("noreload_link_selector")); ?>"
							class="regular-text"/>
					<p class="description">Which links should not reload the page.</p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row">Form Selector</th>
				<td>
					<input type="text" name="noreload_form_selector" 
							value="<?php echo esc_attr(get_option("noreload_form_selector")); ?>"
							class="regular-text"/>
					<p class="description">Which form submissions should not reload the page.</p>
				</td>
			</tr>

			<tr valign="top">
				<th scope="row">Content Selectors</th>
				<td>
					<textarea name="noreload_content_selectors" 
							class="regular-text"
							rows="5"
						><?php echo esc_html(get_option("noreload_content_selectors")); ?></textarea>
					<p class="description">Selectors for content that should be replaced, one on each line.</p>
				</td>
			</tr>
		</table>

		<?php submit_button(); ?>
	</form>
</div>