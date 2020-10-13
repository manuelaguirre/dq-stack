class EventHandler():
    """
    Interface for event handlers in the game. Can emit events and attach listeners
    """
    callbacks = {}

    def trigger(self, event_name):
        """
        Trigger an event.
        """
        if event_name in self.callbacks:
            for callback in self.callbacks[event_name]:
                callback()

    def on(self, event_name, callback):
        """
        Attaches a listener for a specific event to the object, and passes a callback to be 
        executed when the event is triggered
        """
            # Add callback to the list of event_name callback list
        print('Add: ', event_name)
        if event_name not in self.callbacks:
            self.callbacks[event_name] = [callback]
        else:
            self.callbacks[event_name].append(callback)