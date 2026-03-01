import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Storage "blob-storage/Storage";

module {
  type OldAdminMessage = {
    id : Text;
    fromPrincipal : Text;
    toPrincipal : Text;
    body : Text;
    sentAt : Time.Time;
  };

  type OldUserRole = {
    #owner;
    #admin;
    #user;
    #friend;
  };

  type OldUserStatus = {
    #active;
    #inactive;
    #banned;
    #suspended;
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
    status : OldUserStatus;
    profilePicture : ?Storage.ExternalBlob;
  };

  type OldScheduledUpload = {
    id : Text;
    clipId : Text;
    scheduledAt : Time.Time;
    createdAt : Time.Time;
  };

  type OldContentEntry = {
    id : Text;
    title : Text;
    body : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type OldActivityLog = {
    id : Text;
    userPrincipal : Text;
    action : Text;
    timestamp : Time.Time;
  };

  type OldSystemControlResult = {
    success : Bool;
    message : Text;
  };

  type OldSystemActionLog = {
    id : Text;
    action : Text;
    caller : Principal;
    timestamp : Time.Time;
  };

  type OldVideoUploadStats = {
    hour : Int;
    count : Nat;
  };

  type OldSystemStatus = {
    #running;
    #restarting;
    #shutting_down;
  };

  type OldActor = {
    systemStatus : OldSystemStatus;
    videoClips : Map.Map<Text, OldVideoClip>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
    scheduledUploads : Map.Map<Principal, List.List<OldScheduledUpload>>;
    contentEntries : Map.Map<Text, OldContentEntry>;
    activityLogs : [OldActivityLog];
    userMessages : Map.Map<Principal, List.List<OldAdminMessage>>;
  };

  type NewAdminMessage = {
    id : Text;
    fromPrincipal : Text;
    toPrincipal : Text;
    fromUserId : Text;
    toUserId : Text;
    body : Text;
    sentAt : Time.Time;
  };

  type NewSystemStatus = {
    #running;
    #restarting;
    #shutting_down;
    #paused;
  };

  type NewActor = {
    videoClips : Map.Map<Text, OldVideoClip>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
    scheduledUploads : Map.Map<Principal, List.List<OldScheduledUpload>>;
    contentEntries : Map.Map<Text, OldContentEntry>;
    activityLogs : [OldActivityLog];
    userMessages : Map.Map<Principal, List.List<NewAdminMessage>>;
    systemStatus : NewSystemStatus;
  };

  public func run(old : OldActor) : NewActor {
    {
      videoClips = old.videoClips;
      userProfiles = old.userProfiles;
      adminPrincipals = old.adminPrincipals;
      scheduledUploads = old.scheduledUploads;
      contentEntries = old.contentEntries;
      activityLogs = old.activityLogs;
      userMessages = convertUserMessages(old.userMessages);
      systemStatus = #running;
    };
  };

  func convertUserMessages(oldMessages : Map.Map<Principal, List.List<OldAdminMessage>>) : Map.Map<Principal, List.List<NewAdminMessage>> {
    oldMessages.map<Principal, List.List<OldAdminMessage>, List.List<NewAdminMessage>>(
      func(_, oldList) {
        oldList.map<OldAdminMessage, NewAdminMessage>(
          func(oldMsg : OldAdminMessage) : NewAdminMessage {
            {
              id = oldMsg.id;
              fromPrincipal = oldMsg.fromPrincipal;
              toPrincipal = oldMsg.toPrincipal;
              body = oldMsg.body;
              sentAt = oldMsg.sentAt;
              fromUserId = "";
              toUserId = "";
            };
          }
        );
      }
    );
  };
};
