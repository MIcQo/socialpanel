import SocialBar from './modules/SocialBar';

$(function () {
    let bar = new SocialBar();

    // run after document ready   
    $(".panel-content-placeholder").on("click", (e) => e.stopPropagation());
    $(".social-panel .social-icon").on("click", bar.openBar);
    $("body").on("click", bar.closeBar);
});
