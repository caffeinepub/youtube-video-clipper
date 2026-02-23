import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldUserRole = {
    #owner;
    #admin;
    #user;
    #friend;
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

  type OldGoogleOAuthCredentials = {
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Time.Time;
    tokenType : Text;
    idToken : Text;
    scope : Text;
  };

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
    googleOAuthCredentials : ?OldGoogleOAuthCredentials;
    role : OldUserRole;
  };

  type OldActor = {
    videoClips : Map.Map<Text, OldVideoClip>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
  };

  type NewUserRole = {
    #owner;
    #admin;
    #user;
    #friend;
  };

  type NewUserStatus = {
    #active;
    #inactive;
    #banned;
    #suspended;
  };

  type NewVideoClip = {
    id : Text;
    title : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    startTime : Nat;
    endTime : Nat;
    createdAt : Time.Time;
    score : Float;
  };

  type NewGoogleOAuthCredentials = {
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Time.Time;
    tokenType : Text;
    idToken : Text;
    scope : Text;
  };

  type NewYouTubeChannelAuth = {
    accessToken : Text;
    refreshToken : Text;
    channelId : Text;
    channelName : Text;
    expiresAt : Time.Time;
  };

  type NewUserProfile = {
    name : Text;
    youtubeAuth : ?NewYouTubeChannelAuth;
    googleOAuthCredentials : ?NewGoogleOAuthCredentials;
    role : NewUserRole;
    status : NewUserStatus;
  };

  type NewActor = {
    videoClips : Map.Map<Text, NewVideoClip>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        { oldProfile with status = #active };
      }
    );
    {
      videoClips = old.videoClips;
      userProfiles = newUserProfiles;
      adminPrincipals = old.adminPrincipals;
    };
  };
};
