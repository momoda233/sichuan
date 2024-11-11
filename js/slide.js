jQuery(document).ready(function($){
	//cache DOM elements
	var projectsContainer = $('.cd-projects-container'),
		projectsPreviewWrapper = projectsContainer.find('.cd-projects-previews'),
		projectPreviews = projectsPreviewWrapper.children('li'),
		projects = projectsContainer.find('.cd-projects'),
		navigationTrigger = $('.cd-nav-trigger-c '),
		navigation = $('.cd-primary-nav'),
		//if browser doesn't support CSS transitions...
		transitionsNotSupported = ( $('.no-csstransitions').length > 0);

	var animating = false,
		//will be used to extract random numbers for projects slide up/slide down effect
		numRandoms = projects.find('li').length, 
		uniqueRandoms = [];

	//open project
	projectsPreviewWrapper.on('click', 'a', function(event){
		event.preventDefault();
		if( animating == false ) {
			animating = true;
			navigationTrigger.add(projectsContainer).addClass('project-open');
			openProject($(this).parent('li'));
		}
	});

	navigationTrigger.on('click', function(event){
		event.preventDefault();
		
		if( animating == false ) {
			animating = true;
			if( navigationTrigger.hasClass('project-open') ) {
				//close visible project
				navigationTrigger.add(projectsContainer).removeClass('project-open');
				closeProject();
			} else if( navigationTrigger.hasClass('nav-visible') ) {
				//close main navigation
				navigationTrigger.removeClass('nav-visible');
				navigation.removeClass('nav-clickable nav-visible');
				if(transitionsNotSupported) projectPreviews.removeClass('slide-out');
				else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
			} else {
				//open main navigation
				navigationTrigger.addClass('nav-visible');
				navigation.addClass('nav-visible');
				if(transitionsNotSupported) projectPreviews.addClass('slide-out');
				else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);
			}
		}	

		if(transitionsNotSupported) animating = false;
	});

	//scroll down to project info
	projectsContainer.on('click', '.scroll', function(){
		projectsContainer.animate({'scrollTop':$(window).height()}, 500); 
	});

	//check if background-images have been loaded and show project previews
	projectPreviews.children('a').bgLoaded({
	  	afterLoaded : function(){
	   		showPreview(projectPreviews.eq(0));
	  	}
	});

	function showPreview(projectPreview) {
		if(projectPreview.length > 0 ) {
			setTimeout(function(){
				projectPreview.addClass('bg-loaded');
				showPreview(projectPreview.next());
			}, 150);
		}
	}

	function openProject(projectPreview) {
		var projectIndex = projectPreview.index();
		projects.children('li').eq(projectIndex).add(projectPreview).addClass('selected');
		
		if( transitionsNotSupported ) {
			projectPreviews.addClass('slide-out').removeClass('selected');
			projects.children('li').eq(projectIndex).addClass('content-visible');
			animating = false;
		} else { 
			slideToggleProjects(projectPreviews, projectIndex, 0, true);
		}
	}

	function closeProject() {
		projects.find('.selected').removeClass('selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$(this).removeClass('content-visible').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
			slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
		});

		//if browser doesn't support CSS transitions...
		if( transitionsNotSupported ) {
			projectPreviews.removeClass('slide-out');
			projects.find('.content-visible').removeClass('content-visible');
			animating = false;
		}
	}

	function slideToggleProjects(projectsPreviewWrapper, projectIndex, index, bool) {
		if(index == 0 ) createArrayRandom();
		if( projectIndex != -1 && index == 0 ) index = 1;

		var randomProjectIndex = makeUniqueRandom();
		if( randomProjectIndex == projectIndex ) randomProjectIndex = makeUniqueRandom();
		
		if( index < numRandoms - 1 ) {
			projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool);
			setTimeout( function(){
				//animate next preview project
				slideToggleProjects(projectsPreviewWrapper, projectIndex, index + 1, bool);
			}, 150);
		} else if ( index == numRandoms - 1 ) {
			//this is the last project preview to be animated 
			projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				if( projectIndex != -1) {
					projects.children('li.selected').addClass('content-visible');
					projectsPreviewWrapper.eq(projectIndex).addClass('slide-out').removeClass('selected');
				} else if( navigation.hasClass('nav-visible') && bool ) {
					navigation.addClass('nav-clickable');
				}
				projectsPreviewWrapper.eq(randomProjectIndex).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				animating = false;
			});
		}
	}

	function makeUniqueRandom() {
	    var index = Math.floor(Math.random() * uniqueRandoms.length);
	    var val = uniqueRandoms[index];
	    // now remove that value from the array
	    uniqueRandoms.splice(index, 1);
	    return val;
	}

	function createArrayRandom() {
		//reset array
		uniqueRandoms.length = 0;
		for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
	}
});


 (function($){
 	$.fn.bgLoaded = function(custom) {
	 	var self = this;

		// Default plugin settings
		var defaults = {
			afterLoaded : function(){
				this.addClass('bg-loaded');
			}
		};

		// Merge default and user settings
		var settings = $.extend({}, defaults, custom);

		// Loop through element
		self.each(function(){
			var $this = $(this),
				bgImgs = $this.css('background-image').split(', ');
			$this.data('loaded-count',0);
			$.each( bgImgs, function(key, value){
				var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
				$('<img/>').attr('src', img).load(function() {
					$(this).remove(); // prevent memory leaks
					$this.data('loaded-count',$this.data('loaded-count')+1);
					if ($this.data('loaded-count') >= bgImgs.length) {
						settings.afterLoaded.call($this);
					}
				});
			});

		});
	};
})(jQuery);


