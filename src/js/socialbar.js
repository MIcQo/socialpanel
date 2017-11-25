import SocialBar from './modules/SocialBar';

$(function () {
    
    let bar = new SocialBar({
        toggle: true,
        halfPosition: true
    });

    // run after document ready   
    $(".panel-content-placeholder").on("click", (e) => e.stopPropagation());
    $(".social-panel .social-icon").on("click", bar.openBar);
    $("body").on("click", bar.closeBar);
    $(window).resize(bar.setPositionBreakpoints);
});
