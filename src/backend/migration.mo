import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type VideoClip = {
    id : Text;
    title : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    startTime : Nat;
    endTime : Nat;
    createdAt : Time.Time;
    score : Float;
  };

  type YouTubeChannelAuth = {
    accessToken : Text;
    refreshToken : Text;
    channelId : Text;
    channelName : Text;
    expiresAt : Time.Time;
  };

  type UserProfile = {
    name : Text;
    youtubeAuth : ?YouTubeChannelAuth;
  };

  type OldActor = {
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    { videoClips = old.videoClips; userProfiles = old.userProfiles };
  };
};
