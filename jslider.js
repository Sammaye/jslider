(function ($) {
    var options = {
            "width": 580,
            "height": 164,
            "slide_speed": 10000,
            "fade_speed": "slow",
            "json": "data_source.json",
            "images": "",
            "side_nav": false,
            "bottom_nav": true,
            "cycle": true
        },
        methods = {
            init: function (opts) {

                // Merge options so we have the users options
                options = $.extend(options, opts);

                return this.each(function () {

                    // Specify the variable required to make the slider
                    var $this = $(this),
                        thumbs = [],
                        data = $this.data('j_slider');

                    if (!data) {
                        // Get our source data
                        $.getJSON(options.json, function (data) {

                            // Constrain the outer boxes
                            $this.css({"height": options.height + "px", "width": options.width + "px"});
                            $this.children(".j-slider_inner").css({
                                "height": options.height + "px",
                                "width": options.width + "px"
                            });

                            // Add our slider row (all our slides will go into here)
                            $("<div class='j-slider_row'></div>").appendTo($this.children(".j-slider_inner").get());

                            // Add the controls outer (all our slide controls go here)
                            $this.children(".j-slider_inner").append("<div class='j_slider-controls_outer'></div>");

                            // For each of the slides within the JSON file
                            $.each(data, function (i, slide) {

                                // Form an ID
                                id = "slide_" + (i + 1);

                                // Append the slide itself
                                $("<div class='j_slider-slide_outer j_slider-slide' id='slide_" + (i + 1) + "'><img src='" + options.images + slide.image + "' alt=''/></div>")
                                    .appendTo($this.find(".j-slider_row").get());

                                // Add the slide to the buttons at the bottom (the white circle things)
                                if (options.bottom_nav) {
                                    if (slide.thumbnail && slide.thumbnail != undefined && slide.thumbnail != null) {
                                        // Still needs to be done
                                    } else {
                                        $this.children(".j-slider_inner").find(".j_slider-controls_outer")
                                            .append("<div class='j_slider-controls_inner j_slider-controls_active' id='" + i + "'></div>");
                                    }
                                }
                            });

                            // Assign the controls an action.
                            $this.children(".j-slider_inner").children(".j_slider-controls_outer").find(".j_slider-controls_inner").bind({click: _goto});

                            // Make first slide active
                            $this.find(".j-slider_row").children("#slide_1").addClass("j_slider-slide_active");

                            // Make all other slides hide
                            $this.find(".j-slider_row").find("div:not(#slide_1)").css("display", "none");

                            // Assign the inactive class to all control buttons that are not assigned to the first slide
                            $this.find(".j_slider-controls_outer").children(".j_slider-controls_inner:not(#0)").removeClass("j_slider-controls_active");

                            if (options.cycle) {
                                // If the user wants to cycle the slides then start the automated slider
                                slider_timeout = setTimeout(next, options.slide_speed);
                            }

                            if (options.side_nav) {
                                // If user wants the slide menu navs then put them in
                                $this.children(".j-slider_inner")
                                    .append("<div class='j_slider-previous'><span><</span></div><div class='j_slider-next'><span>></span></div>");
                                $this.children(".j-slider_inner").find(".j_slider-next").bind({click: next});
                                $this.children(".j-slider_inner").find(".j_slider-previous").bind({click: previous});
                            }
                        });
                    }
                });
            },
            destroy: function () {
                return this.each(function () {

                    // This function is kinda redundant and aint really needed
                    var $this = $(this),
                        data = $this.data('j_slider');

                    // Namespacing FTW
                    //$(window).unbind('.j_slider');
                    data.j_slider.remove();
                    $this.removeData('j_slider');

                });
            }
        },
        _goto = function () {
            // This function takes us to a specific slide
            // Stop the timeout to stop stupid clitches within animation.
            clearTimeout(slider_timeout);

            // Get the slide we are looking for
            var id = $(this).attr("id"), el = $(".j_slider-slide_outer:eq(" + $(this).attr("id") + ")").get();

            // Make it display (beneath the current one)
            $(el).css("display", "block");

            // Fade out the current slide
            $('.j_slider-slide_active').fadeOut(options.fade_speed, function () {

                // Take away the class from the one just faded out
                $(".j-slider_row").find(".j_slider-slide_active").removeClass("j_slider-slide_active");

                // Take the class away from the control button assigned to this slide
                $(".j_slider-controls_outer").find(".j_slider-controls_active").removeClass("j_slider-controls_active");

                // Add class assigned to goto slide to controls and show the slide
                $(".j_slider-controls_outer").find("div#" + id).addClass("j_slider-controls_active");
                $(el).addClass("j_slider-slide_active").show();
            });

            if (options.cycle) {
                // Continue cycling if user wishes it
                slider_timeout = setTimeout(next, options.slide_speed);
            }
        },
        previous = function () {
            // This function goes to the previous slide
            // Lets clear timeout again
            clearTimeout(slider_timeout);

            // Get previous slide
            var index = 0, el = $(".j-slider_row").find(".j_slider-slide_active").prev();

            // If we are at the end show the last slide otherwise show the next one
            if (el.length > 0) {
                index = $(".j_slider-slide_outer").index(el);
                el.css("display", "block");
            } else {
                index = $(".j_slider-slide_outer").index($(".j_slider-slide_outer").last());
                $(".j_slider-slide_outer").last().css("display", "block");
            }

            // Fade out the current slide
            $('.j_slider-slide_active').fadeOut(options.fade_speed, function () {

                // remove active class from current slide and remove the active class from the control button
                $(".j-slider_row").find(".j_slider-slide_active").removeClass("j_slider-slide_active");
                $(".j_slider-controls_outer").find(".j_slider-controls_active").removeClass("j_slider-controls_active");

                // If we are at the end we want to show the last one else show the next one
                if (el.length > 0) {
                    el.addClass("j_slider-slide_active").show();
                } else {
                    $(".j_slider-slide_outer").last().addClass("j_slider-slide_active").show();
                }

                // Add active class to the control assigned with the index
                $(".j_slider-controls_outer").find("div#" + index).addClass("j_slider-controls_active");
            });

            if (options.cycle) {
                //continue cycling if user wishes to
                slider_timeout = setTimeout(next, options.slide_speed);
            }
        },
        next = function () {
            // Same as the previous function only next instead of previous and first instead of last
            clearTimeout(slider_timeout);

            var index = 0, el = $(".j-slider_row").find(".j_slider-slide_active").next();

            if (el.length > 0) {
                index = $(".j_slider-slide_outer").index(el);
                el.css("display", "block");
            } else {
                index = $(".j_slider-slide_outer").index($(".j_slider-slide_outer").first());
                $(".j_slider-slide_outer").first().css("display", "block");
            }

            $('.j_slider-slide_active').fadeOut(options.fade_speed, function () {
                $(".j-slider_row").find(".j_slider-slide_active").removeClass("j_slider-slide_active");
                $(".j_slider-controls_outer").find(".j_slider-controls_active").removeClass("j_slider-controls_active");

                if (el.length > 0) {
                    el.addClass("j_slider-slide_active").show();
                } else {
                    $(".j_slider-slide_outer").first().addClass("j_slider-slide_active").show();
                }

                $(".j_slider-controls_outer").find("div#" + index).addClass("j_slider-controls_active");
            });

            if (options.cycle) {
                slider_timeout = setTimeout(next, options.slide_speed);
            }
        },
        slider_timeout = null;

    $.fn.j_slider = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.j_slider');
        }

    };
})(jQuery);