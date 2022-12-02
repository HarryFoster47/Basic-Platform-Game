import Phaser from "phaser";
let cursors;
let player;
let stars;
var score = 0;
var scoreText;
var fires;
var gameOver = false;

function collectStar(player, star) {
	star.disableBody(true, true);
	score += 1;
	scoreText.setText('SCORE ' + score);
	if (stars.countActive(true) === 0) {
		stars.children.iterate(function(child) {
			child.enableBody(true, child.x, 0, true, true);
		});
		var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
		var fire = fires.create(x, 16, 'fire');
		fire.setBounce(1);
		fire.setCollideWorldBounds(true);
		fire.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}

function hitfire(player, fire) {
	this.physics.pause();
	player.setTint(0xff0000);
	gameOver = true;
}
// SCENE A-------------------------------------------------------------------------------------
class SceneA extends Phaser.Scene {
	constructor() {
		super('SceneA');
	}
	preload() {
		this.load.spritesheet('idle', 'assets/idle_sheet.png', {
			frameWidth: 21,
			frameHeight: 38
		})
		this.load.spritesheet('run', 'assets/run_sheet.png', {
			frameWidth: 30,
			frameHeight: 39
		})
		this.load.spritesheet('jump', 'assets/jump_sheet.png', {
			frameWidth: 25,
			frameHeight: 38
		})
		this.load.spritesheet('fall', 'assets/fall_sheet.png', {
			frameWidth: 29,
			frameHeight: 38
		})
		this.load.image('fire', 'assets/fire.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('background', 'assets/sky.png');
		this.load.image('ground', 'assets/platform.png');
	}
	create() {
		this.add.image(400, 300, 'background');
		this.add.text(225, 200, 'PRESS Q TO START', {
			fontSize: '32px',
			fill: '#FFD700'
		});
		cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
			q: Phaser.Input.Keyboard.KeyCodes.Q,
			r: Phaser.Input.Keyboard.KeyCodes.R
		});
	}
	update() {
		if (cursors.q.isDown) {
			this.scene.start('SceneB');
		}
	}
}
// SCENE B-------------------------------------------------------------------------------------
class SceneB extends Phaser.Scene {
	constructor() {
		super('SceneB');
	}
	preload() {
		this.load.spritesheet('idle', 'assets/idle_sheet.png', {
			frameWidth: 21,
			frameHeight: 38
		})
		this.load.spritesheet('run', 'assets/run_sheet.png', {
			frameWidth: 30,
			frameHeight: 39
		})
		this.load.spritesheet('jump', 'assets/jump_sheet.png', {
			frameWidth: 25,
			frameHeight: 38
		})
		this.load.spritesheet('fall', 'assets/fall_sheet.png', {
			frameWidth: 29,
			frameHeight: 38
		})
		this.load.image('fire', 'assets/fire.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('background', 'assets/sky.png');
		this.load.image('ground', 'assets/platform.png');
	}
	create() {
		this.add.image(400, 300, 'background');
		scoreText = this.add.text(16, 16, 'SCORE 0', {
			fontSize: '32px',
			fill: '#FFD700'
		});
		this.add.text(575, 20, 'PRESS R TO SWITCH MODES', {
			fontSize: '15px',
			fill: '#FFD700'
		});
		var platforms = this.physics.add.staticGroup();
		platforms.create(400, 600, 'ground').setScale(2).refreshBody();
		platforms.create(650, 450, 'ground')
		platforms.create(755, 300, 'ground')
		platforms.create(860, 150, 'ground')
		platforms.create(150, 450, 'ground')
		platforms.create(40, 300, 'ground')
		platforms.create(-60, 150, 'ground')
		player = this.physics.add.sprite(397, 450, 'idle')
		player.setScale(1.8)
		player.setCollideWorldBounds(true)
		player.setSize(20)
		cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
			q: Phaser.Input.Keyboard.KeyCodes.Q,
			r: Phaser.Input.Keyboard.KeyCodes.R
		});
		this.anims.create({
			key: 'left',
			frameRate: 15,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('run', {
				start: 1,
				end: 10
			})
		})
		this.anims.create({
			key: 'right',
			frameRate: 15,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('run', {
				start: 1,
				end: 10
			})
		})
		this.anims.create({
			key: 'idle',
			frameRate: 10,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('idle', {
				start: 1,
				end: 10
			})
		})
		this.anims.create({
			key: 'jump',
			frameRate: 5,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('jump', {
				start: 1,
				end: 5
			})
		})
		this.anims.create({
			key: 'fall',
			frameRate: 5,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('fall', {
				start: 1,
				end: 5
			})
		})
		stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: {
				x: 12,
				y: 0,
				stepX: 70
			}
		});
		stars.children.iterate(function(child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
			child.setCollideWorldBounds(true);
			child.setBounce(0.2);
		});
		fires = this.physics.add.group();
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(stars, platforms);
		this.physics.add.collider(fires, platforms);
		this.physics.add.overlap(player, stars, collectStar, null, this);
		this.physics.add.collider(player, fires, hitfire, null, this);
	}
	update() {
		if (cursors.left.isDown) {
			player.setVelocityX(-290)
			player.flipX = true
			player.anims.play('left', true)
		} else if (cursors.right.isDown) {
			player.flipX = false
			player.setVelocityX(290)
			player.anims.play('right', true)
		} else if (cursors.space.isDown && player.body.touching.down) {
			player.setVelocityY(-450)
		} else {
			player.setVelocityX(0)
			player.anims.play('idle', true)
		}
		if (cursors.left.isDown && cursors.space.isDown && player.body.touching.down) {
			player.setVelocityX(-290)
			player.setVelocityY(-450)
		}
		if (cursors.right.isDown && cursors.space.isDown && player.body.touching.down) {
			player.setVelocityX(290)
			player.setVelocityY(-450)
		}
		// 
		if (cursors.down.isDown) {
			player.setVelocityY(450)
		}
		if (player.body.velocity.y < 0) {
			player.anims.play('jump', true)
		}
		if (player.body.velocity.y > 20) {
			player.anims.play('fall', true)
		}
		if (cursors.r.isDown) {
			this.scene.start('SceneC');
		}
	}
}
// SCENE C-------------------------------------------------------------------------------------
class SceneC extends Phaser.Scene {
	constructor() {
		super('SceneC');
	}
	preload() {
		this.load.spritesheet('idle', 'assets/idle_sheet.png', {
			frameWidth: 21,
			frameHeight: 38
		})
		this.load.spritesheet('run', 'assets/run_sheet.png', {
			frameWidth: 30,
			frameHeight: 39
		})
		this.load.spritesheet('jump', 'assets/jump_sheet.png', {
			frameWidth: 25,
			frameHeight: 38
		})
		this.load.spritesheet('fall', 'assets/fall_sheet.png', {
			frameWidth: 29,
			frameHeight: 38
		})
		this.load.image('fire', 'assets/fire.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('background', 'assets/sky.png');
		this.load.image('ground', 'assets/platform.png');
	}
	create() {
		this.add.image(400, 300, 'background');
		scoreText = this.add.text(16, 16, 'SCORE 0', {
			fontSize: '32px',
			fill: '#FFD700'
		});
		var platforms = this.physics.add.staticGroup();
		platforms.create(400, 600, 'ground').setScale(2).refreshBody();
		player = this.physics.add.sprite(397, 450, 'idle')
		player.setScale(1.8)
		player.setCollideWorldBounds(true)
		player.setSize(20)
		cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE,
			q: Phaser.Input.Keyboard.KeyCodes.Q
		});
		this.anims.create({
			key: 'left',
			frameRate: 15,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('run', {
				start: 1,
				end: 10
			})
		})
		this.anims.create({
			key: 'right',
			frameRate: 15,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('run', {
				start: 1,
				end: 10
			})
		})
		this.anims.create({
			key: 'idle',
			frameRate: 10,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('idle', {
				start: 1,
				end: 10
			})
		})
		this.anims.create({
			key: 'jump',
			frameRate: 5,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('jump', {
				start: 1,
				end: 5
			})
		})
		this.anims.create({
			key: 'fall',
			frameRate: 5,
			repeat: -1,
			frames: this.anims.generateFrameNumbers('fall', {
				start: 1,
				end: 5
			})
		})
		stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: {
				x: 12,
				y: 0,
				stepX: 70
			}
		});
		stars.children.iterate(function(child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
			child.setCollideWorldBounds(true);
			child.setBounce(0.2);
		});
		fires = this.physics.add.group();
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(stars, platforms);
		this.physics.add.collider(fires, platforms);
		this.physics.add.overlap(player, stars, collectStar, null, this);
		this.physics.add.collider(player, fires, hitfire, null, this);
	}
	update() {
		if (cursors.left.isDown) {
			player.setVelocityX(-290)
			player.flipX = true
			player.anims.play('left', true)
		} else if (cursors.right.isDown) {
			player.flipX = false
			player.setVelocityX(290)
			player.anims.play('right', true)
		} else if (cursors.space.isDown && player.body.touching.down) {
			player.setVelocityY(-450)
		} else {
			player.setVelocityX(0)
			player.anims.play('idle', true)
		}
		if (cursors.left.isDown && cursors.space.isDown && player.body.touching.down) {
			player.setVelocityX(-290)
			player.setVelocityY(-450)
		}
		if (cursors.right.isDown && cursors.space.isDown && player.body.touching.down) {
			player.setVelocityX(290)
			player.setVelocityY(-450)
		}
		// 
		if (cursors.down.isDown) {
			player.setVelocityY(450)
		}
		if (player.body.velocity.y < 0) {
			player.anims.play('jump', true)
		}
		if (player.body.velocity.y > 20) {
			player.anims.play('fall', true)
		}
	}
}
// ------------------------------------------------------------
const game = new Phaser.Game({
	type: Phaser.AUTO,
	render: {
		pixelArt: true
	},
	width: 800,
	height: 600,
	scene: [SceneA, SceneB, SceneC],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 600
			},
			debug: false
		}
	}
});