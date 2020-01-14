<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package AwesomePress
 */

?>
    <?php awesomepress_content_bottom(); ?>
    </div><!-- #content -->
    <?php awesomepress_content_after(); ?>

    <?php awesomepress_footer_before(); ?>
    <footer id="colophon" class="site-footer" role="contentinfo">
    <?php awesomepress_footer_top(); ?>

        <div class="site-info">	           <a href="<?php echo esc_url(__('https://vdabtec.com/', 'dlgw')); ?>">
                <?php printf( esc_html__('This demonstration website and Great Lakes Data Watershed are powered by %s', 'dlgw'), 'VDAB<sup>tm</sup'); ?>
            </a>
         </div><!-- .site-info -->

    <?php awesomepress_footer_bottom(); ?>
    </footer><!-- #colophon -->
    <?php awesomepress_footer_after(); ?>

</div><!-- #page -->

<?php awesomepress_body_bottom(); ?>
<?php wp_footer(); ?>

</body>
</html>
