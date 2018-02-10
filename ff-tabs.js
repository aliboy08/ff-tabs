/*! FF Tabs v.1 */
(function($){
	
	$.fn.ff_tabs = function(options) {
	
		this.addClass('ff-custom-tabs-init');
		
		var settings = $.extend({
			nav: '.tabs-nav',
			tabs: '.tabs',
			same_height: false,
			show_dropdown_nav: { screen: 768 },
		}, options );
		
		var nav = this.find(settings.nav),
			tabs = this.find(settings.tabs),
			tabs_children = tabs.children(),
			nav_children = nav.find('a'),
			dropdown_nav,
			dropdown_nav_trigger;
		
		if( settings.same_height || settings.show_dropdown_nav ) {
	
			if( settings.same_height ) {
				set_same_height();
			}
			
			// Enable Dropdown Nav
			if( settings.show_dropdown_nav ) {
				create_dropdown_nav();
				if( $(window).width() <= settings.show_dropdown_nav.screen ){
					display_dropdown_nav('show');
				} else {
					display_dropdown_nav('hide');
				}
			}
			
			$(window).resize(function(){
				if( settings.same_height ) {
					set_same_height();
				}
				if( settings.show_dropdown_nav ) {
					if( $(window).width() <= settings.show_dropdown_nav.screen ){
						display_dropdown_nav('show');
					} else {
						display_dropdown_nav('hide');
					}
				}
			})
		}
		
		// Set same height
		function set_same_height(){
			var temp_height = 0;
			tabs_children.css('min-height', 'initial'); // reset height
			tabs_children.each(function(){
				// Get tallest
				if( $(this).outerHeight() > temp_height )
					temp_height = $(this).outerHeight();
			});
			// Set tallest to all
			tabs_children.css('min-height', temp_height+'px');
		}
		
		// Create dropdown nav
		function create_dropdown_nav(){
			dropdown_nav = nav.clone().addClass('dropdown'); // clone nav for dropdown
			nav.after(dropdown_nav); // append after
			dropdown_nav.hide();
			dropdown_nav_trigger = $('<span class="dropdown-trigger">Select</span>');
			
			dropdown_nav.prepend(dropdown_nav_trigger);
			
			// create dropdown container for the links
			var dropdown_container = $('<div class="dropdown-container"></div>');
			dropdown_nav.append(dropdown_container);
			
			dropdown_nav_children = dropdown_nav.find('a');
			
			// put dropdown a inside container
			dropdown_container.prepend(dropdown_nav_children);
			
			// Remove class on outside click
			$(window).click(function() {
				dropdown_container.removeClass('show');
			});
			
			dropdown_nav_trigger.click(function(e){
				e.stopPropagation();
				dropdown_container.addClass('show');
			});
			
			// On dropdown nav children click, click matching nav item
			dropdown_nav_children.click(function(){
				$(nav_children[$(this).index()]).click();
			})
			
		}
		
		function display_dropdown_nav(state){
			if( state === 'show' ) {
				nav.hide();
				dropdown_nav.show();
			} else {
				nav.show();
				dropdown_nav.hide();
			}
		}
			
		// Hide on init
		tabs_children.hide();
		
		// Set first nav item active
		$(nav_children[0]).addClass('active');
		
		// Show first tab item
		$(tabs_children[0]).fadeIn();
		
		nav_children.click(function(e){
			e.preventDefault();
			
			var this_nav_item = $(this);
			
			if( this_nav_item.hasClass('active') ) {
				return;
			}
			
			var target = this_nav_item.attr('href');
			
			// Set nav item active
			nav_children.removeClass('active'); // reset
			this_nav_item.addClass('active');
			
			if( typeof dropdown_nav_children !== 'undefined' ){
				dropdown_nav_trigger.text(this_nav_item.text());
			}
			
			var target_tab = tabs.find(target);
			// Show target tab
			tabs_children.hide(); // reset
			target_tab.fadeIn();
			
		});
		
		return this;
	};
	
})(jQuery)