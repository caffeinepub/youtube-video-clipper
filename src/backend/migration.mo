import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldYouTubeChannelAuth = {
    accessToken : Text;
    refreshToken : Text;
    channelId : Text;
    channelName : Text;
    expiresAt : Time.Time;
  };

  type OldUserProfile = {
    name : Text;
    youtubeAuth : ?OldYouTubeChannelAuth;
  };

  type OldActor = {
    videoClips : Map.Map<Text, OldVideoClip>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
  };

  type OldVideoClip = {
    id : Text;
    title : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    startTime : Nat;
    endTime : Nat;
    createdAt : Time.Time;
    score : Float;
  };

  type GoogleOAuthCredentials = {
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Time.Time;
    tokenType : Text;
    idToken : Text;
    scope : Text;
  };

  type NewYouTubeChannelAuth = OldYouTubeChannelAuth;

  type NewUserProfile = {
    name : Text;
    youtubeAuth : ?NewYouTubeChannelAuth;
    googleOAuthCredentials : ?GoogleOAuthCredentials;
  };

  type NewActor = {
    videoClips : Map.Map<Text, OldVideoClip>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
  };

  public func run(old : OldActor) : NewActor {
    // Migrate user profiles to include googleOAuthCredentials field
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProfile) {
        { oldProfile with googleOAuthCredentials = null };
      }
    );

    {
      videoClips = old.videoClips;
      userProfiles = newUserProfiles;
      adminPrincipals = old.adminPrincipals;
    };
  };
};
