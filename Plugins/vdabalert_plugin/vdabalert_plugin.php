<?php
/*
Plugin Name: Vdab Alert
Description: Displays a list of currently active alerts from VDAB
Author: Matthew App
*/


class vdabalert_widget extends WP_Widget {
function __construct() {
parent::__construct('vdabalert_widget', __('VDAB Alert Widget', 'vdabalert_widget_domain'),  
// Widget description
array( 'VDAB Alert display widget' => __( 'Widget to display of a list of currently active alerts', 'vdabalert_widget_domain' ), ) 
);
}
	
public function getHrefForDetail( $alert ) {
var hrefStr = .$AlertDetailURL."?Category=".$alert["Category"]
."&Severity=".$alert["Severity"]
."&Summary=".$alert["Summary"]
."&FlowURL=".$alert["FlowURL"]
."&ContainerURL=".$alert["ContainerURL"]
."&EventTime=".$alert["EventTime"]
."&Container=".$alert["Container"]
."&Latitude=".$alert["Latitude"]
."&Longitude=".$alert["Longitude"]
."&Detail=".$alert["Detail"] ;
return hrefStr;
}
	

public function displayAlert( $alert, $Date, $AlertDetailURL ){
//make the Info attribute of the Alert link to the Alert's ContainerURL

    //$containerURL = $alert["FlowURL"];

	
$tz = 'America/New_York';
$timestamp = (int)$alert["EventTimestamp"];
// This initializes the value to now.
$date = new DateTime("now", new DateTimeZone($tz)); //first argument "must" be a string
$date->setTimestamp($timestamp/1000);

echo "<tr><td class='vdabalert_date' >".$date->format($Date)."</td><td class='vdabalert_summary' >"."<a href='".getHrefForDetail($alert)."'>";
echo $alert["Summary"];
echo "</a></td></tr>";
}
public function fixupJSON($result0){
//trimming the json string of unnessecary white spaces and brackets
//and turning into valid json
$result = str_replace('\s', '', $result0);

$result = str_replace('"Group":', "", $result);
$result = str_replace('"Alert":',"",$result);

$result = trim($result, "{}" );
$result = trim($result, "{}" );

    $result = preg_replace('/{/', '[', $result, 1);
$result = preg_replace('/\}+$/', ']', $result,1);

return $result;
}
// ---------- check for alert duplicates
public function removeDuplicateAlerts($arr){

// MJA NOTE - Indent arrays to make sorting algorithm clear
// MJA NOTE - Add comment to explaing the algorithm
$i=0;
$arr2 = [];
foreach($arr as $val){
$c = "";
foreach($val as $val2){
$c= $c.strval($val2);
}
$arr2[$i]=$c;
$i++;
}
//get array keys of unique array entries
$arrkeys = array_keys(array_unique($arr2));
$arr2=[];
for($j=0; $j<sizeof($arrkeys); $j++){
//extract objects from array that match unique keys
$arr2[$j]=$arr[$arrkeys[$j]];
}

return $arr2;
}
// ----------------------------------------
// Creating widget front-end
// $instance is just an array with settings for an incarnation of a WordPress widget. This array() gets saved to the DB and retrieved again to be able to save the settings for the different widgets. 
public function widget( $args, $instance ) {
$title = apply_filters( 'widget_title', $instance['title'] );
$NoRows = $instance["NoRows"];
$AlertURL = $instance["AlertURL"];
$AlertDetailURL = $instance["AlertDetailURL"];
$Date = $instance["Date"];
//will run any functions that have been hooked (using add_filter()) to the filter hook that we’re naming 'widget_title,' passing $instance['title'] to each of those functions.
// before and after widget arguments are defined by themes
echo $args['before_widget'];
if ( ! empty( $title ) )
echo $args['before_title'] . $title . $args['after_title']; // dot appends strings
  
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_URL, $AlertURL); // Set the url
$result0 = curl_exec($ch); // Execute
curl_close($ch); // Closing

$result = $this->fixupJSON($result0);

$arr = json_decode($result,true);
$arr2 = $this->removeDuplicateAlerts($arr);

//reducing array to number of rows requested
if (sizeof($arr2) > $NoRows){
array_splice($arr2, $NoRows);
}
$result2 = json_encode($arr2);

//if unique array is smaller, a trailing comma must be removed.
if (sizeof($arr2) < sizeof($arr)){
$result2[strrpos($result2, ',')] = '';
}

$arr3 = json_decode($result2, true);
//echo "Version 1.2";
echo "<div class='vdabalert_tablediv'  >";
echo "<table>";	
foreach($arr3 as $alert) { 
$this->displayAlert($alert, $Date, $AlertDetailURL);
} 
echo "</table>";	
echo "</div>";	
echo $args['after_widget'];
}
     
