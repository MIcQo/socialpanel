const config = {
    openedClass: "opened",
    panelClass: ".social-panel",
    panelBodyClass: ".panel-content-placeholder",
    iconClass: ".social-icon",
    iconActiveClass: "active",
    boxClass: ".box"
};

class SocialBar {

    openBar(e) {
        let $this = $(e.currentTarget);
        let type = $this.data("box");

        e.stopPropagation();

        // Change color acorrding by given class
        $(config.panelClass + " " + config.iconClass).removeClass(config.iconActiveClass);
        $this.addClass(config.iconActiveClass);

        // Change content
        $(config.panelClass + " " + config.panelBodyClass + " " + config.boxClass).hide();
        $(config.panelClass + " " + config.panelBodyClass + " ." + type).show();

        // slide content
        $(config.panelClass)
            .addClass(config.openedClass)
            .removeClass(function (index, className) {
                return (className.match(/(^|\s)network-\S+/g) || []).join(' ');
            })
            .addClass("network-" + type);
    }

    closeBar(e) {
        if(!$(config.panelClass).hasClass(config.openedClass))
            return;

        $(config.panelClass).removeClass(config.openedClass);
    }
}

export default SocialBar;