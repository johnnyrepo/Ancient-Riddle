Kinetic.CircledCounter = (function() {
	var COUNTER_HEIGHT = 0.35;
	var COUNTER_Y = 0.325;
	
	var Class = $.Class({
		_init: function(config) {
			Kinetic.Group.call(this, config);
			
			this._build();
			
			this.on('valueChange', this._valueChanged);
		},
		
		_build: function() {
			var circleDiameter = this.getRadius() * 2;
			
			this.add(this.circle = new Kinetic.Image({
				width: circleDiameter,
				height: circleDiameter,
				image: Image.icon.empty
			}));
			
			this.add(this.counter = new Kinetic.Counter({
				y: circleDiameter * COUNTER_Y,
				height: circleDiameter * COUNTER_HEIGHT,
				animate: false
			}));
		},
		
		_valueChanged: function(evt) {
			this.counter.setValue(evt.newVal);
			this.counter.setX(this.getRadius() - this.counter.getWidth()/2);
		},
		
		tickingOn: function() {
			this.counter.setTicking(true);
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.Group);
	Kinetic.Node.addGettersSetters(Class, [ 'value', 'radius' ]);
	
	return Class;
})();