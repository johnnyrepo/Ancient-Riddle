ButtonController = $.Class({
	extend: Controller,
	ctrName: 'button',
	ctrInit: function() {
		Event.backPressed(this.hardwareBackPressed);
		Event.menuPressed(this.hardwareMenuPressed);
		
		UI.quit.on('quit', this.quit.bind(this));
		UI.game.hud.on('paused', this.paused.bind(this));
		UI.menu.on('soundMuted', this.soundMuted.bind(this));
		UI.menu.on('musicMuted', this.musicMuted.bind(this));
		UI.menu.on('resumed', this.resumed.bind(this));
		UI.menu.on('restart', this.restart.bind(this));
		UI.menu.on('levelSelected', this.levelSelected.bind(this));
	},

	hardwareBackPressed: function() {
		if (UI.quit.isVisible()) {
			UI.quit.hide();
		} else {
			UI.quit.show();
		}

		return false;
	},
	
	hardwareMenuPressed: function() {
		if (UI.game.isListening()) {
			UI.game.hud.tapPause();
		} else {
			UI.menu.tapResume();
		}
	},
	
	quit: function() {
		Device.quitApp();
	},

	paused: function() {
		UI.inactiveDisp.fadeIn();
		UI.menu.showMenu();
		UI.bg.toGrayscale();
		UI.game.stopListening();
	},

	resumed: function() {
		UI.inactiveDisp.fadeOut();
		UI.menu.hideMenu(function() {
			UI.game.listen();
		});
		UI.bg.toColor();
	},

	soundMuted: function(cmd) {
		SoundManager.muteSound(cmd.muted);
		DAO.soundMuted(cmd.muted);
	},

	musicMuted: function(cmd) {
		SoundManager.muteMusic(cmd.muted);
		DAO.musicMuted(cmd.muted);
	},

	restart: function() {
		UI.inactiveDisp.fadeOut();
		UI.menu.hideMenu(function() {
			UI.game.fadeOut(function() {
				this.ctr('game').newGame(DAO.getDifficulty(), DAO.getLevel());
			}.bind(this));
		}.bind(this));
	},

	levelSelected: function(cmd) {
		UI.inactiveDisp.fadeOut();
		UI.menu.hideMenu(function() {
			UI.game.fadeOut(function() {
				this.ctr('game').newGame(cmd.difficulty, cmd.level);
			}.bind(this));
		}.bind(this));
	}
});