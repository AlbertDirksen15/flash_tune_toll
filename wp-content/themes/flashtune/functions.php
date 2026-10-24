<?php
if (!defined('ABSPATH')) { exit; }

function flashtune_setup(): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    register_nav_menus([
        'primary' => __('Primary menu', 'flashtune'),
        'footer_catalog' => __('Footer: Catalog', 'flashtune'),
        'footer_info' => __('Footer: Information', 'flashtune'),
        'footer_support' => __('Footer: Support', 'flashtune'),
    ]);
}
add_action('after_setup_theme', 'flashtune_setup');

function flashtune_assets(): void {
    wp_enqueue_style('flashtune-style', get_stylesheet_uri(), [], '0.1.0');
}
add_action('wp_enqueue_scripts', 'flashtune_assets');