//slide部分
$(document).ready(function(){
	for (var i=1; i <= $('.slider__slide').length; i++){
	  $('.slider__indicators').append('<div class="slider__indicator" data-slide="'+i+'"></div>')
	}
	setTimeout(function(){
	  $('.slider__wrap').addClass('slider__wrap--hacked');
	}, 1000);
  })
  
  function goToSlide(number){
	$('.slider__slide').removeClass('slider__slide--active');
	$('.slider__slide[data-slide='+number+']').addClass('slider__slide--active');
  }
  
  $('.slider__next, .next-img').on('click', function(){
	var currentSlide = Number($('.slider__slide--active').data('slide'));
	var totalSlides = $('.slider__slide').length;
	currentSlide++
	if (currentSlide > 4){
	  currentSlide = 1;
	}
	goToSlide(currentSlide);
  })

  //menu
  jQuery(document).ready(function($){
	//open navigation clicking the menu icon
	$('.cd-nav-trigger').on('click', function(event){
		event.preventDefault();
		toggleNav(true);
	});
	//close the navigation
	$('.cd-close-nav, .cd-overlay').on('click', function(event){
		event.preventDefault();
		toggleNav(false);
	});
	//select a new section
	$('.cd-nav li').on('click', function(event){
		event.preventDefault();
		var target = $(this),
			//detect which section user has chosen
			sectionTarget = target.data('menu');
		if( !target.hasClass('cd-selected') ) {
			//if user has selected a section different from the one alredy visible
			//update the navigation -> assign the .cd-selected class to the selected item
			target.addClass('cd-selected').siblings('.cd-selected').removeClass('cd-selected');
			//load the new section
			loadNewContent(sectionTarget);
		} else {
			// otherwise close navigation
			toggleNav(false);
		}
	});

	function toggleNav(bool) {
		$('.cd-nav-container, .cd-overlay').toggleClass('is-visible', bool);
		$('main').toggleClass('scale-down', bool);
	}

	function loadNewContent(newSection) {
		//create a new section element and insert it into the DOM
		var section = $('<section class="cd-section '+newSection+'"></section>').appendTo($('main'));
		//load the new content from the proper html file
		section.load(newSection+'.html .cd-section > *', function(event){
			//add the .cd-selected to the new section element -> it will cover the old one
			section.addClass('cd-selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				//close navigation
				toggleNav(false);
			});
			section.prev('.cd-selected').removeClass('cd-selected');
		});

		$('main').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			//once the navigation is closed, remove the old section from the DOM
			section.prev('.cd-section').remove();
		});

		if( $('.no-csstransitions').length > 0 ) {
			//if browser doesn't support transitions - don't wait but close navigation and remove old item
			toggleNav(false);
			section.prev('.cd-section').remove();
		}
	}
});