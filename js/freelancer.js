/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
(function () {
    var filenames =[];
    var imageMin = '';
    var index=0;
    $(function () {
        $('body').on('click', '.page-scroll a', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });

//for galary
        var fileExt = {};
        $.ajax({
            url: '../img/portfolio/',
            success: function (data) {
                //List all png or jpg or gif file names in the page
                $(data).find('a:contains(".png"),a:contains(".jpg"),a:contains(".gif")').each(function () {
                    filenames.push(this.href.replace(window.location.host, "").replace("http:///", ""));
                });
                showFourImages();
            }
        });
    });

    $('#portfolio-more').click(function () {
        showFourImages();
    });

    function showFourImages() {
        var currentIndex = index;
        for (var i = currentIndex; i < currentIndex + 4; i++) {
            index += 1;
            imageMin += '<div class="col-sm-3 col-xs-12">' +
                '<a href="img/portfolio/' + filenames[i] + '" data-title="Installations" data-lightbox="installations">' +
                '<img src="img/portfolio/' + filenames[i] + '" class="img-thumbnail lazyload" alt=""/>' +
                '</a>' +
                '<div class="caption"> </div>' +
                '</div>';
        }
        $("#portfolio-container").html(imageMin);
        if (index >= filenames.length) {
            $('#portfolio-more').hide();
        }
    }

// Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top'
    });

// Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

}());
