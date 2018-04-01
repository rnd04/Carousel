/**
 * Carousel (Horizontal Accordion type)
 * @charset UTF-8
 */
function HorizontalAccordionCarousel(properties) {
	if (properties.hasOwnProperty('duration') == false) {
		this.properties.duration = 400;
	}
	this.anim = {p:0};
	Carousel.call(this, properties);
	this.jSlide.css({height:this.jSlide.height()});
}
HorizontalAccordionCarousel.prototype = new Carousel();
HorizontalAccordionCarousel.prototype.constructor = HorizontalAccordionCarousel;

HorizontalAccordionCarousel.prototype.initItems = function() {
	var self = this;
	this.jItems.each(function(i, v){
		var jItem = jQuery(v);
		jItem.css({
			whiteSpace: 'nowrap',
			wordSpacing: '0px',
			overflow: 'hidden',
			float: 'left'
		});
		var jImg = jItem.find('img');
		jImg.css({
			border: 0
		});
		var jMainImg = jItem.find('.horizontal_accordion_carousel_main_image');
		jMainImg.css({
			marginLeft: '-'+jMainImg.width()+'px',
			opacity: 0
		});
		jItem.hover(function(){
			if (self.active != i) {
				var tduration = self.properties.duration;
				self.properties.duration /=2 ;
				self.to(i);
				self.properties.duration = tduration;
				tduration = null;
			}
		}, function(){
		});
		jItem = jImg = jMainImg = null;
	});
};
HorizontalAccordionCarousel.prototype.show = function(index) {
	var self = this;
	var active = self.active;
	var jPrevItem = jQuery(self.jItems[self.active]);
	var jPrevThumbnail = jPrevItem.find('.horizontal_accordion_carousel_thumbnail');
	var jPrevMainImage = jPrevItem.find('.horizontal_accordion_carousel_main_image');
	var jNextItem = jQuery(self.jItems[index]);
	var jNextThumbnail = jNextItem.find('.horizontal_accordion_carousel_thumbnail');
	var jNextMainImage = jNextItem.find('.horizontal_accordion_carousel_main_image');

	jPrevMainImage.stop();
	jPrevMainImage.animate({
		opacity: 0
	}, {
		duration:this.properties.duration / 2,
		queue:true
	});
	jPrevThumbnail.stop();
	jPrevThumbnail.animate({
		opacity: 1
	}, {
		duration:this.properties.duration,
		queue:true
	});
	jNextThumbnail.stop();
	jNextThumbnail.animate({
		opacity: 0
	}, {
		duration:this.properties.duration / 2,
		queue:true
	});
	jNextMainImage.stop();
	jNextMainImage.animate({
		opacity: 1
	}, {
		duration:this.properties.duration * 2,
		queue:true
	});
	jQuery(this.anim).animate({p:1},{
		duration: this.properties.duration,
		queue: true,//false,
		step: function(now, tween){
			var jPrevItem = jQuery(self.jItems[active]);
			var jPrevThumbnail = jPrevItem.find('.horizontal_accordion_carousel_thumbnail');
			var jPrevMainImage = jPrevItem.find('.horizontal_accordion_carousel_main_image');
			var jNextItem = jQuery(self.jItems[index]);
			var jNextThumbnail = jNextItem.find('.horizontal_accordion_carousel_thumbnail');
			var jNextMainImage = jNextItem.find('.horizontal_accordion_carousel_main_image');
			
			var prevThumbnailMarginLeft;
			var prevMainImageMarginLeft;
			if (active <= index) {
				// ascending
				prevThumbnailMarginLeft = jPrevThumbnail.width() * -1 * (1-tween.state);	// from -width to 0
				prevMainImageMarginLeft = jPrevMainImage.width() * -1 * (tween.state);	// from 0 to -width
			} else {
				// descending
				prevThumbnailMarginLeft = jPrevThumbnail.width() * (1-tween.state);	// from width to 0
				prevMainImageMarginLeft = jPrevMainImage.width() * (tween.state);	// from 0 to width
			}

			var roundedPrevThumbnailMarginLeft = Math.round(prevThumbnailMarginLeft);
			if (roundedPrevThumbnailMarginLeft > prevThumbnailMarginLeft) {
				// prev thumbnail margin-left ceiled
				prevMainImageMarginLeft = Math.floor(prevMainImageMarginLeft);
			} else {
				// prev thumbnail margin-left floored
				prevMainImageMarginLeft = Math.ceil(prevMainImageMarginLeft);
			}
			prevThumbnailMarginLeft = roundedPrevThumbnailMarginLeft;

			var nextThumbnailMarginLeft;
			var nextMainImageMarginLeft;
			if (active <= index) {
				// ascending
				nextThumbnailMarginLeft = jNextThumbnail.width() * -1 - prevThumbnailMarginLeft;	// from 0 to -width
				nextMainImageMarginLeft = jNextMainImage.width() * -1 - prevMainImageMarginLeft;	// from -width to 0
			} else {
				// descending
				nextThumbnailMarginLeft = prevThumbnailMarginLeft - jNextThumbnail.width();	// from 0 to -width
				nextMainImageMarginLeft = prevMainImageMarginLeft - jNextMainImage.width();	// from -width to 0
			}

			var prevItemWidth = jPrevMainImage.width() - (jPrevMainImage.width() - jPrevThumbnail.width()) * tween.state;	// from mainimage to thumbnail
			var nextItemWidth = jNextMainImage.width() + jNextThumbnail.width() - prevItemWidth;	// from thumbnail to mainimage
			var roundedPrevItemWidth = Math.round(prevItemWidth);
			if (roundedPrevItemWidth > prevItemWidth) {
				// prev item width ceiled
				nextItemWidth = Math.floor(nextItemWidth);
			} else {
				// prev item width floored
				nextItemWidth = Math.ceil(nextItemWidth);
			}
			prevItemWidth = roundedPrevItemWidth;

			jPrevThumbnail.css({marginLeft : prevThumbnailMarginLeft+'px'});
			jPrevMainImage.css({marginLeft : prevMainImageMarginLeft+'px'});
			jNextThumbnail.css({marginLeft : nextThumbnailMarginLeft+'px'});
			jNextMainImage.css({marginLeft : nextMainImageMarginLeft+'px'});

			jPrevItem.width(prevItemWidth);
			jNextItem.width(nextItemWidth);

			jPrevItem = jNextItem = jPrevThumbnail = jPrevMainImage = jNextThumbnail = jNextMainImage = null;
			prevThumbnailMarginLeft = prevMainImageMarginLeft = nextThumbnailMarginLeft = nextMainImageMarginLeft = null;
			roundedPrevThumbnailMarginLeft = null;
			nextThumbnailMarginLeft = nextMainImageMarginLeft = null;
			prevItemWidth = nextItemWidth = roundedPrevItemWidth = null;
		}
	});
	jPrevItem = jPrevThumbnail = jPrevMainImage = jNextItem = jNextThumbnail = jNextMainImage = null;
};
