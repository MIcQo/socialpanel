import SocialBar from './modules/SocialBar';

$(function () {
    let bar = new SocialBar();

    // run after document ready   
    $(".social-panel .social-icon").on("click", bar.openBar);
    $("body").on("click", bar.closeBar);
});
