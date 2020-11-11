class EventHandler(object):
    """
    Interface for event handlers in the game. Can emit events and attach listeners
    """

    callbacks = {}

    def trigger(self, event_name, args=None):
        """
        Trigger an event.
        """
        if event_name in self.callbacks:
            for callback in self.callbacks[event_name]:
                if args:
                    callback(args)
                else:
                    callback()

    def on(self, event_name, callback):
        """
        Attaches a listener for a specific event to the object, and passes a callback to be
        executed when the event is triggered
        """
        # Add callback to the list of event_name callback list
        print("Add: ", event_name)
        try:
            if self.callbacks[event_name]:
                self.callbacks[event_name].append(callback)
        except KeyError:
            self.callbacks[event_name] = [callback]
