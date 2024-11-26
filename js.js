document.addEventListener("DOMContentLoaded", function() {
    const audio = {
        guitar: [
            new Audio("guitar/guitar_Maranello.mp3"),
            new Audio("guitar/guitar_MysteryChorus.mp3"),
            new Audio("guitar/guitar_NewWaveChorus.mp3"),
            new Audio("guitar/guitar_USMetal.mp3"),
        ],
        drums: [
            new Audio("drums/drums_EastBay.mp3"),
            new Audio("drums/drums_AfterParty.mp3"),
            new Audio("drums/drums_ElectronicPop.mp3"),
            new Audio("drums/drums_Liverpool.mp3"),
        ],
        midi: [
            new Audio("midi/midi_bbb.mp3"),
            new Audio("midi/midi_chemtrails.mp3"),
            new Audio("midi/midi_metallic.mp3"),
            new Audio("midi/midi_murky.mp3"),
        ],
        bass: [
            new Audio("bass/bass_60sCombo.mp3"),
            new Audio("bass/bass_FlangeStereo.mp3"),
            new Audio("bass/bass_Maranello.mp3"),
            new Audio("bass/bass_PrettyGood.mp3"),
        ]
    }
    Object.keys(audio).forEach(instrument => {
        audio[instrument].forEach(voice => {
            voice.preload = 'auto';  // Ensure each audio file is preloaded
        });
    });
    const items = {
        guitar: document.getElementById("opt-guitar"),
        drums: document.getElementById("opt-drums"),
        midi: document.getElementById("opt-midi"),
        bass: document.getElementById("opt-bass"),
        video: document.getElementById("video-mp4"),
        vol_guitar: document.getElementById("vol-guitar"),
        vol_drums: document.getElementById("vol-drums"),
        vol_midi: document.getElementById("vol-midi"),
        vol_bass: document.getElementById("vol-bass"),
        ctrl_play_pause: document.getElementById("ctrl-play-pause"),
        ctrl_video_reset: document.getElementById("ctrl-video-reset"),
        ctrl_instr_reset: document.getElementById("ctrl-instr-reset"),
        instr_code: document.getElementById("instr-code")
    }
    let playing = false, pause_timestamp;

    // first run
    items.video.muted = true;
    playDefault();

    function updateAudio(timestamp) {
        items.video.pause();
        items.video.currentTime = timestamp;

        Object.keys(audio).forEach(instrument=> {
            audio[instrument].forEach(voice => {
                voice.pause();
                voice.currentTime = timestamp;
            });
        });

        items.video.play().then(() => {
            audio.guitar[items.guitar.value].play();
            audio.drums[items.drums.value].play();
            audio.midi[items.midi.value].play();
            audio.bass[items.bass.value].play();
        }).catch(error => {
            console.error("::", error);
        });

        // audio.guitar[items.guitar.value].play().catch(error => {
        //     if (error.name !== 'AbortError') {
        //         console.error("Guitar audio play error:", error);
        //     }
        // });
        // audio.drums[items.drums.value].play().catch(error => {
        //     if (error.name !== 'AbortError') {
        //         console.error("Drums audio play error:", error);
        //     }
        // });
        // audio.midi[items.midi.value].play().catch(error => {
        //     if (error.name !== 'AbortError') {
        //         console.error("MIDI audio play error:", error);
        //     }
        // });
        // audio.bass[items.bass.value].play().catch(error => {
        //     if (error.name !== 'AbortError') {
        //         console.error("Bass audio play error:", error);
        //     }
        // });

        playing = true;
        setCode();
    }

    function updateVolume(amounts) {
        console.log(amounts);
        audio.guitar.forEach(g => {
            g.volume = parseFloat(amounts[0]) / 100;
        });
        audio.drums.forEach(d => {
            d.volume = parseFloat(amounts[1]) / 100;
        });
        audio.midi.forEach(m => {
            m.volume = parseFloat(amounts[2]) / 100;
        });
        audio.bass.forEach(b => {
            b.volume = parseFloat(amounts[3]) / 100;
        });
        setCode();
    }

    function playDefault() {
        items.guitar.value = 0;
        items.drums.value = 0;
        items.midi.value = 0;
        items.bass.value = 0;
        updateVolume([50,50,50,50]);
        updateAudio(0);
    }
    function instrDefault() {
        items.vol_drums.value = 50;
        items.vol_midi.value = 50;
        items.vol_guitar.value = 50;
        items.vol_bass.value = 50;

        items.guitar.value = 0;
        items.drums.value = 0;
        items.midi.value = 0;
        items.bass.value = 0;

        items.guitar.dispatchEvent(new Event('change'));
        items.drums.dispatchEvent(new Event('change'));
        items.midi.dispatchEvent(new Event('change'));
        items.bass.dispatchEvent(new Event('change'));
        updateVolume([50,50,50,50]);
    }

    window.onload = playDefault;

    items.guitar.addEventListener("change", adhocUpdate);
    items.drums.addEventListener("change", adhocUpdate);
    items.midi.addEventListener("change", adhocUpdate);
    items.bass.addEventListener("change", adhocUpdate);

    items.vol_guitar.addEventListener("change", adhocVolume);
    items.vol_drums.addEventListener("change", adhocVolume);
    items.vol_midi.addEventListener("change", adhocVolume);
    items.vol_bass.addEventListener("change", adhocVolume);

    items.video.addEventListener("ended", function() {
       updateAudio(0);
    });

    function adhocVolume() {
        updateVolume(
            [
                items.vol_guitar.value,
                items.vol_drums.value,
                items.vol_midi.value,
                items.vol_bass.value
            ]
        )
    }
    function adhocUpdate() {
        updateAudio(items.video.currentTime)
    }

    function playPause() {
        if (playing) {
            items.video.pause();
            audio.guitar[items.guitar.value].pause();
            audio.drums[items.drums.value].pause();
            audio.midi[items.midi.value].pause();
            audio.bass[items.bass.value].pause();
            playing = false;
        } else {
            updateAudio(items.video.currentTime)
        }
    }

    items.ctrl_play_pause.addEventListener("click", playPause);
    items.ctrl_video_reset.addEventListener("click", function () {
        updateAudio(0);
    });
    items.ctrl_instr_reset.addEventListener("click", instrDefault);

    function setCode() {
        let txt = `G${returnLetter(items.guitar.value) + items.vol_guitar.value}`;
        txt += `D${returnLetter(items.drums.value) + items.vol_drums.value}`
        txt += `M${returnLetter(items.midi.value) + items.vol_midi.value}`
        txt += `B${returnLetter(items.bass.value) + items.vol_bass.value}`
        items.instr_code.innerText = txt
    }
    function returnLetter(no) {
        switch (parseInt(no)) {
            case 0: return "A"
            case 1: return "B"
            case 2: return "C"
            case 3: return "D"
        }
    }
});

