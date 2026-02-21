import Map "mo:core/Map";

module {
  type OldActor = {
    clips : Map.Map<Text, {
      id : Text;
      title : Text;
      videoUrl : Text;
      thumbnailUrl : Text;
      startTime : Nat;
      endTime : Nat;
      createdAt : Int;
      score : Float;
    }>;
  };

  type NewActor = {
    videoClips : Map.Map<Text, {
      id : Text;
      title : Text;
      videoUrl : Text;
      thumbnailUrl : Text;
      startTime : Nat;
      endTime : Nat;
      createdAt : Int;
      score : Float;
    }>;
  };

  public func run(old : OldActor) : NewActor { { videoClips = old.clips } };
};
