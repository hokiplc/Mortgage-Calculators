<?php
/*
Plugin Name: Mortgage Calculator
Plugin URI: https://broker360.ai/plugins
Description: Multi-mode Mortgage Calculator (Ireland) – First-Time Buyer, Moving House, Buy-to-Let, Switching, LTV, Home Improvement, and Foreign National.
Version: 1.0.3
Author: Broker 360
Author URI: https://broker360.ai
*/

function mortgage_calculator_register_assets() {
    // Register calculator-specific scripts
    wp_register_script('mortgage-calculator-js', plugin_dir_url(__FILE__) . 'js/mortgage-calculator.js', ['jquery'], '1.0.3', true);
    wp_register_script('mh-calculator-js', plugin_dir_url(__FILE__) . 'js/mh-calculator.js', ['jquery'], '1.0.3', true);
    wp_register_script('btl-calculator-js', plugin_dir_url(__FILE__) . 'js/btl-calculator.js', ['jquery'], '1.0.3', true);
    wp_register_script('switcher-calculator-js', plugin_dir_url(__FILE__) . 'js/switcher-calculator.js', ['jquery'], '1.0.3', true);
    wp_register_script('mortgage-ltv-js', plugin_dir_url(__FILE__) . 'js/mortgage-ltv.js', ['jquery'], '1.0.3', true);
    wp_register_script('home-improvement-js', plugin_dir_url(__FILE__) . 'js/home-improvement.js', ['jquery'], '1.0.3', true);
    wp_register_script('foreign-national-js', plugin_dir_url(__FILE__) . 'js/foreign-national.js', ['jquery'], '1.0.3', true);

    // Load best3 globally (used by all calculators)
    wp_register_script('best3-js', plugin_dir_url(__FILE__) . 'js/best3.js', ['jquery'], '1.0.3', true);
    wp_enqueue_script('best3-js');

    // Pass AJAX URL and settings to JavaScript
    $get_in_touch_url = get_option('broker360_get_in_touch_url', 'https://whichmortgage.ie/start-an-application-2/');
    wp_localize_script('best3-js', 'mortgageCalcAjax', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('mortgage_rates_nonce'),
        'getInTouchUrl' => $get_in_touch_url
    ));

    // Load styles
    wp_enqueue_style('mortgage-calculator-css', plugin_dir_url(__FILE__) . 'css/mortgage-calculator.css', [], '1.0.3');
}
add_action('wp_enqueue_scripts', 'mortgage_calculator_register_assets');

function mortgage_calculator_enqueue_by_shortcode($posts) {
    if (empty($posts)) return $posts;
    foreach ($posts as $post) {
        $c = $post->post_content;
        if (has_shortcode($c, 'mortgage_calculator')) wp_enqueue_script('mortgage-calculator-js');
        if (has_shortcode($c, 'mh_calculator')) wp_enqueue_script('mh-calculator-js');
        if (has_shortcode($c, 'btl_calculator')) wp_enqueue_script('btl-calculator-js');
        if (has_shortcode($c, 'switcher_calculator')) wp_enqueue_script('switcher-calculator-js');
        if (has_shortcode($c, 'mortgage_ltv')) wp_enqueue_script('mortgage-ltv-js');
        if (has_shortcode($c, 'home_improvement_calculator')) wp_enqueue_script('home-improvement-js');
        if (has_shortcode($c, 'fn_calculator')) wp_enqueue_script('foreign-national-js');
    }
    return $posts;
}
add_filter('the_posts', 'mortgage_calculator_enqueue_by_shortcode');

// Include shortcode files
include_once plugin_dir_path(__FILE__) . 'shortcodes/mortgage.php';
include_once plugin_dir_path(__FILE__) . 'shortcodes/moving-house.php';
include_once plugin_dir_path(__FILE__) . 'shortcodes/buy-to-let.php';
include_once plugin_dir_path(__FILE__) . 'shortcodes/switcher.php';
include_once plugin_dir_path(__FILE__) . 'shortcodes/mortgage-ltv.php';
include_once plugin_dir_path(__FILE__) . 'shortcodes/home-improvement.php';
include_once plugin_dir_path(__FILE__) . 'shortcodes/foreign-national.php';

// Admin menu and settings page
function broker360_add_admin_menu() {
    add_menu_page(
        'Broker360 Settings',           // Page title
        'Broker360',                     // Menu title
        'manage_options',                // Capability
        'broker360-settings',            // Menu slug
        'broker360_settings_page',       // Callback function
        'dashicons-admin-generic',       // Icon
        80                               // Position
    );
}
add_action('admin_menu', 'broker360_add_admin_menu');

// Settings page content
function broker360_settings_page() {
    ?>
    <div class="wrap">
        <h1>Broker360 Plugin Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('broker360_settings');
            do_settings_sections('broker360-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings
function broker360_register_settings() {
    register_setting('broker360_settings', 'broker360_get_in_touch_url', array(
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://whichmortgage.ie/start-an-application-2/'
    ));

    add_settings_section(
        'broker360_main_section',
        'Mortgage Calculator Settings',
        'broker360_section_callback',
        'broker360-settings'
    );

    add_settings_field(
        'broker360_get_in_touch_url',
        'Get in Touch URL',
        'broker360_get_in_touch_url_callback',
        'broker360-settings',
        'broker360_main_section'
    );
}
add_action('admin_init', 'broker360_register_settings');

// Section description
function broker360_section_callback() {
    echo '<p>Configure settings for Broker360 plugins. These settings apply to all calculators in the suite.</p>';
}

// Field callback for Get in Touch URL
function broker360_get_in_touch_url_callback() {
    $url = get_option('broker360_get_in_touch_url', 'https://whichmortgage.ie/start-an-application-2/');
    echo '<input type="url" name="broker360_get_in_touch_url" value="' . esc_attr($url) . '" class="regular-text" placeholder="https://example.com/application/">';
    echo '<p class="description">Enter the URL for the "Get in Touch" button shown in all mortgage calculators.</p>';
}

// AJAX handler to proxy mortgage rates (bypasses CORS)
function mortgage_calculator_get_rates() {
    // Get the rates from external API
    $response = wp_remote_get('https://broker360.ai/rates/bestrate360.json', array(
        'timeout' => 15,
        'headers' => array(
            'Accept' => 'application/json'
        )
    ));

    // Check for errors
    if (is_wp_error($response)) {
        wp_send_json_error(array('message' => 'Failed to fetch rates'), 500);
        return;
    }

    // Get the body
    $body = wp_remote_retrieve_body($response);

    // Set JSON header and output
    header('Content-Type: application/json');
    echo $body;
    wp_die();
}

// Register AJAX handlers for both logged-in and non-logged-in users
add_action('wp_ajax_get_mortgage_rates', 'mortgage_calculator_get_rates');
add_action('wp_ajax_nopriv_get_mortgage_rates', 'mortgage_calculator_get_rates');
