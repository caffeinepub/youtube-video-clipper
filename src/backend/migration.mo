import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import Nat "mo:core/Nat";

module {
  type OldActor = {
    collabListings : Map.Map<Text, CollabListing>;
    creatorReports : Map.Map<Text, CreatorReport>;
    notificationState : Map.Map<Principal, List.List<Notification>>;
    notificationCounter : Nat;
    systemStatus : SystemStatus;
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
    activityLogs : [ActivityLog];
    activityLogCounter : Nat;
    userMessages : Map.Map<Principal, List.List<AdminMessage>>;
    messageCounter : Nat;
    adminLinks : Map.Map<Nat, AdminLink>;
    adminLinkCounter : Nat;
    mintedClips : Map.Map<Principal, List.List<MintedClip>>;
    mintedClipCounter : Nat;
    systemActionLogs : [SystemActionLog];
    systemActionCounter : Nat;
    scheduledUploads : Map.Map<Principal, List.List<ScheduledUpload>>;
    contentEntries : Map.Map<Text, ContentEntry>;
    feedbackSubmissions : [FeedbackSubmission];
    currentSubmissionId : Nat;
  };

  type CollabListing = {
    id : Text;
    ownerPrincipal : Principal;
    niche : Text;
    description : Text;
    contactInfo : Text;
    createdAt : Time.Time;
    active : Bool;
    archived : Bool;
  };

  type CreatorReport = {
    id : Text;
    reporterPrincipal : Principal;
    reportedPrincipal : Principal;
    reason : Text;
    description : Text;
    timestamp : Time.Time;
    resolved : Bool;
    archived : Bool;
  };

  type Notification = {
    id : Nat;
    message : Text;
    timestamp : Time.Time;
    notificationType : NotificationType;
    read : Bool;
    sender : ?Principal;
  };

  type NotificationType = {
    #clip_processed;
    #reaction;
    #new_message;
    #system_announcement;
  };

  type SystemStatus = {
    #running;
    #restarting;
    #shutting_down;
    #paused;
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

  type PlayerProgression = {
    xp : Nat;
    level : Nat;
    streak : Nat;
    lastActiveDay : Int;
    clipCoins : Nat;
    playerClass : Text;
    achievements : [Text];
  };

  type UserRole = {
    #owner;
    #admin;
    #user;
    #friend;
  };

  type UserStatus = {
    #active;
    #inactive;
    #banned;
    #suspended;
  };

  type DailyQuest = {
    questId : Text;
    title : Text;
    description : Text;
    xpReward : Nat;
    completed : Bool;
  };

  type UserProfile = {
    name : Text;
    youtubeAuth : ?YouTubeChannelAuth;
    googleOAuthCredentials : ?GoogleOAuthCredentials;
    role : UserRole;
    status : UserStatus;
    profilePicture : ?Storage.ExternalBlob;
  };

  type ActivityLog = {
    id : Text;
    userPrincipal : Text;
    action : Text;
    timestamp : Time.Time;
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

  type AdminLink = {
    id : Nat;
    title : Text;
    url : Text;
    createdBy : Principal;
    createdAt : Time.Time;
  };

  type MintedClip = {
    clipId : Text;
    title : Text;
    videoUrl : Text;
    mintedAt : Time.Time;
  };

  type SystemActionLog = {
    id : Text;
    action : Text;
    caller : Principal;
    timestamp : Time.Time;
  };

  type ScheduledUpload = {
    id : Text;
    clipId : Text;
    scheduledAt : Time.Time;
    createdAt : Time.Time;
  };

  type ContentEntry = {
    id : Text;
    title : Text;
    body : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type SubmissionType = {
    #FeatureRequest;
    #BugReport;
  };

  type FeedbackSubmission = {
    id : Nat;
    submitterPrincipal : Text;
    submitterUserId : Text;
    submissionType : SubmissionType;
    title : Text;
    description : Text;
    timestamp : Int;
  };

  type FastestGameLeaderboardEntry = {
    entryId : Text;
    username : Text;
    fastestTime : Nat;
    timestamp : Time.Time;
    isFlagged : Bool;
    userId : Principal;
  };

  type NewActor = {
    collabListings : Map.Map<Text, CollabListing>;
    creatorReports : Map.Map<Text, CreatorReport>;
    notificationState : Map.Map<Principal, List.List<Notification>>;
    notificationCounter : Nat;
    systemStatus : SystemStatus;
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
    activityLogs : [ActivityLog];
    activityLogCounter : Nat;
    userMessages : Map.Map<Principal, List.List<AdminMessage>>;
    messageCounter : Nat;
    adminLinks : Map.Map<Nat, AdminLink>;
    adminLinkCounter : Nat;
    mintedClips : Map.Map<Principal, List.List<MintedClip>>;
    mintedClipCounter : Nat;
    systemActionLogs : [SystemActionLog];
    systemActionCounter : Nat;
    scheduledUploads : Map.Map<Principal, List.List<ScheduledUpload>>;
    contentEntries : Map.Map<Text, ContentEntry>;
    feedbackSubmissions : [FeedbackSubmission];
    currentSubmissionId : Nat;
    fastestGameEntries : Map.Map<Principal, List.List<FastestGameLeaderboardEntry>>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    { old with fastestGameEntries = Map.empty<Principal, List.List<FastestGameLeaderboardEntry>>() };
  };
};
