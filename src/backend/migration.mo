module {
  type OldActor = {
    systemStatus : { #running; #restarting; #shutting_down; #paused };
  };

  type NewActor = {
    systemStatus : { #running; #restarting; #shutting_down; #paused };
  };

  public func run(old : OldActor) : NewActor { old };
};
