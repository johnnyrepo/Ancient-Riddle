Kinetic.Menu = (function() {
	var SIDE_ANIMATION_TIME = 0.6;
	var RIGHT_SIDE_EXTEND = 0.65;
	var LEFT_SIDE_EXTEND = 0.3;
	var LEFT_SIDE_FULL_EXTEND = 0.45;
	var LEFT_SIDE_TEXT_X_ORIGIN = 0.9;
	var SCORE_COUNTER_START_PCT = 0.5;
	
	var Class = $.Class({
		_init: function(config) {
			Kinetic.AbstractSlidingContainer.call(this, config);
		
			this._buildLeftSide();
			this._buildRightSide();
		},
		
		_difficultySelected: function(d, opt) {
			opt = opt || { replacementScore: [] };
			
			if (d !== undefined) {
				this._selectedDifficulty = d;
			}
	
			this._fullyExtendLeftSide(opt.callback);
			this.leftSide.level.buttons.each(function(c) {
				var l = c.getName();
				var s = this._score(this._selectedDifficulty, l);
				var rs = opt.replacementScore[l];
	
				if (s === undefined) {
					c.clear();
				} else {
					var s = rs !== undefined ? rs : s;
					
					c.nullify().setPercent(s * SCORE_COUNTER_START_PCT);
					c.transitionTo({
						percent: s,
						duration: Random(0.8, 1.2),
						easing: 'soft-back-ease-out'
					});
				}
			}.bind(this));
		},
		
		_levelSelected: function(l) {
			this.fire('levelSelected', { difficulty: this._selectedDifficulty, level: l });
		},
		
		_toggleRightSidePressed: function() {
			if (this.leftSide.isVisible()) {
				if (this.leftSide.difficulty.isVisible()) {
					if (this._selectedDifficulty === undefined) {
						this._hideLeftSide();
					} else {
						this._difficultySelected();
					}
				} else {
					this._showLeftSide();
				}
			} else {
				this._showLeftSide();
			}
		},
		
		_buildNormalLeftSide: function(w, h, unit, padding, buttonXOrigin, circleDiameter) {
			var that = this;
			
			this.leftSide.add(this.leftSide.difficulty = new Kinetic.Group());
			this.leftSide.difficulty.add(this.leftSide.difficulty.buttons = new Kinetic.Group());
			this.leftSide.difficulty.add(this.leftSide.difficulty.text = new Kinetic.ProportionalImage({
				x: w * LEFT_SIDE_TEXT_X_ORIGIN,
				y: padding * 2,
				height: h * 0.5,
				image: Image.text.difficulty
			}));
			
			Difficulty.each(function(d, name) {
				this.leftSide.difficulty.buttons.add(new Kinetic.SimpleButton({
					name: d,
					x: w * buttonXOrigin,
					y: padding * d + circleDiameter * (d - 1),
					width: circleDiameter,
					height: circleDiameter,
					image: Image.button.difficulty[name.toLowerCase()],
					onPress: function() { that._difficultySelected(this.getName()); }
				}));
			}.bind(this));
		},
		
		_buildExtendedLeftSide: function(w, h, unit, padding, buttonXOrigin, circleDiameter) {
			var that = this;
			var circleRadius = circleDiameter / 2;
			
			this.leftSide.add(this.leftSide.level = new Kinetic.Group());
			this.leftSide.level.add(this.leftSide.level.buttons = new Kinetic.Group());
			this.leftSide.level.add(this.leftSide.level.text = new Kinetic.ProportionalImage({
				x: w * LEFT_SIDE_TEXT_X_ORIGIN,
				y: padding * 2,
				height: h * 0.4,
				image: Image.text.level
			}));
			
			Level.each(function(l) {
				var xf = l%2;
				var yf = Math.ceil(l/2);
				
				this.leftSide.level.buttons.add(new Kinetic.ProgressCircle({
					name: l,
					x: w * buttonXOrigin - (circleDiameter + padding) * xf,
					y: padding * yf + circleDiameter * (yf - 1),
					radius: circleRadius,
					onPress: function() { that._levelSelected(this.getName()); }
				}));
			}.bind(this));
		},
			
		_buildLeftSide: function() {
			var unit = this.attrs.unit;
			var padding = this.attrs.padding;
			var w = this.getWidth();
			var h = this.getHeight();
			var buttonXOrigin = LEFT_SIDE_TEXT_X_ORIGIN - 0.17;
			var circleDiameter = unit * 9;
			
			this._buildNormalLeftSide(w, h, unit, padding, buttonXOrigin, circleDiameter);
			this._buildExtendedLeftSide(w, h, unit, padding, buttonXOrigin, circleDiameter);
		},
	
		_buildRightSide: function() {
			var unit = this.attrs.unit;
			var padding = this.attrs.padding;
			var w = this.getWidth();
			var h = this.getHeight();
			var rightEdge = (1 - RIGHT_SIDE_EXTEND);
	
			var smallButton = unit * 6;
			var bigButton = unit * 8;
			
			this.rightSide.add(this.rightSide.resume = new Kinetic.SimpleButton({
				x: w * rightEdge - smallButton - padding,
				y: padding,
				width: smallButton,
				height: smallButton,
				image: Image.button.resume,
				onPress: function() { this.fire('resumed'); }.bind(this)
			}));
			
			this.rightSide.add(this.rightSide.showRightSide = new Kinetic.SimpleButton({
				x: w * (rightEdge - 0.15),
				y: h * 0.5 - bigButton,
				width: bigButton,
				height: bigButton,
				image: Image.button.difficulty.choose,
				onPress: this._toggleRightSidePressed.bind(this)
			}));
			
			this.rightSide.add(this.rightSide.restart = new Kinetic.SimpleButton({
				x: w * (rightEdge - 0.185),
				y: h * 0.5 + unit * 2,
				width: bigButton,
				height: bigButton,
				image: Image.button.restart,
				onPress: function() { this.fire('restart'); }.bind(this)
			}));
			
			this.rightSide.add(this.rightSide.music = new Kinetic.ToggleButton({
				x: w * rightEdge - smallButton - padding,
				y: h - smallButton - padding,
				width: smallButton,
				height: smallButton,
				images: {
					enabled: Image.button.music.on,
					disabled: Image.button.music.off
				},
				onEnable: function() { this.fire('musicMuted', { muted: false }); }.bind(this),
				onDisable: function() { this.fire('musicMuted', { muted: true }); }.bind(this)
			}));
			
			this.rightSide.add(this.rightSide.sound = new Kinetic.ToggleButton({
				x: w * rightEdge - smallButton * 2 - padding * 3,
				y: h - smallButton - padding,
				width: smallButton,
				height: smallButton,
				images: {
					enabled: Image.button.sound.on,
					disabled: Image.button.sound.off
				},
				onEnable: function() { this.fire('soundMuted', { muted: false }); }.bind(this),
				onDisable: function() { this.fire('soundMuted', { muted: true }); }.bind(this)
			}));
		},
		
		_showLeftSide: function(callback) {
			this._showSide({
				side: this.leftSide,
				extend: LEFT_SIDE_EXTEND - 1,
				duration: SIDE_ANIMATION_TIME,
				callback: callback
			});
	
			this.leftSide.level.hide();
			this.leftSide.difficulty.show();
		},
		
		_fullyExtendLeftSide: function(callback) {
			this._showSide({
				side: this.leftSide,
				extend: LEFT_SIDE_FULL_EXTEND - 1,
				duration: SIDE_ANIMATION_TIME,
				callback: callback
			});
	
			this.leftSide.level.show();
			this.leftSide.difficulty.hide();
		},
		
		_hideLeftSide: function() {
			Kinetic.AbstractSlidingContainer.prototype._hideLeftSide.call(this, SIDE_ANIMATION_TIME);
		},
		
		_hideRightSide: function() {
			Kinetic.AbstractSlidingContainer.prototype._hideRightSide.call(this, SIDE_ANIMATION_TIME);
		},
		
		afterSideAnimated: function(callback) {
			$.delay(SIDE_ANIMATION_TIME, callback.bind(this));
		},
		
		getLevelCircle: function(l) {
			return this.leftSide.level.buttons.get('.' + l).first();
		},
		
		showLevelSelector: function(args) {
			this._difficultySelected(args.difficulty, args);
		},
		
		tapResume: function() {
			var r = this.rightSide.resume;
			
			if (r.isVisible() && r.isListening()) {
				r.fire('tap');
			}
		},
	
		hideMenu: function(callback) {
			this._hideLeftSide();
			this._hideRightSide();
			
			var wasListening = this.isListening();
			
			this.stopListening();
			this.afterSideAnimated(function() {
				if (wasListening) this.listen();
				if (callback) callback();
			});
		},
		
		showMenu: function(args) {
			if (args) {
				if (args.hideResume) {
					this.rightSide.resume.hide();
				}
				
				if (args.rightSide) {
					this._toggleRightSidePressed();
				}
			} else {
				this.rightSide.resume.show();
			}
			
			this._showSide({
				side: this.rightSide,
				extend: RIGHT_SIDE_EXTEND,
				duration: SIDE_ANIMATION_TIME
			});
		},
		
		soundMuted: function(muted) {
			this.rightSide.sound.setEnabled(!muted);
		},
		
		musicMuted: function(muted) {
			this.rightSide.music.setEnabled(!muted);
		},
		
		scoreCallback: function(fn) {
			this._score = fn;
		}
	});
	
	Kinetic.Global.extend(Class, Kinetic.AbstractSlidingContainer);
	
	return Class;
})();