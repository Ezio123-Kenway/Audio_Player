interface Track {
    title: string;
    src: string;
}

const tracks: Track[] = [
    {title: "1.December Nya - Lin Nit", src: "track1.mp3"},
    {title: "2.Tsaw Ra Ai Tsaw Hkrup Sai - Ann Naw", src: "track2.mp3"},
    {title: "3.Lann Hma Gyee Yae Bey - Wine Su Khine Thein", src: "track3.mp3"},
    {title: "4.Yee Zarr Sar - Sai Sai Kham Hlaing", src: "track4.mp3"},
];


const playBtn = document.querySelector('.play_arrow') as HTMLElement;
const pauseBtn = document.querySelector('.pause') as HTMLElement;
const forwardBtn = document.querySelector('.fast_forward') as HTMLElement;
const backwardBtn = document.querySelector('.fast_rewind') as HTMLElement;
const fastForwardBtn = document.querySelector('.forward_10') as HTMLElement;
const rewindBtn = document.querySelector('.replay_10') as HTMLElement;

const audioTag = document.getElementById('audioTag') as HTMLAudioElement;

const audioSlider = document.querySelector('.audioSlider') as HTMLInputElement;

const musicPlayTime = document.querySelector('.musicPlayTime') as HTMLParagraphElement;

let musicCurrentTime: string = "";
let musicDuration: string = "";
const showCurrentProgress = () => {
    audioTag.addEventListener('loadedmetadata', () => {
        duration = audioTag.duration;
        // console.log(duration)
        audioSlider.max = duration.toString();
        audioTag.addEventListener('timeupdate', () => {
            currentTime = audioTag.currentTime;
            // console.log(currentTime);

            let currentTimeInMinutes: number = Math.floor(currentTime/60);
            let remainingCurrentTimeInSeconds: number = Math.floor(currentTime%60);
            if(remainingCurrentTimeInSeconds > 60) {
                currentTimeInMinutes += 1;
                remainingCurrentTimeInSeconds = 0
            }
            const remainingCurrentTimeSeconds: string = remainingCurrentTimeInSeconds < 10 ? `0${remainingCurrentTimeInSeconds}` : remainingCurrentTimeInSeconds.toString();
            musicCurrentTime = `0${currentTimeInMinutes}:${remainingCurrentTimeSeconds}`;

            const durationInMinutes: number = Math.floor(duration/60);
            const remainingDurationInSeconds: number = Math.floor(duration%60);
            const remainingDurationSeconds: string = remainingDurationInSeconds < 10 ? `0${remainingDurationInSeconds}` :   remainingDurationInSeconds.toString(); 
            musicDuration = `0${durationInMinutes}:${remainingDurationSeconds}`

            musicPlayTime.innerText = `${musicCurrentTime}/${musicDuration}`;

            if(musicCurrentTime === musicDuration) {
                console.log(audioSlider.value, audioTag.duration);
                isPlaying = false;
                updatePlayAndPauseBtn();
            }
        })
    })
}


let duration: number = 0;
let currentTime: number = 0;
const titles = document.querySelectorAll('.title') as NodeList;
for(let i = 0; i < titles.length; i++) {
    titles[i].addEventListener('click', () => {
        for(let j = 0; j < titles.length; j++) {
            j === i ? titles[j].classList.add('currentTitle') : titles[j].classList.remove('currentTitle');
        }

        audioTag.src = tracks[i].src;
        audioSlider.disabled = false;
        isPlaying = true;
        updatePlayAndPauseBtn();
        showCurrentProgress();
    })
}

let isPlaying = false;
const updatePlayAndPauseBtn = () => {
    if(isPlaying) {
        playBtn.style.display = 'none';
        pauseBtn.style.display  = 'block';
        audioTag.play();
    }else {
        pauseBtn.style.display  = 'none';
        playBtn.style.display = 'block';
        audioTag.pause();
    }
}

let currentPlayingIndex = 0;
playBtn.addEventListener('click', () => {
    audioSlider.disabled = false;
    isPlaying = true;
    if(audioTag.currentTime === 0) {
        audioTag.src = tracks[currentPlayingIndex].src;
        titles[currentPlayingIndex].classList.add('currentTitle');
        updatePlayAndPauseBtn();
        showCurrentProgress();
    }else if(musicCurrentTime === musicDuration) {
        console.log(audioTag.src);
        const currentPlayingTrack: Track|undefined = tracks.find(track => audioTag.src.includes(track.src));
        audioTag.src = currentPlayingTrack.src;
        updatePlayAndPauseBtn();
    }else {
        updatePlayAndPauseBtn();
    }
})

pauseBtn.addEventListener('click', () => {
    isPlaying = false;
    updatePlayAndPauseBtn();
})

forwardBtn.addEventListener('click', () => {
    const currentTrack = tracks.find(item => audioTag.src.includes(item.src))
    let currentTrackIndex: number = tracks.indexOf(currentTrack);
    titles[currentTrackIndex].classList.remove('currentTitle');
    currentTrackIndex === tracks.length - 1 ? currentTrackIndex = 0 : currentTrackIndex++ ;
    audioTag.src = tracks[currentTrackIndex].src;
    titles[currentTrackIndex].classList.add('currentTitle');
    isPlaying = true;
    updatePlayAndPauseBtn();
})

backwardBtn.addEventListener('click', () => {
    const currentTrack = tracks.find(element => audioTag.src.includes(element.src));
    let currentTrackIndex: number = tracks.indexOf(currentTrack);
    titles[currentTrackIndex].classList.remove('currentTitle');
    currentTrackIndex === 0 ? currentTrackIndex = tracks.length - 1 : currentTrackIndex-- ;
    audioTag.src = tracks[currentTrackIndex].src;
    titles[currentTrackIndex].classList.add('currentTitle');
    isPlaying = true;
    updatePlayAndPauseBtn();
})

fastForwardBtn.addEventListener('click', () => {
    let currentTime: number = audioTag.currentTime;
    currentTime += 10;
    audioTag.currentTime = currentTime;
    isPlaying = true;
    updatePlayAndPauseBtn();
})

rewindBtn.addEventListener('click', () => {
    let currentTime: number = audioTag.currentTime;
    currentTime -= 10;
    audioTag.currentTime = currentTime;
    isPlaying = true;
    updatePlayAndPauseBtn();
})


// update audio currentTime based on slider position
audioSlider.addEventListener('input', () => {
    audioTag.currentTime = parseInt(audioSlider.value);
})


// update slider position based on audio currentTime
audioTag.addEventListener('timeupdate', () => {
    audioSlider.value = audioTag.currentTime.toString();
})


window.addEventListener('load', () => {
    audioSlider.value = '0';
    audioSlider.disabled = true;
})
