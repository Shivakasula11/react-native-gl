import TrackPlayer, { Event, Capability } from 'react-native-track-player';

export async function setupPlayer() {
    console.debug('Setting up Track Player...');
    await TrackPlayer.setupPlayer();
    console.debug('Track Player has been set up.');
    await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop
        ],
        compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious]
    });
}

export async function addTracks(tracks) {   
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
}

export async function playbackService() {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
}