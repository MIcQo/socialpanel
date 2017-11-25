/**!
   SocialBar Plug-in v1.0
   Easy plugin for simple social bar with support videos, facebook pages, like and other widgets
   @license: none
   @author: Michal Koval (MIcQo)
   @preserve
**/

import _ from 'lodash';

let config = {
    openedClass: "opened",
    
    panelMaxHeight: 556,
    panelClass: ".social-panel",
    panelFixedClass: "top-fixed",
    panelPercent: {
        halfPosition: 30,
        fixed: 2
    },

    panelBodyClass: ".panel-content-placeholder",
    boxClass: ".box",
    
    iconClass: ".social-icon",
    iconActiveClass: "active",
    
    halfPosition: false,
    halfPositionClass: "half-position",

    toggle: false

};

class SocialBar {

    constructor(userConf) {
        _.forEach(userConf, (value, key) => config[key] = value);

        this.openBar = this.openBar.bind(this);
        this.closeBar = this.closeBar.bind(this);
        this.setPositionBreakpoints = this.setPositionBreakpoints.bind(this);
        this.calcPercent = this.calcPercent.bind(this);

        this.setPositionBreakpoints();
    }

    openBar(e) {
        let $this = $(e.currentTarget);
        let type = $this.data("box");

        e.stopPropagation();

        if(config.toggle) {
            if($(config.panelClass).hasClass(config.openedClass) && $this.hasClass(config.iconActiveClass)) {
                return this.closeBar(e);
            }
        }

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

    setPositionBreakpoints() {
        let panel = $(config.panelClass);
        let panelBody = $(config.panelBodyClass);
        let windowHeight = $(window).height();
        let halfPosition = Math.floor((panelBody.height() + this.calcPercent(windowHeight, config.panelPercent.halfPosition)));

        if (windowHeight <= halfPosition) {
            panel.removeClass(config.halfPositionClass)
                .addClass(config.panelFixedClass);

            panelBody.height(windowHeight);
        } else if (config.halfPosition && windowHeight >= halfPosition) {
            panel.addClass(config.halfPositionClass)
                .removeClass(config.panelFixedClass);
        }

        if (panelBody.height() >= config.panelMaxHeight) {
            panelBody.height(config.panelMaxHeight);
        }
    }

    calcPercent(total, percent) {
        return (percent / 100) * total; 
    }
}

export default SocialBar;