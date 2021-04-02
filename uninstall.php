<?php
/**
 * Uninstall WP Frontend Delete Account.
 *
 * @since @@{version}
 */

// Exit if accessed directly.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

global $wpdb;

// Delete all options set by WP Frontend Delete Account.
$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'wpfda\_%';" );
