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
// REFACTOR - Modify so it just displays one ALERT - put loop in other code.
public function displayAlert( $result2 ){
	//make the Info attribute of the Alert link to the Alert's ContainerURL
	$arr3 = json_decode($result2, true);
	
	foreach($arr3 as $alert) { 
   		$containerURL = $alert["FlowURL"];
		echo "<a href='$containerURL' >";
		echo $alert["Info"];
		echo "</a>";
		echo "<hr>";
	}	
}
// Creating widget front-end
// $instance is just an array with settings for an incarnation of a WordPress widget. This array() gets saved to the DB and retrieved again to be able to save the settings for the different widgets. 	
public function widget( $args, $instance ) {
	$title = apply_filters( 'widget_title', $instance['title'] );
	$NoRows = $instance["NoRows"];
	$AlertURL = $instance["AlertURL"];
	 //will run any functions that have been hooked (using add_filter()) to the filter hook that we’re naming 'widget_title,' passing $instance['title'] to each of those functions.
	// before and after widget arguments are defined by themes
	echo $args['before_widget'];
	if ( ! empty( $title ) )
		echo $args['before_title'] . $title . $args['after_title']; // dot appends strings
 	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Will return the response, if false it print the response
	curl_setopt($ch, CURLOPT_URL, $AlertURL); // Set the url
	$result0 = curl_exec($ch); 	// Execute
	curl_close($ch); 	// Closing
	
	//trimming the json string of unnessecary white spaces and brackets
	//and turning into valid json
	// REFACTOR - put in a function fixupJSON
	$result0 = str_replace('\s', '', $result0);
	$result1 = str_replace('"Group":', "", $result0);
	$result15 = str_replace('"Alert":',"",$result1);
	$result = trim($result15, "{}" );
	$result = trim($result, "{}" );
	$result = trim($result, "{}" );
    $result = preg_replace('/{/', '[', $result, 1);
	$result = preg_replace('/\}+$/', ']', $result,1);
 	$result = trim($result, " \t\n\r\0\x0B");
	$result = trim($result, " \t\n\r\0\x0B");
	$result = trim($result, " \t\n\r\0\x0B");
	$arr = json_decode($result,true);
	
	// REFACTOR - Create a function to array2 = removeDuplicateAlerts( array)
	//  $arr2 = removeDuplicateAlerts($arr);
	// foreach ($arr2 as $alert){
	//	displayAlert($alert);
	// }
	
	//check for alert duplicates
	$i=0;
	$arr2=[];
	//first converting json array to array of strings
	//so that array  uniqueness can be tested
	//(the array_unique method only works on strings)
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
	
	
	//reducing array to number of rows requested
	if (sizeof($arr2) > $NoRows){
			array_splice($arr2, $NoRows);
	}
	$result2 = json_encode($arr2);

	//if unique array is smaller, a trailing comma must be removed.
	if (sizeof($arr2) < sizeof($arr)){
		$result2[strrpos($result2, ',')] = '';
	}
	$this->displayAlert($result2);
	
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
	
	if ( isset( $instance[ 'NoRows' ] ) ) {
		$NoRows = $instance[ 'NoRows' ];
	}
	else {
		$NoRows = __( '3', 'vdabalert_widget_domain' );
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
		
	<label for="<?php echo $this->get_field_id( 'NoRows' ); ?>"><?php _e( 'Number of Rows:' ); ?></label> 
	<input class="widefat" id="<?php echo $this->get_field_id( 'NoRows' ); ?>" name="<?php echo $this->get_field_name( 'NoRows' ); ?>" type="text" value="<?php echo esc_attr( $NoRows ); ?>" />
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
	
	return $instance;
}
}

// Register the widget
function vdabalert_load_widget() {
	    register_widget( 'vdabalert_widget' );
}
// Adds this into the available widgets.
add_action( 'widgets_init', 'vdabalert_load_widget' );