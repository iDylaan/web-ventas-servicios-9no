/*-----------------------------------------------------------------------------------
    Template Name: Oxence - Web Design Company HTML Template
    Template URI: https://webtend.net/demo/html/oxence/
    Author: WebTend
    Author URI:  https://webtend.net/
    Version: 1.0

    Note: This is Main JS File.
-----------------------------------------------------------------------------------
	CSS INDEX
	===================
    01. Header Style
    02. Dropdown menu
    03. Submenu Dropdown
    04. Menu Hidden
    05. Search Box
    06. Video Popup
    07. Video Btn with text
    08. Main Slider
    09. Team Member
    10. Feedback Slider Two
    11. Project Three Slider
    12. Testimonial Two Slider
    13. Fact Counter
    14. Project Filtering
    15. Team Filtering
    16. Shop Filtering
    17. Team skill Counter
    19. Quantity Number
    20. Scroll to Top
    21. Nice Select
    22. WOW Animation
    23. OnePage Nav
    24. Preloader
-----------------------------------------------------------------------------------*/

(function ($) {

    "use strict";

    $(document).ready(function () {

        // 01. Header Style and Scroll to Top
        function headerStyle() {
            if ($('.main-header').length) {
                var windowpos = $(window).scrollTop();
                var siteHeader = $('.main-header');
                var scrollLink = $('.scroll-top');
                if (windowpos >= 250) {
                    siteHeader.addClass('fixed-header');
                    scrollLink.fadeIn(300);
                } else {
                    siteHeader.removeClass('fixed-header');
                    scrollLink.fadeOut(300);
                }
            }
        }
        headerStyle();
        
        
        // 02. Dropdown menu
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');

        navcollapse.hover(function () {
            if ($(window).innerWidth() >= mobileWidth) {
                $(this).children('ul').stop(true, false, true).slideToggle(300);
                $(this).children('.megamenu').stop(true, false, true).slideToggle(300);
            }
        });
        
        // 03. Submenu Dropdown Toggle
        if ($('.main-header .navigation li.dropdown ul').length) {
            $('.main-header .navigation li.dropdown').append('<div class="dropdown-btn"><span class="fas fa-chevron-down"></span></div>');

            //Dropdown Button
            $('.main-header .navigation li.dropdown .dropdown-btn').on('click', function () {
                $(this).prev('ul').slideToggle(500);
                $(this).prev('.megamenu').slideToggle(800);
            });
            
            //Disable dropdown parent link
            $('.navigation li.dropdown > a').on('click', function (e) {
                e.preventDefault();
            });
        }
        
        //Submenu Dropdown Toggle
        if ($('.main-header .main-menu').length) {
            $('.main-header .main-menu .navbar-toggle').click(function () {
                $(this).prev().prev().next().next().children('li.dropdown').hide();
            });
        }
        
        
         
        // 04. Menu Hidden Sidebar Content Toggle
        if($('.menu-sidebar').length){
            //Show Form
            $('.menu-sidebar').on('click', function(e) {
                e.preventDefault();
                $('body').toggleClass('side-content-visible');
            });
            //Hide Form
            $('.hidden-bar .inner-box .cross-icon,.form-back-drop,.close-menu').on('click', function(e) {
                e.preventDefault();
                $('body').removeClass('side-content-visible');
            });
            //Dropdown Menu
            $('.fullscreen-menu .navigation li.dropdown > a').on('click', function() {
                $(this).next('ul').slideToggle(500);
            });
        }
         
        
        // 05. Search Box
		$('.nav-search > button').on('click', function () {
			$('.nav-search form').toggleClass('hide');
		});
        
        
        // Hide Box Search WHEN CLICK OUTSIDE
		if ($(window).width() > 767){
			$('body').on('click', function (event) {
				if ($('.nav-search > button').has(event.target).length == 0 && !$('.nav-search > button').is(event.target)
					&& $('.nav-search form').has(event.target).length == 0 && !$('.nav-search form').is(event.target)) {
					if ($('.nav-search form').hasClass('hide') == false) {
						$('.nav-search form').toggleClass('hide');
					};
				}
			});
		}
        
        
        // 06. Video Popup
        if ($('.video-play').length) {
            $('.video-play').magnificPopup({
                type: 'video',
            });
        } 
        
        
        // 07. Video Btn with text
        if ($('.video-play-text').length) {
            $('.video-play-text').magnificPopup({
                type: 'video',
            });
        } 
         
        
        // 08. Main Slider
        if ($('.main-slider-active').length) {
            $('.main-slider-active').slick({
                infinite: true,
                arrows: false,
                dots: true,
                fade: true,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                slidesToScroll: 1,
                slidesToShow: 1,
                appendDots: '.main-slider-dots',
            });
        }
          
        
        // 09. Team Member
        if ($('.team-slider-active').length) {
            $('.team-slider-active').slick({
                dots: true,
                infinite: true,
                autoplay: false,
                autoplaySpeed: 2000,
                arrows: false,
                speed: 1000,
                focusOnSelect: false,
                slidesToShow: 4,
                slidesToScroll: 2,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 575,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        }
        
        
        
        // 10. Feedback Slider Two
        if ($('.feedback-active').length) {
            $('.feedback-active').slick({
                dots: true,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 5000,
                arrows: false,
                centerMode: false,
                speed: 1000,
                slidesToShow: 3,
                slidesToScroll: 2,
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        }
        
        
        // 11. Project Three Slider
        if ($('.project-three-active').length) {
            $('.project-three-active').slick({
                dots: true,
                infinite: true,
                autoplay: false,
                autoplaySpeed: 5000,
                arrows: false,
                centerMode: false,
                speed: 1000,
                slidesToShow: 3,
                slidesToScroll: 2,
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        }
        
        $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
          $('.project-three-active').slick('setPosition');
        })
        
        
        // 12. Testimonial Two Slider
        if ($('.testimonial-two-active').length) {
            $('.testimonial-two-active').slick({
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                speed: 400,
                autoplay: false,
                autoplaySpeed: 5000,
                prevArrow: $('.work-prev'),
                nextArrow: $('.work-next'),
                responsive: [
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            });
        }
        
        
        // ## Testimonial Four Slider
        if ($('.testimonial-four-active').length) {
            $('.testimonial-four-active').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                speed: 400,
                fade: true,
                arrows: false,
                autoplay: true,
                autoplaySpeed: 5000,
            });
        }
        
        
         /* 13. Fact Counter + Text Count - Our Success */
        if ($('.counter-text-wrap').length) {
            $('.counter-text-wrap').appear(function () {
                
                var $t = $(this),
                    n = $t.find(".count-text").attr("data-stop"),
                    r = parseInt($t.find(".count-text").attr("data-speed"), 10);

                if (!$t.hasClass("counted")) {
                    $t.addClass("counted");
                    $({
                        countNum: $t.find(".count-text").text()
                    }).animate({
                        countNum: n
                    }, {
                        duration: r,
                        easing: "linear",
                        step: function () {
                            $t.find(".count-text").text(Math.floor(this.countNum));
                        },
                        complete: function () {
                            $t.find(".count-text").text(this.countNum);
                        }
                    });
                }

            }, {
                accY: 0
            });
        }
        
        
        // 14. Project Filtering
        $(".project-filter li").on('click', function () {
            $(".project-filter li").removeClass("current");
            $(this).addClass("current");

            var selector = $(this).attr('data-filter');
            $('.project-active').imagesLoaded(function () {
                $(".project-active").isotope({
                    itemSelector: '.item',
                    filter: selector,
                });
            });

        });
        
        
        // 15. Team Filtering
        $(".team-filter li").on('click', function () {
            $(".team-filter li").removeClass("current");
            $(this).addClass("current");

            var selector = $(this).attr('data-filter');
            $('.team-active').imagesLoaded(function () {
                $(".team-active").isotope({
                    itemSelector: '.item',
                    filter: selector,
                });
            });

        });
        
        // 16. Shop Filtering
        $(".shop-filter li").on('click', function () {
            $(".shop-filter li").removeClass("current");
            $(this).addClass("current");

            var selector = $(this).attr('data-filter');
            $('.shop-active').imagesLoaded(function () {
                $(".shop-active").isotope({
                    itemSelector: '.item',
                    filter: selector,
                });
            });

        });
        
        
        /* 17. Team skill Counter */
		if ($.fn.circleProgress) {
			var progress1 = $('.one.progress-content')
			if($.fn.circleProgress) {
			  progress1.appear(function () {
				progress1.circleProgress({
					value: 0.8,
					size: 130,
                    thickness: 7,
					fill: "#3180fc",
                    lineCap: 'square',
					emptyFill: "#eaf2ff",
                    startAngle: -Math.PI / 4 * 2,
					animation : { duration: 2000},
				  }).on('circle-animation-progress', function(event, progress) {
					$(this).find('h3').html(Math.round(89 * progress) + '<span>%</span>');
				  });
			  });
			};
		};
		if ($.fn.circleProgress) {
			var progress2 = $('.two.progress-content')
			if($.fn.circleProgress) {
			  progress2.appear(function () {
				progress2.circleProgress({
					value: 0.76,
					size: 130,
                    thickness: 7,
					fill: "#f1b000",
                    lineCap: 'square',
                    emptyFill: "#fdf3d9",
                    startAngle: -Math.PI / 4 * 2,
					animation : { duration: 2000},
				  }).on('circle-animation-progress', function(event, progress) {
					$(this).find('h3').html(Math.round(76 * progress) + '<span>%</span>');
				  });
			  });
			};
		};
		if ($.fn.circleProgress) {
			var progress3 = $('.three.progress-content')
			if($.fn.circleProgress) {
			  progress3.appear(function () {
				progress3.circleProgress({
					value: 0.63,
					size: 130,
                    thickness: 7,
					fill: "#16b4f2",
                    lineCap: 'square',
                    emptyFill: "#e7f7fe",
                    startAngle: -Math.PI / 4 * 2,
					animation : { duration: 2000},
				  }).on('circle-animation-progress', function(event, progress) {
					$(this).find('h3').html(Math.round(63 * progress) + '<span>%</span>');
				  });
			  });
			};
		};
		if ($.fn.circleProgress) {
			var progress4 = $('.four.progress-content')
			if($.fn.circleProgress) {
			  progress4.appear(function () {
				progress4.circleProgress({
					value: 0.58,
					size: 130,
                    thickness: 7,
					fill: "#c400fc",
                    lineCap: 'square',
                    emptyFill: "#f9e5ff",
                    startAngle: -Math.PI / 4 * 2,
					animation : { duration: 2000},
				  }).on('circle-animation-progress', function(event, progress) {
					$(this).find('h3').html(Math.round(58 * progress) + '<span>%</span>');
				  });
			  });
			};
		};
        
        /* Home Four skill Counter */
		if ($.fn.circleProgress) {
			var skillCounter1 = $('.one.skill-counter')
			if($.fn.circleProgress) {
			  skillCounter1.appear(function () {
				skillCounter1.circleProgress({
					value: 0.75,
					size: 165,
                    thickness: 12,
					fill: "#399648",
                    lineCap: 'square',
					emptyFill: "transparent",
                    startAngle: -Math.PI / 4 * 2,
					animation : { duration: 2000},
				  }).on('circle-animation-progress', function(event, progress) {
					$(this).find('h3').html(Math.round(79 * progress) + '<span>%</span>');
				  });
			  });
			};
		};
        
		if ($.fn.circleProgress) {
			var skillCounter2 = $('.two.skill-counter')
			if($.fn.circleProgress) {
			  skillCounter2.appear(function () {
				skillCounter2.circleProgress({
					value: 0.85,
					size: 165,
                    thickness: 12,
					fill: "#399648",
                    lineCap: 'square',
					emptyFill: "transparent",
                    startAngle: -Math.PI / 4 * 2,
					animation : { duration: 2000},
				  }).on('circle-animation-progress', function(event, progress) {
					$(this).find('h3').html(Math.round(93 * progress) + '<span>%</span>');
				  });
			  });
			};
		};
        
		if ($.fn.circleProgress) {
			var skillCounter3 = $('.three.skill-counter')
			if($.fn.circleProgress) {
			  skillCounter3.appear(function () {
				skillCounter3.circleProgress({
					value: 0.8,
					size: 165,
                    thickness: 12,
					fill: "#399648",
                    lineCap: 'square',
					emptyFill: "transparent",
                    startAngle: -Math.PI / 4 * 2,
					animation : { duration: 2000},
				  }).on('circle-animation-progress', function(event, progress) {
					$(this).find('h3').html(Math.round(84 * progress) + '<span>%</span>');
				  });
			  });
			};
		};
        
        
        // 19. Quantity Number js
        $('.quantity-down').on('click', function(){
            var numProduct = Number($(this).next().val());
            if(numProduct > 1) $(this).next().val(numProduct - 1);
        });
        $('.quantity-up').on('click', function(){
            var numProduct = Number($(this).prev().val());
            $(this).prev().val(numProduct + 1);
        });
        

        
        // 20. Scroll to Top
        if ($('.scroll-to-target').length) {
            $(".scroll-to-target").on('click', function () {
                var target = $(this).attr('data-target');
                // animate
                $('html, body').animate({
                    scrollTop: $(target).offset().top
                }, 1000);

            });
        }
        
        
        // 21. Nice Select
        $('select').niceSelect();
        
        
        // 22. WOW Animation
        if ($('.wow').length) {
            var wow = new WOW({
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 0, // distance to the element when triggering the animation (default is 0)
                mobile: false, // trigger animations on mobile devices (default is true)
                live: true // act on asynchronously loaded content (default is true)
            });
            wow.init();
        }
        
        
        // 23. OnePage Nav Scroll
        $(".onepage a").on('click', function(e){
            e.preventDefault();
            var hash = this.hash;
            var position = $(hash).offset().top;
            $("html").animate({
                scrollTop : position
            },1000);
        });
        
 
    });
    
    
    /* ==========================================================================
       When document is resize, do
       ========================================================================== */

    $(window).on('resize', function () {
        var mobileWidth = 992;
        var navcollapse = $('.navigation li.dropdown');
        navcollapse.children('ul').hide();
        navcollapse.children('.megamenu').hide();

    });


    /* ==========================================================================
       When document is scroll, do
       ========================================================================== */

    $(window).on('scroll', function () {

        // Header Style and Scroll to Top
        function headerStyle() {
            if ($('.main-header').length) {
                var windowpos = $(window).scrollTop();
                var siteHeader = $('.main-header');
                var scrollLink = $('.scroll-top');
                if (windowpos >= 100) {
                    siteHeader.addClass('fixed-header');
                    scrollLink.fadeIn(300);
                } else {
                    siteHeader.removeClass('fixed-header');
                    scrollLink.fadeOut(300);
                }
            }
        }

        headerStyle();

    });

    /* ==========================================================================
       When document is loaded, do
       ========================================================================== */

    $(window).on('load', function () {

        // 24. Preloader
        function handlePreloader() {
            if ($('.preloader').length) {
                $('.preloader').delay(200).fadeOut(500);
            }
        }
        handlePreloader();
        
        
        
        // 14. Project Filtering
        if ($('.project-active').length) {
            $(this).imagesLoaded(function () {
                $('.project-active').isotope({
                    // options
                    itemSelector: '.item',
                });
            });
        }
          
        
        // 15. Team Filtering
        if ($('.team-active').length) {
            $(this).imagesLoaded(function () {
                $('.team-active').isotope({
                    // options
                    itemSelector: '.item',
                });
            });
        }
          
        
        // 16. Shop Filtering
        if ($('.shop-active').length) {
            $(this).imagesLoaded(function () {
                $('.shop-active').isotope({
                    // options
                    itemSelector: '.item',
                });
            });
        }
          
        
    });

})(window.jQuery);
