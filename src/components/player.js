import { Howl }  from "howler"

class Player {
    constructor() {
        this.players = {}
        this.fadeDuration = 3000
    }

    _play(sound) {
        sound.fade(0, 1, this.fadeDuration)
    }

    fadeIn({slug, url}) {
        const sound = this.players[slug]
        if (!url) {
            return
        }
        if (sound) {
            if (!sound.playing()) {
                this._play(sound)
            }
        } else {
            this.players[slug] = new Howl({
                src: [url],
                volume: 0,
                autoplay: true,
                onplayerror: function() {
                    this.players[slug]('unlock', function() {
                        this.players[slug].play();
                    });
                }
            });
            this._play(this.players[slug])
        }
    }

    fadeOut({slug, url}) {
        const sound = this.players[slug]
        if (sound && sound.playing() && sound.volume() > 0) {
            sound.fade(1, 0, this.fadeDuration)
        } else {
        }
    }
}

const player = new Player();
export default player;
