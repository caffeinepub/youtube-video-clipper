import Map "mo:core/Map";

module {
  type Clip = {
    id : Text;
    title : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    startTime : Nat;
    endTime : Nat;
    createdAt : Int;
    score : Float;
  };

  type OldActor = {
    clips : Map.Map<Text, Clip>;
    ownerPrincipal : Text;
  };

  type NewActor = {
    clips : Map.Map<Text, Clip>;
  };

  public func run(old : OldActor) : NewActor {
    {
      clips = old.clips;
    };
  };
};
