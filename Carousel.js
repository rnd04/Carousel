/**
 * Carousel
 * @charset UTF-8
 *
 * properties : <Object>
 *   slide : <string> slide DOM id (required)
 *   interval : <int> item activating interval in second
 *   autorun : <bool> whether run on init.
 *
 * members
 *   jSlide : <JQuery Object>
 *   jListBox : <JQuery Object>
 *   jItems : <JQuery Object>
 *   jIndicators : <JQuery Object>
 *   active : <int> active item index. initially 0.
 *   length : <int> number of items.
 *   interval : <setTimeout>
 */
function Carousel(properties) {
	// for inheritance with parameter
	if (arguments.length == 0) {
		return;
	}
	
	var slide = document.getElementById(properties.slide);
	if (typeof slide == 'undefined') {
		return;
	}
	
	this.properties = properties;
	if (properties.hasOwnProperty('autorun') == false) {
		this.properties.autorun = true;
	}
	if (properties.hasOwnProperty('interval') == false) {
		this.properties.interval = 3;
	}
	
	var self = this;
	
	this.jSlide = jQuery(slide);
	this.jSlide.hover(function(){
		self.stop();
	}, function(){
		self.run();
	});
	this.jSlide.css({overflow: 'hidden', clear: 'both'});
	this.jSlide.find('a').css({textDecoration:'none'});
	
	this.jListBox = this.jSlide.find('.carousel_listbox');
	
	this.jItems = this.jListBox.find('.carousel_item');
	
	this.jIndicators = this.jSlide.find('.carousel_indicator');
	this.jIndicators.each(function(i, v){
		jQuery(v).hover(function(){
			if (self.active != i) {
				self.to(i);
			}
		}, function(){
		});
	});
	
	this.active = 0;
	
	this.length = this.jItems.length;
	
	this.interval = null;
	
	this.initItems();
	this.initIndicators();
	
	// start
	this.activate(this.active);
	this.run();
	
	slide = null;
}

/**
 * slide item들 초기화
 * carousel 유형별 item 초기화가 필요하면 이 method를 override하십시오.
 */
Carousel.prototype.initItems = function() {
	this.jItems.hide();
};

Carousel.prototype.initIndicators = function() {
	if (this.jIndicators.length > 0) {
		this.jIndicators.find('.carousel_indicator_deactivated').show();
		this.jIndicators.find('.carousel_indicator_activated').hide();
	}
};

/**
 * item 활성화
 */
Carousel.prototype.activate = function(index) {
	this.show(index);
	if (this.jIndicators.length > 0) {
		var jPrevIndicator = jQuery(this.jIndicators[this.active]);
		var jNextIndicator = jQuery(this.jIndicators[index]);
		jPrevIndicator.find('.carousel_indicator_activated').hide();
		jPrevIndicator.find('.carousel_indicator_deactivated').show();
		jNextIndicator.find('.carousel_indicator_activated').show();
		jNextIndicator.find('.carousel_indicator_deactivated').hide();
		jPrevIndicator = jNextIndicator = null;
	}
	
};

/**
 * img 보이기
 * carousel HTML의 item 내용에 따라 override하여 사용하십시오.
 */
Carousel.prototype.show = function(index) {
	jQuery(this.jItems[this.active]).hide();
	jQuery(this.jItems[index]).show();
};

/**
 * item 활성화
 */
Carousel.prototype.to = function(index) {
	this.activate(index);
	this.active = index;
};

/**
 * 다음 item index
 */
Carousel.prototype.getNext = function() {
	if (this.active == this.length - 1) {
		return 0;
	} else {
		return this.active + 1;
	}
};

/**
 * carousel 구동 시작
 */
Carousel.prototype.run = function(){
	if (this.properties.autorun) {
		if (this.interval == null) {
			this.interval = setInterval((function(self){
				return function(){
					self.next();
				}
			})(this), this.properties.interval * 1000);
		}
	}
};

/**
 * 다음 item으로 이동
 */
Carousel.prototype.next = function() {
	this.to(this.getNext());
};

/**
 * carousel 구동 정지
 */
Carousel.prototype.stop = function(){
	clearInterval(this.interval);
	this.interval = null;
};
