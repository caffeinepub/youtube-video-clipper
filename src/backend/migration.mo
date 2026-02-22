import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // Original types (without role)
  public type OldYouTubeChannelAuth = {
    accessToken : Text;
    refreshToken : Text;
    channelId : Text;
    channelName : Text;
    expiresAt : Time.Time;
  };

  public type OldGoogleOAuthCredentials = {
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Time.Time;
    tokenType : Text;
    idToken : Text;
    scope : Text;
  };

  public type OldUserProfile = {
    name : Text;
    youtubeAuth : ?OldYouTubeChannelAuth;
    googleOAuthCredentials : ?OldGoogleOAuthCredentials;
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
  };

  // New types (with role)
  public type UserRole = {
    #owner;
    #admin;
    #user;
    #friend;
  };

  public type NewYouTubeChannelAuth = OldYouTubeChannelAuth;
  public type NewGoogleOAuthCredentials = OldGoogleOAuthCredentials;

  public type NewUserProfile = {
    name : Text;
    youtubeAuth : ?NewYouTubeChannelAuth;
    googleOAuthCredentials : ?NewGoogleOAuthCredentials;
    role : UserRole;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    adminPrincipals : Map.Map<Principal, ()>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_userId, oldProfile) {
        {
          name = oldProfile.name;
          youtubeAuth = oldProfile.youtubeAuth;
          googleOAuthCredentials = oldProfile.googleOAuthCredentials;
          role = #user; // Default role for all existing users is 'user'
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles
    };
  };
};
