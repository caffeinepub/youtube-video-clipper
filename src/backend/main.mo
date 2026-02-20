import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Clip = {
    id : Text;
    title : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    startTime : Nat;
    endTime : Nat;
    createdAt : Time.Time;
  };

  let clips = Map.empty<Text, Clip>();

  public shared ({ caller }) func saveClip(title : Text, videoUrl : Text, thumbnailUrl : Text, startTime : Nat, endTime : Nat) : async Text {
    let id = title.concat(Time.now().toText());
    let newClip : Clip = {
      id;
      title;
      videoUrl;
      thumbnailUrl;
      startTime;
      endTime;
      createdAt = Time.now();
    };

    clips.add(id, newClip);
    id;
  };

  public query ({ caller }) func getAllClips() : async [Clip] {
    clips.values().toArray();
  };

  public shared ({ caller }) func deleteClip(clipId : Text) : async () {
    if (not clips.containsKey(clipId)) {
      Runtime.trap("Clip with ID " # clipId # " not found ");
    };
    let _ = clips.remove(clipId);
  };

  public query ({ caller }) func getClipById(clipId : Text) : async Clip {
    switch (clips.get(clipId)) {
      case (?clip) { clip };
      case (null) { Runtime.trap("Clip with ID " # clipId # " not found") };
    };
  };
};
