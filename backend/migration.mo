import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

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
  };

  type OldActor = {
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
  };

  type FeedbackSubmission = {
    id : Nat;
    submitterPrincipal : Text;
    submitterUserId : Text;
    submissionType : {
      #FeatureRequest;
      #BugReport;
    };
    title : Text;
    description : Text;
    timestamp : Int;
  };

  type NewActor = {
    videoClips : Map.Map<Text, VideoClip>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
    feedbackSubmissions : [FeedbackSubmission];
    currentSubmissionId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      feedbackSubmissions = Array.empty<FeedbackSubmission>();
      currentSubmissionId = 0;
    };
  };
};