// Widget Backend 
public function form( $instance ) {


if ( isset( $instance[ 'title' ] ) ) {
$title = $instance[ 'title' ];
}
else {
$title = __( 'VDAB Alerts', 'vdabalert_widget_domain' );
}

if ( isset( $instance[ 'AlertURL' ] ) ) {
$AlertURL = $instance[ 'AlertURL' ];
}
else {
$AlertURL = __( 'http://mirror1.gldw.org/vdab/get_Alerts', 'vdabalert_widget_domain' );
}
	

if ( isset( $instance[ 'AlertDetailURL' ] ) ) {
$AlertDetailURL = $instance[ 'AlertDetailURL' ];
}
else {
$AlertDetailURL = __( 'http://gldw.org/alert-detail/', 'vdabalert_widget_domain' );
}	

if ( isset( $instance[ 'NoRows' ] ) ) {
$NoRows = $instance[ 'NoRows' ];
}
else {
$NoRows = __( '20', 'vdabalert_widget_domain' );
}
	
if ( isset( $instance[ 'Date' ] ) ) {
$Date = $instance[ 'Date' ];
}
else {
$Date = __( 'g:i A', 'vdabalert_widget_domain' );
}
// Widget admin form
// This html outputs the options of the form in the Widgets screen 
// In this case, the input html allows one to change the title of the widget.
// when the title is changed, this method is called with 
// a new instance so that the new title takes effect.
// 
// get_field_id() returns the id attribute of the widget, get_field_name() returns the name attribute
?>
<p>
<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label> 
<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" /> 

<label for="<?php echo $this->get_field_id( 'AlertURL' ); ?>"><?php _e( 'Alert URL:' ); ?></label> 
<input class="widefat" id="<?php echo $this->get_field_id( 'AlertURL' ); ?>" name="<?php echo $this->get_field_name( 'AlertURL' ); ?>" type="text" value="<?php echo esc_attr( $AlertURL ); ?>" /> 

<label for="<?php echo $this->get_field_id( 'AlertDetailURL' ); ?>"><?php _e( 'Alert Detail URL:' ); ?></label> 
<input class="widefat" id="<?php echo $this->get_field_id( 'AlertDetailURL' ); ?>" name="<?php echo $this->get_field_name( 'AlertDetailURL' ); ?>" type="text" value="<?php echo esc_attr( $AlertDetailURL ); ?>" /> 	
	
<label for="<?php echo $this->get_field_id( 'NoRows' ); ?>"><?php _e( 'Number of Rows:' ); ?></label> 
<input class="widefat" id="<?php echo $this->get_field_id( 'NoRows' ); ?>" name="<?php echo $this->get_field_name( 'NoRows' ); ?>" type="text" value="<?php echo esc_attr( $NoRows ); ?>" />

<label for="<?php echo $this->get_field_id( 'Date' ); ?>"><?php _e( 'Date Formatting:' ); ?></label> 
<input class="widefat" id="<?php echo $this->get_field_id( 'Date' ); ?>" name="<?php echo $this->get_field_name( 'Date' ); ?>" type="text" value="<?php echo esc_attr( $Date ); ?>" />	
</p>

<?php 
}

     
// Updating widget replacing old instances with new
// updates settings user changes through widgets screen, in this case, title
public function update( $new_instance, $old_instance ) {
$instance = array();
$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
$instance['NoRows'] = ( ! empty( $new_instance['NoRows'] ) ) ? strip_tags( $new_instance['NoRows'] ) : '';
$instance['AlertURL'] = ( ! empty( $new_instance['AlertURL'] ) ) ? strip_tags( $new_instance['AlertURL'] ) : '';
$instance['AlertDetailURL'] = ( ! empty( $new_instance['AlertDetailURL'] ) ) ? strip_tags( $new_instance['AlertDetailURL'] ) : '';
$instance['Date'] = ( ! empty( $new_instance['Date'] ) ) ? strip_tags( $new_instance['Date'] ) : '';
	
return $instance;
}
}

// Register the widget
function vdabalert_load_widget() {
   register_widget( 'vdabalert_widget' );
}
// Adds this into the available widgets.
add_action( 'widgets_init', 'vdabalert_load_widget' );

function add_vdabalert_stylesheet() {
	wp_register_style('vdab_alertwidget', '/wp-content/plugins/vdabalert_plugin/vdab_alertwidget.css');
wp_enqueue_style('vdab_alertwidget');

}

add_action( 'wp_print_styles', 'add_vdabalert_stylesheet' );