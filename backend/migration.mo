import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Storage "blob-storage/Storage";

module {
  type UserRole = {
    #owner;
    #admin;
    #user;
    #friend;
  };

  type SystemStatus = {
    #running;
    #restarting;
    #shutting_down;
    #paused;
  };

  type UserStatus = {
    #active;
    #inactive;
    #banned;
    #suspended;
  };

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

  type GoogleOAuthCredentials = {
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Time.Time;
    tokenType : Text;
    idToken : Text;
    scope : Text;
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
    googleOAuthCredentials : ?GoogleOAuthCredentials;
    role : UserRole;
    status : UserStatus;
    profilePicture : ?Storage.ExternalBlob;
  };

  type AdminMessage = {
    id : Text;
    fromPrincipal : Text;
    toPrincipal : Text;
    fromUserId : Text;
    toUserId : Text;
    body : Text;
    sentAt : Time.Time;
  };

  type SystemControlResult = {
    success : Bool;
    message : Text;
  };

  type SystemActionLog = {
    id : Text;
    action : Text;
    caller : Principal;
    timestamp : Time.Time;
  };

  type OldActor = {
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
    userMessages : Map.Map<Principal, List.List<AdminMessage>>;
    systemActionLogs : [SystemActionLog];
  };

  type NewActor = {
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
    userMessages : Map.Map<Principal, List.List<AdminMessage>>;
    systemActionLogs : [SystemActionLog];
  };

  public func run(old : OldActor) : NewActor {
    {
      videoClips = old.videoClips;
      userProfiles = old.userProfiles;
      adminPrincipals = old.adminPrincipals;
      userMessages = old.userMessages;
      systemActionLogs = old.systemActionLogs;
    };
  };
};
