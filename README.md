# Social Bar
Easy plugin for simple social bar with support videos, facebook pages, like and other widgets

### Installation:
```
npm install -S social_bar
```

### Javascript import:
```
require("~node_modules/social_bar/build/js/socialbar");
```

### HTML:
```
<div class="social-panel">
    <div class="icons">
        <div class="social-icon facebook" data-box="facebook">
            <i class="fa fa-facebook"></i>
        </div>
        <div class="social-icon gplus" data-box="gplus">
            <i class="fa fa-google-plus"></i>
        </div>
        <div class="social-icon github" data-box="github">
            <i class="fa fa-github"></i>
        </div>
        <div class="social-icon pinterest" data-box="pinterest">
            <i class="fa fa-pinterest"></i>
        </div>
        <div class="social-icon soundcloud" data-box="soundcloud">
            <i class="fa fa-soundcloud"></i>
        </div>
    </div>

    <div class="panel-content-placeholder">
        <div class="boxes">
            <div class="box facebook">
                <iframe src="FACEBOOK_SHAREURL" width="355" height="556" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
            </div>
            <div class="box gplus">gplus</div>
            <div class="box github">github</div>
            <div class="box pinterest">pinterest</div>
            <div class="box soundcloud">soundcloud</div>
        </div>
    </div>
</div>
```

### Supported networks
Networks list is only for colors, content is **not important** you can create any tab with any content yourself.
- BandCamp
- Delicious
- Facebook
- Ficly
- Flickr
- GitHub
- Google+
- Instagram
- Kickstarter
- Lanyrd
- LastFM
- LinkedIn
- Photodrop
- Pinterest
- Rdio
- SoundCloud
- Twitter
- Vimeo
- YouTube
- **other sites & own blocks**